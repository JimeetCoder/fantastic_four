/**
 * Vision Assistant - Lightweight Browser Extension
 * Uses Ollama for local LLM processing
 * Automatic wake word detection: "Vision"
 */

class VisionAssistant {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.isProcessing = false;
        this.wakeWordDetected = false;
        this.wakeWord = 'vision';
        this.ollamaUrl = 'http://localhost:11434';
        this.modelName = 'tinyllama';
        this.voiceSpeed = 1.0;
        this.wakeWordEnabled = true;
        this.listeningTimeout = null; // Timeout for silence detection
        this.listeningStartTime = null; // Track when listening started
        this.lastSpeechTime = null; // Track when user last spoke
        this.accumulatedTranscript = ''; // Accumulate transcript until silence
        this.silenceTimeout = null; // Timeout to detect silence

        this.initialize();
    }

    async initialize() {
        try {
            // Load settings from storage
            await this.loadSettings();

            // Check Ollama connection (don't wait, do it in background)
            this.checkOllamaConnection().catch(err => {
                console.log('Ollama check failed, will use fallbacks:', err);
            });

            // Initialize speech recognition
            await this.initializeSpeechRecognition();

            // Initialize speech synthesis
            this.initializeSpeechSynthesis();

            // Setup event listeners
            this.setupEventListeners();

            // Start continuous listening for wake word
            if (this.wakeWordEnabled) {
                // Delay wake word detection to ensure everything is ready
                setTimeout(() => {
                    this.startWakeWordDetection();
                }, 1000);
            }
        } catch (error) {
            console.error('Error during initialization:', error);
            // Still try to start wake word detection even if initialization had errors
            if (this.wakeWordEnabled) {
                setTimeout(() => {
                    this.startWakeWordDetection();
                }, 2000);
            }
        }
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get([
                'ollamaUrl',
                'modelName',
                'voiceSpeed',
                'wakeWordEnabled',
                'wakeWord'
            ]);

            if (result.ollamaUrl) this.ollamaUrl = result.ollamaUrl;
            if (result.modelName) this.modelName = result.modelName;
            if (result.voiceSpeed) this.voiceSpeed = result.voiceSpeed;
            if (result.wakeWordEnabled !== undefined) this.wakeWordEnabled = result.wakeWordEnabled;
            if (result.wakeWord) this.wakeWord = result.wakeWord.toLowerCase().trim();

            // Update UI
            const ollamaUrlInput = document.getElementById('ollamaUrl');
            const modelNameInput = document.getElementById('modelName');
            const voiceSpeedInput = document.getElementById('voiceSpeed');
            const voiceSpeedValue = document.getElementById('voiceSpeedValue');
            const wakeWordToggle = document.getElementById('wakeWordDetection');

            if (ollamaUrlInput) ollamaUrlInput.value = this.ollamaUrl;
            if (modelNameInput) modelNameInput.value = this.modelName;
            if (voiceSpeedInput) {
                voiceSpeedInput.value = this.voiceSpeed;
                if (voiceSpeedValue) {
                    voiceSpeedValue.textContent = this.voiceSpeed.toFixed(1) + 'x';
                }
            }
            if (wakeWordToggle) {
                if (this.wakeWordEnabled) {
                    wakeWordToggle.classList.add('active');
                    wakeWordToggle.setAttribute('aria-checked', 'true');
                } else {
                    wakeWordToggle.classList.remove('active');
                    wakeWordToggle.setAttribute('aria-checked', 'false');
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings() {
        try {
            await chrome.storage.sync.set({
                ollamaUrl: this.ollamaUrl,
                modelName: this.modelName,
                voiceSpeed: this.voiceSpeed,
                wakeWordEnabled: this.wakeWordEnabled,
                wakeWord: this.wakeWord
            });
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    async checkOllamaConnection() {
        const statusElement = document.getElementById('ollamaStatus');

        // Validate URL
        if (!this.ollamaUrl || typeof this.ollamaUrl !== 'string') {
            if (statusElement) {
                statusElement.textContent = 'Invalid URL';
                statusElement.parentElement.className = 'connection-status disconnected';
            }
            return;
        }

        try {
            // Normalize URL
            let baseUrl = this.ollamaUrl.trim();
            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }

            const apiUrl = `${baseUrl}/api/tags`;

            // Validate URL format
            try {
                new URL(apiUrl);
            } catch (urlError) {
                if (statusElement) {
                    statusElement.textContent = 'Invalid URL';
                    statusElement.parentElement.className = 'connection-status disconnected';
                }
                return;
            }

            // Add timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            let response;
            try {
                response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal
                });
            } catch (fetchError) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                    console.warn('Ollama connection check timeout');
                } else {
                    console.warn('Ollama connection check failed:', fetchError.message);
                }
                if (statusElement) {
                    statusElement.textContent = 'Ollama Disconnected';
                    statusElement.parentElement.className = 'connection-status disconnected';
                }
                return;
            }

            clearTimeout(timeoutId);

            if (response && response.ok) {
                let data;
                try {
                    data = await response.json();
                } catch (parseError) {
                    console.warn('Error parsing Ollama tags response:', parseError.message);
                    if (statusElement) {
                        statusElement.textContent = 'Ollama Disconnected';
                        statusElement.parentElement.className = 'connection-status disconnected';
                    }
                    return;
                }

                const hasModel = data.models?.some(m => m.name.includes(this.modelName.split(':')[0]));

                if (statusElement) {
                    statusElement.textContent = hasModel ? 'Ollama Connected' : 'Model not found';
                    statusElement.parentElement.className = hasModel ? 'connection-status connected' : 'connection-status disconnected';
                }

                if (!hasModel) {
                    // Don't announce during initialization, only log
                    console.log(`Model ${this.modelName} not found. Please pull it using: ollama pull ${this.modelName}`);
                }
            } else {
                if (statusElement) {
                    statusElement.textContent = 'Ollama Disconnected';
                    statusElement.parentElement.className = 'connection-status disconnected';
                }
            }
        } catch (error) {
            console.warn('Ollama connection error:', error.message || error);
            if (statusElement) {
                statusElement.textContent = 'Ollama Disconnected';
                statusElement.parentElement.className = 'connection-status disconnected';
            }
            // Don't announce connection errors - they're handled gracefully with fallbacks
            // Only log for debugging
            console.log('Ollama connection unavailable, using fallback responses');
        }
    }

    async initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();

            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            // Use Indian English for better accent recognition
            this.recognition.lang = 'en-IN';

            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                let hasSpeech = false;

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript.toLowerCase().trim();
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                        hasSpeech = true;
                    } else {
                        interimTranscript += transcript + ' ';
                        hasSpeech = true;
                    }
                }

                // Update last speech time if user is speaking (even interim results)
                if (hasSpeech && this.wakeWordDetected && this.isListening) {
                    this.lastSpeechTime = Date.now();
                    // Restart silence detection
                    this.startSilenceDetection();
                }

                if (finalTranscript) {
                    this.handleTranscript(finalTranscript.trim());
                } else if (interimTranscript && !this.wakeWordDetected) {
                    // Check for wake word in interim results
                    this.checkWakeWord(interimTranscript.trim());
                }

                // Also check final transcript for wake word if not detected yet
                if (finalTranscript && !this.wakeWordDetected) {
                    this.checkWakeWord(finalTranscript.trim());
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (event.error === 'no-speech') {
                    // Restart if no speech detected (for continuous wake word detection)
                    if (this.wakeWordEnabled && !this.isProcessing) {
                        setTimeout(() => {
                            if (!this.isProcessing) {
                                this.recognition.start();
                            }
                        }, 1000);
                    }
                } else if (event.error === 'not-allowed') {
                    this.announce('Microphone permission denied. Please enable microphone access.');
                }
            };

            this.recognition.onend = () => {
                // Restart recognition if wake word detection is enabled
                if (this.wakeWordEnabled && !this.isProcessing && !this.isListening) {
                    setTimeout(() => {
                        if (!this.isProcessing) {
                            this.recognition.start();
                        }
                    }, 500);
                }
            };
        } else {
            this.announce('Speech recognition not supported in your browser. Please use Chrome or Edge.');
        }
    }

    initializeSpeechSynthesis() {
        try {
            if ('speechSynthesis' in window) {
                this.speechSynthesis = window.speechSynthesis;

                // Get available voices
                if (this.speechSynthesis.onvoiceschanged !== undefined) {
                    this.speechSynthesis.onvoiceschanged = () => {
                        try {
                            this.voices = this.speechSynthesis.getVoices();
                        } catch (e) {
                            console.warn('Error getting voices:', e);
                        }
                    };
                }

                // Initial voice load
                try {
                    this.voices = this.speechSynthesis.getVoices();
                } catch (e) {
                    console.warn('Error loading initial voices:', e);
                }
            } else {
                console.warn('Speech synthesis not supported in this browser');
                this.speechSynthesis = null;
            }
        } catch (error) {
            console.error('Error initializing speech synthesis:', error);
            this.speechSynthesis = null;
        }
    }

    startWakeWordDetection() {
        if (!this.recognition || this.isListening) return;

        try {
            this.recognition.start();
            this.isListening = true;
            this.updateVoiceStatus('Listening for "Vision"...', '');
        } catch (error) {
            console.error('Error starting wake word detection:', error);
            // Retry after a delay
            setTimeout(() => this.startWakeWordDetection(), 2000);
        }
    }

    checkWakeWord(transcript) {
        if (!this.wakeWordEnabled || this.wakeWordDetected) return;

        const lowerTranscript = transcript.toLowerCase().trim();

        // Check for exact wake word match or as part of a phrase
        // Accept "vision" or "hello vision" or "hey vision" etc.
        const wakeWordLower = this.wakeWord.toLowerCase().trim();

        // Split transcript into words for better matching
        const words = lowerTranscript.split(/\s+/);

        // Check if wake word appears in transcript
        // This handles both "vision" alone and "hello vision" or "hey vision"
        if (lowerTranscript.includes(wakeWordLower) ||
            words.includes(wakeWordLower) ||
            lowerTranscript.endsWith(wakeWordLower) ||
            lowerTranscript.startsWith(wakeWordLower)) {
            this.wakeWordDetected = true;
            this.handleWakeWordActivation();
        }
    }

    handleWakeWordActivation() {
        try {
            this.updateVoiceStatus('Wake word detected! Listening...', 'listening');
            this.updateCommandPrompt('Listening...');

            // Stop wake word detection temporarily
            if (this.recognition) {
                try {
                    this.recognition.stop();
                } catch (err) {
                    console.log('Error stopping recognition:', err);
                }
            }

            // Start command listening
            setTimeout(() => {
                try {
                    this.startCommandListening();
                    // Play beep to indicate ready to listen
                    this.playBeep();
                } catch (error) {
                    console.error('Error in wake word activation:', error);
                    this.playBeep();
                }
            }, 500);
        } catch (error) {
            console.error('Error handling wake word activation:', error);
            this.playBeep();
        }
    }

    startCommandListening() {
        if (!this.recognition) return;

        try {
            // Clear any existing timeouts
            if (this.listeningTimeout) {
                clearTimeout(this.listeningTimeout);
                this.listeningTimeout = null;
            }
            if (this.silenceTimeout) {
                clearTimeout(this.silenceTimeout);
                this.silenceTimeout = null;
            }

            // Reset transcript accumulation
            this.accumulatedTranscript = '';
            this.lastSpeechTime = Date.now();
            this.listeningStartTime = Date.now();

            this.recognition.start();
            this.isListening = true;
            this.updateVoiceStatus('Listening...', 'listening');

            // Set up silence detection - if no speech for 2 seconds, process command
            this.startSilenceDetection();

            // Handle recognition ending - restart if still listening
            const originalOnEnd = this.recognition.onend;
            this.recognition.onend = () => {
                // If still listening and not processing, restart recognition
                if (this.isListening && !this.isProcessing) {
                    setTimeout(() => {
                        if (this.isListening && !this.isProcessing) {
                            try {
                                this.recognition.start();
                                // Restart silence detection
                                this.startSilenceDetection();
                            } catch (e) {
                                console.log('Error restarting recognition:', e);
                            }
                        }
                    }, 200);
                } else {
                    // Call original handler if we're done
                    if (originalOnEnd) {
                        originalOnEnd.call(this.recognition);
                    }
                }
            };
        } catch (error) {
            console.error('Error starting command listening:', error);
        }
    }

    startSilenceDetection() {
        // Clear existing silence timeout
        if (this.silenceTimeout) {
            clearTimeout(this.silenceTimeout);
        }

        // Check for silence after 2 seconds
        this.silenceTimeout = setTimeout(() => {
            if (this.isListening && !this.isProcessing) {
                const silenceDuration = Date.now() - (this.lastSpeechTime || this.listeningStartTime);

                // If user hasn't spoken for 2 seconds, process the accumulated transcript
                if (silenceDuration >= 2000 && this.accumulatedTranscript.trim()) {
                    const command = this.accumulatedTranscript.trim();
                    this.accumulatedTranscript = ''; // Clear after processing
                    this.stopCommandListening();
                    this.processCommand(command);
                } else if (silenceDuration >= 5000) {
                    // If no speech for 5 seconds, stop listening
                    this.stopCommandListening();
                } else {
                    // Continue checking for silence
                    this.startSilenceDetection();
                }
            }
        }, 2000); // Check every 2 seconds
    }

    stopCommandListening() {
        if (!this.recognition) return;

        try {
            // Clear all timeouts
            if (this.listeningTimeout) {
                clearTimeout(this.listeningTimeout);
                this.listeningTimeout = null;
            }
            if (this.silenceTimeout) {
                clearTimeout(this.silenceTimeout);
                this.silenceTimeout = null;
            }

            this.recognition.stop();
            this.isListening = false;
            this.listeningStartTime = null;
            this.lastSpeechTime = null;
            this.accumulatedTranscript = '';
            this.updateVoiceStatus('Ready', '');
        } catch (error) {
            console.error('Error stopping command listening:', error);
        }
    }

    handleTranscript(transcript) {
        if (!this.wakeWordDetected) {
            // Still checking for wake word
            this.checkWakeWord(transcript);
            return;
        }

        // User is speaking - update last speech time and accumulate transcript
        this.lastSpeechTime = Date.now();

        // Accumulate the transcript
        if (this.accumulatedTranscript) {
            this.accumulatedTranscript += ' ' + transcript;
        } else {
            this.accumulatedTranscript = transcript;
        }

        // Restart silence detection since user is speaking
        this.startSilenceDetection();
    }

    async processCommand(command) {
        if (!command.trim() || this.isProcessing) return;

        this.isProcessing = true;
        this.updateVoiceStatus('Processing...', 'processing');

        // Add user message to chat
        this.addChatMessage('user', command);
        this.updateResponseText('Processing your request...');

        // Stop listening while processing
        if (this.recognition) {
            this.recognition.stop();
        }

        let response = null;
        let actionPerformed = false;

        try {
            // Initialize web controller if not already done
            if (!this.webController && typeof WebController !== 'undefined') {
                this.webController = new WebController();
            }

            // Try web control commands first (open tabs, YouTube, etc.)
            if (this.webController) {
                try {
                    response = await this.webController.processCommand(command);
                    if (response) {
                        actionPerformed = true;
                    }
                } catch (webError) {
                    console.error('Web control error:', webError);
                    // Continue to try Ollama or fallback
                }
            }

            // If no web action was taken, try to get AI response
            if (!response) {
                response = await this.getOllamaResponse(command);
                // If Ollama fails, use fallback
                if (!response) {
                    response = this.getFallbackResponse(command);
                }
            }

            // Make sure we have a response
            if (!response) {
                response = this.getFallbackResponse(command);
            }

            // Speak response
            if (response && typeof response === 'string' && response.trim()) {
                try {
                    // Add AI response to chat
                    this.addChatMessage('assistant', response);
                    this.updateResponseText(response);
                    // Speak response (don't await to prevent blocking)
                    this.speakResponse(response).catch(err => {
                        console.warn('Speech error (non-blocking):', err);
                    });
                } catch (speakError) {
                    console.error('Error in response handling:', speakError);
                    // Still update text even if speech fails
                    this.addChatMessage('assistant', response);
                    this.updateResponseText(response);
                }
            } else if (response) {
                // Response exists but is not a valid string, convert it
                const responseText = String(response).trim();
                if (responseText) {
                    try {
                        this.addChatMessage('assistant', responseText);
                        this.updateResponseText(responseText);
                        this.speakResponse(responseText).catch(err => {
                            console.warn('Speech error (non-blocking):', err);
                        });
                    } catch (error) {
                        console.error('Error handling response:', error);
                    }
                }
            }

        } catch (error) {
            console.error('Command processing error:', error);
            // Use fallback response instead of error message
            response = this.getFallbackResponse(command);
            if (response && typeof response === 'string' && response.trim()) {
                try {
                    this.addChatMessage('assistant', response);
                    this.updateResponseText(response);
                    // Speak response (don't await to prevent blocking)
                    this.speakResponse(response).catch(err => {
                        console.warn('Speech error (non-blocking):', err);
                    });
                } catch (speakError) {
                    console.error('Error in fallback response handling:', speakError);
                    // Still update text even if speech fails
                    this.addChatMessage('assistant', response);
                    this.updateResponseText(response);
                }
            } else if (response) {
                // Response exists but is not a valid string, convert it
                const responseText = String(response).trim();
                if (responseText) {
                    try {
                        this.addChatMessage('assistant', responseText);
                        this.updateResponseText(responseText);
                        this.speakResponse(responseText).catch(err => {
                            console.warn('Speech error (non-blocking):', err);
                        });
                    } catch (error) {
                        console.error('Error handling fallback response:', error);
                    }
                }
            }
        } finally {
            this.isProcessing = false;
            this.wakeWordDetected = false;

            // Stop command listening (clears timeout and stops recognition)
            this.stopCommandListening();

            this.updateCommandPrompt('Say "Vision" to start');

            // Restart wake word detection
            if (this.wakeWordEnabled) {
                setTimeout(() => {
                    this.startWakeWordDetection();
                }, 2000);
            }
        }
    }

    getFallbackResponse(command) {
        const lowerCommand = command.toLowerCase();

        // Basic command responses when Ollama is unavailable
        if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
            return "Hello!";
        }

        if (lowerCommand.includes('time')) {
            const now = new Date();
            return `The current time is ${now.toLocaleTimeString()}`;
        }

        if (lowerCommand.includes('date')) {
            const today = new Date();
            return `Today is ${today.toLocaleDateString()}`;
        }

        if (lowerCommand.includes('help')) {
            return "I can help you open websites, control YouTube, manage tabs, and answer questions. Try saying 'open YouTube' or 'play music'.";
        }

        // Default helpful response
        return "I'm here to help. You can ask me to open websites, play videos, or ask questions. If Ollama is not connected, some features may be limited.";
    }

    async getOllamaResponse(prompt) {
        // Validate inputs
        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            console.warn('Invalid prompt for Ollama');
            return null;
        }

        if (!this.ollamaUrl || typeof this.ollamaUrl !== 'string') {
            console.warn('Invalid Ollama URL');
            return null;
        }

        if (!this.modelName || typeof this.modelName !== 'string') {
            console.warn('Invalid model name');
            return null;
        }

        try {
            // Normalize URL - ensure it doesn't end with /
            let baseUrl = this.ollamaUrl.trim();
            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }

            // Construct full URL
            const apiUrl = `${baseUrl}/api/generate`;

            // Validate URL format
            try {
                new URL(apiUrl);
            } catch (urlError) {
                console.warn('Invalid Ollama URL format:', apiUrl);
                return null;
            }

            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, 10000); // 10 second timeout

            // Prepare request body
            const requestBody = {
                model: this.modelName.trim(),
                prompt: prompt.trim()
            };

            // Make the fetch request
            // Note: Browser extensions don't need CORS mode for localhost requests
            let response;
            try {
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });
            } catch (fetchError) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                    console.warn('Ollama request timeout');
                } else if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
                    console.warn('Network error: Ollama server may not be running or URL is incorrect');
                } else {
                    console.warn('Fetch error:', fetchError.message);
                }
                return null;
            }

            clearTimeout(timeoutId);

            // Check response status
            if (!response) {
                console.warn('Ollama API: No response received');
                return null;
            }

            // Handle 403 Forbidden error specifically
            if (response.status === 403) {
                let errorText = 'Forbidden';
                try {
                    const errorData = await response.text();
                    errorText = errorData || 'Forbidden - Check Ollama server CORS settings';
                } catch (e) {
                    errorText = response.statusText || 'Forbidden';
                }
                console.warn(`Ollama API 403 Forbidden: ${errorText}`);
                console.warn('This usually means CORS is blocking the request. Make sure Ollama is running and accessible.');
                return null;
            }

            // Handle other non-OK responses
            if (!response.ok) {
                let errorText = 'Unknown error';
                try {
                    errorText = await response.text();
                } catch (e) {
                    errorText = response.statusText || 'No response';
                }
                console.warn(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
                return null;
            }

            // Parse response
            let data;
            try {
                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('application/json')) {
                    data = await response.json();
                } else {
                    // Try to parse as JSON anyway
                    const text = await response.text();
                    try {
                        data = JSON.parse(text);
                    } catch (parseError) {
                        console.warn('Ollama returned non-JSON response:', text.substring(0, 100));
                        return null;
                    }
                }
            } catch (parseError) {
                console.warn('Error parsing Ollama response:', parseError.message);
                return null;
            }

            // Extract response text
            if (data && typeof data === 'object') {
                return data.response || data.text || null;
            }

            return null;
        } catch (error) {
            // Catch any other unexpected errors
            if (error.name === 'AbortError') {
                console.warn('Ollama request timeout');
            } else if (error instanceof SyntaxError) {
                console.warn('Ollama API returned invalid JSON:', error.message);
            } else if (error instanceof TypeError) {
                console.warn('Ollama API network error:', error.message);
            } else {
                console.warn('Ollama API error:', error.message || error);
            }
            return null;
        }
    }

    async speakResponse(text) {
        // Validate input
        if (!text) {
            console.warn('Invalid text for speech: text is empty');
            return Promise.resolve();
        }

        // Convert to string if not already
        if (typeof text !== 'string') {
            text = String(text);
        }

        // Trim and validate
        text = text.trim();
        if (!text) {
            console.warn('Invalid text for speech: text is empty after trimming');
            return Promise.resolve();
        }

        // Check if speech synthesis is available
        if (!this.speechSynthesis) {
            console.warn('Speech synthesis not available');
            return Promise.resolve();
        }

        // Check if speechSynthesis is actually an object with speak method
        if (typeof this.speechSynthesis.speak !== 'function') {
            console.warn('Speech synthesis speak method not available');
            return Promise.resolve();
        }

        try {
            // Cancel any ongoing speech
            if (typeof this.speechSynthesis.cancel === 'function') {
                this.speechSynthesis.cancel();
            }

            // Wait a bit for cancel to take effect
            await new Promise(resolve => setTimeout(resolve, 100));

            // Create utterance
            let utterance;
            try {
                utterance = new SpeechSynthesisUtterance(text);
            } catch (error) {
                console.error('Error creating SpeechSynthesisUtterance:', error);
                return Promise.resolve();
            }

            // Configure utterance
            utterance.rate = this.voiceSpeed || 1.0;
            utterance.pitch = 1;
            utterance.volume = 1;

            // Return promise that resolves when speech completes
            return new Promise((resolve) => {
                let resolved = false;

                const cleanup = () => {
                    if (!resolved) {
                        resolved = true;
                        resolve();
                    }
                };

                utterance.onend = cleanup;
                utterance.onerror = (error) => {
                    console.warn('Speech synthesis error:', error);
                    cleanup();
                };

                try {
                    this.speechSynthesis.speak(utterance);

                    // Timeout fallback in case events don't fire
                    const timeout = Math.max(text.length * 50, 3000); // At least 3 seconds or based on text length
                    setTimeout(() => {
                        cleanup();
                    }, timeout);
                } catch (error) {
                    console.error('Error starting speech:', error);
                    cleanup();
                }
            });
        } catch (error) {
            console.error('Error in speakResponse:', error);
            // Return resolved promise to prevent errors from propagating
            return Promise.resolve();
        }
    }

    announce(message) {
        if (!message || typeof message !== 'string') {
            return;
        }

        if (!this.speechSynthesis) {
            console.warn('Speech synthesis not available for announcement');
            return;
        }

        try {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = this.voiceSpeed || 1.0;
            utterance.volume = 1;

            utterance.onerror = (error) => {
                console.warn('Announcement speech error:', error);
            };

            this.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error in announce:', error);
            // Don't throw, just log
        }
    }

    playBeep() {
        try {
            // Create audio context for beep sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            // Configure beep: 800Hz frequency, 0.15 seconds duration
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            // Fade out for smooth beep
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        } catch (error) {
            console.warn('Error playing beep:', error);
            // Fallback: try using a simple audio element if AudioContext fails
            try {
                const beep = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yk2CBlou+/nn00QDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC');
                beep.volume = 0.3;
                beep.play().catch(() => {
                    // Ignore if beep fails
                });
            } catch (fallbackError) {
                // If all beep methods fail, just continue silently
                console.warn('All beep methods failed:', fallbackError);
            }
        }
    }

    updateVoiceStatus(text, statusClass) {
        const statusElement = document.getElementById('voiceStatus');
        const indicator = document.getElementById('voiceIndicator');

        if (statusElement) {
            statusElement.textContent = text;
        }

        if (indicator) {
            indicator.classList.remove('listening', 'processing');
            if (statusClass) {
                indicator.classList.add(statusClass);
            }
        }
    }

    updateCommandPrompt(text) {
        const promptElement = document.getElementById('commandPrompt');
        if (promptElement) {
            promptElement.textContent = text;
        }
    }

    updateResponseText(text) {
        const responseElement = document.getElementById('responseText');
        if (responseElement) {
            responseElement.textContent = text;
            responseElement.classList.add('speaking');
            setTimeout(() => {
                responseElement.classList.remove('speaking');
            }, 2000);
        }
    }

    addChatMessage(role, message) {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message chat-message-${role}`;

        const roleLabel = document.createElement('div');
        roleLabel.className = 'chat-role';
        roleLabel.textContent = role === 'user' ? 'You' : 'Vision';

        const messageText = document.createElement('div');
        messageText.className = 'chat-text';
        messageText.textContent = message;

        messageDiv.appendChild(roleLabel);
        messageDiv.appendChild(messageText);

        chatContainer.appendChild(messageDiv);

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    setupEventListeners() {
        // Settings button - open settings page
        const openSettingsBtn = document.getElementById('openSettings');
        if (openSettingsBtn) {
            openSettingsBtn.addEventListener('click', () => {
                chrome.tabs.create({
                    url: chrome.runtime.getURL('settings.html')
                });
            });
        }

        // Settings inputs (if they exist in popup - they're now in settings page)
        const ollamaUrlInput = document.getElementById('ollamaUrl');
        const modelNameInput = document.getElementById('modelName');
        const voiceSpeedInput = document.getElementById('voiceSpeed');
        const voiceSpeedValue = document.getElementById('voiceSpeedValue');
        const wakeWordToggle = document.getElementById('wakeWordDetection');

        if (ollamaUrlInput) {
            ollamaUrlInput.addEventListener('change', (e) => {
                this.ollamaUrl = e.target.value;
                this.saveSettings();
                this.checkOllamaConnection();
            });
        }

        if (modelNameInput) {
            modelNameInput.addEventListener('change', (e) => {
                this.modelName = e.target.value;
                this.saveSettings();
                this.checkOllamaConnection();
            });
        }

        if (voiceSpeedInput) {
            voiceSpeedInput.addEventListener('input', (e) => {
                this.voiceSpeed = parseFloat(e.target.value);
                if (voiceSpeedValue) {
                    voiceSpeedValue.textContent = this.voiceSpeed.toFixed(1) + 'x';
                }
                this.saveSettings();
            });
        }

        if (wakeWordToggle) {
            wakeWordToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isActive = wakeWordToggle.classList.contains('active');
                if (isActive) {
                    wakeWordToggle.classList.remove('active');
                    wakeWordToggle.setAttribute('aria-checked', 'false');
                    this.wakeWordEnabled = false;
                    if (this.recognition) {
                        this.recognition.stop();
                    }
                } else {
                    wakeWordToggle.classList.add('active');
                    wakeWordToggle.setAttribute('aria-checked', 'true');
                    this.wakeWordEnabled = true;
                    this.startWakeWordDetection();
                }
                this.saveSettings();
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.visionAssistant = new VisionAssistant();

    // Listen for settings updates and Ollama requests
    if (chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'settingsChanged' || request.action === 'settingsUpdated') {
                // Reload settings when updated from settings page
                if (window.visionAssistant) {
                    window.visionAssistant.loadSettings().then(() => {
                        window.visionAssistant.checkOllamaConnection().catch(() => { });
                    });
                }
                sendResponse({ success: true });
            } else if (request.action === 'processWithOllama') {
                // Process request with Ollama and speak result
                if (window.visionAssistant) {
                    window.visionAssistant.getOllamaResponse(request.prompt).then(response => {
                        if (response && request.speak) {
                            window.visionAssistant.speakResponse(response);
                            window.visionAssistant.addChatMessage('assistant', response);
                        }
                        sendResponse({ success: true, response });
                    }).catch(err => {
                        sendResponse({ success: false, error: err.message });
                    });
                    return true; // Keep channel open for async
                }
            }
            return true;
        });
    }

    // Also listen to storage changes (more reliable)
    if (chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'sync' && window.visionAssistant) {
                // Reload settings when they change
                window.visionAssistant.loadSettings().then(() => {
                    window.visionAssistant.checkOllamaConnection().catch(() => { });
                });
            }
        });
    }
});
