// ============================================================================
// File: InvestmentPortfolio.WCF/Program.cs
// ============================================================================

using CoreWCF;
using CoreWCF.Configuration;
using InvestmentPortfolio.Domain.Interfaces;
using InvestmentPortfolio.Infrastructure.Data;
using InvestmentPortfolio.Infrastructure.Repositories;
using InvestmentPortfolio.WCF.ServiceContracts;
using InvestmentPortfolio.WCF.Services;

namespace InvestmentPortfolio.WCF
{
	/// <summary>
	/// Main class responsible for configuring and running the WCF services.
	/// Uses CoreWCF to host services such as UserDataService, TransactionDataService, and ReportDataService.
	/// </summary>
	public class Program
	{
		/// <summary>
		/// Application entry point.
		/// Configures dependency injection, WCF services, and starts the host.
		/// </summary>
		/// <param name="args">Command line arguments</param>
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// Configure connection string
			var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

			// Register DbConnectionFactory
			builder.Services.AddSingleton<IDbConnectionFactory>(sp =>
				new DbConnectionFactory(connectionString!));

			// Register repositories
			builder.Services.AddScoped<IUserRepository, UserRepository>();
			builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
			builder.Services.AddScoped<IAssetRepository, AssetRepository>();
			builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
			builder.Services.AddScoped<IAlertRepository, AlertRepository>();

			// Register WCF services
			builder.Services.AddScoped<UserDataService>();
			builder.Services.AddScoped<TransactionDataService>();
			builder.Services.AddScoped<ReportDataService>();

			// Configure CoreWCF
			builder.Services.AddServiceModelServices();
			builder.Services.AddServiceModelMetadata();

			var app = builder.Build();

			// Configure CoreWCF endpoints
			app.UseServiceModel(serviceBuilder =>
			{
				serviceBuilder.AddService<UserDataService>();
				serviceBuilder.AddServiceEndpoint<UserDataService, IUserDataService>(
					new BasicHttpBinding(), "/UserDataService.svc");

				serviceBuilder.AddService<TransactionDataService>();
				serviceBuilder.AddServiceEndpoint<TransactionDataService, ITransactionDataService>(
					new BasicHttpBinding(), "/TransactionDataService.svc");

				serviceBuilder.AddService<ReportDataService>();
				serviceBuilder.AddServiceEndpoint<ReportDataService, IReportDataService>(
					new BasicHttpBinding(), "/ReportDataService.svc");

				// Enable metadata to allow client proxy generation
				var serviceMetadataBehavior = app.Services.GetRequiredService<CoreWCF.Description.ServiceMetadataBehavior>();
				serviceMetadataBehavior.HttpGetEnabled = true;
			});

			app.Run();
		}
	}
}
