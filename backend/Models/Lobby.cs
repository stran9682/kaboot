namespace backend.Models;

public class Lobby
{
    public string AdminConnectionId { get; set; } = string.Empty;
    
    public Dictionary<string, UserInfo> Users { get; set; } = new ();
}