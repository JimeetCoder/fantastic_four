# Ollama Setup Script for Vision Assistant Extension (PowerShell)
# This script helps set up Ollama and pull the recommended model

Write-Host "Vision Assistant - Ollama Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is installed
try {
    $ollamaVersion = ollama --version 2>&1
    Write-Host "✅ Ollama is installed" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Ollama is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Ollama first:" -ForegroundColor Yellow
    Write-Host "  Download from: https://ollama.ai/download/windows" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Check if Ollama is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Ollama service is running" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "⚠️  Ollama service is not running" -ForegroundColor Yellow
    Write-Host "Please start Ollama manually or run: ollama serve" -ForegroundColor Yellow
    Write-Host ""
}

# Recommended model
$MODEL = "qwen3:4b"
Write-Host "Pulling recommended model: $MODEL (2.3GB)" -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

try {
    ollama pull $MODEL
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Model $MODEL successfully pulled!" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now use the Vision Assistant extension." -ForegroundColor Cyan
        Write-Host "Configure the extension with:" -ForegroundColor Cyan
        Write-Host "  - Ollama URL: http://localhost:11434" -ForegroundColor White
        Write-Host "  - Model Name: $MODEL" -ForegroundColor White
        Write-Host ""
        
        Write-Host "Testing the model..." -ForegroundColor Cyan
        ollama run $MODEL "Hello, this is a test."
        
        Write-Host ""
        Write-Host "✅ Setup complete!" -ForegroundColor Green
    } else {
        throw "Pull failed"
    }
} catch {
    Write-Host ""
    Write-Host "❌ Failed to pull model" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative models you can try:" -ForegroundColor Yellow
    Write-Host "  - ollama pull gemma:2b (1.4GB)" -ForegroundColor White
    Write-Host "  - ollama pull tinyllama (637MB)" -ForegroundColor White
    exit 1
}

