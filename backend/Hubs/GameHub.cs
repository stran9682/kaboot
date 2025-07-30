using backend.DataService;
using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public class GameHub : Hub
{
    private readonly SharedDb _sharedDb;
    
    public GameHub(SharedDb sharedDb) => _sharedDb = sharedDb;
    
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
    
    // TODO : find a way to create a lobby
    public async Task CreateLobby()
    {
        // TODO : create game in mongoDb
        
        // TODO : add the "admin" to game
        await Groups.AddToGroupAsync(Context.ConnectionId, "some pin");
        
        // TODO : display the code
        await Clients.User(Context.UserIdentifier)
            .SendAsync("ReceiveGameCode", "the code");
    }
    
}