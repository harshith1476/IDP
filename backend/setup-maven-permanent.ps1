# Permanent Maven Setup Script
# Run this script as Administrator for system-wide installation
# Or run normally for user-level installation

Write-Host "=== Maven Permanent Setup ===" -ForegroundColor Cyan

$mavenHome = "C:\Users\vemul\Apache\apache-maven-3.9.6"
$mavenBin = "$mavenHome\bin"

if (-not (Test-Path "$mavenHome\bin\mvn.cmd")) {
    Write-Host "Error: Maven not found at $mavenHome" -ForegroundColor Red
    Write-Host "Please run the download script first." -ForegroundColor Yellow
    exit 1
}

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Host "Running as Administrator - Setting System PATH" -ForegroundColor Green
    
    # System PATH
    $systemPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($systemPath -notlike "*$mavenBin*") {
        $newSystemPath = "$systemPath;$mavenBin"
        [Environment]::SetEnvironmentVariable("Path", $newSystemPath, "Machine")
        Write-Host "Added to System PATH" -ForegroundColor Green
    }
    
    # System MAVEN_HOME
    [Environment]::SetEnvironmentVariable("MAVEN_HOME", $mavenHome, "Machine")
    Write-Host "MAVEN_HOME set at System level" -ForegroundColor Green
} else {
    Write-Host "Running as User - Setting User PATH" -ForegroundColor Yellow
    
    # User PATH
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($userPath -notlike "*$mavenBin*") {
        $newUserPath = "$userPath;$mavenBin"
        [Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
        Write-Host "Added to User PATH" -ForegroundColor Green
    }
    
    # User MAVEN_HOME
    [Environment]::SetEnvironmentVariable("MAVEN_HOME", $mavenHome, "User")
    Write-Host "MAVEN_HOME set at User level" -ForegroundColor Green
}

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host "Maven Location: $mavenHome" -ForegroundColor Cyan
Write-Host "`nIMPORTANT: Restart your terminal/PowerShell for changes to take effect!" -ForegroundColor Yellow
Write-Host "After restart, test with: mvn --version" -ForegroundColor Cyan

