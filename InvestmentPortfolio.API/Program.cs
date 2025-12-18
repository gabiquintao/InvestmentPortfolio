using FluentValidation;
using FluentValidation.AspNetCore;
using InvestmentPortfolio.API.Middleware;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Application.Mappings;
using InvestmentPortfolio.Application.Services;
using InvestmentPortfolio.Application.Validators.Auth;
using InvestmentPortfolio.Domain.Interfaces;
using InvestmentPortfolio.Infrastructure.Data;
using InvestmentPortfolio.Infrastructure.Repositories;
using InvestmentPortfolio.Infrastructure.UnitOfWork;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Scalar.AspNetCore;
using Serilog;
using System.Text;

namespace InvestmentPortfolio.API
{
	/// <summary>
	/// Entry point of the Investment Portfolio API application.
	/// Configures logging, services, authentication, CORS, OpenAPI, and middleware.
	/// </summary>
	public class Program
	{
		/// <summary>
		/// Main method to configure and run the API.
		/// </summary>
		/// <param name="args">Command-line arguments.</param>
		public static void Main(string[] args)
		{
			// Create the web application builder
			var builder = WebApplication.CreateBuilder(args);

			#region Serilog Logging
			/// Configure Serilog for structured logging to console and file.
			Log.Logger = new LoggerConfiguration()
				.ReadFrom.Configuration(builder.Configuration)
				.Enrich.FromLogContext()
				.WriteTo.Console()
				.WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
				.CreateLogger();

			builder.Host.UseSerilog();
			#endregion

			#region Controllers
			/// Add MVC controllers
			builder.Services.AddControllers();
			#endregion

			#region FluentValidation
			/// Automatically validate models using FluentValidation
			builder.Services.AddFluentValidationAutoValidation();
			/// Register all validators from the assembly containing RegisterRequestValidator
			builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
			#endregion

			#region AutoMapper
			/// Configure AutoMapper profiles
			builder.Services.AddAutoMapper(cfg =>
			{
				cfg.AddProfile<MappingProfile>();
			});
			#endregion

			#region Database
			/// Configure a database connection factory as singleton
			var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
			builder.Services.AddSingleton<IDbConnectionFactory>(_ => new DbConnectionFactory(connectionString!));
			#endregion

			#region Repositories
			/// Register domain repositories with scoped lifetime
			builder.Services.AddScoped<IUserRepository, UserRepository>();
			builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
			builder.Services.AddScoped<IAssetRepository, AssetRepository>();
			builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
			builder.Services.AddScoped<IAlertRepository, AlertRepository>();
			#endregion

			#region UnitOfWork
			/// Register Unit of Work pattern
			builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
			#endregion

			#region Application Services
			/// Register application services (business logic layer)
			builder.Services.AddScoped<IAuthService, AuthService>();
			builder.Services.AddScoped<IPortfolioService, PortfolioService>();
			builder.Services.AddScoped<IAssetService, AssetService>();
			builder.Services.AddScoped<ITransactionService, TransactionService>();
			builder.Services.AddScoped<IAlertService, AlertService>();
			builder.Services.AddScoped<IJwtService, JwtService>();
			#endregion

			#region JWT Authentication
			/// Configure JWT authentication for API
			var jwtKey = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:SecretKey"]!);

			builder.Services
				.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(options =>
				{
					options.RequireHttpsMetadata = false;
					options.SaveToken = true;
					options.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuerSigningKey = true,
						IssuerSigningKey = new SymmetricSecurityKey(jwtKey),
						ValidateIssuer = true,
						ValidIssuer = builder.Configuration["Jwt:Issuer"],
						ValidateAudience = true,
						ValidAudience = builder.Configuration["Jwt:Audience"],
						ValidateLifetime = true,
						ClockSkew = TimeSpan.Zero
					};
				});

			builder.Services.AddAuthorization();
			#endregion

			#region CORS
			/// Enable Cross-Origin Requests (CORS) to allow all origins
			builder.Services.AddCors(options =>
			{
				options.AddPolicy("AllowAll", policy =>
				{
					policy.AllowAnyOrigin()
						  .AllowAnyMethod()
						  .AllowAnyHeader();
				});
			});
			#endregion

			#region OpenAPI / Scalar
			/// Configure OpenAPI/Swagger documentation and JWT support
			builder.Services.AddOpenApi(options =>
			{
				/// Configure the OpenAPI document
				options.AddDocumentTransformer((document, _, _) =>
				{
					document.Info = new OpenApiInfo
					{
						Title = "Investment Portfolio API",
						Version = "v1",
						Description = "API for managing investment portfolios"
					};

					document.Components ??= new OpenApiComponents();

					// Add JWT Bearer security definition
					document.Components.SecuritySchemes?["Bearer"] = new OpenApiSecurityScheme
					{
						Type = SecuritySchemeType.Http,
						Scheme = "bearer",
						BearerFormat = "JWT",
						Name = "Authorization",
						In = ParameterLocation.Header,
						Description = "JWT Authorization header using the Bearer scheme."
					};

					return Task.CompletedTask;
				});

				/// Add security requirements to each operation
				options.AddOperationTransformer((operation, context, _) =>
				{
					context.Document?.Components ??= new OpenApiComponents();

					if (context.Document?.Components?.SecuritySchemes == null)
					{
						context.Document?.Components?.SecuritySchemes = new Dictionary<string, IOpenApiSecurityScheme>();
					}
					else
					if (!context.Document.Components.SecuritySchemes.ContainsKey("Bearer"))
					{
						context.Document.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme
						{
							Type = SecuritySchemeType.Http,
							Scheme = "bearer",
							BearerFormat = "JWT",
							Description = "JWT Authorization header using the Bearer scheme."
						};
					}

					operation.Security ??= new List<OpenApiSecurityRequirement>();

					var securityRequirement = new OpenApiSecurityRequirement
					{
						[new OpenApiSecuritySchemeReference("Bearer", context.Document)] = new List<string>()
					};

					operation.Security.Add(securityRequirement);

					return Task.CompletedTask;
				});
			});
			#endregion

			// Build the app
			var app = builder.Build();

			#region Middleware
			/// Use global exception handling middleware
			app.UseMiddleware<ExceptionHandlingMiddleware>();

			/// Redirect HTTP to HTTPS
			app.UseHttpsRedirection();

			/// Enable CORS
			app.UseCors("AllowAll");

			/// Enable authentication and authorization
			app.UseAuthentication();
			app.UseAuthorization();
			#endregion

			#region API Endpoints
			/// Map Scalar and OpenAPI endpoints
			app.MapOpenApi();
			app.MapScalarApiReference(options =>
			{
				options.WithTitle("Investment Portfolio API")
					   .WithTheme(ScalarTheme.Purple);
			});

			/// Map controllers
			app.MapControllers();
			#endregion

			// Run the web application
			app.Run();
		}
	}
}
