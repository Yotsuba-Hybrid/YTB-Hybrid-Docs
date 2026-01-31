using Microsoft.EntityFrameworkCore;
using YotsubaWebApi.Domain;
using YotsubaWebApi.Infrastructure;

namespace YotsubaWebApi.Application;

public class SessionService
{
    private readonly AppDbContext _dbContext;
    private readonly OAuthClient _oauthClient;

    public SessionService(AppDbContext dbContext, OAuthClient oauthClient)
    {
        _dbContext = dbContext;
        _oauthClient = oauthClient;
    }

    public async Task<DiscordSession?> ValidateSessionAsync(Guid sessionId)
    {
        var session = await _dbContext.DiscordSessions
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null || session.IsRevoked)
            return null;

        // Update last used
        session.LastUsedAt = DateTime.UtcNow;

        // Check if token needs refresh
        if (DateTime.UtcNow >= session.TokenExpiresAt)
        {
            var refreshed = await RefreshSessionTokenAsync(session);
            if (!refreshed) return null;
        }

        await _dbContext.SaveChangesAsync();
        return session;
    }

    private async Task<bool> RefreshSessionTokenAsync(DiscordSession session)
    {
        var tokenResponse = await _oauthClient.RefreshTokenAsync(session.RefreshToken);
        if (tokenResponse == null) return false;

        var root = tokenResponse.RootElement;
        var accessToken = root.GetProperty("access_token").GetString();
        var refreshToken = root.GetProperty("refresh_token").GetString();
        var expiresIn = root.GetProperty("expires_in").GetInt32();

        if (accessToken == null || refreshToken == null) return false;

        session.AccessToken = accessToken;
        session.RefreshToken = refreshToken;
        session.TokenExpiresAt = DateTime.UtcNow.AddSeconds(expiresIn);

        return true;
    }

    public async Task RevokeSessionAsync(Guid sessionId)
    {
        var session = await _dbContext.DiscordSessions.FindAsync(sessionId);
        if (session != null)
        {
            session.IsRevoked = true;
            await _dbContext.SaveChangesAsync();
        }
    }
}
