// ============================================================================
// File: InvestmentPortfolio.Domain/Interfaces/ITransactionRepository.cs
// Purpose: Interface for transaction repository operations, including CRUD and queries by portfolio, asset, or user.
// ============================================================================

using InvestmentPortfolio.Domain.Entities;

namespace InvestmentPortfolio.Domain.Interfaces;

/// <summary>
/// Provides methods for accessing and managing transactions in the data store.
/// </summary>
public interface ITransactionRepository
{
	/// <summary>
	/// Gets a transaction by its unique identifier.
	/// </summary>
	Task<Transaction?> GetByIdAsync(int transactionId);

	/// <summary>
	/// Gets all transactions associated with a specific portfolio.
	/// </summary>
	Task<IEnumerable<Transaction>> GetByPortfolioIdAsync(int portfolioId);

	/// <summary>
	/// Gets all transactions associated with a specific asset.
	/// </summary>
	Task<IEnumerable<Transaction>> GetByAssetIdAsync(int assetId);

	/// <summary>
	/// Gets all transactions associated with a specific user.
	/// </summary>
	Task<IEnumerable<Transaction>> GetByUserIdAsync(int userId);

	/// <summary>
	/// Creates a new transaction in the data store.
	/// </summary>
	Task<int> CreateAsync(Transaction transaction);

	/// <summary>
	/// Gets all transactions for a specified portfolio within a date range.
	/// </summary>
	Task<IEnumerable<Transaction>> GetByDateRangeAsync(int portfolioId, DateTime start, DateTime end);
}
