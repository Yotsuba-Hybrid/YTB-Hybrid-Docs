namespace YotsubaWebApi.Domain;

public class User
{
    public Guid Id { get; set; }
    public string DiscordUserId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public DateTime LinkedAt { get; set; }
    public string AccountStatus { get; set; } = "Active";
}
