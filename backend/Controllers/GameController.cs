namespace backend.Controllers;

using System;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.DataService;

[Controller]
[Route("api/[controller]")]
public class GameController : Controller
{
    private readonly MongoDbService _mongoDbService;

    public GameController(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    [HttpGet]
    public async Task<List<GameInfo>> Get()
    {
        return await _mongoDbService.GetAllAsync();
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] GameInfo gameInfo)
    {
        await _mongoDbService.CreateAsync(gameInfo);
        return CreatedAtAction(nameof(Get), new { id = gameInfo.Id }, gameInfo);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(string id, [FromBody] UserConnection userConnection)
    {
        await _mongoDbService.AddToGameInfo(id, userConnection);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        await _mongoDbService.DeleteGameInfo(id);
        return Ok();
    }
}