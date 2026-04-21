@echo off
echo ========================================
echo   Automatic Maven Installation
echo ========================================
echo.
echo This will automatically:
echo   - Download Maven 3.9.6
echo   - Install it to Program Files
echo   - Set up environment variables
echo   - Verify the installation
echo.
echo This requires Administrator privileges.
echo.
pause

powershell -ExecutionPolicy Bypass -File "%~dp0install-maven-automatic.ps1"

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo IMPORTANT: Close and reopen your terminal
echo            for changes to take effect.
echo.
pause
