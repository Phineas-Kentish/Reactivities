FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
# Container destination
WORKDIR /app
# Expose ports
EXPOSE 80
EXPOSE 443
# Copy the production build
COPY /Publish .
# Give permissions
RUN chmod +x /app/API.dll
# Run program
ENTRYPOINT ["dotnet", "API.dll"]