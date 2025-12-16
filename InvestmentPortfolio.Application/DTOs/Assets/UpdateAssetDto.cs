// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Assets/UpdateAssetDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Assets;

/// <summary>
/// DTO for asset update
/// </summary>
public class UpdateAssetDto
{
	/// <summary>
	/// Quantity
	/// </summary>
	public decimal Quantity { get; set; }

	/// <summary>
	/// Average purchase price
	/// </summary>
	public decimal AvgPurchasePrice { get; set; }
}
