# Fix Port 8080 and Start Backend to Load All 74 Faculty
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing Port 8080 and Starting Backend" -ForegroundColor Cyan
Write-Host "This will load all 74 faculty members" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill any process using port 8080
Write-Host "Step 1: Checking port 8080..." -ForegroundColor Yellow
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($port8080) {
    $pid = $port8080.OwningProcess
    Write-Host "Found process $pid using port 8080. Killing it..." -ForegroundColor Yellow
    taskkill /PID $pid /F 2>$null
    Start-Sleep -Seconds 2
    Write-Host "Process killed. Port 8080 is now free." -ForegroundColor Green
} else {
    Write-Host "Port 8080 is free." -ForegroundColor Green
}
Write-Host ""

# Step 2: Navigate to backend
Set-Location "C:\Users\vemul\Desktop\DRIMS-master\backend"
if (-not (Test-Path "pom.xml")) {
    Write-Host "ERROR: Backend directory not found!" -ForegroundColor Red
    pause
    exit 1
}

# Step 3: Rebuild
Write-Host "Step 2: Rebuilding backend..." -ForegroundColor Yellow
mvn clean install -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Step 4: Important note about database
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "IMPORTANT: Database Clear Required!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "The database has an old index that needs to be cleared." -ForegroundColor Yellow
Write-Host "Please clear the database using MongoDB Compass:" -ForegroundColor Yellow
Write-Host "  1. Open MongoDB Compass" -ForegroundColor White
Write-Host "  2. Connect to: mongodb://localhost:27017" -ForegroundColor White
Write-Host "  3. Select 'drims' database" -ForegroundColor White
Write-Host "  4. Click 'Drop Database'" -ForegroundColor White
Write-Host ""
Write-Host "OR the backend will attempt to auto-fix (may take a moment)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to start backend (after clearing database or to try auto-fix)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Write-Host ""

# Step 5: Start backend
Write-Host "Step 3: Starting backend - Loading all 74 faculty..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Watch console for: 'Total faculty created: 74'" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the backend" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
mvn spring-boot:run
