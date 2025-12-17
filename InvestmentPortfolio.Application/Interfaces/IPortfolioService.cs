// ============================================================================
// File: InvestmentPortfolio.Application/Interfaces/IPortfolioService.cs
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Portfolios;

namespace InvestmentPortfolio.Application.Interfaces;

/// <summary>
/// Interface for portfolio service, providing operations to manage user portfolios.
/// </summary>
public interface IPortfolioService
{
	/// <summary>
	/// Retrieves all portfolios for a specific user.
	/// </summary>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A collection of <see cref="PortfolioDto"/> representing the user's portfolios.</returns>
	Task<IEnumerable<PortfolioDto>> GetUserPortfoliosAsync(int userId);

	/// <summary>
	/// Retrieves a specific portfolio by its ID for a user.
	/// </summary>
	/// <param name="portfolioId">The ID of the portfolio.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The <see cref="PortfolioDto"/> if found; otherwise, null.</returns>
	Task<PortfolioDto?> GetByIdAsync(int portfolioId, int userId);

	/// <summary>
	/// Creates a new portfolio for a user.
	/// </summary>
	/// <param name="dto">The portfolio creation data.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The created <see cref="PortfolioDto"/>.</returns>
	Task<PortfolioDto> CreateAsync(CreatePortfolioDto dto, int userId);

	/// <summary>
	/// Updates an existing portfolio for a user.
	/// </summary>
	/// <param name="portfolioId">The ID of the portfolio to update.</param>
	/// <param name="dto">The portfolio update data.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The updated <see cref="PortfolioDto"/> if successful; otherwise, null.</returns>
	Task<PortfolioDto?> UpdateAsync(int portfolioId, UpdatePortfolioDto dto, int userId);

	/// <summary>
	/// Deletes a user's portfolio by its ID.
	/// </summary>
	/// <param name="portfolioId">The ID of the portfolio to delete.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>True if the portfolio was successfully deleted; otherwise, false.</returns>
	Task<bool> DeleteAsync(int portfolioId, int userId);
}
