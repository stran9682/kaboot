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

    public async Task JoinLobby(string lobbyName, UserConnection connection)
    {
        // TODO : Check if connection.Lobby is valid before adding user
        if (!_connectionDb.LobbyData.ContainsKey(lobbyName))
        {
            return;
        }
        
        await Groups.AddToGroupAsync(Context.ConnectionId, lobbyName);
        
        // TODO : add UserConnection to ConnectionId hashmap 
        // Key: string Context.ConnectionId , Value: UserConnection Connection
        
        
        // TODO : then add UserConnection to Groups hashmap
        // Key: string Group , Value : UserConnection Connection (same Connection)
        
        // TODO : send update to admin to update players list
        // Get admin connection from mongoDb , then use Clients.User(adminID)
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

    public async Task DisconnectUser(string pin)
    {
        _connectionDb.LobbyData.TryGetValue(pin, out var lobby);
        
        
        
        
    }
}