# ─────────────────────────────────────────────────
# Stage 1: Build the Spring Boot fat JAR with Maven
# ─────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn package -DskipTests -B

# ─────────────────────────────────────────────────
# Stage 2: Run the JAR in a lightweight JRE image
# ─────────────────────────────────────────────────
FROM eclipse-temurin:17-jre
WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads

# Copy the built JAR
COPY --from=build /app/target/*.jar app.jar

# Render injects PORT env var; Spring Boot reads server.port=${PORT:8081}
EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
