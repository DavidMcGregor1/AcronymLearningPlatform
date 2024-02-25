# # Build JAR
# # ./gradlew bootJar

# Need to manually build the jar file and then run this

# # Build Docker Image
 docker build -t davidsregistry01.azurecr.io/acronym-image-1:acVersion-6 .
#
# # Login to Azure Container Registry
az acr login --name davidsregistry01.azurecr.io
#
# # Push Docker Image to ACR
 docker push davidsregistry01.azurecr.io/acronym-image-1:acVersion-6


