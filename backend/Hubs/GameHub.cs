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
        await Groups.AddToGroupAsync(Context.ConnectionId, connection.Lobby);
        await Clients.Group(connection.Lobby).
            SendAsync("JoinLobby", "admin", $"{connection.Username} joined the {connection.Lobby}");
    }
}