// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Assets/AssetDto.cs
// Purpose: DTO representing an asset entity in the system.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Assets;

/// <summary>
/// DTO representing an asset within a portfolio.
/// </summary>
[DataContract]
public class AssetDto
{
	/// <summary>
	/// Unique identifier of the asset.
	/// </summary>
	[DataMember]
	public int AssetId { get; set; }

	/// <summary>
	/// Identifier of the portfolio this asset belongs to.
	/// </summary>
	[DataMember]
	public int PortfolioId { get; set; }

	/// <summary>
	/// Symbol of the asset (e.g., stock ticker).
	/// </summary>
	[DataMember]
	public string Symbol { get; set; } = string.Empty;

	/// <summary>
	/// Numeric representation of the asset type.
	/// </summary>
	[DataMember]
	public int AssetType { get; set; }

	/// <summary>
	/// Human-readable name of the asset type.
	/// </summary>
	[DataMember]
	public string AssetTypeName { get; set; } = string.Empty;

	/// <summary>
	/// Quantity of the asset owned.
	/// </summary>
	[DataMember]
	public decimal Quantity { get; set; }

	/// <summary>
	/// Average price at which the asset was purchased.
	/// </summary>
	[DataMember]
	public decimal AvgPurchasePrice { get; set; }

	/// <summary>
	/// Date when the asset was purchased.
	/// </summary>
	[DataMember]
	public DateTime PurchaseDate { get; set; }
}
