#!/bin/bash

# Ollama Setup Script for Vision Assistant Extension
# This script helps set up Ollama and pull the recommended model

echo "Vision Assistant - Ollama Setup"
echo "================================"
echo ""

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed!"
    echo ""
    echo "Please install Ollama first:"
    echo "  Windows: https://ollama.ai/download/windows"
    echo "  macOS:   brew install ollama"
    echo "  Linux:   curl -fsSL https://ollama.ai/install.sh | sh"
    echo ""
    exit 1
fi

echo "✅ Ollama is installed"
echo ""

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "⚠️  Ollama service is not running"
    echo "Starting Ollama..."
    ollama serve &
    sleep 3
fi

echo "✅ Ollama service is running"
echo ""

# Recommended model
MODEL="qwen3:4b"
echo "Pulling recommended model: $MODEL (2.3GB)"
echo "This may take a few minutes..."
echo ""

ollama pull $MODEL

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Model $MODEL successfully pulled!"
    echo ""
    echo "You can now use the Vision Assistant extension."
    echo "Configure the extension with:"
    echo "  - Ollama URL: http://localhost:11434"
    echo "  - Model Name: $MODEL"
else
    echo ""
    echo "❌ Failed to pull model"
    echo ""
    echo "Alternative models you can try:"
    echo "  - ollama pull gemma:2b (1.4GB)"
    echo "  - ollama pull tinyllama (637MB)"
    exit 1
fi

echo ""
echo "Testing the model..."
ollama run $MODEL "Hello, this is a test."

echo ""
echo "✅ Setup complete!"

