# Pull the Model - Quick Guide

## ✅ Good News!
Ollama service is running! You just need to pull the model.

## ⚠️ Important: Restart PowerShell First

The `ollama` command isn't recognized because PowerShell needs to be restarted to pick up the PATH changes.

## Steps to Pull the Model

### Step 1: Close and Reopen PowerShell
- **Close this PowerShell window completely**
- **Open a NEW PowerShell window**
- This is required for the `ollama` command to work

### Step 2: Pull the Model

In your **NEW** PowerShell window, run:

```powershell
ollama pull qwen3:4b
```

This will:
- Download the `qwen3:4b` model (~2.3GB)
- Take 5-15 minutes depending on your internet speed
- Show progress as it downloads

### Step 3: Verify the Model

After the download completes:

```powershell
# List installed models
ollama list

# Test the model
ollama run qwen3:4b "Hello, this is a test"
```

## Model Information

- **Model Name**: `qwen3:4b`
- **Size**: ~2.3GB
- **Recommended**: Yes, this is what the extension is configured to use
- **Performance**: Good balance of size and capability

## Alternative Models (if needed)

If you want a smaller model:

```powershell
ollama pull llama3.2:1b  # 1.3GB - smaller but less capable
```

If you want a different model:

```powershell
ollama pull phi3:mini   # 2.3GB - alternative
ollama pull gemma:2b    # 1.4GB - smaller option
```

**Note**: If you use a different model, update the extension settings to match!

## After Pulling the Model

1. **Load the extension** in Chrome/Edge (if not already done)
2. **Configure settings**:
   - Ollama URL: `http://localhost:11434`
   - Model Name: `qwen3:4b`
3. **Say "Hello Vision"** to activate!

## Troubleshooting

### "ollama is not recognized" after restarting PowerShell

**Solution 1**: Restart your computer
- Sometimes a full restart is needed

**Solution 2**: Check PATH manually
```powershell
$env:PATH -split ';' | Select-String ollama
```

**Solution 3**: Use full path
```powershell
# Try common locations
& "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe" pull qwen3:4b
```

### Download is slow or fails

- Check your internet connection
- Try again: `ollama pull qwen3:4b`
- Ensure you have at least 3GB free disk space

### Model not found after pulling

- Verify: `ollama list` should show `qwen3:4b`
- If not listed, try pulling again
- Check disk space

