using System.Collections.Concurrent;

namespace backend.Models;

public class Lobby
{
    public string Pin {get; set;} = string.Empty;
    public string AdminConnectionId { get; set; } = string.Empty;
    public ConcurrentBag<UserConnection> Players { get; set; } = new();
}