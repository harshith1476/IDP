@echo off
REM Enable delayed expansion for errorlevel checks
setlocal enabledelayedexpansion

echo ========================================
echo START BACKEND - Load All 74 Faculty
echo ========================================
echo.

REM Step 1: Kill port 8080 processes
echo [Step 1/3] Freeing port 8080...
powershell -Command "Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host 'Killing process' $_.OwningProcess; taskkill /PID $_.OwningProcess /F 2>$null }"
timeout /t 2 /nobreak >nul

REM Verify port is free
powershell -Command "$port = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue; if ($port) { Write-Host 'WARNING: Port still in use! Force killing...'; taskkill /PID $port.OwningProcess /F /T 2>$null; Start-Sleep -Seconds 2 } else { Write-Host 'SUCCESS: Port 8080 is free!' }"
if %errorlevel% neq 0 (
    echo ERROR: Could not free port 8080
    pause
    exit /b 1
)

REM Step 2: Navigate to backend
echo.
echo [Step 2/3] Navigating to backend directory...
cd /d "%~dp0backend"
if not exist "pom.xml" (
    echo ERROR: Backend directory not found! Make sure you run this from DRIMS-master folder.
    pause
    exit /b 1
)
echo SUCCESS: In backend directory
echo.

REM Step 3: Start backend
echo [Step 3/3] Starting backend...
echo.
echo ========================================
echo Backend will automatically:
echo   - Drop old indexes (universityId_1, etc.)
echo   - Auto-fix database issues
echo   - Load all 74 faculty members
echo   - Default password: faculty123
echo ========================================
echo.
echo Watch console for: "Total faculty created: 74 (Expected: 74)"
echo Press Ctrl+C to stop the backend
echo.
echo ========================================
echo.
mvn spring-boot:run

pause
