// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Assets/CreateAssetDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Assets;

/// <summary>
/// DTO for asset creation
/// </summary>
public class CreateAssetDto
{
	/// <summary>
	/// Symbol of the asset
	/// </summary>
	public string Symbol { get; set; } = string.Empty;

	/// <summary>
	/// Type of the asset
	/// </summary>
	public int AssetType { get; set; }

	/// <summary>
	/// Quantity
	/// </summary>
	public decimal Quantity { get; set; }

	/// <summary>
	/// Average purchase price
	/// </summary>
	public decimal AvgPurchasePrice { get; set; }

	/// <summary>
	/// Date of purchase
	/// </summary>
	public DateTime PurchaseDate { get; set; }
}