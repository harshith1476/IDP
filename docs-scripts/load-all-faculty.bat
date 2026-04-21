@echo off
echo ========================================
echo Loading All 74 Faculty Members
echo ========================================
echo.

echo Step 1: Checking MongoDB...
sc query MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MongoDB is not running!
    echo Please start MongoDB first: net start MongoDB
    pause
    exit /b 1
)
echo MongoDB is running.
echo.

echo Step 2: Clearing MongoDB database...
echo Please run these commands in MongoDB:
echo   mongo
echo   use drims
echo   db.dropDatabase()
echo   exit
echo.
echo Press any key after clearing the database...
pause
echo.

echo Step 3: Navigating to backend directory...
cd backend
if %errorlevel% neq 0 (
    echo ERROR: Backend directory not found!
    pause
    exit /b 1
)
echo.

echo Step 4: Rebuilding backend...
call mvnw.cmd clean install
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo Build successful!
echo.

echo Step 5: Starting backend (this will load all 74 faculty)...
echo.
echo ========================================
echo Backend is starting...
echo Watch for: "Total faculty created: 74"
echo Press Ctrl+C to stop
echo ========================================
echo.
call mvnw.cmd spring-boot:run

pause
