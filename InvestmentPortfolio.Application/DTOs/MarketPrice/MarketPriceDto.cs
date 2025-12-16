// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/MarketData/MarketPriceDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.MarketData;

/// <summary>
/// DTO for market price
/// </summary>
public class MarketPriceDto
{
	/// <summary>
	/// Symbol of the active
	/// </summary>
	public string Symbol { get; set; } = string.Empty;

	/// <summary>
	/// Current price
	/// </summary>
	public decimal CurrentPrice { get; set; }

	/// <summary>
	/// Change in 24h (percentage)
	/// </summary>
	public decimal Change24h { get; set; }

	/// <summary>
	/// Date of last update
	/// </summary>
	public DateTime LastUpdated { get; set; }

	/// <summary>
	/// Source of the data
	/// </summary>
	public string Source { get; set; } = string.Empty;
}