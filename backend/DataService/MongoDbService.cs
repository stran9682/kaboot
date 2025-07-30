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
        MongoClient client = new MongoClient(options.Value.ConnectionUri);
        IMongoDatabase database = client.GetDatabase(options.Value.DatabaseName);
        _gameInfo = database.GetCollection<GameInfo>(options.Value.CollectionName);
    }

    public async Task CreateAsync(GameInfo gameInfo)
    {
        await _gameInfo.InsertOneAsync(gameInfo);
    }

    public async Task<List<GameInfo>> GetAllAsync()
    {
        return await _gameInfo.Find(new BsonDocument()).ToListAsync();
    }

    public async Task AddToGameInfo(string id, UserConnection userConnection)
    {
        FilterDefinition<GameInfo> filter = Builders<GameInfo>.Filter.Eq("Id", id);
        UpdateDefinition<GameInfo> update = Builders<GameInfo>.Update.AddToSet<UserConnection>("UserConnections", userConnection);
        await _gameInfo.UpdateOneAsync(filter, update);
    }

    public async Task DeleteGameInfo(string id)
    {
        FilterDefinition<GameInfo> filter = Builders<GameInfo>.Filter.Eq("Id", id);
        await _gameInfo.DeleteOneAsync(filter);
    }
}