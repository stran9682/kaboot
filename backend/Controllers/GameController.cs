namespace backend.Controllers;

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
    
    [HttpPost("/convert")]
    public async Task<IActionResult> ConvertJson(IFormFile file)
    {
        string extension = Path.GetExtension(file.FileName);
        if (!extension.Equals(".json"))
        {
            return BadRequest();
        }
        
        var filePath = Path.GetTempFileName();
        
        try
        {
            await using (FileStream fs = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fs);
            }
            
            using var reader = new StreamReader(filePath);

            string result = await reader.ReadToEndAsync();

            return Ok(result);
        }
        finally
        {
            System.IO.File.Delete(filePath);
        }
    }
}
