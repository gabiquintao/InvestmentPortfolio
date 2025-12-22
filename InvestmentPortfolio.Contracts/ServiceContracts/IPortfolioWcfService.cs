// ============================================================================
// File: InvestmentPortfolio.Contracts/ServiceContracts/IPortfolioWcfService.cs
// Purpose: WCF service contract defining operations for managing user portfolios.
// ============================================================================

using System.ServiceModel;
using InvestmentPortfolio.Application.DTOs.Portfolios;
using InvestmentPortfolio.Contracts.Models;

namespace InvestmentPortfolio.Contracts.ServiceContracts;

/// <summary>
/// Defines WCF operations for managing user portfolios.
/// </summary>
[ServiceContract]
public interface IPortfolioWcfService
{
	/// <summary>
	/// Retrieves all portfolios for a specific user.
	/// </summary>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A service response containing a list of portfolio DTOs.</returns>
	[OperationContract]
	Task<ServiceResponse<List<PortfolioDto>>> GetUserPortfoliosAsync(int userId);

	/// <summary>
	/// Retrieves a specific portfolio by its ID for a given user.
	/// </summary>
	/// <param name="portfolioId">The ID of the portfolio.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A service response containing the portfolio DTO, or null if not found.</returns>
	[OperationContract]
	Task<ServiceResponse<PortfolioDto>> GetByIdAsync(int portfolioId, int userId);

	/// <summary>
	/// Creates a new portfolio for a user.
	/// </summary>
	/// <param name="dto">The DTO containing portfolio creation details.</param>
	/// <param name="userId">The ID of the user creating the portfolio.</param>
	/// <returns>A service response containing the created portfolio DTO.</returns>
	[OperationContract]
	Task<ServiceResponse<PortfolioDto>> CreateAsync(CreatePortfolioDto dto, int userId);

	/// <summary>
	/// Updates an existing portfolio for a user.
	/// </summary>
	/// <param name="portfolioId">The ID of the portfolio to update.</param>
	/// <param name="dto">The DTO containing updated portfolio details.</param>
	/// <param name="userId">The ID of the user updating the portfolio.</param>
	/// <returns>A service response containing the updated portfolio DTO.</returns>
	[OperationContract]
	Task<ServiceResponse<PortfolioDto>> UpdateAsync(int portfolioId, UpdatePortfolioDto dto, int userId);

	/// <summary>
	/// Deletes a portfolio for a user.
	/// </summary>
	/// <param name="portfolioId">The ID of the portfolio to delete.</param>
	/// <param name="userId">The ID of the user deleting the portfolio.</param>
	/// <returns>A service response indicating whether the deletion was successful.</returns>
	[OperationContract]
	Task<ServiceResponse<bool>> DeleteAsync(int portfolioId, int userId);
}
