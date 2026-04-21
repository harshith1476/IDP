@echo off
echo ========================================
echo Killing ALL processes using port 8080
echo ========================================
echo.

echo Finding processes on port 8080...
netstat -ano | findstr :8080 | findstr LISTENING > temp_port.txt
if exist temp_port.txt (
    for /f "tokens=5" %%a in (temp_port.txt) do (
        echo Found process %%a using port 8080
        echo Killing process %%a and all its child processes...
        taskkill /PID %%a /F /T >nul 2>&1
        if !errorlevel! equ 0 (
            echo SUCCESS: Process %%a killed
        ) else (
            echo WARNING: Could not kill process %%a (may already be stopped)
        )
    )
    del temp_port.txt
) else (
    echo No processes found on port 8080
)

timeout /t 3 /nobreak >nul

echo.
echo Verifying port 8080 is free...
netstat -ano | findstr :8080 | findstr LISTENING > temp_port2.txt
if exist temp_port2.txt (
    for /f "tokens=5" %%a in (temp_port2.txt) do (
        echo ERROR: Port 8080 still in use by process %%a
        echo Attempting force kill...
        taskkill /PID %%a /F /T >nul 2>&1
    )
    del temp_port2.txt
    timeout /t 2 /nobreak >nul
)

REM Final check
netstat -ano | findstr :8080 | findstr LISTENING > temp_port3.txt
if exist temp_port3.txt (
    for /f "tokens=5" %%a in (temp_port3.txt) do (
        echo ERROR: Port 8080 is STILL in use by process %%a
        echo Please manually kill this process
    )
    del temp_port3.txt
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS: Port 8080 is now FREE!
echo ========================================
echo.
