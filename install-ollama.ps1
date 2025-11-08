# Ollama Installation Helper for Windows
# This script helps download and set up Ollama

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ollama Installation Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is already installed
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Write-Host "✅ Ollama is already installed!" -ForegroundColor Green
    $version = ollama --version
    Write-Host "Version: $version" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run: ollama pull qwen3:4b" -ForegroundColor Cyan
    exit 0
}

Write-Host "Ollama is not installed." -ForegroundColor Yellow
Write-Host ""

# Check if we're on Windows
if ($PSVersionTable.Platform -and $PSVersionTable.Platform -ne "Win32NT") {
    Write-Host "This script is for Windows only." -ForegroundColor Red
    Write-Host "For other platforms, visit: https://ollama.ai" -ForegroundColor Yellow
    exit 1
}

Write-Host "Installation Options:" -ForegroundColor Cyan
Write-Host "1. Download installer (Recommended)" -ForegroundColor White
Write-Host "2. Manual installation instructions" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Choose option (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Downloading Ollama installer..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please download from:" -ForegroundColor Yellow
    Write-Host "https://ollama.ai/download/windows" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or direct link:" -ForegroundColor Yellow
    Write-Host "https://ollama.ai/download/OllamaSetup.exe" -ForegroundColor Cyan
    Write-Host ""
    
    # Try to open the download page
    $openBrowser = Read-Host "Open download page in browser? (Y/N)"
    if ($openBrowser -eq "Y" -or $openBrowser -eq "y") {
        Start-Process "https://ollama.ai/download/windows"
    }
    
    Write-Host ""
    Write-Host "After downloading:" -ForegroundColor Yellow
    Write-Host "1. Run OllamaSetup.exe" -ForegroundColor White
    Write-Host "2. Follow the installation wizard" -ForegroundColor White
    Write-Host "3. Close and reopen PowerShell" -ForegroundColor White
    Write-Host "4. Run: ollama pull qwen3:4b" -ForegroundColor White
    Write-Host ""
    
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Manual Installation Steps:" -ForegroundColor Cyan
    Write-Host "========================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Download Ollama executable:" -ForegroundColor Yellow
    Write-Host "   https://github.com/ollama/ollama/releases" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Create folder: C:\Program Files\Ollama" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "3. Extract ollama.exe to that folder" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "4. Add to PATH:" -ForegroundColor Yellow
    Write-Host "   - Right-click 'This PC' → Properties" -ForegroundColor White
    Write-Host "   - Advanced System Settings → Environment Variables" -ForegroundColor White
    Write-Host "   - Edit 'Path' under System variables" -ForegroundColor White
    Write-Host "   - Add: C:\Program Files\Ollama" -ForegroundColor White
    Write-Host ""
    Write-Host "5. Restart PowerShell" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "Invalid choice. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "After installation, verify with:" -ForegroundColor Cyan
Write-Host "  ollama --version" -ForegroundColor White
Write-Host ""
Write-Host "Then pull a model:" -ForegroundColor Cyan
Write-Host "  ollama pull qwen3:4b" -ForegroundColor White
Write-Host ""

