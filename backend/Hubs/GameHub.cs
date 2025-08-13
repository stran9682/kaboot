using backend.DataService;
using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public class GameHub : Hub
{
    private readonly RedisService _redis;
    
    public GameHub(RedisService redis)
    {
        _redis = redis;
    }

    public async Task JoinLobbyTest(UserInfo connection)
    {
        await Clients.All.
            SendAsync("JoinLobby", "admin", $"{connection.Username} joined the lobby");
    }

    public async Task JoinLobby(string pin, string username)
    {
        await Reset(Context.ConnectionId);
        
        string? adminId = await _redis.GetAdmin(pin);
        
        if (! await _redis.LobbyExists(pin) || adminId is null) 
            return; // game does not exist

        UserInfo userInfo = new UserInfo()
        {
            Username = username
        };
        
        await _redis.CreateUser(Context.ConnectionId, pin);
        
        await _redis.AddToLobby(userInfo, pin, Context.ConnectionId);
        
        await Groups.AddToGroupAsync(Context.ConnectionId, pin);
        
        Lobby? updatedLobby = await _redis.GetLobby(pin);
        
        if (updatedLobby is null) return; // this should honestly never run

        await Clients.Client(adminId).SendAsync("Players", updatedLobby.Users.Values.ToList());
            
        await Clients.Caller.SendAsync("ConfirmJoin");
    }
    
    public async Task CreateLobby()
    {
        int pin;
        Random random = new Random();

        do
        {
            pin = random.Next(1, 100000);
        }
        while (await _redis.LobbyExists(pin.ToString()));
        
        Lobby lobby = new Lobby()
        {
            AdminConnectionId = Context.ConnectionId
        };
        
        await Reset(Context.ConnectionId);
        
        await _redis.CreateLobby(lobby, pin.ToString());
        
        await _redis.CreateUser(Context.ConnectionId, pin.ToString());
        
        await Clients.Caller.SendAsync("CreateLobby", pin.ToString());
    }

    public async Task StartGame()
    {
        string? pin = await _redis.GetPin(Context.ConnectionId);
        
        // Person other than admin is invoking, not allowed
        if (pin is null || await _redis.GetAdmin(pin) != Context.ConnectionId) return;
        
        await Clients.Group(pin).SendAsync("StartGame");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Reset(Context.ConnectionId);
    }

    private async Task Reset(string connectionId)
    {
        string? oldPin = await _redis.RemoveUser(connectionId);
        
        if (oldPin is null) return;
        
        await Groups.RemoveFromGroupAsync(connectionId, oldPin);
        
        Lobby? lobby = await _redis.GetLobby(oldPin);

        if (lobby is not null && connectionId == lobby.AdminConnectionId)
        {
            List<string>? connectionIds = await _redis.RemoveLobby(oldPin);
            await HandleLobbyCleanup(connectionIds); 
        }
        else if (lobby is not null)
        {
            await Clients.Client(lobby.AdminConnectionId).SendAsync("Players", lobby.Users.Values.ToList());
        }
    }

    private async Task HandleLobbyCleanup(List<string>? connectionIds)
    {
        if (connectionIds is null || connectionIds.Count == 0) return;

        foreach (var connectionId in connectionIds)
        {
            string? oldPin = await _redis.RemoveUser(connectionId);

            if (oldPin is not null)
            {
                await Groups.RemoveFromGroupAsync(connectionId, oldPin);
                
                await Clients.Client(connectionId).SendAsync("EndSession");
            }
        }
    }
}