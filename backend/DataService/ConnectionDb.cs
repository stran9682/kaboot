using System.Collections.Concurrent;
using backend.Models;

namespace backend.DataService;

public class ConnectionDb
{
    // Key: String Lobby Pin, Value: Lobby object 
    private readonly ConcurrentDictionary<string, Lobby> _lobbyData = new();
    public ConcurrentDictionary<string, Lobby> LobbyData => _lobbyData;
    
    // Key: String ConnectionID, Value: String Lobby Pin
    private readonly ConcurrentDictionary<string, string> _connectionData = new();
    public ConcurrentDictionary<string, string> ConnectionData => _connectionData;
}