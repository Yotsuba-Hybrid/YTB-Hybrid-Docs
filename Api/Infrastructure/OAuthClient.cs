using System.Text.Json;
using YotsubaWebApi.Configuration;

namespace YotsubaWebApi.Infrastructure;

public class OAuthClient
{
    private readonly HttpClient _httpClient;

    public OAuthClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://discord.com/api/v10/");
    }

    public async Task<JsonDocument?> ExchangeCodeAsync(string code)
    {
        try
        {
            var payload = new Dictionary<string, string>
            {
                { "client_id", DiscordConfiguration.CLIENT_ID },
                { "client_secret", DiscordConfiguration.CLIENT_SECRET },
                { "grant_type", "authorization_code" },
                { "code", code },
                { "redirect_uri", DiscordConfiguration.REDIRECT_URI }
            };

            var response = await _httpClient.PostAsync("oauth2/token", new FormUrlEncodedContent(payload));
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonDocument.Parse(content);
        }
        catch (Exception)
        {
            return null;
        }
    }

    public async Task<JsonDocument?> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            var payload = new Dictionary<string, string>
            {
                { "client_id", DiscordConfiguration.CLIENT_ID },
                { "client_secret", DiscordConfiguration.CLIENT_SECRET },
                { "grant_type", "refresh_token" },
                { "refresh_token", refreshToken }
            };

            var response = await _httpClient.PostAsync("oauth2/token", new FormUrlEncodedContent(payload));
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonDocument.Parse(content);
        }
        catch (Exception)
        {
            return null;
        }
    }

    public async Task<JsonDocument?> GetUserInfoAsync(string accessToken)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "users/@me");
            request.Headers.Add("Authorization", $"Bearer {accessToken}");
            
            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonDocument.Parse(content);
        }
        catch (Exception)
        {
            return null;
        }
    }
}
