using backend.DataService;
using backend.Hubs;
using backend.Models;
using Microsoft.AspNetCore.SignalR.StackExchangeRedis;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

/*
 * MongoDB
 */
// builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDB"));
// builder.Services.AddSingleton<MongoDbService>();

/*
 * SignalR + Redis
 */
builder.Services.AddSignalR()
    .AddStackExchangeRedis(builder.Configuration.GetConnectionString("Redis"));

builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("Redis")));

builder.Services.AddSingleton<RedisService>();

/*
 * Swagger
 */
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

/*
 * Cors
 */
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("frontend", builder =>
    {
        builder.WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<GameHub>("/game");

app.UseCors("frontend");

app.Run();