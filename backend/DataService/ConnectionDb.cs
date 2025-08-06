using System.Collections.Concurrent;
using backend.Models;

namespace backend.DataService;

public class ConnectionDb
{
    // Key : Player ConnectionID, Value : UserConnection object
    private readonly ConcurrentDictionary<string, UserConnection> _connections = new();
    public ConcurrentDictionary<string, UserConnection> Connections => _connections;

    // Key: Lobby Pin, Value: Lobby object 
    private readonly ConcurrentDictionary<string, Lobby> _lobbyData = new();
    public ConcurrentDictionary<string, Lobby> LobbyData => _lobbyData;
}