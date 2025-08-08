using System.Collections.Concurrent;
using backend.Models;

namespace backend.DataService;

public class ConnectionDb
{
    // Key: Lobby Pin, Value: Lobby object 
    private readonly ConcurrentDictionary<string, Lobby> _lobbyData = new();
    public ConcurrentDictionary<string, Lobby> LobbyData => _lobbyData;
    
    // Key: ConnectionID, Value: Lobby Pin
    private readonly ConcurrentDictionary<string, string> _connectionData = new();
    public ConcurrentDictionary<string, string> ConnectionData => _connectionData;
}