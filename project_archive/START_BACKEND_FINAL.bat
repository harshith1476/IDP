@echo off
echo ========================================
echo Starting Backend - Load All 74 Faculty
echo ========================================
echo.

echo Step 1: Killing any process on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo Found process %%a using port 8080. Killing it...
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo Port 8080 is now free.
echo.

cd backend
if %errorlevel% neq 0 (
    echo ERROR: Backend directory not found!
    pause
    exit /b 1
)

echo Step 2: Rebuilding backend...
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo Build successful!
echo.

echo ========================================
echo IMPORTANT: Database Must Be Cleared!
echo ========================================
echo.
echo The database has an old index causing errors.
echo Please clear the database FIRST using one of these methods:
echo.
echo METHOD 1 (Easiest - MongoDB Compass):
echo   1. Open MongoDB Compass
echo   2. Connect to: mongodb://localhost:27017
echo   3. Select 'drims' database
echo   4. Click "Drop Database"
echo.
echo METHOD 2 (MongoDB Shell):
echo   mongosh
echo   use drims
echo   db.dropDatabase()
echo   exit
echo.
echo The backend will attempt to auto-fix if you continue,
echo but clearing the database first is recommended.
echo.
echo Press any key to continue (after clearing database)...
pause
echo.

echo Step 3: Starting backend - This will load all 74 faculty...
echo.
echo ========================================
echo Watch for: "Total faculty created: 74"
echo Press Ctrl+C to stop
echo ========================================
echo.
call mvn spring-boot:run

pause
