# -----------------------------------------------------------------------------
# Dockerfile for Java Spark Application (Maven Build)
# -----------------------------------------------------------------------------

# STAGE 1: Build the Application
# We use a Maven image to compile the source code into a JAR file.
FROM maven:3.9.4-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file first to cache dependencies (faster builds)
COPY pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy the rest of the source code
COPY src ./src

# Build the application (skip tests for faster deployment)
RUN mvn clean package -DskipTests

# -----------------------------------------------------------------------------
# STAGE 2: Run the Application
# We use a smaller, lighter image just for running the app.
FROM eclipse-temurin:17-jre-alpine

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the 'build' stage
# Note: Adjust the JAR name if your pom.xml produces a different name
COPY --from=build /app/target/lovoson-website-1.0-SNAPSHOT.jar app.jar

# Expose the port (Render sets the PORT env var, but this is good documentation)
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "app.jar"]