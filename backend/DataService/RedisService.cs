using backend.Models;
using StackExchange.Redis;
using NRedisStack.RedisStackCommands;

namespace backend.DataService;

public class RedisService
{
    private readonly IDatabase _db;
    
    public RedisService(IConnectionMultiplexer redis)
    {
        _db = redis.GetDatabase();
    }

    public async Task AddToLobby(UserInfo user, string pin, string connectionId)
    {
        await _db.JSON().SetAsync($"lobby:{pin}", $"$.Users.{connectionId}", user);
    }

    public async Task AddToScore(int score, string pin, string connectionId)
    {
        await _db.JSON().NumIncrbyAsync($"lobby:{pin}", $"$.Users.{connectionId}.Score", score);
    }

    public async Task CreateLobby(Lobby lobby, string pin)
    {
        await _db.JSON().SetAsync($"lobby:{pin}", "$", lobby);
    }
    
    public async Task CreateUser(string connectionId, string pin)
    {
        await _db.StringSetAsync($"player:{connectionId}", pin);
    }
    
    public async Task<Lobby?> GetLobby(string pin)
    {
        var lobby = await _db.JSON().GetAsync<Lobby>($"lobby:{pin}");
        
        return lobby;
    }
    
    public async Task<string?> GetAdmin(string pin)
    {
        return await _db.JSON().GetAsync<string>($"lobby:{pin}", "$.AdminConnectionId");
    }
    
    public async Task<string?> GetPin(string connectionId)
    {
        return await _db.StringGetAsync($"player:{connectionId}");
    }
    
    public async Task<bool> LobbyExists(string pin)
    {
        return await _db.KeyExistsAsync($"lobby:{pin}");
    }
    
    public async Task<List<string>?> RemoveLobby(string pin)
    {
        var userConnections = await _db.JSON().GetAsync<Dictionary<string, UserInfo>>($"lobby:{pin}", "$.Users");
        
        if (userConnections is null) return null;
        
        await _db.KeyDeleteAsync($"lobby:{pin}");
        
        return userConnections.Keys.ToList();
    }

    public async Task<string?> RemoveUser(string connectionId)
    {
        string? pin = await _db.StringGetAsync($"player:{connectionId}");
        
        await _db.KeyDeleteAsync(connectionId);
        
        await _db.JSON().DelAsync($"lobby:{pin}", $"$.Users.{connectionId}");
        
        return pin;
    }
    
}