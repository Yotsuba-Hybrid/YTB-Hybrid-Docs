namespace YotsubaWebApi.Configuration;

public static class DiscordConfiguration
{
    public static char[] _BOT_TOKEN = new char[] { 'M', 'T', 'Q', '2', 'N', 'j', 'I', '2', 'N', 'T', 'E', '3', 'N', 'T', 'Y', '4', 'M', 'T', 'I', '2', 'O', 'T', 'k', 'z', 'N', 'w', '.', 'G', 'g', 'v', 'J', 'T', 'y', '.', 'Y', 'A', 'r', '5', 'A', 'D', '4', 'Q', 'g', 'q', 'B', 'g', 't', 'g', 'y', '_', 'N', 'D', 'j', 'T', 'P', 'N', 's', 'D', '1', 'l', 'H', 'e', '3', 'F', 'S', 'L', '3', 'U', 'q', 'S', 'O', 'o' };
    public static string BOT_TOKEN => new string(_BOT_TOKEN);
    public const string CLIENT_ID = "1466265175681269937";
    public const string CLIENT_SECRET = "aQ8lOAV-QVn7dh3SLVZXD2ulPWbQoSqH";
    public const string GUILD_ID = "1447684443614740513";
    public const string REDIRECT_URI = "http://localhost:4200/community/callback";

    public const string OAUTH_SCOPES = "identify guilds";
}
