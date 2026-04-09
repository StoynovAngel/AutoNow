FROM eclipse-temurin:17.0.18_8-jdk

WORKDIR /app
COPY target/autonow-*.jar app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]