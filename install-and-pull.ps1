# Complete Installation and Model Pull Script
# This script helps install Ollama and pull the qwen3:4b model

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vision Assistant - Complete Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Ollama is installed
Write-Host "Step 1: Checking Ollama installation..." -ForegroundColor Yellow
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Write-Host "✅ Ollama is installed!" -ForegroundColor Green
    $version = ollama --version
    Write-Host "   Version: $version" -ForegroundColor Green
    Write-Host ""
    
    # Step 2: Check if Ollama service is running
    Write-Host "Step 2: Checking Ollama service..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 3 -ErrorAction Stop
        Write-Host "✅ Ollama service is running!" -ForegroundColor Green
        Write-Host ""
        
        # Step 3: Pull the model
        Write-Host "Step 3: Pulling qwen3:4b model..." -ForegroundColor Yellow
        Write-Host "This will download ~2.3GB. Please wait..." -ForegroundColor Cyan
        Write-Host ""
        
        ollama pull qwen3:4b
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Model qwen3:4b successfully pulled!" -ForegroundColor Green
            Write-Host ""
            
            # Step 4: Verify the model
            Write-Host "Step 4: Verifying model..." -ForegroundColor Yellow
            ollama list
            Write-Host ""
            
            Write-Host "✅ Setup complete!" -ForegroundColor Green
            Write-Host ""
            Write-Host "You can now use the Vision Assistant extension!" -ForegroundColor Cyan
            Write-Host "Configure it with:" -ForegroundColor Cyan
            Write-Host "  - Ollama URL: http://localhost:11434" -ForegroundColor White
            Write-Host "  - Model Name: qwen3:4b" -ForegroundColor White
        } else {
            Write-Host ""
            Write-Host "❌ Failed to pull model. Please check your internet connection." -ForegroundColor Red
        }
    } catch {
        Write-Host "⚠️  Ollama service is not running" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please start Ollama:" -ForegroundColor Yellow
        Write-Host "1. Open Services (Win+R, type: services.msc)" -ForegroundColor White
        Write-Host "2. Find 'Ollama' service" -ForegroundColor White
        Write-Host "3. Right-click → Start" -ForegroundColor White
        Write-Host "4. Run this script again" -ForegroundColor White
    }
} else {
    Write-Host "❌ Ollama is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Ollama first:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Download and Install (Recommended)" -ForegroundColor Cyan
    Write-Host "1. Download from: https://ollama.ai/download/windows" -ForegroundColor White
    Write-Host "2. Run OllamaSetup.exe" -ForegroundColor White
    Write-Host "3. Follow the installation wizard" -ForegroundColor White
    Write-Host "4. Close and reopen PowerShell" -ForegroundColor White
    Write-Host "5. Run this script again" -ForegroundColor White
    Write-Host ""
    
    $openBrowser = Read-Host "Would you like to open the download page now? (Y/N)"
    if ($openBrowser -eq "Y" -or $openBrowser -eq "y") {
        Start-Process "https://ollama.ai/download/windows"
        Write-Host ""
        Write-Host "After installation, close and reopen PowerShell, then run this script again." -ForegroundColor Cyan
    }
}

Write-Host ""

