// ============================================================================
// File: InvestmentPortfolio.Domain/Interfaces/IPortfolioRepository.cs
// Purpose: Interface for portfolio repository operations, including CRUD and user queries.
// ============================================================================

using InvestmentPortfolio.Domain.Entities;

namespace InvestmentPortfolio.Domain.Interfaces;

/// <summary>
/// Provides methods for accessing and managing portfolios in the data store.
/// </summary>
public interface IPortfolioRepository
{
	/// <summary>
	/// Gets a portfolio by its unique identifier.
	/// </summary>
	Task<Portfolio?> GetByIdAsync(int portfolioId);

	/// <summary>
	/// Gets all portfolios associated with a specific user.
	/// </summary>
	Task<IEnumerable<Portfolio>> GetByUserIdAsync(int userId);

	/// <summary>
	/// Creates a new portfolio in the data store.
	/// </summary>
	Task<int> CreateAsync(Portfolio portfolio);

	/// <summary>
	/// Updates an existing portfolio in the data store.
	/// </summary>
	Task<bool> UpdateAsync(Portfolio portfolio);

	/// <summary>
	/// Deletes a portfolio by its unique identifier.
	/// </summary>
	Task<bool> DeleteAsync(int portfolioId);

	/// <summary>
	/// Checks whether a portfolio belongs to a specific user.
	/// </summary>
	Task<bool> BelongsToUserAsync(int portfolioId, int userId);
}
