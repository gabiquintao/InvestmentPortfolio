// ============================================================================
// File: InvestmentPortfolio.Domain/Interfaces/IPortfolioRepository.cs
// ============================================================================

using InvestmentPortfolio.Domain.Entities;

namespace InvestmentPortfolio.Domain.Interfaces;

/// <summary>
/// Interface for portfolio repository operations
/// </summary>
public interface IPortfolioRepository
{
	/// <summary>
	/// Gets a portfolio by ID
	/// </summary>
	Task<Portfolio?> GetByIdAsync(int portfolioId);

	/// <summary>
	/// Gets all portfolios for a user
	/// </summary>
	Task<IEnumerable<Portfolio>> GetByUserIdAsync(int userId);

	/// <summary>
	/// Creates a new <see cref="Portfolio"/>
	/// </summary>
	Task<int> CreateAsync(Portfolio portfolio);

	/// <summary>
	/// Updates an existing <see cref="Portfolio"/>
	/// </summary>
	Task<bool> UpdateAsync(Portfolio portfolio);

	/// <summary>
	/// Deletes a portfolio
	/// </summary>
	Task<bool> DeleteAsync(int portfolioId);

	/// <summary>
	/// Checks whether a portfolio belongs to a user
	/// </summary>
	Task<bool> BelongsToUserAsync(int portfolioId, int userId);
}
