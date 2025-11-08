/**
 * Settings Page Script
 * Handles settings management in the standalone settings page
 */

class SettingsManager {
    constructor() {
        this.settings = {
            ollamaUrl: 'http://localhost:11434',
            modelName: 'tinyllama',
            voiceSpeed: 1.0,
            wakeWordEnabled: true,
            wakeWord: 'vision'
        };
        
        this.initialize();
    }

    async initialize() {
        // Load settings from storage
        await this.loadSettings();
        
        // Populate UI
        this.populateUI();
        
        // Check Ollama connection
        await this.checkOllamaConnection();
        
        // Setup event listeners
        this.setupEventListeners();
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
            
            if (result.ollamaUrl) this.settings.ollamaUrl = result.ollamaUrl;
            if (result.modelName) this.settings.modelName = result.modelName;
            if (result.voiceSpeed) this.settings.voiceSpeed = result.voiceSpeed;
            if (result.wakeWordEnabled !== undefined) this.settings.wakeWordEnabled = result.wakeWordEnabled;
            if (result.wakeWord) this.settings.wakeWord = result.wakeWord;
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    populateUI() {
        const ollamaUrlInput = document.getElementById('ollamaUrl');
        const modelNameInput = document.getElementById('modelName');
        const voiceSpeedInput = document.getElementById('voiceSpeed');
        const voiceSpeedValue = document.getElementById('voiceSpeedValue');
        const wakeWordToggle = document.getElementById('wakeWordDetection');
        const wakeWordInput = document.getElementById('wakeWord');
        
        if (ollamaUrlInput) ollamaUrlInput.value = this.settings.ollamaUrl;
        if (modelNameInput) modelNameInput.value = this.settings.modelName;
        if (voiceSpeedInput) {
            voiceSpeedInput.value = this.settings.voiceSpeed;
            if (voiceSpeedValue) {
                voiceSpeedValue.textContent = this.settings.voiceSpeed.toFixed(1) + 'x';
            }
        }
        if (wakeWordToggle) {
            if (this.settings.wakeWordEnabled) {
                wakeWordToggle.classList.add('active');
                wakeWordToggle.setAttribute('aria-checked', 'true');
            } else {
                wakeWordToggle.classList.remove('active');
                wakeWordToggle.setAttribute('aria-checked', 'false');
            }
        }
        if (wakeWordInput) wakeWordInput.value = this.settings.wakeWord;
    }

    async saveSettings() {
        const ollamaUrlInput = document.getElementById('ollamaUrl');
        const modelNameInput = document.getElementById('modelName');
        const voiceSpeedInput = document.getElementById('voiceSpeed');
        const wakeWordToggle = document.getElementById('wakeWordDetection');
        const wakeWordInput = document.getElementById('wakeWord');
        
        this.settings.ollamaUrl = ollamaUrlInput.value;
        this.settings.modelName = modelNameInput.value;
        this.settings.voiceSpeed = parseFloat(voiceSpeedInput.value);
        this.settings.wakeWordEnabled = wakeWordToggle.classList.contains('active');
        this.settings.wakeWord = wakeWordInput.value.toLowerCase().trim();
        
        try {
            await chrome.storage.sync.set(this.settings);
            alert('Settings saved successfully!');
            // Notify background script to reload settings
            chrome.runtime.sendMessage({ action: 'settingsUpdated' });
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error saving settings. Please try again.');
        }
    }

    async resetSettings() {
        if (confirm('Reset all settings to defaults?')) {
            this.settings = {
                ollamaUrl: 'http://localhost:11434',
                modelName: 'tinyllama',
                voiceSpeed: 1.0,
                wakeWordEnabled: true,
                wakeWord: 'vision'
            };
            
            try {
                await chrome.storage.sync.set(this.settings);
                this.populateUI();
                await this.checkOllamaConnection();
                alert('Settings reset to defaults!');
            } catch (error) {
                console.error('Error resetting settings:', error);
            }
        }
    }

    async checkOllamaConnection() {
        const statusElement = document.getElementById('ollamaStatus');
        const statusContainer = document.getElementById('connectionStatus');
        
        if (statusElement) {
            statusElement.textContent = 'Checking connection...';
        }
        
        try {
            // Use current input values if available, otherwise use saved settings
            const ollamaUrlInput = document.getElementById('ollamaUrl');
            const modelNameInput = document.getElementById('modelName');
            const url = ollamaUrlInput ? ollamaUrlInput.value.trim() : this.settings.ollamaUrl;
            const model = modelNameInput ? modelNameInput.value.trim() : this.settings.modelName;
            
            if (!url) {
                throw new Error('No Ollama URL configured');
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(`${url}/api/tags`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                const modelBase = model.split(':')[0];
                const hasModel = data.models?.some(m => {
                    const modelName = m.name.toLowerCase();
                    return modelName.includes(modelBase.toLowerCase()) || modelName === model.toLowerCase();
                });
                
                if (statusElement) {
                    if (hasModel) {
                        statusElement.textContent = `✅ Ollama Connected - Model "${model}" found`;
                    } else {
                        const availableModels = data.models?.length > 0 ? 
                            `Available: ${data.models.map(m => m.name).join(', ')}` : 
                            'No models found';
                        statusElement.textContent = `⚠️ Ollama Connected - Model "${model}" not found. ${availableModels}`;
                    }
                }
                
                if (statusContainer) {
                    statusContainer.className = hasModel ? 
                        'status-indicator connected' : 
                        'status-indicator disconnected';
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Ollama connection error:', error);
            if (statusElement) {
                if (error.name === 'AbortError') {
                    statusElement.textContent = '❌ Connection Timeout - Check if Ollama is running';
                } else {
                    statusElement.textContent = `❌ Ollama Disconnected - ${error.message}`;
                }
            }
            if (statusContainer) {
                statusContainer.className = 'status-indicator disconnected';
            }
        }
    }

    async testConnection() {
        const ollamaUrlInput = document.getElementById('ollamaUrl');
        const modelNameInput = document.getElementById('modelName');
        const testButton = event?.target || document.querySelector('button[onclick="testConnection()"]');
        
        if (!ollamaUrlInput || !ollamaUrlInput.value.trim()) {
            alert('Please enter an Ollama URL');
            return;
        }
        
        if (!modelNameInput || !modelNameInput.value.trim()) {
            alert('Please enter a model name');
            return;
        }
        
        const url = ollamaUrlInput.value.trim();
        const model = modelNameInput.value.trim();
        
        // Validate URL
        try {
            new URL(url);
        } catch (e) {
            alert('Please enter a valid URL (e.g., http://localhost:11434)');
            return;
        }
        
        // Disable button during test
        if (testButton) {
            testButton.disabled = true;
            testButton.textContent = 'Testing...';
        }
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(`${url}/api/tags`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                const modelBase = model.split(':')[0];
                const hasModel = data.models?.some(m => {
                    const modelName = m.name.toLowerCase();
                    return modelName.includes(modelBase.toLowerCase()) || modelName === model.toLowerCase();
                });
                
                if (hasModel) {
                    alert(`✅ Connection successful!\n\nModel "${model}" is available and ready to use.`);
                    // Update status indicator
                    await this.checkOllamaConnection();
                } else {
                    const availableModels = data.models?.map(m => m.name).join(', ') || 'none';
                    alert(`⚠️ Connection successful, but model "${model}" not found.\n\nAvailable models: ${availableModels}\n\nPlease pull the model using:\nollama pull ${model}`);
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                alert(`❌ Connection timeout.\n\nPlease check:\n- Ollama is running\n- URL is correct: ${url}\n- Firewall is not blocking the connection`);
            } else {
                alert(`❌ Connection failed.\n\nError: ${error.message}\n\nPlease check:\n- Ollama is running\n- URL is correct: ${url}\n- Try: ollama serve`);
            }
        } finally {
            if (testButton) {
                testButton.disabled = false;
                testButton.textContent = 'Test Connection';
            }
        }
    }

    setupEventListeners() {
        const voiceSpeedInput = document.getElementById('voiceSpeed');
        const voiceSpeedValue = document.getElementById('voiceSpeedValue');
        const wakeWordToggle = document.getElementById('wakeWordDetection');
        const ollamaUrlInput = document.getElementById('ollamaUrl');
        const modelNameInput = document.getElementById('modelName');
        
        if (voiceSpeedInput) {
            voiceSpeedInput.addEventListener('input', (e) => {
                const speed = parseFloat(e.target.value);
                if (voiceSpeedValue) {
                    voiceSpeedValue.textContent = speed.toFixed(1) + 'x';
                }
            });
        }
        
        if (wakeWordToggle) {
            wakeWordToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isActive = wakeWordToggle.classList.contains('active');
                if (isActive) {
                    wakeWordToggle.classList.remove('active');
                    wakeWordToggle.setAttribute('aria-checked', 'false');
                } else {
                    wakeWordToggle.classList.add('active');
                    wakeWordToggle.setAttribute('aria-checked', 'true');
                }
            });
        }
        
        // Auto-check connection when URL or model changes
        if (ollamaUrlInput) {
            let urlTimeout;
            ollamaUrlInput.addEventListener('input', () => {
                clearTimeout(urlTimeout);
                urlTimeout = setTimeout(() => {
                    this.checkOllamaConnection();
                }, 1000); // Check 1 second after user stops typing
            });
        }
        
        if (modelNameInput) {
            let modelTimeout;
            modelNameInput.addEventListener('input', () => {
                clearTimeout(modelTimeout);
                modelTimeout = setTimeout(() => {
                    this.checkOllamaConnection();
                }, 1000);
            });
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});

// Helper functions for buttons
async function saveSettings() {
    if (window.settingsManager) {
        await window.settingsManager.saveSettings();
    }
}

async function resetSettings() {
    if (window.settingsManager) {
        await window.settingsManager.resetSettings();
    }
}

async function testConnection() {
    if (window.settingsManager) {
        await window.settingsManager.testConnection();
    }
}

async function refreshConnection() {
    if (window.settingsManager) {
        await window.settingsManager.checkOllamaConnection();
    }
}

