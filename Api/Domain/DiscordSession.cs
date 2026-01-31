namespace YotsubaWebApi.Domain;

public class DiscordSession
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string DiscordUserId { get; set; } = string.Empty;

    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;

    public DateTime TokenExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastUsedAt { get; set; }

    public bool IsRevoked { get; set; }

    // Navigation property
    public User? User { get; set; }
}
