# Automatic Maven Installation Script
# This script will download and install Maven automatically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Automatic Maven Installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  Not running as Administrator" -ForegroundColor Yellow
    Write-Host "   Requesting elevated permissions..." -ForegroundColor Yellow
    Write-Host ""
    
    # Restart script as Administrator
    $scriptPath = $MyInvocation.MyCommand.Path
    Start-Process powershell -Verb RunAs -ArgumentList "-ExecutionPolicy Bypass -File `"$scriptPath`""
    exit
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Check if Maven is already installed
Write-Host "Checking if Maven is already installed..." -ForegroundColor Yellow
try {
    $mvnCheck = mvn -version 2>&1 | Select-Object -First 1
    if ($mvnCheck -match "Apache Maven") {
        Write-Host "✅ Maven is already installed!" -ForegroundColor Green
        mvn -version
        Write-Host ""
        Write-Host "Maven is ready to use!" -ForegroundColor Green
        exit 0
    }
} catch {
    Write-Host "Maven not found, proceeding with installation..." -ForegroundColor Yellow
}

Write-Host ""

# Maven version and paths
$mavenVersion = "3.9.6"
$mavenInstallPath = "C:\Program Files\Apache\maven"
$mavenZipPath = "$env:TEMP\apache-maven-$mavenVersion-bin.zip"
$mavenExtractPath = "$env:TEMP\apache-maven-extract"

# Clean up any existing files
if (Test-Path $mavenZipPath) {
    Remove-Item $mavenZipPath -Force -ErrorAction SilentlyContinue
}
if (Test-Path $mavenExtractPath) {
    Remove-Item $mavenExtractPath -Recurse -Force -ErrorAction SilentlyContinue
}

# Create installation directory
if (-not (Test-Path "C:\Program Files\Apache")) {
    New-Item -ItemType Directory -Path "C:\Program Files\Apache" -Force | Out-Null
}

# List of Maven download URLs (trying multiple sources)
$mavenUrls = @(
    "https://dlcdn.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip",
    "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip",
    "https://downloads.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip",
    "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/$mavenVersion/apache-maven-$mavenVersion-bin.zip"
)

Write-Host "Step 1: Downloading Maven $mavenVersion..." -ForegroundColor Yellow
Write-Host ""

$downloadSuccess = $false
$lastError = $null

foreach ($url in $mavenUrls) {
    try {
        Write-Host "Trying download from: $url" -ForegroundColor Cyan
        Write-Host "This may take a few minutes, please wait..." -ForegroundColor Gray
        
        # Use WebClient for better download control
        $webClient = New-Object System.Net.WebClient
        $webClient.Headers.Add("User-Agent", "Mozilla/5.0")
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        
        # Download with progress
        $webClient.DownloadFile($url, $mavenZipPath)
        
        # Verify file was downloaded
        if (Test-Path $mavenZipPath) {
            $fileSize = (Get-Item $mavenZipPath).Length
            if ($fileSize -gt 1000000) { # At least 1MB
                Write-Host "✅ Download successful! ($([math]::Round($fileSize/1MB, 2)) MB)" -ForegroundColor Green
                $downloadSuccess = $true
                break
            } else {
                Write-Host "⚠️  Downloaded file seems too small, trying next source..." -ForegroundColor Yellow
                Remove-Item $mavenZipPath -Force -ErrorAction SilentlyContinue
            }
        }
    } catch {
        $lastError = $_.Exception.Message
        Write-Host "❌ Download failed: $lastError" -ForegroundColor Red
        Write-Host "Trying next download source..." -ForegroundColor Yellow
        if (Test-Path $mavenZipPath) {
            Remove-Item $mavenZipPath -Force -ErrorAction SilentlyContinue
        }
        continue
    }
}

if (-not $downloadSuccess) {
    Write-Host ""
    Write-Host "❌ All download sources failed!" -ForegroundColor Red
    Write-Host "Last error: $lastError" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Download manually from:" -ForegroundColor Yellow
    Write-Host "https://maven.apache.org/download.cgi" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then extract to: C:\Program Files\Apache\maven" -ForegroundColor Yellow
    Write-Host "And add to PATH: C:\Program Files\Apache\maven\bin" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Extract Maven
Write-Host "Step 2: Extracting Maven..." -ForegroundColor Yellow
try {
    Expand-Archive -Path $mavenZipPath -DestinationPath $mavenExtractPath -Force
    Write-Host "✅ Extraction successful" -ForegroundColor Green
    
    # Find the maven folder
    $mavenFolder = Get-ChildItem $mavenExtractPath -Directory | Where-Object { $_.Name -like "apache-maven*" } | Select-Object -First 1
    
    if (-not $mavenFolder) {
        throw "Could not find apache-maven folder in extracted files"
    }
    
    Write-Host "Found Maven folder: $($mavenFolder.Name)" -ForegroundColor Green
} catch {
    Write-Host "❌ Extraction failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install to Program Files
Write-Host "Step 3: Installing Maven to Program Files..." -ForegroundColor Yellow
try {
    # Remove old installation if exists
    if (Test-Path $mavenInstallPath) {
        Write-Host "Removing old Maven installation..." -ForegroundColor Gray
        Remove-Item $mavenInstallPath -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    # Copy to installation directory
    Write-Host "Copying files to: $mavenInstallPath" -ForegroundColor Gray
    Copy-Item -Path $mavenFolder.FullName -Destination $mavenInstallPath -Recurse -Force
    
    Write-Host "✅ Maven installed to: $mavenInstallPath" -ForegroundColor Green
} catch {
    Write-Host "❌ Installation failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Set Environment Variables
Write-Host "Step 4: Setting up environment variables..." -ForegroundColor Yellow
try {
    # Set MAVEN_HOME
    [System.Environment]::SetEnvironmentVariable("MAVEN_HOME", $mavenInstallPath, "Machine")
    Write-Host "✅ MAVEN_HOME set to: $mavenInstallPath" -ForegroundColor Green
    
    # Add to PATH
    $currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    $mavenBinPath = "$mavenInstallPath\bin"
    
    if ($currentPath -notlike "*$mavenBinPath*") {
        $newPath = "$currentPath;$mavenBinPath"
        [System.Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
        Write-Host "✅ Added Maven to PATH" -ForegroundColor Green
    } else {
        Write-Host "✅ Maven already in PATH" -ForegroundColor Green
    }
    
    # Set for current session
    $env:MAVEN_HOME = $mavenInstallPath
    $env:PATH = "$mavenBinPath;$env:PATH"
    
} catch {
    Write-Host "❌ Failed to set environment variables: $_" -ForegroundColor Red
    Write-Host "You may need to set them manually" -ForegroundColor Yellow
}

Write-Host ""

# Cleanup
Write-Host "Step 5: Cleaning up temporary files..." -ForegroundColor Yellow
try {
    Remove-Item $mavenZipPath -Force -ErrorAction SilentlyContinue
    Remove-Item $mavenExtractPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Cleanup complete" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not clean up temporary files (not critical)" -ForegroundColor Yellow
}

Write-Host ""

# Verify Installation
Write-Host "Step 6: Verifying installation..." -ForegroundColor Yellow
Write-Host ""

# Refresh environment variables
$env:MAVEN_HOME = [System.Environment]::GetEnvironmentVariable("MAVEN_HOME", "Machine")
$env:PATH = [System.Environment]::GetEnvironmentVariable("Path", "Machine")

# Wait a moment for PATH to refresh
Start-Sleep -Seconds 2

try {
    # Try to run mvn
    $mvnPath = "$mavenInstallPath\bin\mvn.cmd"
    if (Test-Path $mvnPath) {
        Write-Host "Testing Maven installation..." -ForegroundColor Cyan
        $mvnOutput = & $mvnPath -version 2>&1
        
        if ($mvnOutput -match "Apache Maven") {
            Write-Host "✅ Maven installation verified!" -ForegroundColor Green
            Write-Host ""
            $mvnOutput | Select-Object -First 5
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Cyan
            Write-Host "  ✅ Maven Installation Successful!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Maven is now installed and ready to use!" -ForegroundColor Green
            Write-Host ""
            Write-Host "⚠️  IMPORTANT: Close and reopen your terminal/PowerShell" -ForegroundColor Yellow
            Write-Host "   for the PATH changes to take effect." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "After reopening, test with: mvn -version" -ForegroundColor Cyan
            Write-Host ""
        } else {
            throw "Maven version check failed"
        }
    } else {
        throw "Maven executable not found"
    }
} catch {
    Write-Host "⚠️  Verification had issues, but Maven should be installed" -ForegroundColor Yellow
    Write-Host "   Please close and reopen your terminal, then run: mvn -version" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host ""
