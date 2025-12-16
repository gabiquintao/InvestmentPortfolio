// ============================================================================
// File: InvestmentPortfolio.Domain/Interfaces/ITransactionRepository.cs
// ============================================================================

using InvestmentPortfolio.Domain.Entities;

namespace InvestmentPortfolio.Domain.Interfaces;

/// <summary>
/// Interface for transaction repository operations
/// </summary>
public interface ITransactionRepository
{
	/// <summary>
	/// Gets a transaction by ID
	/// </summary>
	Task<Transaction?> GetByIdAsync(int transactionId);

	/// <summary>
	/// Gets all transactions for a portfolio
	/// </summary>
	Task<IEnumerable<Transaction>> GetByPortfolioIdAsync(int portfolioId);

	/// <summary>
	/// Gets all transactions for an asset
	/// </summary>
	Task<IEnumerable<Transaction>> GetByAssetIdAsync(int assetId);

	/// <summary>
	/// Gets all transactions for a user
	/// </summary>
	Task<IEnumerable<Transaction>> GetByUserIdAsync(int userId);

	/// <summary>
	/// Creates a new <see cref="Transaction"/>
	/// </summary>
	Task<int> CreateAsync(Transaction transaction);

	/// <summary>
	/// Gets transactions for a specified date range
	/// </summary>
	Task<IEnumerable<Transaction>> GetByDateRangeAsync(int portfolioId, DateTime start, DateTime end);
}