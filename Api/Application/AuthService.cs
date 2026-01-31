using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using YotsubaWebApi.Domain;
using YotsubaWebApi.Infrastructure;

namespace YotsubaWebApi.Application;

public class AuthService
{
    private readonly AppDbContext _dbContext;
    private readonly OAuthClient _oauthClient;

    public AuthService(AppDbContext dbContext, OAuthClient oauthClient)
    {
        _dbContext = dbContext;
        _oauthClient = oauthClient;
    }

    public async Task<Guid?> LoginWithDiscordAsync(string code)
    {
        // Exchange code for tokens
        var tokenResponse = await _oauthClient.ExchangeCodeAsync(code);
        if (tokenResponse == null) return null;

        var root = tokenResponse.RootElement;
        var accessToken = root.GetProperty("access_token").GetString();
        var refreshToken = root.GetProperty("refresh_token").GetString();
        var expiresIn = root.GetProperty("expires_in").GetInt32();

        if (accessToken == null || refreshToken == null) return null;

        // Get user info
        var userInfo = await _oauthClient.GetUserInfoAsync(accessToken);
        if (userInfo == null) return null;

        var userRoot = userInfo.RootElement;
        var discordUserId = userRoot.GetProperty("id").GetString();
        var username = userRoot.GetProperty("username").GetString();
        var avatar = userRoot.TryGetProperty("avatar", out var avatarProp) ? avatarProp.GetString() : "";

        if (discordUserId == null || username == null) return null;

        // Find or create user
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.DiscordUserId == discordUserId);
        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                DiscordUserId = discordUserId,
                Username = username,
                Avatar = avatar ?? "",
                LinkedAt = DateTime.UtcNow,
                AccountStatus = "Active"
            };
            _dbContext.Users.Add(user);
        }
        else
        {
            // Update user info
            user.Username = username;
            user.Avatar = avatar ?? "";
        }

        // Invalidate previous sessions
        var oldSessions = await _dbContext.DiscordSessions
            .Where(s => s.UserId == user.Id && !s.IsRevoked)
            .ToListAsync();
        
        foreach (var session in oldSessions)
        {
            session.IsRevoked = true;
        }

        // Create new session
        var newSession = new DiscordSession
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            DiscordUserId = discordUserId,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            TokenExpiresAt = DateTime.UtcNow.AddSeconds(expiresIn),
            CreatedAt = DateTime.UtcNow,
            LastUsedAt = DateTime.UtcNow,
            IsRevoked = false
        };

        _dbContext.DiscordSessions.Add(newSession);
        await _dbContext.SaveChangesAsync();

        return newSession.Id;
    }
}
