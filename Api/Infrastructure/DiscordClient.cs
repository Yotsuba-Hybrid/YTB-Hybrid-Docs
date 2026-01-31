using System.Text;
using System.Text.Json;
using YotsubaWebApi.Configuration;

namespace YotsubaWebApi.Infrastructure;

public class DiscordClient
{
    private readonly HttpClient _httpClient;
    private readonly string _botToken;

    public DiscordClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _botToken = DiscordConfiguration.BOT_TOKEN;
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bot {_botToken}");
        _httpClient.BaseAddress = new Uri("https://discord.com/api/v10/");
    }

    public async Task<JsonDocument?> GetGuildChannelsAsync()
    {
        
            var guildId = DiscordConfiguration.GUILD_ID;
            var response = await _httpClient.GetAsync($"guilds/{guildId}/channels");
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonDocument.Parse(content);
    }

    public async Task<JsonDocument?> GetChannelMessagesAsync(string channelId, int limit = 50)
    {
        try
        {
            var response = await _httpClient.GetAsync($"channels/{channelId}/messages?limit={limit}");
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonDocument.Parse(content);
        }
        catch (Exception)
        {
            return null;
        }
    }

    public async Task<JsonDocument?> SendMessageAsync(string channelId, string content, string username)
    {
        try
        {
            var messageContent = $"**{username}** (via Yotsuba Hybrid Web):\n{content}";
            var payload = new
            {
                content = messageContent
            };

            var response = await _httpClient.PostAsJsonAsync($"channels/{channelId}/messages", payload);
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonDocument.Parse(responseContent);
        }
        catch (Exception)
        {
            return null;
        }
    }
}
