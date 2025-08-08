using System.Collections.Concurrent;

namespace backend.Models;

public class Lobby
{
    public string AdminConnectionId { get; set; } = string.Empty;
    
    // Key : ConnectionId, Value : UserConnection object
    public ConcurrentDictionary<string, UserConnection> Players { get; set; } = new();
}