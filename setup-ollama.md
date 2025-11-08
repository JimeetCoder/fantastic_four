# Ollama Setup Instructions

## Step 1: Install Ollama

### Windows
1. Download from: https://ollama.ai/download/windows
2. Run the installer
3. Ollama will start automatically

### macOS
```bash
brew install ollama
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

## Step 2: Verify Installation

```bash
ollama --version
```

## Step 3: Pull a Lightweight Model (Under 2GB)

### Recommended: qwen3:4b (2.3GB)
```bash
ollama pull qwen3:4b
```

### Alternative Models:
```bash
# Phi-3 Mini (2.3GB - slightly over but very fast)
ollama pull phi3:mini

# Gemma 2B (1.4GB)
ollama pull gemma:2b

# TinyLlama (637MB - smallest but less capable)
ollama pull tinyllama
```

## Step 4: Test Ollama

```bash
# List installed models
ollama list

# Test the model
ollama run qwen3:4b "Hello, how are you?"
```

## Step 5: Verify API is Running

```bash
# Check if Ollama API is accessible
curl http://localhost:11434/api/tags
```

You should see a JSON response with your installed models.

## Step 6: Configure Extension

1. Open the Vision Assistant extension
2. Set Ollama URL: `http://localhost:11434` (default)
3. Set Model Name: `qwen3:4b` (or your chosen model)
4. The extension will automatically check the connection

## Troubleshooting

### Ollama not starting
- Windows: Check if Ollama service is running in Services
- macOS/Linux: Run `ollama serve` manually

### Port 11434 already in use
- Change Ollama port: `OLLAMA_HOST=0.0.0.0:11435 ollama serve`
- Update extension settings to use the new port

### Model download fails
- Check internet connection
- Try pulling a different model
- Check available disk space (models need space)

### API not responding
- Ensure Ollama is running: `ollama list`
- Check firewall settings
- Verify port 11434 is not blocked

