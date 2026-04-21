#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "========================================="
echo "DRIMS Backend Build Script"
echo "========================================="

# Install Maven if not already installed
if ! command -v mvn &> /dev/null; then
    echo "Installing Maven..."
    wget -q https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz
    tar -xzf apache-maven-3.9.6-bin.tar.gz
    export PATH=$PWD/apache-maven-3.9.6/bin:$PATH
    echo "Maven installed successfully"
else
    echo "Maven already installed"
fi

# Verify Maven installation
mvn -version

# Build the application
echo "Building application..."
mvn clean package -DskipTests

# Verify JAR file was created
if [ ! -f target/drims-backend-1.0.0.jar ]; then
    echo "ERROR: JAR file not found!"
    exit 1
fi

# Make the JAR file executable
chmod +x target/*.jar

echo "========================================="
echo "Build completed successfully!"
echo "JAR file: target/drims-backend-1.0.0.jar"
echo "========================================="