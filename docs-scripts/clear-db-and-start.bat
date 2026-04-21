@echo off
echo ========================================
echo Clear Database and Load All 74 Faculty
echo ========================================
echo.

cd backend
if %errorlevel% neq 0 (
    echo ERROR: Backend directory not found!
    pause
    exit /b 1
)

echo Step 1: Building JAR file...
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo Build successful!
echo.

echo Step 2: Clearing database using JAR file...
echo This will drop all collections and indexes...
call java -jar target\drims-backend-1.0.0.jar --clear-db
if %errorlevel% neq 0 (
    echo WARNING: Could not clear database using JAR. You may need to clear manually.
    echo.
    echo Please clear database manually:
    echo   1. Open MongoDB Compass
    echo   2. Connect to mongodb://localhost:27017
    echo   3. Select 'drims' database
    echo   4. Click "Drop Database"
    echo.
    echo OR use MongoDB shell:
    echo   mongosh
    echo   use drims
    echo   db.dropDatabase()
    echo   exit
    echo.
    pause
)
echo.

echo Step 3: Starting backend to load all 74 faculty...
echo.
echo ========================================
echo Backend starting - Loading all 74 faculty
echo Watch for: "Total faculty created: 74"
echo Press Ctrl+C to stop
echo ========================================
echo.
call mvn spring-boot:run

pause
