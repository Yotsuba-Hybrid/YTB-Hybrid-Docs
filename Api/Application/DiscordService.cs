using System.Text.Json;
using YotsubaWebApi.Infrastructure;

namespace YotsubaWebApi.Application;

public class DiscordService
{
    private readonly DiscordClient _discordClient;

    public DiscordService(DiscordClient discordClient)
    {
        _discordClient = discordClient;
    }

    public async Task<JsonDocument?> GetChannelsAsync()
    {
        return await _discordClient.GetGuildChannelsAsync();
    }

    public async Task<JsonDocument?> GetChannelMessagesAsync(string channelId, int limit = 50)
    {
        return await _discordClient.GetChannelMessagesAsync(channelId, limit);
    }

    public async Task<JsonDocument?> SendMessageAsync(string channelId, string content, string username)
    {
        return await _discordClient.SendMessageAsync(channelId, content, username);
    }
}
