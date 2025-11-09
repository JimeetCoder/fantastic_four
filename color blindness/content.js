// content script: listens for mode changes and injects/removes the partial blindness stylesheet
(function () {
    const STYLE_ID = 'partial-blindness-style-v1';

    function injectCSSFromURL(url) {
        return fetch(url)
            .then((r) => r.text())
            .then((cssText) => {
                let existing = document.getElementById(STYLE_ID);
                if (!existing) {
                    const style = document.createElement('style');
                    style.id = STYLE_ID;
                    style.textContent = cssText;
                    document.head.appendChild(style);
                }
            })
            .catch((err) => {
                console.error('partial-blindness: failed to load css', err);
            });
    }

    function removeInjectedCSS() {
        const existing = document.getElementById(STYLE_ID);
        if (existing) existing.remove();
        // also remove class from body if present
        document.documentElement.classList.remove('partial-blindness-applied');
    }

    function setEnabled(enabled) {
        if (enabled) {
            const url = chrome.runtime.getURL('partial-blindness.css');
            injectCSSFromURL(url).then(() => {
                document.documentElement.classList.add('partial-blindness-applied');
            });
        } else {
            removeInjectedCSS();
        }
    }

    // initial state from storage
    chrome.storage.local.get({ partialBlindness: false }, (items) => {
        setEnabled(!!items.partialBlindness);
    });

    // listen for messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message && message.type === 'set-partial-blindness') {
            setEnabled(!!message.enabled);
        }
    });

    // support keyboard shortcut: Ctrl+Shift+P toggles partial blindness for quick testing
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
            chrome.runtime.sendMessage({ type: 'toggle-partial-blindness' });
        }
    });
})();
