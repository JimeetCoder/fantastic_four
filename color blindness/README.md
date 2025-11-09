# Color Vision Assistant — Partial Blindness Mode

This repository contains a browser extension scaffold (manifest v3) that includes a "Partial Blindness" mode — a UI overlay that makes pages bolder and brighter for users with low vision.

What I added:
- `partial-blindness.css` — stylesheet injected into pages when the mode is enabled. It increases font-weight/size, stronger borders, higher contrast, and visible focus outlines.
- `content.js` — content script that injects/removes the stylesheet and listens for toggle messages.
- `background.js` — service worker that stores the mode state and broadcasts changes to all tabs.
- `popup.html` — a simple popup to toggle the mode.

How to load the extension (Chrome / Edge):

1. Open the browser's extension management page (e.g., chrome://extensions/).
2. Enable Developer mode.
3. Click "Load unpacked" and select this project folder.
4. Click the extension icon and toggle "Partial Blindness".

Firefox notes:
- Firefox supports WebExtensions, but MV3 support differs; you may need to adapt `background.js` to a background page/service worker model compatible with the target Firefox version.

Cross-platform compatibility notes (major apps):
- Browsers: This extension approach works for Chromium-based browsers and can be adapted for Firefox with small manifest tweaks.
- Electron apps: For an Electron-based desktop app you can apply the same CSS by injecting the contents of `partial-blindness.css` into the BrowserWindow/WebContents (e.g., `webContents.insertCSS(cssText)`).
- Native apps (non-web UIs): They typically don't support CSS injection. For broad OS-level support, consider using platform accessibility APIs or building a companion app that overlays the screen (this is more complex and platform-specific).

Next steps / improvements:
- Add an Options page to adjust intensity (font scale, extra contrast, image adjustments).
- Provide per-site persistence and a whitelist/blacklist.
- Add a keyboard shortcut via the commands API and surface it in the popup.
