// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Assets/AssetDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Assets;

/// <summary>
/// DTO for asset
/// </summary>
public class AssetDto
{
	/// <summary>
	/// ID of the asset
	/// </summary>
	public int AssetId { get; set; }

	/// <summary>
	/// ID of the portfolio
	/// </summary>
	public int PortfolioId { get; set; }

	/// <summary>
	/// Symbol of the asset
	/// </summary>
	public string Symbol { get; set; } = string.Empty;

	/// <summary>
	/// Type of asset
	/// </summary>
	public int AssetType { get; set; }

	/// <summary>
	/// Name of the asset type
	/// </summary>
	public string AssetTypeName { get; set; } = string.Empty;

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