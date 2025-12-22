// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Assets/UpdateAssetDto.cs
// Purpose: DTO for updating an existing asset in a portfolio.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Assets;

/// <summary>
/// DTO used to update an existing asset's details.
/// </summary>
[DataContract]
public class UpdateAssetDto
{
	/// <summary>
	/// Updated quantity of the asset.
	/// </summary>
	[DataMember]
	public decimal Quantity { get; set; }

	/// <summary>
	/// Updated average purchase price of the asset.
	/// </summary>
	[DataMember]
	public decimal AvgPurchasePrice { get; set; }
}
