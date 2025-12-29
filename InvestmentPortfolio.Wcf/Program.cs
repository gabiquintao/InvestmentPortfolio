// ============================================================================
// File: InvestmentPortfolio.Wcf/Program.cs
// Purpose: CoreWCF service host for InvestmentPortfolio (HTTPS-ready for Azure)
// ============================================================================

using AutoMapper;
using CoreWCF;
using CoreWCF.Channels;
using CoreWCF.Configuration;
using CoreWCF.Description;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Application.Mappings;
using InvestmentPortfolio.Application.Services;
using InvestmentPortfolio.Contracts.ServiceContracts;
using InvestmentPortfolio.Domain.Interfaces;
using InvestmentPortfolio.Infrastructure.Data;
using InvestmentPortfolio.Infrastructure.Repositories;
using InvestmentPortfolio.Infrastructure.UnitOfWork;
using InvestmentPortfolio.Wcf.Services;
using Microsoft.AspNetCore.HttpOverrides;
using System.Xml;

var builder = WebApplication.CreateBuilder(args);

// ============================================================================
// Configuration
// ============================================================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
	?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

// ============================================================================
// ENABLE HTTPS LOCALLY (REQUIRED FOR CoreWCF + Transport)
// ============================================================================
if (builder.Environment.IsDevelopment())
{
	builder.WebHost.ConfigureKestrel(options =>
	{
		options.ListenAnyIP(5000); // HTTP (optional)
		options.ListenAnyIP(5001, listenOptions =>
		{
			listenOptions.UseHttps(); // HTTPS for CoreWCF
		});
	});
}

// ============================================================================
// CORS
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
// Infrastructure Services
// ============================================================================
builder.Services.AddSingleton<IDbConnectionFactory>(_ =>
	new DbConnectionFactory(connectionString));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
builder.Services.AddScoped<IAssetRepository, AssetRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IAlertRepository, AlertRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ============================================================================
// Application Services
// ============================================================================
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPortfolioService, PortfolioService>();
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IAlertService, AlertService>();
builder.Services.AddSingleton<IJwtService, JwtService>();

// ============================================================================
// WCF Services
// ============================================================================
builder.Services.AddTransient<AuthWcfService>();
builder.Services.AddTransient<PortfolioWcfService>();
builder.Services.AddTransient<AssetWcfService>();
builder.Services.AddTransient<TransactionWcfService>();
builder.Services.AddTransient<AlertWcfService>();

// ============================================================================
// AutoMapper
// ============================================================================
builder.Services.AddSingleton<IMapper>(_ =>
{
	var config = new MapperConfiguration(cfg =>
	{
		cfg.AddProfile<MappingProfile>();
	});
	return config.CreateMapper();
});

// ============================================================================
// Logging
// ============================================================================
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// ============================================================================
// CoreWCF Setup
// ============================================================================
builder.Services.AddServiceModelServices();
builder.Services.AddServiceModelMetadata();

// REQUIRED FOR AZURE HTTPS METADATA
builder.Services.AddSingleton<IServiceBehavior,
	UseRequestHeadersForMetadataAddressBehavior>();

var app = builder.Build();

// ============================================================================
// Forwarded Headers (REQUIRED FOR AZURE)
// ============================================================================
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
	ForwardedHeaders =
		ForwardedHeaders.XForwardedFor |
		ForwardedHeaders.XForwardedProto
});

// ============================================================================
// Middleware
// ============================================================================
app.UseRouting();
app.UseCors("AllowAll");

// ============================================================================
// CoreWCF Endpoints (HTTPS ONLY)
// ============================================================================
app.UseServiceModel(serviceBuilder =>
{
	var binding = new BasicHttpBinding
	{
		MaxReceivedMessageSize = int.MaxValue,
		MaxBufferSize = int.MaxValue,
		ReaderQuotas = XmlDictionaryReaderQuotas.Max,
		Security = new BasicHttpSecurity
		{
			// HTTPS REQUIRED (LOCAL + AZURE)
			Mode = BasicHttpSecurityMode.Transport
		}
	};

	serviceBuilder.AddService<AuthWcfService>(options =>
	{
		options.DebugBehavior.IncludeExceptionDetailInFaults = true;
	});
	serviceBuilder.AddServiceEndpoint<AuthWcfService, IAuthWcfService>(
		binding, "/AuthService.svc");

	serviceBuilder.AddService<PortfolioWcfService>(options =>
	{
		options.DebugBehavior.IncludeExceptionDetailInFaults = true;
	});
	serviceBuilder.AddServiceEndpoint<PortfolioWcfService, IPortfolioWcfService>(
		binding, "/PortfolioService.svc");

	serviceBuilder.AddService<AssetWcfService>(options =>
	{
		options.DebugBehavior.IncludeExceptionDetailInFaults = true;
	});
	serviceBuilder.AddServiceEndpoint<AssetWcfService, IAssetWcfService>(
		binding, "/AssetService.svc");

	serviceBuilder.AddService<TransactionWcfService>(options =>
	{
		options.DebugBehavior.IncludeExceptionDetailInFaults = true;
	});
	serviceBuilder.AddServiceEndpoint<TransactionWcfService, ITransactionWcfService>(
		binding, "/TransactionService.svc");

	serviceBuilder.AddService<AlertWcfService>(options =>
	{
		options.DebugBehavior.IncludeExceptionDetailInFaults = true;
	});
	serviceBuilder.AddServiceEndpoint<AlertWcfService, IAlertWcfService>(
		binding, "/AlertService.svc");

	var metadata = app.Services.GetRequiredService<ServiceMetadataBehavior>();
	metadata.HttpGetEnabled = false;
	metadata.HttpsGetEnabled = true;
});

// ============================================================================
// Test Endpoint
// ============================================================================
app.UseEndpoints(endpoints =>
{
	endpoints.MapGet("/", async context =>
	{
		await context.Response.WriteAsync(
			"InvestmentPortfolio WCF Services running (HTTPS enabled)");
	});
});

// ============================================================================
// Startup Logging
// ============================================================================
app.Lifetime.ApplicationStarted.Register(() =>
{
	var logger = app.Services.GetRequiredService<ILogger<Program>>();

	logger.LogInformation("=== InvestmentPortfolio WCF Services Started ===");
	logger.LogInformation("HTTPS endpoints:");
	logger.LogInformation("  - https://localhost:5001/AuthService.svc");
	logger.LogInformation("  - https://localhost:5001/PortfolioService.svc");
	logger.LogInformation("  - https://localhost:5001/AssetService.svc");
	logger.LogInformation("  - https://localhost:5001/TransactionService.svc");
	logger.LogInformation("  - https://localhost:5001/AlertService.svc");
});

// ============================================================================
// Run
// ============================================================================
app.Run();