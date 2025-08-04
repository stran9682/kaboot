using backend.DataService;
using backend.Models;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;

namespace backend.Hubs;

public class GameHub : Hub
{
    private readonly SharedDb _sharedDb;
    private readonly MongoDbService _mongoDbService;

    public GameHub(SharedDb sharedDb, MongoDbService  mongoDb)
    {
        _sharedDb = sharedDb;
        _mongoDbService =  mongoDb;
    }

    public async Task JoinLobbyTest(UserConnection connection)
    {
        await Clients.All.
            SendAsync("JoinLobby", "admin", $"{connection.Username} joined the lobby");
    }

    public async Task JoinLobby(UserConnection connection)
    {
        // TODO : Check if connection.Lobby is valid before adding user
        if (false)
        {
            // send message to Context.connectionId,
        }
        
        await Groups.AddToGroupAsync(Context.ConnectionId, connection.Lobby);
        
        // TODO : add UserConnection to ConnectionId hashmap 
        // Key: string Context.ConnectionId , Value: UserConnection Connection
        
        // TODO : then add UserConnection to Groups hashmap
        // Key: string Group , Value : UserConnection Connection (same Connection)
        
        // TODO : send update to admin to update players list
        // Get admin connection from mongoDb , then use Clients.User(adminID)
        
        await Clients.Group(connection.Lobby).
            SendAsync("JoinLobby", "admin", $"{connection.Username} joined the {connection.Lobby}");
    }
    
    public async Task CreateLobby()
    {
        Random random = new Random();
        const int maxRetries = 5;
        var attempt = 0;

        while (attempt < maxRetries)
        {
            try
            {
                int pin = random.Next(1, 99999);
                
                GameInfo lobby = new GameInfo()
                {
                    AdminConnection = Context.ConnectionId,
                    PinCode = pin
                };

                await _mongoDbService.CreateAsync(lobby);

                await Clients.Caller
                    .SendAsync("CreateLobby", pin.ToString());
                
                return;
            }
            catch (Exception ex)
            {
                attempt++;
            }
        }
        
        throw new Exception("Failed to create lobby");
    }
}