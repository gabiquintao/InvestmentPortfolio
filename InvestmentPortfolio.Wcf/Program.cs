// ============================================================================
// File: InvestmentPortfolio.Wcf/Program.cs
// Purpose: Configures and starts the WCF services for the InvestmentPortfolio application.
//          Sets up dependency injection for infrastructure and application services, 
//          configures AutoMapper, logging, CORS, and exposes WCF endpoints with metadata.
// ============================================================================

using CoreWCF;
using CoreWCF.Channels;
using CoreWCF.Configuration;
using CoreWCF.Description;
using AutoMapper;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Application.Mappings;
using InvestmentPortfolio.Application.Services;
using InvestmentPortfolio.Contracts.ServiceContracts;
using InvestmentPortfolio.Domain.Interfaces;
using InvestmentPortfolio.Infrastructure.Data;
using InvestmentPortfolio.Infrastructure.Repositories;
using InvestmentPortfolio.Infrastructure.UnitOfWork;
using InvestmentPortfolio.Wcf.Services;


var builder = WebApplication.CreateBuilder(args);

// ============================================================================
// Configuration
// ============================================================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
	?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

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
// Register Infrastructure Services
// ============================================================================
builder.Services.AddSingleton<IDbConnectionFactory>(sp =>
	new DbConnectionFactory(connectionString));

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
builder.Services.AddScoped<IAssetRepository, AssetRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IAlertRepository, AlertRepository>();

// Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ============================================================================
// Register Application Services
// ============================================================================
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPortfolioService, PortfolioService>();
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IAlertService, AlertService>();
builder.Services.AddSingleton<IJwtService, JwtService>();

// ============================================================================
// Register WCF Services
// ============================================================================
builder.Services.AddScoped<AuthWcfService>();
builder.Services.AddScoped<PortfolioWcfService>();
builder.Services.AddScoped<AssetWcfService>();
builder.Services.AddScoped<TransactionWcfService>();
builder.Services.AddScoped<AlertWcfService>();

// ============================================================================
// AutoMapper
// ============================================================================
builder.Services.AddSingleton<IMapper>(provider =>
{
	var loggerFactory = provider.GetRequiredService<ILoggerFactory>();
	var configExpression = new MapperConfigurationExpression();
	configExpression.AddProfile<MappingProfile>();
	var config = new MapperConfiguration(configExpression, loggerFactory);
	return config.CreateMapper();
});

// ============================================================================
// Logging Configuration
// ============================================================================
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

if (builder.Environment.IsProduction())
{
	builder.Logging.SetMinimumLevel(LogLevel.Warning);
}
else
{
	builder.Logging.SetMinimumLevel(LogLevel.Information);
}

// ============================================================================
// Configure CoreWCF
// ============================================================================
builder.Services.AddServiceModelServices();
builder.Services.AddServiceModelMetadata();
builder.Services.AddSingleton<IServiceBehavior, UseRequestHeadersForMetadataAddressBehavior>();

var app = builder.Build();

// ============================================================================
// Middleware Pipeline
// ============================================================================
if (app.Environment.IsDevelopment())
{
	app.UseDeveloperExceptionPage();
}

app.UseCors("AllowAll");

// ============================================================================
// Configure CoreWCF Endpoints
// ============================================================================
app.UseServiceModel(serviceBuilder =>
{
	// BINDING CORRIGIDO - Tem que ser igual ao cliente
	var binding = new BasicHttpBinding
	{
		MaxReceivedMessageSize = int.MaxValue,
		MaxBufferSize = int.MaxValue,
		Security = new BasicHttpSecurity
		{
			Mode = BasicHttpSecurityMode.None
		}
	};

	// ========================================================================
	// Auth Service
	// ========================================================================
	serviceBuilder.AddService<AuthWcfService>(options =>
	{
		options.DebugBehavior.IncludeExceptionDetailInFaults = true;
	});
	serviceBuilder.AddServiceEndpoint<AuthWcfService, IAuthWcfService>(
		binding,
		"/AuthService.svc"
	);

	// ========================================================================
	// Portfolio Service
	// ========================================================================
	serviceBuilder.AddService<PortfolioWcfService>(options =>
	{
		options.DebugBehavior.IncludeExceptionDetailInFaults = true;
	});
	serviceBuilder.AddServiceEndpoint<PortfolioWcfService, IPortfolioWcfService>(
		binding,
		"/PortfolioService.svc"
	);

	// ========================================================================
	// Asset Service
	// ========================================================================
	serviceBuilder.AddService<AssetWcfService>(options =>
	{
		options.DebugBehavior.IncludeExceptionDetailInFaults = true;
	});
	serviceBuilder.AddServiceEndpoint<AssetWcfService, IAssetWcfService>(
		binding,
		"/AssetService.svc"
	);

	// ========================================================================
	// Transaction Service
	// ========================================================================
	serviceBuilder.AddService<TransactionWcfService>(options =>
	{
		options.DebugBehavior.IncludeExceptionDetailInFaults = true;
	});
	serviceBuilder.AddServiceEndpoint<TransactionWcfService, ITransactionWcfService>(
		binding,
		"/TransactionService.svc"
	);

	// ========================================================================
	// Alert Service
	// ========================================================================
	serviceBuilder.AddService<AlertWcfService>(options =>
	{
		options.DebugBehavior.IncludeExceptionDetailInFaults = true;
	});
	serviceBuilder.AddServiceEndpoint<AlertWcfService, IAlertWcfService>(
		binding,
		"/AlertService.svc"
	);

	// ========================================================================
	// Enable WSDL metadata
	// ========================================================================
	var serviceMetadataBehavior = app.Services.GetRequiredService<ServiceMetadataBehavior>();
	serviceMetadataBehavior.HttpGetEnabled = true;
	serviceMetadataBehavior.HttpsGetEnabled = false;
});

// ============================================================================
// Startup Message
// ============================================================================
app.Lifetime.ApplicationStarted.Register(() =>
{
	var logger = app.Services.GetRequiredService<ILogger<Program>>();
	var urls = builder.Configuration["ASPNETCORE_URLS"] ?? "http://localhost:5003";

	logger.LogInformation("WCF Services are running");
	logger.LogInformation("WSDL endpoints:");
	logger.LogInformation("  - Auth: {Url}/AuthService.svc?wsdl", urls);
	logger.LogInformation("  - Portfolio: {Url}/PortfolioService.svc?wsdl", urls);
	logger.LogInformation("  - Asset: {Url}/AssetService.svc?wsdl", urls);
	logger.LogInformation("  - Transaction: {Url}/TransactionService.svc?wsdl", urls);
	logger.LogInformation("  - Alert: {Url}/AlertService.svc?wsdl", urls);
});

app.Run();