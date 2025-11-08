# How to Access Ollama Settings

## Method 1: Through Extension Popup (Recommended)

1. **Click the Vision Assistant extension icon** in your browser toolbar (top right)
2. **Look for the blue button** at the bottom that says "⚙️ Open Settings"
3. **Click that button**
4. **Settings page opens in a new tab** with all Ollama configuration options

## Method 2: Direct URL (If button doesn't work)

If the button isn't working, you can access settings directly:

1. **Copy this URL** and paste it in your browser address bar:
   ```
   chrome-extension://YOUR_EXTENSION_ID/settings.html
   ```

2. **To find your extension ID:**
   - Go to `chrome://extensions/` or `edge://extensions/`
   - Find "Vision Assistant" extension
   - Copy the ID shown under the extension name
   - Replace `YOUR_EXTENSION_ID` in the URL above

## Method 3: Right-Click Extension Icon

1. **Right-click** the Vision Assistant extension icon
2. Look for "Options" or "Manage extension"
3. This might open the settings page

## What You'll See in Settings Page

Once the settings page opens, you'll see:

### Ollama Configuration Section:
- **Ollama URL**: `http://localhost:11434` (default)
- **Model Name**: `tinyllama` (default)
- **Test Connection** button: Click to verify Ollama is working

### Voice Settings:
- **Voice Speed**: Adjust speech rate (0.5x to 2x)

### Wake Word Settings:
- **Wake Word Detection**: Toggle on/off
- **Wake Word**: "hello vision" (customizable)

## Troubleshooting

### Button not visible?
1. **Reload the extension:**
   - Go to `chrome://extensions/`
   - Find "Vision Assistant"
   - Click the reload button (circular arrow)

### Settings page won't open?
1. **Check if settings.html exists** in the extension folder
2. **Check browser console** for errors (F12)
3. **Try Method 2** (direct URL) above

### Can't find extension icon?
1. **Pin the extension:**
   - Go to `chrome://extensions/`
   - Find "Vision Assistant"
   - Click the pin icon to add it to toolbar

## Quick Test

After opening settings:
1. Check "Connection Status" at the top
2. Should show: "✅ Ollama Connected - Model 'tinyllama' found"
3. If not, click "Test Connection" button
4. Adjust Ollama URL if needed

