# Vision Assistant Browser Extension

A lightweight browser extension for blind and visually impaired users with voice-controlled AI assistance using local LLM (Ollama).

## Features

- **Automatic Wake Word Detection**: Say "Hello Vision" to activate
- **Local LLM Processing**: Uses Ollama for privacy-preserving AI responses
- **Lightweight**: Removed unnecessary libraries (TensorFlow, annyang, hammer.js)
- **Voice Commands**: Natural language interaction
- **Text-to-Speech**: Responses are spoken aloud

## Prerequisites

1. **Ollama** must be installed and running
   - Download from: https://ollama.ai
   - Install and start Ollama service

2. **Pull a lightweight model**:
   ```bash
   ollama pull qwen3:4b
   ```
   
   Other recommended models:
   - `qwen3:4b` (2.3GB) - Recommended
   - `llama3.2:1b` (1.3GB) - Smaller option
   - `phi3:mini` (2.3GB) - Alternative
   - `gemma:2b` (1.4GB) - Smaller option

## Installation

1. **Load the extension**:
   - Open Chrome/Edge
   - Go to `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension folder

2. **Configure settings**:
   - Click the extension icon
   - Verify Ollama URL (default: `http://localhost:11434`)
   - Set model name (default: `qwen3:4b`)
   - Adjust voice speed if needed

3. **Grant microphone permission**:
   - Click the extension icon
   - Allow microphone access when prompted

## Usage

1. **Activate**: Say "Hello Vision" (wake word detection is automatic)
2. **Speak your command**: After activation, speak naturally
3. **Get response**: The assistant will respond via text-to-speech

## Settings

- **Ollama URL**: Default is `http://localhost:11434`
- **Model Name**: The Ollama model to use (must be pulled first)
- **Voice Speed**: Adjust speech rate (0.5x to 2x)
- **Wake Word Detection**: Toggle automatic wake word listening

## Troubleshooting

### Ollama Connection Issues

1. **Check if Ollama is running**:
   ```bash
   ollama list
   ```

2. **Verify model is pulled**:
   ```bash
   ollama pull llama3.2:1b
   ```

3. **Test Ollama API**:
   ```bash
   curl http://localhost:11434/api/tags
   ```

### Microphone Not Working

1. Check browser permissions for microphone
2. Ensure microphone is not being used by another application
3. Try refreshing the extension popup

### Wake Word Not Detecting

1. Ensure wake word detection is enabled in settings
2. Speak clearly: "Hello Vision"
3. Check microphone permissions

## File Structure

```
vision-assistant-extension/
├── manifest.json          # Extension manifest (Manifest V3)
├── popup.html             # Extension popup UI
├── styles.css             # Styling
├── app.js                 # Main application logic
├── background.js          # Background service worker
├── content.js            # Content script (for future features)
└── icons/                # Extension icons (create these)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Development

To modify the extension:

1. Make changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## Notes

- The extension uses the Web Speech API for speech recognition
- Ollama must be running locally for the extension to work
- All processing happens locally (privacy-preserving)
- The extension works best with Chrome or Edge browsers

## License

MIT License

