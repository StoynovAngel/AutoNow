FROM eclipse-temurin:25.0.3_9-jdk

WORKDIR /app
COPY target/autonow-*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]