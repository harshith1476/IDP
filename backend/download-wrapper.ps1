# Download Maven Wrapper JAR
Write-Host "Downloading Maven Wrapper..." -ForegroundColor Yellow

$wrapperDir = ".mvn\wrapper"
$wrapperJar = "$wrapperDir\maven-wrapper.jar"
$wrapperUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

# Create directory if it doesn't exist
if (-not (Test-Path $wrapperDir)) {
    New-Item -ItemType Directory -Path $wrapperDir -Force | Out-Null
}

# Download the wrapper JAR
try {
    Write-Host "Downloading from: $wrapperUrl" -ForegroundColor Cyan
    Invoke-WebRequest -Uri $wrapperUrl -OutFile $wrapperJar
    Write-Host "Maven Wrapper downloaded successfully!" -ForegroundColor Green
    Write-Host "`nYou can now use: .\mvnw.cmd spring-boot:run" -ForegroundColor Green
} catch {
    Write-Host "Error downloading wrapper: $_" -ForegroundColor Red
    Write-Host "`nPlease download manually from:" -ForegroundColor Yellow
    Write-Host $wrapperUrl -ForegroundColor Cyan
    Write-Host "And save it to: $wrapperJar" -ForegroundColor Yellow
}

