# Launch Extension Loading Guide

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vision Assistant Extension - Launch" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if icons folder exists
$iconsPath = "icons"
if (-not (Test-Path $iconsPath)) {
    New-Item -ItemType Directory -Name "icons" | Out-Null
    Write-Host "✅ Created icons folder" -ForegroundColor Green
} else {
    Write-Host "✅ Icons folder exists" -ForegroundColor Green
}

# Check for icon files
$iconFiles = @("icon16.png", "icon48.png", "icon128.png")
$missingIcons = @()

foreach ($icon in $iconFiles) {
    $iconPath = Join-Path $iconsPath $icon
    if (-not (Test-Path $iconPath)) {
        $missingIcons += $icon
    }
}

if ($missingIcons.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Missing icon files:" -ForegroundColor Yellow
    foreach ($icon in $missingIcons) {
        Write-Host "   - $icon" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Quick fix: Create simple placeholder images or use create-icons.html" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✅ All icon files present" -ForegroundColor Green
}

Write-Host ""
Write-Host "Opening browser extensions page..." -ForegroundColor Cyan
Write-Host ""

# Try to open Chrome extensions page
try {
    Start-Process "chrome://extensions/"
    Write-Host "✅ Opened Chrome extensions page" -ForegroundColor Green
} catch {
    try {
        Start-Process "msedge://extensions/"
        Write-Host "✅ Opened Edge extensions page" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not auto-open browser" -ForegroundColor Yellow
        Write-Host "Please manually open:" -ForegroundColor Yellow
        Write-Host "   Chrome: chrome://extensions/" -ForegroundColor White
        Write-Host "   Edge: edge://extensions/" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Enable 'Developer mode' (toggle in top right)" -ForegroundColor White
Write-Host "2. Click 'Load unpacked'" -ForegroundColor White
Write-Host "3. Select this folder:" -ForegroundColor White
Write-Host "   $(Get-Location)" -ForegroundColor Cyan
Write-Host "4. Click the extension icon in toolbar" -ForegroundColor White
Write-Host "5. Allow microphone permission" -ForegroundColor White
Write-Host "6. Say 'Hello Vision' to activate!" -ForegroundColor Green
Write-Host ""

