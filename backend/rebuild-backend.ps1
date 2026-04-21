# Rebuild and Restart Backend Script
# This script cleans, rebuilds, and restarts the backend with the latest changes

Write-Host "=== DRIMS Backend Rebuild ===" -ForegroundColor Cyan

# Set JAVA_HOME if not set
if (-not $env:JAVA_HOME) {
    $javaPath = "C:\Program Files\Java\jdk-22"
    if (Test-Path $javaPath) {
        $env:JAVA_HOME = $javaPath
        Write-Host "JAVA_HOME set to: $javaPath" -ForegroundColor Green
    } else {
        Write-Host "JAVA_HOME not set. Please set it manually." -ForegroundColor Red
        Write-Host "Run: `$env:JAVA_HOME = 'C:\Program Files\Java\jdk-22'" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "JAVA_HOME is already set: $env:JAVA_HOME" -ForegroundColor Green
}

# Check if Maven Wrapper exists
if (-not (Test-Path "mvnw.cmd")) {
    Write-Host "Maven Wrapper not found. Setting up..." -ForegroundColor Yellow
    powershell -ExecutionPolicy Bypass -File download-wrapper.ps1
}

Write-Host "`n=== Step 1: Cleaning previous build ===" -ForegroundColor Cyan
.\mvnw.cmd clean

Write-Host "`n=== Step 2: Compiling and building ===" -ForegroundColor Cyan
.\mvnw.cmd install -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Build failed! Please check the errors above." -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Build successful!" -ForegroundColor Green

# Check MongoDB connection (optional)
Write-Host "`n⚠️  Note: Make sure MongoDB is running!" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the backend`n" -ForegroundColor Gray

# Start the backend
Write-Host "=== Step 3: Starting backend ===" -ForegroundColor Cyan
.\mvnw.cmd spring-boot:run
