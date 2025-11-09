// background service worker for MV3 - toggles modes and notifies tabs
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get({ partialBlindness: false }, (items) => {
        // ensure default exists
        chrome.storage.local.set({ partialBlindness: items.partialBlindness });
    });
});

// Toggle via popup message
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === 'toggle-partial-blindness') {
        chrome.storage.local.get({ partialBlindness: false }, (items) => {
            const next = !items.partialBlindness;
            chrome.storage.local.set({ partialBlindness: next }, () => {
                // broadcast to all tabs
                chrome.tabs.query({}, (tabs) => {
                    for (const tab of tabs) {
                        if (!tab.id) continue;
                        chrome.tabs.sendMessage(tab.id, { type: 'set-partial-blindness', enabled: next });
                    }
                });
                sendResponse({ ok: true, enabled: next });
            });
        });
        return true; // will respond asynchronously
    }
});

// Also respond to queries from popup/content
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.type === 'get-partial-blindness') {
        chrome.storage.local.get({ partialBlindness: false }, (items) => {
            sendResponse({ enabled: !!items.partialBlindness });
        });
        return true;
    }
});

// When storage changes (e.g., another device), notify tabs
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.partialBlindness) {
        const enabled = changes.partialBlindness.newValue;
        chrome.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
                if (!tab.id) continue;
                chrome.tabs.sendMessage(tab.id, { type: 'set-partial-blindness', enabled });
            }
        });
    }
});
