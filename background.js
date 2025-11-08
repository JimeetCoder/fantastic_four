/**
 * Background Service Worker for Vision Assistant Extension
 */

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Vision Assistant extension installed');
        // Set default settings
        chrome.storage.sync.set({
            ollamaUrl: 'http://localhost:11434',
            modelName: 'tinyllama',
            voiceSpeed: 1.0,
            wakeWordEnabled: true,
            wakeWord: 'vision'
        });
    }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkOllama') {
        checkOllamaConnection(request.url)
            .then(result => sendResponse({ success: true, ...result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep channel open for async response
    }
    
    if (request.action === 'settingsUpdated') {
        // Settings were updated, broadcast to all extension pages
        console.log('Settings updated:', request.settings);
        
        // Broadcast to all extension pages
        chrome.runtime.sendMessage({
            action: 'settingsChanged',
            settings: request.settings
        }).catch(() => {
            // Ignore errors if no listeners
        });
        
        sendResponse({ success: true });
        return true;
    }
    
    if (request.action === 'settingsChanged') {
        // This is a broadcast message, don't respond
        console.log('Settings changed broadcast received');
        return false;
    }
});

async function checkOllamaConnection(url) {
    try {
        const response = await fetch(`${url}/api/tags`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            return { connected: true, models: data.models || [] };
        } else {
            return { connected: false, error: 'Ollama not responding' };
        }
    } catch (error) {
        return { connected: false, error: error.message };
    }
}

