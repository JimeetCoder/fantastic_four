# How Vision Assistant Extension Works with Ollama

## Architecture Overview

```
┌─────────────────────────────────────┐
│   Vision Assistant Extension         │
│   (Browser Extension)                 │
│   - popup.html                        │
│   - app.js                            │
│   - manifest.json                     │
└──────────────┬───────────────────────┘
               │
               │ HTTP API Calls
               │ (http://localhost:11434)
               │
┌──────────────▼───────────────────────┐
│   Ollama Service                    │
│   (System-wide Service)              │
│   - Runs on port 11434               │
│   - Manages AI models                │
│   - Processes requests               │
└─────────────────────────────────────┘
```

## Key Points

### 1. Ollama is a System Service
- **Ollama is NOT in the extension folder**
- Ollama is installed **system-wide** on your computer
- It runs as a **background service** (like Windows Services)
- It listens on `http://localhost:11434` for API requests

### 2. Extension Folder Contains Only Extension Files
The extension folder (`fantastic_four-ParthVarekar-blindness-part`) contains:
- ✅ `popup.html` - Extension UI
- ✅ `app.js` - Extension logic
- ✅ `manifest.json` - Extension configuration
- ✅ `styles.css` - Styling
- ✅ `background.js` - Background worker
- ❌ **NOT Ollama** (Ollama is separate)

### 3. How They Communicate
- Extension makes **HTTP requests** to `http://localhost:11434`
- Ollama service responds with AI-generated text
- No files need to be in the same folder
- They communicate over the network (localhost)

## Installation Locations

### Ollama Installation
When you install Ollama:
- **Windows**: Usually installs to:
  - `C:\Users\<YourUsername>\AppData\Local\Programs\Ollama\`
  - Or `C:\Program Files\Ollama\`
- **Service**: Runs as a Windows Service
- **Port**: Listens on `localhost:11434`

### Extension Installation
- **Location**: Any folder you choose (like your Downloads folder)
- **Loaded into**: Chrome/Edge browser
- **No connection to**: Ollama's installation location

## What You Need

### For the Extension to Work:
1. ✅ Extension files in a folder (you have this)
2. ✅ Extension loaded in Chrome/Edge browser
3. ✅ Ollama installed system-wide (separate installation)
4. ✅ Ollama service running
5. ✅ Model pulled (`qwen3:4b`)

### The Extension Connects to Ollama Via:
- **URL**: `http://localhost:11434`
- **API Endpoint**: `/api/generate`
- **Method**: HTTP POST requests

## Example Flow

1. User says "Hello Vision" → Extension activates
2. User speaks command → Extension captures audio
3. Extension sends text to Ollama:
   ```
   POST http://localhost:11434/api/generate
   Body: { "model": "qwen3:4b", "prompt": "user's command" }
   ```
4. Ollama processes → Returns AI response
5. Extension receives response → Speaks it to user

## Common Misconceptions

❌ **Wrong**: "Ollama needs to be in the extension folder"
✅ **Correct**: Ollama is a separate system service

❌ **Wrong**: "I need to copy Ollama files to the extension"
✅ **Correct**: Ollama runs independently, extension just connects to it

❌ **Wrong**: "Extension and Ollama must be in same folder"
✅ **Correct**: They can be anywhere, they communicate over HTTP

## Summary

- **Ollama**: System-wide service (like a web server)
- **Extension**: Browser extension (like a web client)
- **Connection**: HTTP API calls (localhost:11434)
- **No file sharing needed**: They're completely separate

Think of it like:
- Ollama = A restaurant (system service)
- Extension = A customer (browser extension)
- They communicate via orders (HTTP requests)
- They don't need to be in the same building!

