# ──────────────────────────────────────────────────────────────────
# Stage 1: Build the React frontend
# ──────────────────────────────────────────────────────────────────
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copy package files first for better layer caching
COPY ["online doc hub frontend/package.json", "online doc hub frontend/package-lock.json", "./"]
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY ["online doc hub frontend/", "./"]

# In production the React app is served from the same origin as the API,
# so relative /api paths work without needing a full URL.
ENV REACT_APP_API_URL=/api
RUN npm run build

# ──────────────────────────────────────────────────────────────────
# Stage 2: Build the Spring Boot backend
# ──────────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app/backend

# Copy pom.xml first and download dependencies for layer caching
COPY ["online document hub/pom.xml", "./"]
RUN mvn dependency:go-offline -B -q

# Copy source code
COPY ["online document hub/src", "./src"]

# Copy the React build output into Spring Boot's static resources folder
# so Spring Boot will serve the frontend automatically
COPY --from=frontend-build /app/frontend/build ./src/main/resources/static

# Build the JAR, skipping tests (tests are run in CI separately)
RUN mvn clean package -DskipTests -B -q

# ──────────────────────────────────────────────────────────────────
# Stage 3: Minimal runtime image
# ──────────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create uploads directory for document file storage
RUN mkdir -p /app/uploads

# Copy the built JAR
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Expose the Spring Boot port
EXPOSE 8081

# Use exec form so signals (SIGTERM) reach the JVM for graceful shutdown
ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-Dapp.upload.dir=/app/uploads", \
  "-jar", "app.jar"]
