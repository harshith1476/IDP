# Quick Start Script for Backend (Auto-Fix MongoDB)
$ErrorActionPreference = "Stop"

function Test-Admin {
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Start-MongoDB-Service {
    Write-Host "Attempting to start MongoDB Service..." -ForegroundColor Cyan
    try {
        $service = Get-Service "MongoDB" -ErrorAction SilentlyContinue
        if ($service) {
            if ($service.Status -ne 'Running') {
                Start-Service "MongoDB"
                Write-Host "MongoDB Service started." -ForegroundColor Green
                return $true
            } else {
                Write-Host "MongoDB Service is already running." -ForegroundColor Green
                return $true
            }
        }
        Write-Host "MongoDB Service not found." -ForegroundColor Yellow
        return $false
    } catch {
        Write-Host "Failed to start MongoDB service (Access Denied?)." -ForegroundColor Yellow
        return $false
    }
}

function Find-Mongod-Executable {
    # Check updated path first (User seems to have 8.2??)
    $manualPaths = @(
        "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe",
        "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe",
        "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe",
        "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe",
        "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"
    )
    foreach ($path in $manualPaths) {
        if (Test-Path $path) { return $path }
    }
    
    # Fallback to search if not found
    Write-Host "Searching for mongod.exe..." -ForegroundColor Gray
    try {
        $found = Get-ChildItem -Path "C:\Program Files\MongoDB" -Filter "mongod.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
        if ($found) { return $found }
    } catch {}
    
    return $null
}

function Start-MongoDB-Local {
    param($mongodPath)
    Write-Host "Attempting to start local MongoDB instance..." -ForegroundColor Cyan
    
    # Create data dir relative to script
    $dataDir = Join-Path $PSScriptRoot "data\db"
    if (-not (Test-Path $dataDir)) {
        New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
        Write-Host "Created local data directory: $dataDir" -ForegroundColor Gray
    }

    # Start mongod process separate window
    $argList = "--dbpath `"$dataDir`" --port 27017 --bind_ip 127.0.0.1"
    Write-Host "Starting: $mongodPath $argList" -ForegroundColor Gray
    
    try {
        $process = Start-Process -FilePath $mongodPath -ArgumentList $argList -PassThru -WindowStyle Minimised
        if ($process.Id) {
            Write-Host "Started local MongoDB (PID: $($process.Id))" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "Failed to start local MongoDB: $_" -ForegroundColor Red
    }
    return $false
}

# --- Main Logic ---

# 1. Elevate if needed (only if we suspect service needs it, but we can try local without)
if (-not (Test-Admin)) {
    Write-Host "Requesting Administrator privileges to check services..." -ForegroundColor Yellow
    # Relaunch as Admin
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Set-Location $PSScriptRoot

# 2. Try Service
$mongoRunning = Start-MongoDB-Service

# 3. If Service failed, try Local
if (-not $mongoRunning) {
    if (-not (Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet)) {
        Write-Host "Service failed. Trying local instance..." -ForegroundColor Yellow
        $mongodPath = Find-Mongod-Executable
        if ($mongodPath) {
            Write-Host "Found mongod.exe at: $mongodPath" -ForegroundColor Gray
            $mongoRunning = Start-MongoDB-Local -mongodPath $mongodPath
            Start-Sleep -Seconds 5
        } else {
            Write-Host "Could not find mongod.exe in standard locations." -ForegroundColor Red
        }
    } else {
        $mongoRunning = $true # Port is open, assume running
    }
}

# 4. Final verify
if (-not (Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet)) {
    Write-Host "CRITICAL ERROR: MongoDB is not reachable on port 27017." -ForegroundColor Red
    Write-Host "Please check if another service is using port 27017 (netstat -ano | findstr :27017)." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# 5. Run Backend
Write-Host "Starting Maven build & run..." -ForegroundColor Cyan

# Check for mvn or wrapper
$mvnCmd = "mvn"
if (Test-Path ".\mvnw.cmd") {
    $mvnCmd = ".\mvnw.cmd"
}

# Run
Write-Host "Running: $mvnCmd spring-boot:run" -ForegroundColor Cyan
Invoke-Expression "& $mvnCmd spring-boot:run"
