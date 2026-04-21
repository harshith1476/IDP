@echo off
echo ========================================
echo Clear Database and Load All 74 Faculty
echo ========================================
echo.

echo IMPORTANT: This script requires the database to be cleared first.
echo.
echo Step 1: Clearing MongoDB Database...
echo.
echo Please clear the database using ONE of these methods:
echo.
echo METHOD A (Easiest - MongoDB Compass GUI):
echo   1. Open MongoDB Compass
echo   2. Connect to: mongodb://localhost:27017
echo   3. Click on 'drims' database
echo   4. Click "Drop Database" button
echo   5. Press any key here after dropping...
echo.
echo METHOD B (MongoDB Shell):
echo   mongosh
echo   use drims
echo   db.dropDatabase()
echo   exit
echo.
echo Press any key after clearing the database...
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

echo Step 3: Starting backend - This will load all 74 faculty...
echo.
echo ========================================
echo Watch console for: "Total faculty created: 74"
echo Press Ctrl+C to stop the backend
echo ========================================
echo.
call mvn spring-boot:run

pause
