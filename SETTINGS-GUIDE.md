# Settings Guide - Vision Assistant Extension

## How to Access Settings

1. **Click the extension icon** in your browser toolbar
2. **Click "⚙️ Open Ollama Settings"** button
3. **Settings page opens in a new tab**

## Settings Features

### ✅ Connection Status
- **Real-time status**: Shows if Ollama is connected
- **Model verification**: Checks if your model is available
- **Auto-refresh**: Updates when you change URL or model

### ✅ Ollama Configuration

#### Ollama URL
- **Default**: `http://localhost:11434`
- **Custom**: Enter your Ollama server URL
- **Auto-check**: Connection is checked automatically when you type

#### Model Name
- **Default**: `tinyllama`
- **Change**: Enter any Ollama model name
- **Examples**: `llama3.2:1b`, `qwen3:4b`, `phi3:mini`
- **Auto-check**: Verifies model availability

#### Test Connection Button
- **Tests**: Ollama connection and model availability
- **Shows**: Available models if connection succeeds
- **Helps**: Troubleshoot connection issues

#### Refresh Status Button
- **Refreshes**: Connection status without testing
- **Updates**: Status indicator immediately

### ✅ Voice Settings

#### Voice Speed
- **Range**: 0.5x to 2x
- **Default**: 1x (normal speed)
- **Adjust**: Use slider to change speech rate

### ✅ Wake Word Settings

#### Wake Word Detection
- **Toggle**: Enable/disable automatic wake word detection
- **Default**: Enabled
- **When disabled**: Manual activation required

#### Wake Word
- **Default**: "hello vision"
- **Customize**: Change to any phrase you prefer
- **Example**: "hey assistant", "activate"

## How Settings Work

### Saving Settings
1. **Change settings** in the settings page
2. **Click "Save Settings"** button
3. **Settings are saved** to browser storage
4. **Extension reloads** settings automatically
5. **Success message** appears

### Settings Sync
- ✅ Settings sync across all extension pages
- ✅ Changes apply immediately
- ✅ No need to reload extension manually
- ✅ Popup and settings page stay in sync

### Auto-Save (Optional)
- Settings are checked automatically when typing
- Connection status updates in real-time
- No need to click "Save" to see connection status

## Troubleshooting

### Settings Not Saving
1. **Check browser console** (F12) for errors
2. **Try refreshing** the settings page
3. **Check storage permissions** in extension settings
4. **Reload extension** if needed

### Connection Not Working
1. **Check Ollama URL** - Should be `http://localhost:11434`
2. **Click "Test Connection"** button
3. **Verify Ollama is running**: `ollama list`
4. **Check firewall** isn't blocking port 11434
5. **Try "Refresh Status"** button

### Model Not Found
1. **Check model name** is correct (case-sensitive)
2. **Verify model is pulled**: `ollama list`
3. **Pull model if missing**: `ollama pull [model-name]`
4. **Click "Test Connection"** to see available models

### Settings Not Applying
1. **Make sure you clicked "Save Settings"**
2. **Close and reopen** extension popup
3. **Check if settings page shows** success message
4. **Reload extension** if changes don't apply

## Quick Tips

- **Test Connection** before saving to verify settings
- **Refresh Status** to update connection status quickly
- **Check available models** using Test Connection
- **Save Settings** after making changes
- **Settings persist** across browser restarts

## Default Settings

- **Ollama URL**: `http://localhost:11434`
- **Model Name**: `tinyllama`
- **Voice Speed**: `1x`
- **Wake Word Detection**: `Enabled`
- **Wake Word**: `hello vision`

## Advanced

### Custom Ollama Server
If running Ollama on a different machine:
1. Set **Ollama URL** to: `http://[IP-ADDRESS]:11434`
2. Click **Test Connection**
3. Save settings

### Multiple Models
You can switch between models:
1. Change **Model Name** in settings
2. Click **Test Connection** to verify
3. Save settings
4. Extension will use the new model

## Need Help?

- Check connection status at top of settings page
- Use "Test Connection" to diagnose issues
- See error messages for specific problems
- Check browser console (F12) for detailed logs

