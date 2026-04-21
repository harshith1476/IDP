# Maven Setup Helper Script for Windows

Write-Host "Checking for Maven..." -ForegroundColor Yellow

# Check if Maven is already installed
$mvnCheck = Get-Command mvn -ErrorAction SilentlyContinue
if ($mvnCheck) {
    Write-Host "Maven is already installed!" -ForegroundColor Green
    mvn -version
    exit 0
}

Write-Host "Maven not found. Installing Maven Wrapper..." -ForegroundColor Yellow

# Create .mvn/wrapper directory
$wrapperDir = ".mvn\wrapper"
if (-not (Test-Path $wrapperDir)) {
    New-Item -ItemType Directory -Path $wrapperDir -Force | Out-Null
}

Write-Host "`nPlease choose an option:" -ForegroundColor Cyan
Write-Host "1. Install Maven globally (Recommended for development)"
Write-Host "2. Download Maven Wrapper files (Alternative)"
Write-Host "3. Use online Maven Wrapper generator"
Write-Host "`nFor now, here are manual installation steps:" -ForegroundColor Yellow

Write-Host "`n=== OPTION 1: Install Maven ===" -ForegroundColor Green
Write-Host "1. Download Maven from: https://maven.apache.org/download.cgi"
Write-Host "2. Extract to: C:\Program Files\Apache\maven"
Write-Host "3. Add to PATH: C:\Program Files\Apache\maven\bin"
Write-Host "4. Restart terminal and run: mvn -version"

Write-Host "`n=== OPTION 2: Quick Install with Chocolatey ===" -ForegroundColor Green
Write-Host "If you have Chocolatey installed, run:"
Write-Host "  choco install maven"

Write-Host "`n=== OPTION 3: Use Maven Wrapper ===" -ForegroundColor Green
Write-Host "I'll create a simple batch file to help you run Maven commands."
Write-Host "Or visit: https://maven.apache.org/wrapper/ to generate wrapper files"

# Create a helper batch file
$batchContent = @"
@echo off
echo Maven Wrapper Helper
echo.
echo This script helps you run Maven commands.
echo.
echo Option 1: Install Maven from https://maven.apache.org/download.cgi
echo Option 2: Use online Maven Wrapper generator
echo.
pause
"@

Set-Content -Path "run-maven.bat" -Value $batchContent
Write-Host "`nCreated helper file: run-maven.bat" -ForegroundColor Green

