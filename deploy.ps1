# # Build JAR
# # ./gradlew bootJar

# Need to manually build the jar file and then run this

# # Build Docker Image
 docker build -t davidsregistry01.azurecr.io/acronym-image-1:bob-2 .
#
# # Login to Azure Container Registry
az acr login --name davidsregistry01.azurecr.io
#
# # Push Docker Image to ACR
 docker push davidsregistry01.azurecr.io/acronym-image-1:bob-2

#az container create --resource-group AcronymResources --name AcronymContainer1 --image davidsregistry01.azurecr.io/acronym-image-1:latest `
# --environment-variables SPRING_DATASOURCE_PASSWORD=GQtOavSQqXa0b5HkYoSM!  SPRING_DATASOURCE_URL=jdbc:sqlserver://david-db.database.windows.net:1433;databaseName=acronymdatabase;encrypt=false

