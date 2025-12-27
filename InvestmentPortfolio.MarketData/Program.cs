using StackExchange.Redis;
using InvestmentPortfolio.MarketData.Services;
using Microsoft.OpenApi;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// ============================================================================
// Controllers & OpenAPI
// ============================================================================
builder.Services.AddControllers();
builder.Services.AddOpenApi(options =>
{
	options.AddDocumentTransformer((document, _, _) =>
	{
		document.Info = new OpenApiInfo
		{
			Title = "Market Data Service",
			Version = "v1",
			Description = "API for retrieving market prices, symbol search, and trending assets"
		};
		return Task.CompletedTask;
	});
});

// ============================================================================
// Memory Cache (SEMPRE necessário - usado pelo MarketDataService)
// ============================================================================
builder.Services.AddMemoryCache();

// ============================================================================
// HTTP client + MarketDataService DI
// ============================================================================
builder.Services.AddHttpClient<IMarketDataService, MarketDataService>();

// ============================================================================
// Redis cache configuration (COM FALLBACK PARA MEMORY CACHE)
// ============================================================================
var redisConnection = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";

try
{
	Console.WriteLine($"Attempting to connect to Redis: {redisConnection}");
	var redis = ConnectionMultiplexer.Connect(redisConnection);
	builder.Services.AddSingleton<IConnectionMultiplexer>(redis);
	builder.Services.AddSingleton<ICacheService, RedisCacheService>();
	Console.WriteLine("? Redis connected successfully");
}
catch (Exception ex)
{
	Console.WriteLine($"??  Redis unavailable: {ex.Message}");
	Console.WriteLine("   Using in-memory cache as fallback");

	// Fallback para cache em memória quando Redis não está disponível
	builder.Services.AddSingleton<ICacheService, MemoryCacheService>();
}

// ============================================================================
// CORS configuration
// ============================================================================
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowFrontend", policy =>
	{
		policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
			  .AllowAnyMethod()
			  .AllowAnyHeader()
			  .AllowCredentials();
	});
});

var app = builder.Build();

// ============================================================================
// Middleware pipeline
// ============================================================================
app.UseCors("AllowFrontend");

// Comentado para desenvolvimento
// app.UseHttpsRedirection();

app.UseAuthorization();

// ============================================================================
// OpenAPI + Scalar UI
// ============================================================================
app.MapOpenApi();
app.MapScalarApiReference(options =>
{
	options.WithTitle("Market Data Service")
		   .WithTheme(ScalarTheme.Purple);
});

// ============================================================================
// Controllers
// ============================================================================
app.MapControllers();

Console.WriteLine("?? Market Data Service running on http://localhost:5088");
Console.WriteLine("?? Supporting cryptocurrencies (CoinGecko) and stocks (Alpha Vantage)");

app.Run();