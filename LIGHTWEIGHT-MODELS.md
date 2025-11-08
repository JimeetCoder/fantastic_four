# Lightweight Ollama Models Comparison

## Lightest Models (Smallest to Largest)

### 1. TinyLlama - **SMALLEST** ⭐
- **Model**: `tinyllama`
- **Size**: ~637MB (0.6GB)
- **Speed**: Very fast
- **Capability**: Basic, good for simple tasks
- **Best for**: Testing, very limited resources
- **Pull command**: `ollama pull tinyllama`

### 2. Llama 3.2 1B
- **Model**: `llama3.2:1b`
- **Size**: ~1.3GB
- **Speed**: Fast
- **Capability**: Good for general use
- **Best for**: Balanced performance and size
- **Pull command**: `ollama pull llama3.2:1b`

### 3. Gemma 2B
- **Model**: `gemma:2b`
- **Size**: ~1.4GB
- **Speed**: Fast
- **Capability**: Good quality
- **Best for**: Good balance
- **Pull command**: `ollama pull gemma:2b`

### 4. Qwen 3 4B (Current Default)
- **Model**: `qwen3:4b`
- **Size**: ~2.3GB
- **Speed**: Moderate
- **Capability**: Better quality
- **Best for**: Better responses, more capable
- **Pull command**: `ollama pull qwen3:4b`

## Recommendation by Use Case

### If you want the ABSOLUTE SMALLEST:
```powershell
ollama pull tinyllama
```
- **Size**: 637MB
- **Trade-off**: Less capable, but fastest and smallest

### If you want SMALL but still capable:
```powershell
ollama pull llama3.2:1b
```
- **Size**: 1.3GB
- **Trade-off**: Good balance of size and capability

### If you want CURRENT DEFAULT (better quality):
```powershell
ollama pull qwen3:4b
```
- **Size**: 2.3GB
- **Trade-off**: Larger but better responses

## Quick Comparison Table

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| `tinyllama` | 637MB | ⚡⚡⚡ | ⭐⭐ | Testing, minimal resources |
| `llama3.2:1b` | 1.3GB | ⚡⚡ | ⭐⭐⭐ | General use, balanced |
| `gemma:2b` | 1.4GB | ⚡⚡ | ⭐⭐⭐ | Good balance |
| `qwen3:4b` | 2.3GB | ⚡ | ⭐⭐⭐⭐ | Better quality |

## How to Switch Models

After pulling a model, update the extension:

1. Open the Vision Assistant extension popup
2. Change "Model Name" setting to your chosen model:
   - `tinyllama` (lightest)
   - `llama3.2:1b` (recommended for small)
   - `gemma:2b` (alternative)
   - `qwen3:4b` (current default)
3. The extension will automatically use the new model

## Pull Multiple Models

You can have multiple models installed:

```powershell
ollama pull tinyllama      # 637MB - smallest
ollama pull llama3.2:1b    # 1.3GB - balanced
ollama pull qwen3:4b       # 2.3GB - better quality
```

Then switch between them in the extension settings!

## Storage Space

- **tinyllama**: ~1GB total (model + overhead)
- **llama3.2:1b**: ~2GB total
- **gemma:2b**: ~2GB total
- **qwen3:4b**: ~3GB total

Make sure you have enough disk space!

