namespace backend.Models;

public class UserInfo
{
    public string Username { get; set; } = string.Empty;
    public int Score { get; set; } = 0;
    public string ConnectionId { get; set; } = string.Empty;
}