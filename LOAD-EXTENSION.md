# Load Vision Assistant Extension - Quick Guide

## Step 1: Create Icons Folder (Required)

The extension needs icon files. You have two options:

### Option A: Use the Icon Generator (Easiest)
1. Open `create-icons.html` in your browser
2. Click the download links to save the icons
3. Create a folder named `icons` in the extension directory
4. Move the downloaded icons to the `icons` folder

### Option B: Create Icons Manually
1. Create a folder named `icons` in the extension directory
2. Create three PNG files:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)  
   - `icon128.png` (128x128 pixels)
3. You can use any simple icon/image editor

**Quick Fix**: If you just want to test, you can create empty placeholder files or use any small images renamed to the required names.

## Step 2: Load Extension in Chrome/Edge

### For Chrome:
1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Navigate to and select the `fantastic_four-ParthVarekar-blindness-part` folder
6. Click **Select Folder**

### For Edge:
1. Open Edge
2. Go to: `edge://extensions/`
3. Enable **Developer mode** (toggle in bottom left)
4. Click **Load unpacked**
5. Navigate to and select the `fantastic_four-ParthVarekar-blindness-part` folder
6. Click **Select Folder**

## Step 3: Grant Permissions

1. Click the extension icon in your browser toolbar
2. Allow microphone access when prompted
3. The extension popup will open

## Step 4: Configure Settings

In the extension popup, verify:
- **Ollama URL**: `http://localhost:11434`
- **Model Name**: `tinyllama`
- **Connection Status**: Should show "Ollama Connected" (green)

## Step 5: Test the Extension

1. **Say "Hello Vision"** - The extension automatically listens for this wake word
2. **Speak your command** - After activation, speak naturally
3. **Get response** - The assistant will respond via text-to-speech

## Troubleshooting

### Extension won't load
- Make sure you selected the correct folder (the one with manifest.json)
- Check that `icons` folder exists with icon files
- Try creating simple placeholder icons if needed

### Microphone not working
- Check browser permissions for microphone
- Click the extension icon → Allow microphone access
- Check Windows microphone settings

### Ollama not connected
- Make sure Ollama service is running
- Verify: `curl http://localhost:11434/api/tags`
- Check the URL in extension settings

### Wake word not detecting
- Ensure microphone permission is granted
- Check that wake word detection is enabled (toggle in settings)
- Speak clearly: "Hello Vision"

## Quick Test Commands

After loading, try saying:
- "Hello Vision, what time is it?"
- "Hello Vision, tell me a joke"
- "Hello Vision, how are you?"

## File Structure Check

Your extension folder should have:
```
fantastic_four-ParthVarekar-blindness-part/
├── manifest.json          ✅
├── popup.html            ✅
├── app.js               ✅
├── styles.css            ✅
├── background.js         ✅
├── content.js            ✅
└── icons/                ⚠️  (needs to be created)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Ready to Use!

Once loaded, the extension will:
- ✅ Listen for "Hello Vision" wake word
- ✅ Convert speech to text
- ✅ Process with tinyllama (Ollama)
- ✅ Respond via text-to-speech

Enjoy your Vision Assistant! 🎉

