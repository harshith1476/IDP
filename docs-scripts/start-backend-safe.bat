@echo off
echo ========================================
echo Safe Backend Startup - Load All 74 Faculty
echo ========================================
echo.

REM Step 1: Kill any process on port 8080
echo Step 1: Freeing port 8080...
call kill-port-8080.bat
if %errorlevel% neq 0 (
    echo ERROR: Could not free port 8080
    pause
    exit /b 1
)

REM Step 2: Navigate to backend
cd backend
if %errorlevel% neq 0 (
    echo ERROR: Backend directory not found!
    pause
    exit /b 1
)

REM Step 3: Verify port is free one more time
echo.
echo Step 2: Double-checking port 8080...
timeout /t 1 /nobreak >nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo WARNING: Port 8080 still in use by process %%a
    echo Force killing...
    taskkill /PID %%a /F /T >nul 2>&1
    timeout /t 2 /nobreak >nul
)

REM Step 4: Start backend
echo.
echo Step 3: Starting backend...
echo.
echo ========================================
echo Backend will now:
echo   - Auto-fix database indexes
echo   - Load all 74 faculty members
echo   - Default password: faculty123
echo ========================================
echo.
echo Watch for: "Total faculty created: 74 (Expected: 74)"
echo Press Ctrl+C to stop
echo.
echo ========================================
echo.

call mvn spring-boot:run

pause
