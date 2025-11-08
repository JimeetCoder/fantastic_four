# How Speech Comprehension Works in Vision Assistant

## Overview

The Vision Assistant extension uses a **two-step process**:

```
1. Speech Recognition (Web Speech API)
   ↓
   Your voice → Text conversion
   ↓
2. AI Processing (Ollama with tinyllama)
   ↓
   Text → AI response
   ↓
3. Text-to-Speech (Web Speech API)
   ↓
   AI response → Spoken audio
```

## Step-by-Step Process

### Step 1: Speech Recognition (Speech-to-Text)
- **Technology**: Browser's built-in Web Speech API
- **What it does**: Converts your spoken words into text
- **Example**: You say "Hello Vision, what's the weather?" → Text: "what's the weather?"
- **No AI needed**: This is handled by your browser/OS

### Step 2: AI Processing (Text Understanding & Response)
- **Technology**: Ollama with `tinyllama` model
- **What it does**: 
  - Understands your text command
  - Generates an appropriate response
- **Example**: Text "what's the weather?" → AI generates response text
- **Model used**: `tinyllama` (637MB - lightest option)

### Step 3: Text-to-Speech (Response)
- **Technology**: Browser's built-in Web Speech API
- **What it does**: Converts AI response text back to speech
- **Example**: AI response text → Spoken audio you hear

## Current Configuration

✅ **Model**: `tinyllama` (637MB - lightest)
✅ **Speech Recognition**: Web Speech API (browser built-in)
✅ **Text-to-Speech**: Web Speech API (browser built-in)
✅ **AI Processing**: Ollama with tinyllama

## What tinyllama Does

- **Understands** your voice commands (after they're converted to text)
- **Generates** intelligent responses
- **Processes** natural language
- **Runs locally** on your computer (privacy-preserving)

## What tinyllama Does NOT Do

- ❌ Does NOT do speech recognition (that's Web Speech API)
- ❌ Does NOT do text-to-speech (that's Web Speech API)
- ✅ Only processes the TEXT after speech is converted

## Model Comparison

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| `tinyllama` | 637MB | ⚡⚡⚡ | ⭐⭐ | Lightest, basic responses |
| `llama3.2:1b` | 1.3GB | ⚡⚡ | ⭐⭐⭐ | Better quality |
| `qwen3:4b` | 2.3GB | ⚡ | ⭐⭐⭐⭐ | Best quality |

## Changing Models

If you want to use a different model:

1. Pull the model: `ollama pull llama3.2:1b`
2. Update extension settings:
   - Open extension popup
   - Change "Model Name" to `llama3.2:1b`
3. The extension will use the new model for AI processing

## Summary

- **Speech → Text**: Web Speech API (browser)
- **Text → AI Response**: Ollama with `tinyllama` (local AI)
- **AI Response → Speech**: Web Speech API (browser)

**tinyllama** handles the AI understanding and response generation part!

