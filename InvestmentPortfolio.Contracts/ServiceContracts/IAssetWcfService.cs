// ============================================================================
// File: InvestmentPortfolio.Contracts/ServiceContracts/IAssetWcfService.cs
// Purpose: WCF service contract defining operations for managing assets in user portfolios.
// ============================================================================

using System.ServiceModel;
using InvestmentPortfolio.Application.DTOs.Assets;
using InvestmentPortfolio.Contracts.Models;

namespace InvestmentPortfolio.Contracts.ServiceContracts;

/// <summary>
/// Defines WCF operations for managing portfolio assets.
/// </summary>
[ServiceContract]
public interface IAssetWcfService
{
	/// <summary>
	/// Retrieves all assets in a portfolio for a given user.
	/// </summary>
	/// <param name="portfolioId">The ID of the portfolio.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A service response containing a list of asset DTOs.</returns>
	[OperationContract]
	Task<ServiceResponse<List<AssetDto>>> GetPortfolioAssetsAsync(int portfolioId, int userId);

	/// <summary>
	/// Retrieves a specific asset by its ID for a given user.
	/// </summary>
	/// <param name="assetId">The ID of the asset.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A service response containing the asset DTO, or null if not found.</returns>
	[OperationContract]
	Task<ServiceResponse<AssetDto>> GetByIdAsync(int assetId, int userId);

	/// <summary>
	/// Creates a new asset in a user's portfolio.
	/// </summary>
	/// <param name="portfolioId">The ID of the portfolio.</param>
	/// <param name="dto">The DTO containing asset creation details.</param>
	/// <param name="userId">The ID of the user creating the asset.</param>
	/// <returns>A service response containing the created asset DTO.</returns>
	[OperationContract]
	Task<ServiceResponse<AssetDto>> CreateAsync(int portfolioId, CreateAssetDto dto, int userId);

	/// <summary>
	/// Updates an existing asset in a user's portfolio.
	/// </summary>
	/// <param name="assetId">The ID of the asset to update.</param>
	/// <param name="dto">The DTO containing updated asset details.</param>
	/// <param name="userId">The ID of the user updating the asset.</param>
	/// <returns>A service response containing the updated asset DTO.</returns>
	[OperationContract]
	Task<ServiceResponse<AssetDto>> UpdateAsync(int assetId, UpdateAssetDto dto, int userId);

	/// <summary>
	/// Deletes an asset from a user's portfolio.
	/// </summary>
	/// <param name="assetId">The ID of the asset to delete.</param>
	/// <param name="userId">The ID of the user deleting the asset.</param>
	/// <returns>A service response indicating whether the deletion was successful.</returns>
	[OperationContract]
	Task<ServiceResponse<bool>> DeleteAsync(int assetId, int userId);
}
