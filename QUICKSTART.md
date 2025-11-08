# Quick Start Guide

## 1. Install Ollama

**Windows:**
- Download from https://ollama.ai/download/windows
- Run installer
- Ollama starts automatically

**macOS/Linux:**
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh
```

## 2. Pull a Model

```bash
ollama pull qwen3:4b
```

This downloads a 2.3GB model. Wait for it to complete.

## 3. Verify Ollama is Running

```bash
ollama list
```

You should see `qwen3:4b` in the list.

## 4. Load the Extension

1. Open Chrome/Edge
2. Go to `chrome://extensions/` (or `edge://extensions/`)
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `fantastic_four-ParthVarekar-blindness-part` folder

## 5. Create Icons (Required)

The extension needs icon files. You have two options:

**Option A: Use the icon generator**
1. Open `create-icons.html` in a browser
2. Click the download links to save icons
3. Create an `icons` folder in the extension directory
4. Move the downloaded icons to `icons/` folder

**Option B: Create manually**
1. Create an `icons` folder
2. Create three PNG files:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
3. Use any simple icon/image editor

## 6. Configure Extension

1. Click the extension icon in your browser toolbar
2. Allow microphone permission when prompted
3. Verify settings:
   - **Ollama URL**: `http://localhost:11434`
   - **Model Name**: `qwen3:4b`
4. Check that "Ollama Connected" appears in green

## 7. Use the Extension

1. **Say "Hello Vision"** - The extension automatically listens for this wake word
2. **Speak your command** - After activation, speak naturally
3. **Get response** - The assistant responds via text-to-speech

## Troubleshooting

**Extension icon is missing:**
- Create the `icons` folder and add the three icon files

**Ollama not connected:**
- Make sure Ollama is running: `ollama list`
- Check the URL in settings matches your Ollama installation
- Try: `curl http://localhost:11434/api/tags`

**Wake word not working:**
- Check microphone permissions in browser settings
- Ensure wake word detection is enabled (toggle in settings)
- Speak clearly: "Hello Vision"

**Model not found:**
- Run: `ollama pull qwen3:4b`
- Wait for download to complete
- Refresh extension popup

## Features

✅ **Automatic Wake Word**: No button needed, just say "Hello Vision"  
✅ **Local Processing**: All AI processing happens on your computer  
✅ **Lightweight**: Removed heavy libraries (TensorFlow, etc.)  
✅ **Privacy**: No data sent to external servers  
✅ **Voice Commands**: Natural language interaction  

