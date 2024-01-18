FROM openjdk
COPY ./build/libs/*.jar /app/
WORKDIR /app
EXPOSE 80
ENTRYPOINT ["java", "-jar", "demo-0.0.1-SNAPSHOT.jar"]