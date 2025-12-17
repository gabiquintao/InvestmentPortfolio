// ============================================================================
// File: InvestmentPortfolio.Application/Interfaces/IAssetService.cs
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Assets;

namespace InvestmentPortfolio.Application.Interfaces;

/// <summary>
/// Interface for asset service, providing operations to manage assets in portfolios.
/// </summary>
public interface IAssetService
{
	/// <summary>
	/// Retrieves all assets in a specific portfolio for a user.
	/// </summary>
	/// <param name="portfolioId">The ID of the portfolio.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A collection of <see cref="AssetDto"/> representing the portfolio's assets.</returns>
	Task<IEnumerable<AssetDto>> GetPortfolioAssetsAsync(int portfolioId, int userId);

	/// <summary>
	/// Retrieves a specific asset by its ID for a user.
	/// </summary>
	/// <param name="assetId">The ID of the asset.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The <see cref="AssetDto"/> if found; otherwise, null.</returns>
	Task<AssetDto?> GetByIdAsync(int assetId, int userId);

	/// <summary>
	/// Creates a new asset in a portfolio for a user.
	/// </summary>
	/// <param name="portfolioId">The ID of the portfolio.</param>
	/// <param name="dto">The asset creation data.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The created <see cref="AssetDto"/>.</returns>
	Task<AssetDto> CreateAsync(int portfolioId, CreateAssetDto dto, int userId);

	/// <summary>
	/// Updates an existing asset for a user.
	/// </summary>
	/// <param name="assetId">The ID of the asset to update.</param>
	/// <param name="dto">The asset update data.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The updated <see cref="AssetDto"/> if successful; otherwise, null.</returns>
	Task<AssetDto?> UpdateAsync(int assetId, UpdateAssetDto dto, int userId);

	/// <summary>
	/// Deletes a user's asset by its ID.
	/// </summary>
	/// <param name="assetId">The ID of the asset to delete.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>True if the asset was successfully deleted; otherwise, false.</returns>
	Task<bool> DeleteAsync(int assetId, int userId);
}