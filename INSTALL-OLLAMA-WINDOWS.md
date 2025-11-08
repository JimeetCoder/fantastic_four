# Installing Ollama on Windows

## Method 1: Official Installer (Recommended)

1. **Download Ollama for Windows:**
   - Go to: https://ollama.ai/download/windows
   - Or direct download: https://ollama.ai/download/OllamaSetup.exe

2. **Run the Installer:**
   - Double-click `OllamaSetup.exe`
   - Follow the installation wizard
   - Ollama will be installed and added to your PATH automatically

3. **Verify Installation:**
   - Close and reopen PowerShell/Command Prompt
   - Run: `ollama --version`
   - You should see the version number

4. **Start Ollama Service:**
   - Ollama usually starts automatically after installation
   - If not, you can start it manually:
     - Press `Win + R`
     - Type: `services.msc`
     - Find "Ollama" service
     - Right-click → Start

## Method 2: Manual Installation (If installer doesn't work)

1. **Download the executable:**
   - Visit: https://github.com/ollama/ollama/releases
   - Download the latest Windows release (ollama-windows-amd64.exe)

2. **Add to PATH:**
   - Create a folder: `C:\Program Files\Ollama`
   - Move the executable there and rename it to `ollama.exe`
   - Add `C:\Program Files\Ollama` to your system PATH:
     - Right-click "This PC" → Properties
     - Advanced System Settings → Environment Variables
     - Under "System variables", find "Path" → Edit
     - Add: `C:\Program Files\Ollama`
     - Click OK on all dialogs

3. **Restart PowerShell/Command Prompt**

## Verify Installation

After installation, open a **NEW** PowerShell window and run:

```powershell
ollama --version
```

You should see something like: `ollama version is 0.x.x`

## Start Ollama Service

If Ollama isn't running automatically:

```powershell
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If that fails, start Ollama manually
# The service should start automatically, but if not:
# Go to Services (services.msc) and start "Ollama" service
```

## Pull Your First Model

Once Ollama is installed and running:

```powershell
ollama pull qwen3:4b
```

This will download the 2.3GB model (takes a few minutes depending on your internet speed).

## Troubleshooting

### "ollama is not recognized"
- Make sure you closed and reopened PowerShell after installation
- Check if Ollama is in your PATH: `$env:PATH -split ';' | Select-String ollama`
- Try the full path: `C:\Users\<YourUsername>\AppData\Local\Programs\Ollama\ollama.exe --version`

### Ollama service not running
- Open Services: Press `Win + R`, type `services.msc`, press Enter
- Find "Ollama" service
- Right-click → Start
- Set it to "Automatic" startup type

### Port 11434 already in use
- Another application might be using the port
- Check: `netstat -ano | findstr :11434`
- Stop the conflicting service or change Ollama port

### Firewall blocking
- Windows Firewall might block Ollama
- Add exception for Ollama in Windows Defender Firewall settings

## Quick Test

After installation, test with:

```powershell
# Check version
ollama --version

# List models (should be empty initially)
ollama list

# Pull a model
ollama pull llama3.2:1b

# Test the model
ollama run qwen3:4b "Hello, how are you?"
```

## Next Steps

Once Ollama is installed and you've pulled a model:

1. Load the Vision Assistant extension in Chrome/Edge
2. Configure it with:
   - Ollama URL: `http://localhost:11434`
   - Model Name: `qwen3:4b`
3. Start using voice commands!

