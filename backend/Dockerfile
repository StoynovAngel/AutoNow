FROM eclipse-temurin:25.0.2_10-jdk

WORKDIR /app
COPY target/autonow-*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]