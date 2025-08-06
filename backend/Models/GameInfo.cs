namespace backend.Models;

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;
public class GameInfo
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;
    
    public int PinCode { get; set; }
    
    public List<UserConnection> UserConnections { get; set; } = new List<UserConnection>();
}