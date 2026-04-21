# Comprehensive Backend Dependencies Installation Script
# This script installs Java 17, Maven, and sets up Maven Wrapper

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DRIMS Backend - Complete Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  Warning: Not running as Administrator" -ForegroundColor Yellow
    Write-Host "   Some operations may require admin rights" -ForegroundColor Yellow
    Write-Host ""
}

# ============================================
# STEP 1: Check and Install Java 17
# ============================================
Write-Host "Step 1: Checking Java Installation..." -ForegroundColor Yellow
Write-Host ""

$javaInstalled = $false
$javaVersion = $null
$javaHome = $null

# Check if Java is in PATH
try {
    $javaOutput = java -version 2>&1 | Select-Object -First 1
    if ($javaOutput -match "version") {
        $javaInstalled = $true
        Write-Host "✅ Java found in PATH" -ForegroundColor Green
        java -version
    }
} catch {
    Write-Host "❌ Java not found in PATH" -ForegroundColor Red
}

# Check common Java installation paths
if (-not $javaInstalled) {
    $javaPaths = @(
        "C:\Program Files\Java",
        "C:\Program Files (x86)\Java",
        "$env:LOCALAPPDATA\Programs\Java",
        "$env:ProgramFiles\Java"
    )
    
    foreach ($path in $javaPaths) {
        if (Test-Path $path) {
            $jdkDirs = Get-ChildItem $path -Directory -ErrorAction SilentlyContinue | 
                Where-Object { $_.Name -like "jdk-17*" -or $_.Name -like "jdk17*" -or $_.Name -like "java-17*" } | 
                Sort-Object Name -Descending
            if ($jdkDirs) {
                $javaHome = $jdkDirs[0].FullName
                $javaInstalled = $true
                Write-Host "✅ Found Java 17 at: $javaHome" -ForegroundColor Green
                break
            }
        }
    }
}

# If Java 17 not found, download and install
if (-not $javaInstalled) {
    Write-Host ""
    Write-Host "❌ Java 17 not found. Downloading Java 17..." -ForegroundColor Yellow
    Write-Host ""
    
    # Download Java 17 from Adoptium (Eclipse Temurin)
    $javaUrl = "https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse"
    $javaZipPath = "$env:TEMP\openjdk-17.zip"
    $javaExtractPath = "$env:TEMP\openjdk-17"
    $javaInstallPath = "C:\Program Files\Java\jdk-17"
    
    try {
        Write-Host "Downloading Java 17 (this may take a few minutes)..." -ForegroundColor Cyan
        Invoke-WebRequest -Uri $javaUrl -OutFile $javaZipPath -UseBasicParsing
        
        Write-Host "Extracting Java 17..." -ForegroundColor Cyan
        if (Test-Path $javaExtractPath) {
            Remove-Item $javaExtractPath -Recurse -Force
        }
        Expand-Archive -Path $javaZipPath -DestinationPath $javaExtractPath -Force
        
        # Find the actual JDK folder
        $jdkFolder = Get-ChildItem $javaExtractPath -Directory | Where-Object { $_.Name -like "jdk*" } | Select-Object -First 1
        if ($jdkFolder) {
            # Copy to Program Files (requires admin)
            if ($isAdmin) {
                if (-not (Test-Path "C:\Program Files\Java")) {
                    New-Item -ItemType Directory -Path "C:\Program Files\Java" -Force | Out-Null
                }
                Copy-Item -Path $jdkFolder.FullName -Destination $javaInstallPath -Recurse -Force
                $javaHome = $javaInstallPath
                Write-Host "✅ Java 17 installed to: $javaHome" -ForegroundColor Green
            } else {
                # If not admin, use temp location
                $javaHome = $jdkFolder.FullName
                Write-Host "✅ Java 17 extracted to: $javaHome" -ForegroundColor Green
                Write-Host "⚠️  Run as Administrator to install to Program Files" -ForegroundColor Yellow
            }
        }
        
        # Cleanup
        Remove-Item $javaZipPath -Force -ErrorAction SilentlyContinue
    } catch {
        Write-Host "❌ Error downloading Java: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please download Java 17 manually:" -ForegroundColor Yellow
        Write-Host "1. Visit: https://adoptium.net/temurin/releases/?version=17" -ForegroundColor Cyan
        Write-Host "2. Download Windows x64 JDK"
        Write-Host "3. Install it"
        Write-Host "4. Run this script again"
        Write-Host ""
        exit 1
    }
}

# Set JAVA_HOME
if ($javaHome) {
    $env:JAVA_HOME = $javaHome
    Write-Host "✅ JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green
    
    # Add to PATH for this session
    if (-not ($env:PATH -like "*$javaHome\bin*")) {
        $env:PATH = "$javaHome\bin;$env:PATH"
    }
    
    # Set permanently (requires admin)
    if ($isAdmin) {
        [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $javaHome, "Machine")
        $currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
        if ($currentPath -notlike "*$javaHome\bin*") {
            [System.Environment]::SetEnvironmentVariable("Path", "$currentPath;$javaHome\bin", "Machine")
        }
        Write-Host "✅ JAVA_HOME set permanently" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Run as Administrator to set JAVA_HOME permanently" -ForegroundColor Yellow
    }
}

Write-Host ""

# ============================================
# STEP 2: Check and Install Maven
# ============================================
Write-Host "Step 2: Checking Maven Installation..." -ForegroundColor Yellow
Write-Host ""

$mavenInstalled = $false
$mavenHome = $null

# Check if Maven is in PATH
try {
    $mvnOutput = mvn -version 2>&1 | Select-Object -First 1
    if ($mvnOutput -match "Apache Maven") {
        $mavenInstalled = $true
        Write-Host "✅ Maven found in PATH" -ForegroundColor Green
        mvn -version
        $mavenHome = (Get-Command mvn).Source | Split-Path | Split-Path
    }
} catch {
    Write-Host "❌ Maven not found in PATH" -ForegroundColor Red
}

# Check common Maven installation paths
if (-not $mavenInstalled) {
    $mavenPaths = @(
        "C:\Program Files\Apache\maven",
        "C:\apache-maven",
        "$env:USERPROFILE\apache-maven"
    )
    
    foreach ($path in $mavenPaths) {
        if (Test-Path "$path\bin\mvn.cmd") {
            $mavenHome = $path
            $mavenInstalled = $true
            Write-Host "✅ Found Maven at: $mavenHome" -ForegroundColor Green
            $env:PATH = "$mavenHome\bin;$env:PATH"
            break
        }
    }
}

# If Maven not found, download and install
if (-not $mavenInstalled) {
    Write-Host ""
    Write-Host "❌ Maven not found. Downloading Maven 3.9.6..." -ForegroundColor Yellow
    Write-Host ""
    
    $mavenVersion = "3.9.6"
    # Try multiple download URLs (mirrors may vary)
    $mavenUrls = @(
        "https://dlcdn.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip",
        "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip",
        "https://downloads.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
    )
    $mavenUrl = $null
    $mavenZipPath = "$env:TEMP\apache-maven.zip"
    $mavenExtractPath = "$env:TEMP\apache-maven"
    $mavenInstallPath = "C:\Program Files\Apache\maven"
    
    try {
        Write-Host "Downloading Maven $mavenVersion (this may take a minute)..." -ForegroundColor Cyan
        $downloadSuccess = $false
        foreach ($url in $mavenUrls) {
            try {
                Write-Host "Trying: $url" -ForegroundColor Gray
                # Use WebClient for more reliable downloads
                $webClient = New-Object System.Net.WebClient
                $webClient.Headers.Add("User-Agent", "Mozilla/5.0")
                [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
                $webClient.DownloadFile($url, $mavenZipPath)
                
                # Verify file was downloaded
                if (Test-Path $mavenZipPath) {
                    $fileSize = (Get-Item $mavenZipPath).Length
                    if ($fileSize -gt 1000000) { # At least 1MB
                        Write-Host "✅ Download successful! ($([math]::Round($fileSize/1MB, 2)) MB)" -ForegroundColor Green
                        $downloadSuccess = $true
                        break
                    } else {
                        Write-Host "File too small, trying next mirror..." -ForegroundColor Gray
                        Remove-Item $mavenZipPath -Force -ErrorAction SilentlyContinue
                    }
                }
            } catch {
                Write-Host "Failed, trying next mirror..." -ForegroundColor Gray
                if (Test-Path $mavenZipPath) {
                    Remove-Item $mavenZipPath -Force -ErrorAction SilentlyContinue
                }
                continue
            }
        }
        if (-not $downloadSuccess) {
            throw "All download mirrors failed"
        }
        
        Write-Host "Extracting Maven..." -ForegroundColor Cyan
        if (Test-Path $mavenExtractPath) {
            Remove-Item $mavenExtractPath -Recurse -Force
        }
        Expand-Archive -Path $mavenZipPath -DestinationPath $mavenExtractPath -Force
        
        # Find the actual maven folder
        $mavenFolder = Get-ChildItem $mavenExtractPath -Directory | Where-Object { $_.Name -like "apache-maven*" } | Select-Object -First 1
        if ($mavenFolder) {
            # Copy to Program Files (requires admin)
            if ($isAdmin) {
                if (-not (Test-Path "C:\Program Files\Apache")) {
                    New-Item -ItemType Directory -Path "C:\Program Files\Apache" -Force | Out-Null
                }
                if (Test-Path $mavenInstallPath) {
                    Remove-Item $mavenInstallPath -Recurse -Force
                }
                Copy-Item -Path $mavenFolder.FullName -Destination $mavenInstallPath -Recurse -Force
                $mavenHome = $mavenInstallPath
                Write-Host "✅ Maven installed to: $mavenHome" -ForegroundColor Green
            } else {
                # If not admin, use temp location
                $mavenHome = $mavenFolder.FullName
                Write-Host "✅ Maven extracted to: $mavenHome" -ForegroundColor Green
                Write-Host "⚠️  Run as Administrator to install to Program Files" -ForegroundColor Yellow
            }
        }
        
        # Add to PATH
        $env:PATH = "$mavenHome\bin;$env:PATH"
        
        # Set permanently (requires admin)
        if ($isAdmin) {
            [System.Environment]::SetEnvironmentVariable("MAVEN_HOME", $mavenHome, "Machine")
            $currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
            if ($currentPath -notlike "*$mavenHome\bin*") {
                [System.Environment]::SetEnvironmentVariable("Path", "$currentPath;$mavenHome\bin", "Machine")
            }
            Write-Host "✅ Maven added to PATH permanently" -ForegroundColor Green
        }
        
        # Cleanup
        Remove-Item $javaZipPath -Force -ErrorAction SilentlyContinue
    } catch {
        Write-Host "❌ Error downloading Maven: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please download Maven manually:" -ForegroundColor Yellow
        Write-Host "1. Visit: https://maven.apache.org/download.cgi" -ForegroundColor Cyan
        Write-Host "2. Download apache-maven-3.9.6-bin.zip"
        Write-Host "3. Extract to C:\Program Files\Apache\maven"
        Write-Host "4. Add C:\Program Files\Apache\maven\bin to PATH"
        Write-Host ""
    }
}

Write-Host ""

# ============================================
# STEP 3: Setup Maven Wrapper (Backup)
# ============================================
Write-Host "Step 3: Setting up Maven Wrapper (backup method)..." -ForegroundColor Yellow
Write-Host ""

$wrapperDir = ".mvn\wrapper"
$wrapperJar = "$wrapperDir\maven-wrapper.jar"
$wrapperProperties = "$wrapperDir\maven-wrapper.properties"
$mvnwCmd = "mvnw.cmd"
$mvnwBat = "mvnw.bat"

# Create wrapper directory
if (-not (Test-Path $wrapperDir)) {
    New-Item -ItemType Directory -Path $wrapperDir -Force | Out-Null
    Write-Host "✅ Created .mvn\wrapper directory" -ForegroundColor Green
}

# Download Maven Wrapper JAR
if (-not (Test-Path $wrapperJar)) {
    try {
        $wrapperUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"
        Write-Host "Downloading Maven Wrapper JAR..." -ForegroundColor Cyan
        Invoke-WebRequest -Uri $wrapperUrl -OutFile $wrapperJar -UseBasicParsing
        Write-Host "✅ Maven Wrapper JAR downloaded" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not download Maven Wrapper JAR: $_" -ForegroundColor Yellow
    }
}

# Create maven-wrapper.properties
if (-not (Test-Path $wrapperProperties)) {
    $propertiesContent = @"
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip
wrapperUrl=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
"@
    Set-Content -Path $wrapperProperties -Value $propertiesContent
    Write-Host "✅ Created maven-wrapper.properties" -ForegroundColor Green
}

# Create mvnw.cmd (Windows wrapper script)
if (-not (Test-Path $mvnwCmd)) {
    $mvnwContent = @"
@echo off
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM M2_HOME - location of maven2's installed home dir
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a keystroke before ending
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@REM Begin all REM lines with '@' in case MAVEN_BATCH_ECHO is 'on'
@echo off
@REM set title of command window
title %0
@REM enable echoing by setting MAVEN_BATCH_ECHO to 'on'
@if "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_BATCH_ECHO%

@REM set %HOME% to equivalent of $HOME
if "%HOME%" == "" (set "HOME=%HOMEDRIVE%%HOMEPATH%")

@REM Execute a user defined script before this one
if not "%MAVEN_SKIP_RC%" == "" goto skipRcPre
@REM check for pre script, once with legacy .bat ending and once with .cmd ending
if exist "%HOME%\mavenrc_pre.bat" call "%HOME%\mavenrc_pre.bat"
if exist "%HOME%\mavenrc_pre.cmd" call "%HOME%\mavenrc_pre.cmd"
:skipRcPre

@setlocal

set ERROR_CODE=0

@REM To isolate internal variables from possible post scripts, we use another setlocal
@setlocal

@REM ==== START VALIDATION ====
if not "%JAVA_HOME%" == "" goto OkJHome

echo.
echo Error: JAVA_HOME not found in your environment. >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

:OkJHome
if exist "%JAVA_HOME%\bin\java.exe" goto init

echo.
echo Error: JAVA_HOME is set to an invalid directory. >&2
echo JAVA_HOME = "%JAVA_HOME%" >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
echo.
goto error

@REM ==== END VALIDATION ====

:init

@REM Find the project base dir, i.e. the directory that contains the folder ".mvn".
@REM Fallback to current working directory if not found.

set MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
IF NOT "%MAVEN_PROJECTBASEDIR%"=="" goto endDetectBaseDir

set EXEC_DIR=%CD%
set WDIR=%EXEC_DIR%
:findBaseDir
IF EXIST "%WDIR%"\.mvn goto baseDirFound
cd ..
IF "%WDIR%"=="%CD%" goto baseDirNotFound
set WDIR=%CD%
goto findBaseDir

:baseDirFound
set MAVEN_PROJECTBASEDIR=%WDIR%
cd "%EXEC_DIR%"
goto endDetectBaseDir

:baseDirNotFound
set MAVEN_PROJECTBASEDIR=%EXEC_DIR%
cd "%EXEC_DIR%"

:endDetectBaseDir

IF NOT EXIST "%MAVEN_PROJECTBASEDIR%\.mvn\jvm.config" goto endReadAdditionalConfig

@setlocal EnableExtensions EnableDelayedExpansion
for /F "usebackq delims=" %%a in ("%MAVEN_PROJECTBASEDIR%\.mvn\jvm.config") do set JVM_CONFIG_MAVEN_PROPS=!JVM_CONFIG_MAVEN_PROPS! %%a
@endlocal & set JVM_CONFIG_MAVEN_PROPS=%JVM_CONFIG_MAVEN_PROPS%

:endReadAdditionalConfig

SET MAVEN_JAVA_EXE="%JAVA_HOME%\bin\java.exe"
set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

set DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties") DO (
    IF "%%A"=="wrapperUrl" SET DOWNLOAD_URL=%%B
)

@REM Extension to allow automatically downloading the maven-wrapper.jar from Maven-central
@REM This allows using the maven wrapper in projects that prohibit checking in binary data.
if exist %WRAPPER_JAR% (
    if "%MVNW_VERBOSE%" == "true" (
        echo Found %WRAPPER_JAR%
    )
) else (
    if not "%MVNW_REPOURL%" == "" (
        SET DOWNLOAD_URL="%MVNW_REPOURL%/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"
    )
    if "%MVNW_VERBOSE%" == "true" (
        echo Couldn't find %WRAPPER_JAR%, downloading it ...
        echo Downloading from: %DOWNLOAD_URL%
    )

    powershell -Command "&{"^
		"$webclient = new-object System.Net.WebClient;"^
		"if (-not ([string]::IsNullOrEmpty('%MVNW_USERNAME%') -and [string]::IsNullOrEmpty('%MVNW_PASSWORD%'))) {"^
		"$webclient.Credentials = new-object System.Net.NetworkCredential('%MVNW_USERNAME%', '%MVNW_PASSWORD%');"^
		"}"^
		"[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $webclient.DownloadFile('%DOWNLOAD_URL%', '%WRAPPER_JAR%')"^
		"}"
    if "%MVNW_VERBOSE%" == "true" (
        echo Finished downloading %WRAPPER_JAR%
    )
)
@REM End of extension

@REM Provide a "standardized" way to retrieve the CLI args that will
@REM work with both Windows and non-Windows executions.
set MAVEN_CMD_LINE_ARGS=%*

%MAVEN_JAVA_EXE% ^
  %JVM_CONFIG_MAVEN_PROPS% ^
  %MAVEN_OPTS% ^
  %MAVEN_DEBUG_OPTS% ^
  -classpath %WRAPPER_JAR% ^
  "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
  %WRAPPER_LAUNCHER% %MAVEN_CMD_LINE_ARGS%
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%

if not "%MAVEN_SKIP_RC%" == "" goto skipRcPost
@REM check for post script, once with legacy .bat ending and once with .cmd ending
if exist "%HOME%\mavenrc_post.bat" call "%HOME%\mavenrc_post.bat"
if exist "%HOME%\mavenrc_post.cmd" call "%HOME%\mavenrc_post.cmd"
:skipRcPost

@REM pause the script if MAVEN_BATCH_PAUSE is set to 'on'
if "%MAVEN_BATCH_PAUSE%" == "on" pause

if "%MAVEN_TERMINATE_CMD%" == "on" exit %ERROR_CODE%

exit /B %ERROR_CODE%
"@
    Set-Content -Path $mvnwCmd -Value $mvnwContent
    Write-Host "✅ Created mvnw.cmd wrapper script" -ForegroundColor Green
}

Write-Host ""

# ============================================
# STEP 4: Verify Installations
# ============================================
Write-Host "Step 4: Verifying Installations..." -ForegroundColor Yellow
Write-Host ""

# Verify Java
Write-Host "Checking Java..." -ForegroundColor Cyan
try {
    $javaCheck = java -version 2>&1 | Select-Object -First 1
    if ($javaCheck -match "version") {
        Write-Host "✅ Java is working" -ForegroundColor Green
        java -version 2>&1 | Select-Object -First 3
    } else {
        Write-Host "⚠️  Java may not be working correctly" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Java verification failed" -ForegroundColor Red
}

Write-Host ""

# Verify Maven
Write-Host "Checking Maven..." -ForegroundColor Cyan
try {
    $mvnCheck = mvn -version 2>&1 | Select-Object -First 1
    if ($mvnCheck -match "Apache Maven") {
        Write-Host "✅ Maven is working" -ForegroundColor Green
        mvn -version 2>&1 | Select-Object -First 3
    } else {
        Write-Host "⚠️  Maven may not be working correctly" -ForegroundColor Yellow
        Write-Host "   You can use .\mvnw.cmd instead" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Maven not in PATH, but Maven Wrapper is available" -ForegroundColor Yellow
    Write-Host "   Use: .\mvnw.cmd instead of mvn" -ForegroundColor Cyan
}

Write-Host ""

# ============================================
# STEP 5: MongoDB Check
# ============================================
Write-Host "Step 5: Checking MongoDB..." -ForegroundColor Yellow
Write-Host ""

$mongodbRunning = $false
try {
    $mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($mongoService -and $mongoService.Status -eq "Running") {
        $mongodbRunning = $true
        Write-Host "✅ MongoDB service is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB service not found or not running" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  MongoDB service not found" -ForegroundColor Yellow
}

if (-not $mongodbRunning) {
    Write-Host ""
    Write-Host "MongoDB Setup Instructions:" -ForegroundColor Cyan
    Write-Host "1. Download MongoDB Community Edition:" -ForegroundColor White
    Write-Host "   https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2. Install MongoDB" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Start MongoDB service:" -ForegroundColor White
    Write-Host "   net start MongoDB" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OR use MongoDB Atlas (cloud):" -ForegroundColor White
    Write-Host "   https://www.mongodb.com/cloud/atlas" -ForegroundColor Yellow
    Write-Host "   (Update connection string in application.properties)" -ForegroundColor White
    Write-Host ""
}

# ============================================
# SUMMARY
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($javaHome) {
    Write-Host "✅ Java 17: $javaHome" -ForegroundColor Green
} else {
    Write-Host "❌ Java 17: Not installed" -ForegroundColor Red
}

if ($mavenHome) {
    Write-Host "✅ Maven: $mavenHome" -ForegroundColor Green
} else {
    Write-Host "⚠️  Maven: Not installed (but Maven Wrapper is available)" -ForegroundColor Yellow
}

Write-Host "✅ Maven Wrapper: Available (use .\mvnw.cmd)" -ForegroundColor Green

if ($mongodbRunning) {
    Write-Host "✅ MongoDB: Running" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB: Not running (install and start it)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($mongodbRunning) {
    Write-Host "1. Start MongoDB (if not already running):" -ForegroundColor White
    Write-Host "   net start MongoDB" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "2. Build the backend:" -ForegroundColor White
if ($mavenHome) {
    Write-Host "   mvn clean install" -ForegroundColor Yellow
} else {
    Write-Host "   .\mvnw.cmd clean install" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "3. Run the backend:" -ForegroundColor White
if ($mavenHome) {
    Write-Host "   mvn spring-boot:run" -ForegroundColor Yellow
} else {
    Write-Host "   .\mvnw.cmd spring-boot:run" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Note: If you see environment variable warnings," -ForegroundColor Yellow
Write-Host "      restart your terminal/PowerShell for changes to take effect." -ForegroundColor Yellow
Write-Host ""
