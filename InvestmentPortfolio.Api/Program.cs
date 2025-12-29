using FluentValidation;
using InvestmentPortfolio.Api.WcfClients;
using InvestmentPortfolio.Application.Validators.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuration
var jwtSecretKey = builder.Configuration["Jwt:SecretKey"]
	?? throw new InvalidOperationException("JWT SecretKey not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "InvestmentPortfolio";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "InvestmentPortfolio";
var marketDataServiceUrl = builder.Configuration["Services:MarketDataUrl"] ?? "http://localhost:5088";

// Services
builder.Services.AddControllers();

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();

// WCF Clients
builder.Services.AddScoped<AlertWcfClient>();
builder.Services.AddScoped<AuthWcfClient>();
builder.Services.AddScoped<PortfolioWcfClient>();
builder.Services.AddScoped<AssetWcfClient>();
builder.Services.AddScoped<TransactionWcfClient>();

// HTTP Clients
builder.Services.AddHttpClient("MarketDataService", client =>
{
	client.BaseAddress = new Uri(marketDataServiceUrl);
	client.Timeout = TimeSpan.FromSeconds(30);
});

// JWT Authentication
builder.Services
	.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			ValidIssuer = jwtIssuer,
			ValidAudience = jwtAudience,
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecretKey)),
			ClockSkew = TimeSpan.Zero
		};
	});

builder.Services.AddAuthorization();

// CORS - CORRIGIDO
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll", policy =>
	{
		policy.WithOrigins(
			"http://localhost:3000",
			"http://localhost:5173",
			"https://gabiquintao.github.io"
		)
		.AllowAnyMethod()
		.AllowAnyHeader();
		// ?? REMOVE AllowCredentials se não estás a usar cookies
	});
});

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	options.SwaggerDoc("v1", new OpenApiInfo
	{
		Title = "Investment Portfolio API",
		Version = "v1",
		Description = "REST API for Investment Portfolio Management System"
	});

	options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
	{
		Type = SecuritySchemeType.Http,
		Scheme = "bearer",
		BearerFormat = "JWT",
		Description = "JWT Authorization header using the Bearer scheme."
	});

	options.AddSecurityRequirement(new OpenApiSecurityRequirement
	{
		{
			new OpenApiSecurityScheme
			{
				Reference = new OpenApiReference
				{
					Type = ReferenceType.SecurityScheme,
					Id = "Bearer"
				}
			},
			new string[] {}
		}
	});
});

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Middleware - ORDEM IMPORTANTE
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
	app.MapScalarApiReference(options =>
	{
		options
			.WithTitle("Investment Portfolio API")
			.WithTheme(ScalarTheme.Purple)
			.WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
	});
}

app.UseCors("AllowAll"); // ?? CORS antes de tudo

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Test endpoint
app.MapGet("/", () => "Investment Portfolio API is running!");

// Logging
app.Lifetime.ApplicationStarted.Register(() =>
{
	var logger = app.Services.GetRequiredService<ILoggerFactory>()
							 .CreateLogger("Startup");

	logger.LogInformation("=== Investment Portfolio API Started ===");
	logger.LogInformation("API URLs: https://localhost:7039 | http://localhost:5012");
	logger.LogInformation("Swagger UI: https://localhost:7039/swagger");
	logger.LogInformation("Scalar UI: https://localhost:7039/scalar/v1");
	logger.LogInformation("Market Data Service: {MarketDataUrl}", marketDataServiceUrl);
	logger.LogInformation("WCF Auth Service: {WcfUrl}",
		builder.Configuration["WcfServices:AuthService"]);
});

app.Run();