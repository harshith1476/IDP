@echo off
echo ========================================
echo Quick Start - Load All 74 Faculty
echo ========================================
echo.

echo Step 1: Killing any process on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo Found process %%a using port 8080. Killing it...
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo Port 8080 is free.
echo.

cd backend
if %errorlevel% neq 0 (
    echo ERROR: Backend directory not found!
    pause
    exit /b 1
)

echo Step 2: Starting backend (will auto-fix database and load all 74 faculty)...
echo.
echo ========================================
echo The backend will automatically:
echo   - Drop old indexes (universityId_1, etc.)
echo   - Clear collections if needed
echo   - Load all 74 faculty members
echo   - Default password for all: faculty123
echo ========================================
echo.
echo Watch for: "Total faculty created: 74 (Expected: 74)"
echo Press Ctrl+C to stop the backend
echo.
call mvn spring-boot:run

pause
