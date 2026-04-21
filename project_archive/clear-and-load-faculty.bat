@echo off
echo ========================================
echo Clearing Database and Loading All 74 Faculty
echo ========================================
echo.

echo Step 1: Clearing MongoDB database...
echo.
echo Please run these commands in a NEW terminal to clear the database:
echo   mongosh
echo   use drims
echo   db.dropDatabase()
echo   exit
echo.
echo OR use MongoDB Compass GUI to drop the 'drims' database
echo.
echo Press any key after clearing the database (or if already cleared)...
pause
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

echo Step 3: Starting backend (this will load all 74 faculty)...
echo.
echo ========================================
echo Backend is starting...
echo Watch for: "Total faculty created: 74"
echo Press Ctrl+C to stop
echo ========================================
echo.
call mvn spring-boot:run

pause
