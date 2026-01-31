# Yotsuba Hybrid Web API

API backend para la sección de comunidad Discord de la web oficial de Yotsuba Hybrid.

## 🏗️ Arquitectura

Esta es una **Minimal API** construida con ASP.NET Core 10, siguiendo principios de arquitectura limpia:

```
Web Frontend (Angular)
        ↓
ASP.NET 10 Minimal API
        ├── Endpoints (Program.cs)
        ├── Application Services
        ├── Discord Integration
        ├── Session Management
        ├── Persistence (SQLite / EF Core)
        └── Configuration (Constantes)
        ↓
Discord Bot (REST + Gateway)
        ↓
Servidor Discord Oficial
```

## 📂 Estructura del Proyecto

```
/Api
 ├── Program.cs                     # Minimal API endpoints
 ├── Configuration/
 │    └── DiscordConfiguration.cs   # Constantes de Discord
 ├── Domain/
 │    ├── User.cs                   # Entidad de usuario web
 │    └── DiscordSession.cs         # Sesión de Discord OAuth
 ├── Application/
 │    ├── AuthService.cs            # Servicio de autenticación
 │    ├── SessionService.cs         # Gestión de sesiones
 │    └── DiscordService.cs         # Integración con Discord
 ├── Infrastructure/
 │    ├── DiscordClient.cs          # Cliente HTTP para Discord API
 │    ├── OAuthClient.cs            # Cliente OAuth2
 │    └── AppDbContext.cs           # Contexto de base de datos
 └── README.md                      # Este archivo
```

## 🔑 Configuración de Discord

Para usar esta API, necesitas configurar una aplicación de Discord y un bot.

### Paso 1: Crear Aplicación en Discord Developer Portal

1. Ve a https://discord.com/developers/applications
2. Haz clic en "New Application"
3. Dale un nombre (ej: "Yotsuba Hybrid Web")
4. Guarda el **Application ID** (CLIENT_ID)

### Paso 2: Crear Bot

1. En tu aplicación, ve a la sección "Bot"
2. Haz clic en "Add Bot"
3. Habilita "Message Content Intent" si planeas leer mensajes
4. Copia el **Token** del bot (BOT_TOKEN)

### Paso 3: Configurar OAuth2

1. Ve a la sección "OAuth2" → "General"
2. Añade una Redirect URI (ej: `http://localhost:4200/auth/callback`)
3. Guarda el **Client Secret** (CLIENT_SECRET)
4. En "OAuth2 URL Generator", selecciona los scopes:
   - `identify`
   - `guilds`

### Paso 4: Invitar el Bot al Servidor

1. Ve a "OAuth2" → "URL Generator"
2. Selecciona los scopes:
   - `bot`
3. Selecciona los permisos del bot:
   - `Read Messages/View Channels`
   - `Send Messages`
   - `Read Message History`
4. Copia la URL generada y ábrela en tu navegador
5. Selecciona tu servidor y autoriza el bot
6. Guarda el **Server ID** (GUILD_ID) - Click derecho en el servidor → Copiar ID

### Paso 5: Actualizar Constantes

Edita el archivo `Configuration/DiscordConfiguration.cs` con tus valores:

```csharp
public static class DiscordConfiguration
{
    public const string BOT_TOKEN = "YOUR_DISCORD_BOT_TOKEN_HERE";
    public const string CLIENT_ID = "YOUR_DISCORD_CLIENT_ID_HERE";
    public const string CLIENT_SECRET = "YOUR_DISCORD_CLIENT_SECRET_HERE";
    public const string GUILD_ID = "YOUR_DISCORD_GUILD_ID_HERE";
    public const string REDIRECT_URI = "http://localhost:4200/#/community/callback";
    
    public const string OAUTH_SCOPES = "identify guilds";
}
```

⚠️ **IMPORTANTE**: Nunca compartas estos valores ni los commits en un repositorio público.

## 🚀 Instalación y Ejecución

### Requisitos

- .NET 10 SDK
- SQLite

### Instalación

```bash
cd Api
dotnet restore
```

### Ejecutar en Desarrollo

```bash
dotnet run
```

La API estará disponible en `http://localhost:5000`

### Ejecutar con Watch Mode

```bash
dotnet watch run
```

## 📡 Endpoints

### Discord

- `GET /api/discord/channels` - Obtiene los canales del servidor Discord
- `GET /api/discord/channels/{channelId}/messages` - Obtiene mensajes de un canal
- `POST /api/discord/channels/{channelId}/messages` - Envía un mensaje (requiere autenticación)

### Autenticación

- `POST /api/auth/discord/login` - Inicia sesión con Discord OAuth2
  - Body: `{ "code": "oauth_code" }`
  - Retorna: `{ "sessionId": "guid" }`

### Usuario

- `GET /api/users/me` - Obtiene información del usuario autenticado (requiere header `X-Session-Id`)

## 🔐 Autenticación

La API usa un sistema de sesiones basado en Discord OAuth2:

1. El frontend redirige al usuario a Discord para autenticarse
2. Discord redirige de vuelta con un código
3. El frontend envía el código a `/api/auth/discord/login`
4. La API intercambia el código por tokens de Discord
5. La API crea/actualiza el usuario y genera una sesión
6. El frontend recibe un `sessionId` que debe incluir en el header `X-Session-Id` para requests autenticados

### Ciclo de Vida de Sesión

- **Creación**: Al hacer login con Discord
- **Validación**: Cada request verifica que la sesión sea válida y no esté revocada
- **Renovación**: Si el token OAuth2 expira, se renueva automáticamente con el refresh token
- **Revocación**: Un nuevo login invalida sesiones anteriores del mismo usuario
- **Expiración**: Las sesiones inactivas pueden ser limpiadas periódicamente

## 🔒 Cumplimiento con Discord ToS

Esta API cumple estrictamente con los Términos de Servicio de Discord:

- ✅ Todos los mensajes se envían como **Bot**, no como usuario
- ✅ Los mensajes incluyen indicación visual del usuario real (formato: "username (via Yotsuba Hybrid Web):")
- ✅ El Access Token OAuth2 se usa **solo para identificación**, no para enviar mensajes
- ✅ No se utilizan self-bots ni tokens de usuario para automatización
- ✅ No se crea un cliente alternativo de Discord

## 📊 Base de Datos

La API usa SQLite con Entity Framework Core. La base de datos se crea automáticamente al iniciar la aplicación.

### Migraciones

Para crear una nueva migración:

```bash
dotnet ef migrations add NombreDeMigracion
```

Para aplicar migraciones:

```bash
dotnet ef database update
```

## 🧪 Testing

```bash
dotnet test
```

## 🔧 Troubleshooting

### Error: "Unauthorized" al enviar mensajes

- Verifica que el bot tenga permisos de "Send Messages" en el canal
- Verifica que el BOT_TOKEN sea correcto
- Verifica que el bot esté en el servidor

### Error: "Failed to authenticate"

- Verifica que CLIENT_ID, CLIENT_SECRET y REDIRECT_URI sean correctos
- Verifica que la Redirect URI esté configurada en Discord Developer Portal
- Verifica que los scopes OAuth2 incluyan "identify" y "guilds"

### Error: "Failed to fetch channels"

- Verifica que el GUILD_ID sea correcto
- Verifica que el bot esté invitado al servidor
- Verifica que el bot tenga permisos de "View Channels"

## 📝 Notas Importantes

- Esta API es parte de la **web oficial de Yotsuba Hybrid**, no del engine en sí
- El engine Yotsuba Hybrid es independiente de esta funcionalidad web
- La funcionalidad Discord es exclusiva de la web, no del engine

## 📄 Licencia

MIT License - Ver el archivo LICENSE del proyecto principal.
