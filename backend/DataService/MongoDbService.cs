namespace backend.DataService;

using backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

public class MongoDbService
{
    private readonly IMongoCollection<GameInfo> _gameInfo;

    public MongoDbService(IOptions<MongoDbSettings> options)
    {
        // Connection to MongoDb
        MongoClient client = new MongoClient(options.Value.ConnectionUri);
        IMongoDatabase database = client.GetDatabase(options.Value.DatabaseName);
        _gameInfo = database.GetCollection<GameInfo>(options.Value.CollectionName);
    }
}