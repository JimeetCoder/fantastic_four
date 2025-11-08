# Step-by-Step Installation Guide

## ⚠️ IMPORTANT: Ollama Must Be Installed First

You cannot pull models until Ollama is installed on your system.

## Complete Installation Steps

### Step 1: Install Ollama

1. **Download Ollama:**
   - Go to: **https://ollama.ai/download/windows**
   - Click the download button
   - Save `OllamaSetup.exe` to your Downloads folder

2. **Run the Installer:**
   - Navigate to your Downloads folder
   - Double-click `OllamaSetup.exe`
   - Click "Install" or "Next" through the installation wizard
   - Wait for installation to complete (usually takes 1-2 minutes)

3. **VERY IMPORTANT - Restart PowerShell:**
   - **Close this PowerShell window completely**
   - **Open a NEW PowerShell window**
   - This is required for PATH changes to take effect

### Step 2: Verify Ollama Installation

In your **NEW** PowerShell window, run:

```powershell
ollama --version
```

You should see something like: `ollama version is 0.x.x`

If you still get "not recognized", try:
- Restart your computer
- Or manually add Ollama to PATH (see troubleshooting below)

### Step 3: Start Ollama Service

The service usually starts automatically, but verify:

```powershell
# Check if Ollama is running
curl http://localhost:11434/api/tags
```

If this works, you'll see JSON output. If not, start the service:
1. Press `Win + R`
2. Type: `services.msc`
3. Find "Ollama" service
4. Right-click → Start
5. Set to "Automatic" (right-click → Properties → Startup type: Automatic)

### Step 4: Pull the Model

Once Ollama is installed and running:

```powershell
ollama pull qwen3:4b
```

This will:
- Download ~2.3GB (takes 5-15 minutes depending on internet speed)
- Show progress as it downloads
- Be ready when complete

### Step 5: Verify Model

```powershell
# List installed models
ollama list

# Test the model
ollama run qwen3:4b "Hello, this is a test"
```

### Step 6: Use the Extension

1. Load the Vision Assistant extension in Chrome/Edge
2. Configure settings:
   - Ollama URL: `http://localhost:11434`
   - Model Name: `qwen3:4b`
3. Say "Hello Vision" to activate!

## Quick Command Reference

```powershell
# Check if Ollama is installed
ollama --version

# Check if Ollama is running
curl http://localhost:11434/api/tags

# Pull the model
ollama pull qwen3:4b

# List models
ollama list

# Test model
ollama run qwen3:4b "Your question here"
```

## Troubleshooting

### "ollama is not recognized" after installation

**Solution 1: Restart PowerShell**
- Close ALL PowerShell windows
- Open a NEW one
- Try again

**Solution 2: Restart Computer**
- Sometimes a full restart is needed

**Solution 3: Manual PATH Check**
```powershell
# Check if Ollama is in PATH
$env:PATH -split ';' | Select-String ollama

# Check common installation locations
Test-Path "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe"
```

### Ollama service not running

1. Open Services: `Win + R` → `services.msc`
2. Find "Ollama"
3. Right-click → Start
4. Right-click → Properties → Set to "Automatic"

### Can't download model

- Check internet connection
- Try again: `ollama pull qwen3:4b`
- Check available disk space (need at least 3GB free)

### Port 11434 already in use

- Another app might be using the port
- Check: `netstat -ano | findstr :11434`
- Stop conflicting service or change Ollama port

## Need More Help?

If you're still stuck:
1. Make sure you closed and reopened PowerShell after installation
2. Try restarting your computer
3. Check Windows Firewall isn't blocking Ollama
4. Verify the Ollama service is running in Services

