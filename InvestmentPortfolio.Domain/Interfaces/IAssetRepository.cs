// ============================================================================
// File: InvestmentPortfolio.Domain/Interfaces/IAssetRepository.cs
// Purpose: Interface for the Asset repository, providing CRUD operations
//          and portfolio-specific asset queries.
// ============================================================================

using InvestmentPortfolio.Domain.Entities;

namespace InvestmentPortfolio.Domain.Interfaces;

/// <summary>
/// Interface for asset repository operations.
/// </summary>
public interface IAssetRepository
{
	/// <summary>
	/// Gets an asset by its unique identifier.
	/// </summary>
	/// <param name="assetId">The asset ID.</param>
	/// <returns>The asset if found; otherwise, null.</returns>
	Task<Asset?> GetByIdAsync(int assetId);

	/// <summary>
	/// Gets all assets in a specific portfolio.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <returns>A collection of assets.</returns>
	Task<IEnumerable<Asset>> GetByPortfolioIdAsync(int portfolioId);

	/// <summary>
	/// Creates a new asset in the data store.
	/// </summary>
	/// <param name="asset">The asset to create.</param>
	/// <returns>The ID of the created asset.</returns>
	Task<int> CreateAsync(Asset asset);

	/// <summary>
	/// Updates an existing asset in the data store.
	/// </summary>
	/// <param name="asset">The asset to update.</param>
	/// <returns>True if the update succeeded; otherwise, false.</returns>
	Task<bool> UpdateAsync(Asset asset);

	/// <summary>
	/// Deletes an asset by its unique identifier.
	/// </summary>
	/// <param name="assetId">The asset ID to delete.</param>
	/// <returns>True if deletion succeeded; otherwise, false.</returns>
	Task<bool> DeleteAsync(int assetId);

	/// <summary>
	/// Checks if an asset exists in a specific portfolio by symbol.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <param name="symbol">The asset symbol.</param>
	/// <returns>True if the asset exists; otherwise, false.</returns>
	Task<bool> ExistsInPortfolioAsync(int portfolioId, string symbol);
}
