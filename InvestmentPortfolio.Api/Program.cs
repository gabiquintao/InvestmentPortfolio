// ============================================================================
// File: InvestmentPortfolio.Api/Program.cs
// Purpose: Configures and starts the Investment Portfolio API application.
//          Sets up services, authentication, WCF clients, CORS, OpenAPI, logging,
//          and middleware pipeline.
// ============================================================================
using FluentValidation;
using InvestmentPortfolio.Api.WcfClients;
using InvestmentPortfolio.Application.Validators.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Scalar.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ============================================================================
// Configuration
// ============================================================================
var jwtSecretKey = builder.Configuration["Jwt:SecretKey"]
	?? throw new InvalidOperationException("JWT SecretKey not configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "InvestmentPortfolio";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "InvestmentPortfolio";

// Market Data Service URL
var marketDataServiceUrl = builder.Configuration["Services:MarketDataUrl"] ?? "http://localhost:5088";

// ============================================================================
// Services
// ============================================================================
builder.Services.AddControllers();

// ============================================================================
// FluentValidation
// ============================================================================
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();

// ============================================================================
// WCF Clients
// ============================================================================
builder.Services.AddScoped<AuthWcfClient>();
builder.Services.AddScoped<PortfolioWcfClient>();
builder.Services.AddScoped<AssetWcfClient>();
builder.Services.AddScoped<TransactionWcfClient>();
builder.Services.AddScoped<AlertWcfClient>();

// ============================================================================
// HTTP Clients for External Services
// ============================================================================
// Market Data Service HTTP Client
builder.Services.AddHttpClient("MarketDataService", client =>
{
	client.BaseAddress = new Uri(marketDataServiceUrl);
	client.Timeout = TimeSpan.FromSeconds(30);
});

// ============================================================================
// JWT Authentication
// ============================================================================
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

// ============================================================================
// CORS (Cross-Origin Resource Sharing)
// ============================================================================
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll", policy =>
	{
		policy.AllowAnyOrigin()
			  .AllowAnyMethod()
			  .AllowAnyHeader();
	});
});

// ============================================================================
// OpenAPI / Swagger with Scalar UI
// ============================================================================
builder.Services.AddOpenApi(options =>
{
	// Document-level transformation
	options.AddDocumentTransformer((document, _, _) =>
	{
		document.Info = new OpenApiInfo
		{
			Title = "Investment Portfolio API",
			Version = "v1",
			Description = "REST API for Investment Portfolio Management System"
		};

		document.Components ??= new OpenApiComponents();
		document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();
		document.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme
		{
			Type = SecuritySchemeType.Http,
			Scheme = "bearer",
			BearerFormat = "JWT",
			Description = "JWT Authorization header using the Bearer scheme."
		};

		return Task.CompletedTask;
	});

	// Operation-level security transformation
	options.AddOperationTransformer((operation, context, _) =>
	{
		operation.Security ??= new List<OpenApiSecurityRequirement>();
		operation.Security.Add(new OpenApiSecurityRequirement
		{
			[
				new OpenApiSecuritySchemeReference("Bearer", context.Document)
			] = new List<string>()
		});

		return Task.CompletedTask;
	});
});

// ============================================================================
// Logging
// ============================================================================
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// ============================================================================
// Build Application
// ============================================================================
var app = builder.Build();

// ============================================================================
// Middleware Pipeline
// ============================================================================
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

// ============================================================================
// OpenAPI / Scalar UI
// ============================================================================
app.MapOpenApi();
app.MapScalarApiReference(options =>
{
	options.WithTitle("Investment Portfolio API")
		   .WithTheme(ScalarTheme.Purple);
});

// ============================================================================
// Map Controllers
// ============================================================================
app.MapControllers();

// ============================================================================
// Application Started Logging
// ============================================================================
app.Lifetime.ApplicationStarted.Register(() =>
{
	var logger = app.Services.GetRequiredService<ILoggerFactory>()
							 .CreateLogger("Startup");
	logger.LogInformation("Investment Portfolio API is running");
	logger.LogInformation("Open Scalar UI at: http://localhost:5001/scalar/v1");
	logger.LogInformation("Market Data Service URL: {MarketDataUrl}", marketDataServiceUrl);
});

// ============================================================================
// Run Application
// ============================================================================
app.Run();