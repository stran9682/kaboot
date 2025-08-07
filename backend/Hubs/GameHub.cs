using System.Collections.Concurrent;
using backend.DataService;
using backend.Models;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;

namespace backend.Hubs;

public class GameHub : Hub
{
    private readonly ConnectionDb _connectionDb;
    private readonly MongoDbService _mongoDbService;

    public GameHub(ConnectionDb connectionDb, MongoDbService  mongoDb)
    {
        _connectionDb = connectionDb;
        _mongoDbService =  mongoDb;
    }

    public async Task JoinLobbyTest(UserConnection connection)
    {
        await Clients.All.
            SendAsync("JoinLobby", "admin", $"{connection.Username} joined the lobby");
    }

    public async Task JoinLobby(string pin, string username)
    {
        _connectionDb.LobbyData.TryGetValue(pin, out var lobbyData);

        if (lobbyData == null) return; // game does not exist

        UserConnection userConnection = new UserConnection()
        {
            Username = username
        };

        if (lobbyData.Players.TryAdd(Context.ConnectionId, userConnection))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, pin);

            await Clients.Client(lobbyData.AdminConnectionId).SendAsync("Players", lobbyData.Players.Values.ToList());
        }
    }
    
    public async Task CreateLobby()
    {
        int pin;
        
        do
        {
            Random random = new Random();
        
            pin = random.Next(1, 99999);
        }
        while (_connectionDb.LobbyData.ContainsKey(pin.ToString()));

        Lobby lobby = new()
        {
            AdminConnectionId = Context.ConnectionId,
            Pin = pin.ToString()
        };
        
        _connectionDb.LobbyData.TryAdd(pin.ToString(), lobby);
        
        await Clients.Caller
            .SendAsync("CreateLobby", pin.ToString());
    }
}