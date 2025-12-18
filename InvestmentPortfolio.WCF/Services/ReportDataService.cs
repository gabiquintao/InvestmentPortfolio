// ============================================================================
// File: InvestmentPortfolio.WCF/Services/ReportDataService.cs
// ============================================================================

using System.Text;
using InvestmentPortfolio.Domain.Interfaces;
using InvestmentPortfolio.WCF.DataContracts;
using InvestmentPortfolio.WCF.ServiceContracts;
using Newtonsoft.Json;

namespace InvestmentPortfolio.WCF.Services;

/// <summary>
/// Implementation of the report data service.
/// Provides methods to generate portfolio performance reports and export transaction histories.
/// </summary>
public class ReportDataService : IReportDataService
{
	private readonly IPortfolioRepository _portfolioRepository;
	private readonly ITransactionRepository _transactionRepository;
	private readonly IAssetRepository _assetRepository;

	/// <summary>
	/// Initializes a new instance of the <see cref="ReportDataService"/> class.
	/// </summary>
	/// <param name="portfolioRepository">Repository for portfolio data.</param>
	/// <param name="transactionRepository">Repository for transaction data.</param>
	/// <param name="assetRepository">Repository for asset data.</param>
	public ReportDataService(
		IPortfolioRepository portfolioRepository,
		ITransactionRepository transactionRepository,
		IAssetRepository assetRepository)
	{
		_portfolioRepository = portfolioRepository ?? throw new ArgumentNullException(nameof(portfolioRepository));
		_transactionRepository = transactionRepository ?? throw new ArgumentNullException(nameof(transactionRepository));
		_assetRepository = assetRepository ?? throw new ArgumentNullException(nameof(assetRepository));
	}

	/// <summary>
	/// Generates a performance report for a specific portfolio within a given date range.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <param name="startDate">The start date of the report period.</param>
	/// <param name="endDate">The end date of the report period.</param>
	/// <returns>A <see cref="PerformanceReportDataContract"/> containing the performance metrics.</returns>
	/// <exception cref="InvalidOperationException">Thrown if the portfolio is not found.</exception>
	public async Task<PerformanceReportDataContract> GeneratePerformanceReportAsync(
		int portfolioId,
		DateTime startDate,
		DateTime endDate)
	{
		var portfolio = await _portfolioRepository.GetByIdAsync(portfolioId);

		if (portfolio == null)
			throw new InvalidOperationException("Portfolio not found");

		var transactions = await _transactionRepository.GetByDateRangeAsync(portfolioId, startDate, endDate);
		var assets = await _assetRepository.GetByPortfolioIdAsync(portfolioId);

		decimal totalInvested = transactions
			.Where(t => t.Type == Domain.Enums.TransactionType.Buy)
			.Sum(t => t.TotalAmount);

		decimal currentValue = assets.Sum(a => a.Quantity * a.AvgPurchasePrice);

		decimal totalProfit = currentValue - totalInvested;
		decimal profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

		return new PerformanceReportDataContract
		{
			PortfolioId = portfolio.PortfolioId,
			PortfolioName = portfolio.Name,
			StartDate = startDate,
			EndDate = endDate,
			TotalInvested = totalInvested,
			CurrentValue = currentValue,
			TotalProfit = totalProfit,
			ProfitPercentage = profitPercentage,
			TotalTransactions = transactions.Count(),
			GeneratedAt = DateTime.UtcNow
		};
	}

	/// <summary>
	/// Exports the transaction history of a portfolio in the specified format (JSON or CSV).
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <param name="format">The export format ("json" or "csv").</param>
	/// <returns>A string representing the transaction history in the requested format.</returns>
	/// <exception cref="ArgumentException">Thrown if the specified format is unsupported.</exception>
	public async Task<string> ExportTransactionHistoryAsync(int portfolioId, string format)
	{
		var transactions = await _transactionRepository.GetByPortfolioIdAsync(portfolioId);

		return format.ToLower() switch
		{
			"json" => JsonConvert.SerializeObject(transactions, Formatting.Indented),
			"csv" => ConvertToCsv(transactions),
			_ => throw new ArgumentException("Unsupported format. Use 'json' or 'csv'.")
		};
	}

	/// <summary>
	/// Converts a collection of transactions to a CSV string.
	/// </summary>
	/// <param name="transactions">The transactions to convert.</param>
	/// <returns>A CSV-formatted string representing the transactions.</returns>
	private string ConvertToCsv(IEnumerable<Domain.Entities.Transaction> transactions)
	{
		var csv = new StringBuilder();
		csv.AppendLine("TransactionId,PortfolioId,AssetId,Type,Quantity,PricePerUnit,TotalAmount,Fees,TransactionDate,Notes");

		foreach (var t in transactions)
		{
			csv.AppendLine($"{t.TransactionId},{t.PortfolioId},{t.AssetId},{t.Type},{t.Quantity},{t.PricePerUnit},{t.TotalAmount},{t.Fees},{t.TransactionDate:yyyy-MM-dd},{t.Notes}");
		}

		return csv.ToString();
	}
}
