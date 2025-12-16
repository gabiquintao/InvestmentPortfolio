// ============================================================================
// File: InvestmentPortfolio.Domain/Interfaces/IAssetRepository.cs
// ============================================================================

using InvestmentPortfolio.Domain.Entities;

namespace InvestmentPortfolio.Domain.Interfaces;

/// <summary>
/// Interface for asset repository operations
/// </summary>
public interface IAssetRepository
{
	/// <summary>
	/// Gets an asset by ID
	/// </summary>
	Task<Asset?> GetByIdAsync(int assetId);

	/// <summary>
	/// Gets all assets for a portfolio
	/// </summary>
	Task<IEnumerable<Asset>> GetByPortfolioIdAsync(int portfolioId);

	/// <summary>
	/// Creates a new <see cref="Asset"/>
	/// </summary>
	Task<int> CreateAsync(Asset asset);

	/// <summary>
	/// Updates an existing <see cref="Asset"/>
	/// </summary>
	Task<bool> UpdateAsync(Asset asset);

	/// <summary>
	/// Deletes an asset
	/// </summary>
	Task<bool> DeleteAsync(int assetId);

	/// <summary>
	/// Checks whether an asset exists in a portfolio
	/// </summary>
	Task<bool> ExistsInPortfolioAsync(int portfolioId, string symbol);
}
