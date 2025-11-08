# Quick Ollama Installation for Windows

## Step 1: Download Ollama

**Option A: Direct Download (Easiest)**
1. Open your browser
2. Go to: **https://ollama.ai/download/windows**
3. Click the download button
4. The file `OllamaSetup.exe` will download

**Option B: Direct Link**
- Download directly: https://ollama.ai/download/OllamaSetup.exe

## Step 2: Install Ollama

1. **Run the installer:**
   - Go to your Downloads folder
   - Double-click `OllamaSetup.exe`
   - Click "Install" or "Next" through the wizard
   - Wait for installation to complete

2. **Ollama will automatically:**
   - Install to your system
   - Add itself to your PATH
   - Start the Ollama service

## Step 3: Verify Installation

1. **Close your current PowerShell window**
2. **Open a NEW PowerShell window** (important - new window picks up PATH changes)
3. **Test Ollama:**
   ```powershell
   ollama --version
   ```
   
   You should see something like: `ollama version is 0.x.x`

## Step 4: Pull the Model

Once Ollama is working, pull the model:

```powershell
ollama pull qwen3:4b
```

This will:
- Download the 2.3GB model (takes a few minutes)
- Show progress as it downloads
- Be ready to use when complete

## Step 5: Test the Model

```powershell
ollama run qwen3:4b "Hello, this is a test"
```

You should get a response from the AI model.

## Troubleshooting

### "ollama is not recognized" after installation

**Solution 1: Restart PowerShell**
- Close ALL PowerShell windows
- Open a NEW PowerShell window
- Try `ollama --version` again

**Solution 2: Check PATH manually**
```powershell
$env:PATH -split ';' | Select-String ollama
```

If nothing appears, Ollama might not be in PATH. Try:
```powershell
# Check common installation locations
Test-Path "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe"
Test-Path "C:\Program Files\Ollama\ollama.exe"
```

**Solution 3: Restart your computer**
- Sometimes a full restart is needed for PATH changes to take effect

### Ollama service not running

Check if Ollama service is running:
```powershell
Get-Service | Where-Object {$_.Name -like "*ollama*"}
```

If it's stopped, start it:
```powershell
Start-Service Ollama
```

Or manually:
1. Press `Win + R`
2. Type: `services.msc`
3. Find "Ollama" service
4. Right-click → Start
5. Right-click → Properties → Set to "Automatic"

### Can't download model

**Check internet connection:**
```powershell
Test-NetConnection ollama.ai -Port 443
```

**Try a different model (smaller):**
```powershell
ollama pull tinyllama  # 637MB - smallest option
```

## Quick Commands Reference

```powershell
# Check if Ollama is installed
ollama --version

# List installed models
ollama list

# Pull a model
ollama pull qwen3:4b

# Run a model
ollama run qwen3:4b "Your question here"

# Check if Ollama API is running
curl http://localhost:11434/api/tags
```

## After Installation

Once Ollama is installed and you've pulled `qwen3:4b`:

1. **Load the Vision Assistant extension** in Chrome/Edge
2. **Configure settings:**
   - Ollama URL: `http://localhost:11434`
   - Model Name: `qwen3:4b`
3. **Say "Hello Vision"** to activate!

## Need Help?

If you're still having issues:
1. Make sure you closed and reopened PowerShell after installation
2. Try restarting your computer
3. Check Windows Firewall isn't blocking Ollama
4. Verify the Ollama service is running in Services (services.msc)

