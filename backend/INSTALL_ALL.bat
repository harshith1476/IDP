@echo off
echo ========================================
echo   DRIMS Backend - Complete Setup
echo ========================================
echo.
echo This will install:
echo   - Java 17 JDK
echo   - Apache Maven
echo   - Maven Wrapper (backup)
echo.
echo Press any key to continue, or Ctrl+C to cancel...
pause >nul

powershell -ExecutionPolicy Bypass -File "%~dp0install-all-dependencies.ps1"

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Press any key to exit...
pause >nul
