FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY ["picture-transform-asp.net_core-react/picture-transform-asp.net_core-react.csproj", "picture-transform-asp.net_core-react/"]
RUN dotnet restore "picture-transform-asp.net_core-react/picture-transform-asp.net_core-react.csproj"
COPY . .
WORKDIR "/src/picture-transform-asp.net_core-react"
RUN dotnet build "picture-transform-asp.net_core-react.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "picture-transform-asp.net_core-react.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "picture-transform-asp.net_core-react.dll"]
