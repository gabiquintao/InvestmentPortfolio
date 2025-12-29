using InvestmentPortfolio.MarketData.Services;
using Microsoft.OpenApi;
using Scalar.AspNetCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// ============================================================================
// Controllers & Swagger
// ============================================================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	options.SwaggerDoc("v1", new OpenApiInfo
	{
		Title = "Market Data Service",
		Version = "v1",
		Description = "API for retrieving market prices, symbol search, and trending assets"
	});
});

// ============================================================================
// Cache & Services
// ============================================================================
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient<IMarketDataService, MarketDataService>();

// Redis with fallback to MemoryCache
var redisConnection = builder.Configuration.GetConnectionString("Redis");
if (!string.IsNullOrWhiteSpace(redisConnection))
{
	try
	{
		var redis = ConnectionMultiplexer.Connect(redisConnection);
		builder.Services.AddSingleton<IConnectionMultiplexer>(redis);
		builder.Services.AddSingleton<ICacheService, RedisCacheService>();
	}
	catch
	{
		builder.Services.AddSingleton<ICacheService, MemoryCacheService>();
	}
}
else
{
	builder.Services.AddSingleton<ICacheService, MemoryCacheService>();
}

// ============================================================================
// CORS - CORRIGIDO (sem AllowCredentials)
// ============================================================================
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowFrontend", policy =>
	{
		policy.WithOrigins(
			"http://localhost:3000",
			"http://localhost:5173",
			"https://investmentportfolio-api.azurewebsites.net",
			"https://gabiquintao.github.io"
		)
		.AllowAnyMethod()
		.AllowAnyHeader();
		// ?? REMOVIDO: .AllowCredentials()
	});
});

// ============================================================================
// Logging
// ============================================================================
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// ============================================================================
// Middleware - ORDEM CORRETA
// ============================================================================
app.UseCors("AllowFrontend"); // ?? CORS PRIMEIRO

// Swagger (sempre disponível)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
	c.SwaggerEndpoint("/swagger/v1/swagger.json", "Market Data API v1");
});

app.MapScalarApiReference(options =>
{
	options.WithTitle("Market Data Service")
		   .WithTheme(ScalarTheme.Purple);
});

// ============================================================================
// Controllers
// ============================================================================
app.MapControllers();

// Health check endpoint
app.MapGet("/", () => "Market Data Service is running!");

// ============================================================================
// Startup Log
// ============================================================================
app.Lifetime.ApplicationStarted.Register(() =>
{
	var logger = app.Services.GetRequiredService<ILogger<Program>>();
	logger.LogInformation("=== Market Data Service Started ===");

	if (app.Environment.IsDevelopment())
	{
		logger.LogInformation("Local: https://localhost:5088");
		logger.LogInformation("Swagger: https://localhost:5088/swagger");
		logger.LogInformation("Scalar: https://localhost:5088/scalar/v1");
	}
	else
	{
		logger.LogInformation("Azure: https://investmentportfolio-marketdata.azurewebsites.net");
		logger.LogInformation("Swagger: https://investmentportfolio-marketdata.azurewebsites.net/swagger");
	}
});

app.Run();