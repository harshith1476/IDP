# Use Eclipse Temurin 17 JDK (official OpenJDK replacement)
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Install Maven
RUN apt-get update && \
    apt-get install -y maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy pom.xml and download dependencies (for better caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Expose port (Render will set PORT env variable)
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/drims-backend-1.0.0.jar"]

