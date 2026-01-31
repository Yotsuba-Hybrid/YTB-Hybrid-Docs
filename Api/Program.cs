using Microsoft.EntityFrameworkCore;
using YotsubaWebApi.Application;
using YotsubaWebApi.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWebsite", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://myengine-official.github.io")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=yotsuba.db"));

// Add HttpClients
builder.Services.AddHttpClient<DiscordClient>();
builder.Services.AddHttpClient<OAuthClient>();

// Add Services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<SessionService>();
builder.Services.AddScoped<DiscordService>();

var app = builder.Build();

// Apply migrations
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseCors("AllowWebsite");

// Root endpoint
app.MapGet("/", () => "Yotsuba Hybrid Web API");

// Discord endpoints
app.MapGet("/api/discord/channels", async (DiscordService discordService) =>
{
    var channels = await discordService.GetChannelsAsync();
    return channels != null ? Results.Ok(channels) : Results.Problem("Failed to fetch channels");
});

app.MapGet("/api/discord/channels/{channelId}/messages", async (string channelId, DiscordService discordService, int? limit) =>
{
    var messages = await discordService.GetChannelMessagesAsync(channelId, limit ?? 50);
    return messages != null ? Results.Ok(messages) : Results.Problem("Failed to fetch messages");
});

app.MapPost("/api/discord/channels/{channelId}/messages", async (
    string channelId,
    MessageRequest request,
    HttpContext httpContext,
    DiscordService discordService,
    SessionService sessionService) =>
{
    // Get session ID from header
    if (!httpContext.Request.Headers.TryGetValue("X-Session-Id", out var sessionIdHeader))
        return Results.Unauthorized();

    if (!Guid.TryParse(sessionIdHeader, out var sessionId))
        return Results.Unauthorized();

    // Validate message content
    if (string.IsNullOrWhiteSpace(request.Content))
        return Results.BadRequest(new { error = "Message content cannot be empty" });

    if (request.Content.Length > 2000)
        return Results.BadRequest(new { error = "Message content cannot exceed 2000 characters" });

    // Validate session
    var session = await sessionService.ValidateSessionAsync(sessionId);
    if (session == null || session.User == null)
        return Results.Unauthorized();

    // Send message
    var result = await discordService.SendMessageAsync(channelId, request.Content, session.User.Username);
    return result != null ? Results.Ok(result) : Results.Problem("Failed to send message");
});

// Auth endpoints
app.MapPost("/api/auth/discord/login", async (LoginRequest request, AuthService authService) =>
{
    if (string.IsNullOrWhiteSpace(request.Code))
        return Results.BadRequest(new { error = "Authorization code is required" });

    var sessionId = await authService.LoginWithDiscordAsync(request.Code);
    return sessionId.HasValue 
        ? Results.Ok(new { sessionId }) 
        : Results.Problem("Failed to authenticate");
});

// User endpoints
app.MapGet("/api/users/me", async (HttpContext httpContext, SessionService sessionService) =>
{
    // Get session ID from header
    if (!httpContext.Request.Headers.TryGetValue("X-Session-Id", out var sessionIdHeader))
        return Results.Unauthorized();

    if (!Guid.TryParse(sessionIdHeader, out var sessionId))
        return Results.Unauthorized();

    // Validate session
    var session = await sessionService.ValidateSessionAsync(sessionId);
    if (session == null || session.User == null)
        return Results.Unauthorized();

    return Results.Ok(new
    {
        id = session.User.Id,
        discordUserId = session.User.DiscordUserId,
        username = session.User.Username,
        avatar = session.User.Avatar,
        linkedAt = session.User.LinkedAt,
        accountStatus = session.User.AccountStatus
    });
});

app.Run();

// Request DTOs
record LoginRequest(string Code);
record MessageRequest(string Content);
