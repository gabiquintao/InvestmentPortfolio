// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Assets/CreateAssetDto.cs
// Purpose: DTO for creating a new asset in a portfolio.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Assets;

/// <summary>
/// DTO used to create a new asset within a portfolio.
/// </summary>
[DataContract]
public class CreateAssetDto
{
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
	/// Quantity of the asset to add.
	/// </summary>
	[DataMember]
	public decimal Quantity { get; set; }

	/// <summary>
	/// Average purchase price of the asset.
	/// </summary>
	[DataMember]
	public decimal AvgPurchasePrice { get; set; }

	/// <summary>
	/// Date when the asset was purchased.
	/// </summary>
	[DataMember]
	public DateTime PurchaseDate { get; set; }
}
