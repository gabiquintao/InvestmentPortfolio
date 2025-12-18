// ============================================================================
// File: InvestmentPortfolio.WCF/Services/TransactionDataService.cs
// ============================================================================

using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Enums;
using InvestmentPortfolio.Domain.Interfaces;
using InvestmentPortfolio.WCF.DataContracts;
using InvestmentPortfolio.WCF.ServiceContracts;

namespace InvestmentPortfolio.WCF.Services;

/// <summary>
/// Implementation of the transaction data service.
/// Provides methods to create transactions, fetch transactions by portfolio or date range,
/// and calculate portfolio total value.
/// </summary>
public class TransactionDataService : ITransactionDataService
{
	private readonly ITransactionRepository _transactionRepository;
	private readonly IAssetRepository _assetRepository;

	/// <summary>
	/// Initializes a new instance of the <see cref="TransactionDataService"/> class.
	/// </summary>
	/// <param name="transactionRepository">Repository for transaction data.</param>
	/// <param name="assetRepository">Repository for asset data.</param>
	public TransactionDataService(
		ITransactionRepository transactionRepository,
		IAssetRepository assetRepository)
	{
		_transactionRepository = transactionRepository ?? throw new ArgumentNullException(nameof(transactionRepository));
		_assetRepository = assetRepository ?? throw new ArgumentNullException(nameof(assetRepository));
	}

	/// <summary>
	/// Creates a new transaction.
	/// </summary>
	/// <param name="transaction">The transaction data contract.</param>
	/// <returns>The ID of the newly created transaction.</returns>
	public async Task<int> CreateTransactionAsync(TransactionDataContract transaction)
	{
		var entity = new Transaction
		{
			PortfolioId = transaction.PortfolioId,
			AssetId = transaction.AssetId,
			Type = (TransactionType)transaction.Type,
			Quantity = transaction.Quantity,
			PricePerUnit = transaction.PricePerUnit,
			TotalAmount = transaction.TotalAmount,
			Fees = transaction.Fees,
			TransactionDate = transaction.TransactionDate,
			Notes = transaction.Notes
		};

		return await _transactionRepository.CreateAsync(entity);
	}

	/// <summary>
	/// Retrieves all transactions for a specific portfolio.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <returns>A list of transaction data contracts.</returns>
	public async Task<List<TransactionDataContract>> GetTransactionsByPortfolioAsync(int portfolioId)
	{
		var transactions = await _transactionRepository.GetByPortfolioIdAsync(portfolioId);

		return transactions.Select(t => new TransactionDataContract
		{
			TransactionId = t.TransactionId,
			PortfolioId = t.PortfolioId,
			AssetId = t.AssetId,
			Type = (int)t.Type,
			Quantity = t.Quantity,
			PricePerUnit = t.PricePerUnit,
			TotalAmount = t.TotalAmount,
			Fees = t.Fees,
			TransactionDate = t.TransactionDate,
			Notes = t.Notes,
			AssetSymbol = t.Asset?.Symbol ?? string.Empty
		}).ToList();
	}

	/// <summary>
	/// Calculates the total value of a portfolio based on its assets.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <returns>The total portfolio value.</returns>
	public async Task<decimal> CalculatePortfolioValueAsync(int portfolioId)
	{
		var assets = await _assetRepository.GetByPortfolioIdAsync(portfolioId);

		decimal totalValue = 0;
		foreach (var asset in assets)
		{
			totalValue += asset.Quantity * asset.AvgPurchasePrice;
		}

		return totalValue;
	}

	/// <summary>
	/// Retrieves transactions for a portfolio within a specific date range.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <param name="startDate">Start date of the range.</param>
	/// <param name="endDate">End date of the range.</param>
	/// <returns>A list of transaction data contracts.</returns>
	public async Task<List<TransactionDataContract>> GetTransactionsByDateRangeAsync(
		int portfolioId,
		DateTime startDate,
		DateTime endDate)
	{
		var transactions = await _transactionRepository.GetByDateRangeAsync(portfolioId, startDate, endDate);

		return transactions.Select(t => new TransactionDataContract
		{
			TransactionId = t.TransactionId,
			PortfolioId = t.PortfolioId,
			AssetId = t.AssetId,
			Type = (int)t.Type,
			Quantity = t.Quantity,
			PricePerUnit = t.PricePerUnit,
			TotalAmount = t.TotalAmount,
			Fees = t.Fees,
			TransactionDate = t.TransactionDate,
			Notes = t.Notes,
			AssetSymbol = t.Asset?.Symbol ?? string.Empty
		}).ToList();
	}
}