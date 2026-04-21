# Find and set JAVA_HOME
Write-Host "Finding Java installation..." -ForegroundColor Yellow

# Try to find Java using common methods
$javaPaths = @(
    "C:\Program Files\Java",
    "C:\Program Files (x86)\Java",
    "$env:LOCALAPPDATA\Programs\Java",
    "$env:ProgramFiles\Java"
)

$javaHome = $null

# Check if JAVA_HOME is already set
if ($env:JAVA_HOME) {
    Write-Host "JAVA_HOME is already set to: $env:JAVA_HOME" -ForegroundColor Green
    $javaHome = $env:JAVA_HOME
} else {
    # Try to find Java
    foreach ($path in $javaPaths) {
        if (Test-Path $path) {
            $jdkDirs = Get-ChildItem $path -Directory | Where-Object { $_.Name -like "jdk*" -or $_.Name -like "java*" } | Sort-Object Name -Descending
            if ($jdkDirs) {
                $javaHome = $jdkDirs[0].FullName
                Write-Host "Found Java at: $javaHome" -ForegroundColor Green
                break
            }
        }
    }
    
    # If not found, try using java -version output
    if (-not $javaHome) {
        try {
            $javaVersion = java -version 2>&1 | Select-Object -First 1
            Write-Host "Java is installed (version check works)" -ForegroundColor Green
            Write-Host "Please set JAVA_HOME manually:" -ForegroundColor Yellow
            Write-Host "1. Find your Java installation (usually in C:\Program Files\Java\jdk-XX)" -ForegroundColor Cyan
            Write-Host "2. Set JAVA_HOME environment variable to that path" -ForegroundColor Cyan
        } catch {
            Write-Host "Could not find Java automatically" -ForegroundColor Red
        }
    }
}

if ($javaHome) {
    Write-Host "`nSetting JAVA_HOME for this session..." -ForegroundColor Yellow
    $env:JAVA_HOME = $javaHome
    Write-Host "JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green
    Write-Host "`nNote: This is only for this PowerShell session." -ForegroundColor Yellow
    Write-Host "To make it permanent, add JAVA_HOME to System Environment Variables." -ForegroundColor Yellow
}

