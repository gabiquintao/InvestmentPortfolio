// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/MarketData/MarketPriceDto.cs
// Purpose: DTO representing market price information for assets.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.MarketData;

/// <summary>
/// DTO representing the current market price of an asset.
/// </summary>
[DataContract]
public class MarketPriceDto
{
	/// <summary>
	/// Symbol of the asset.
	/// </summary>
	[DataMember]
	public string Symbol { get; set; } = string.Empty;

	/// <summary>
	/// Current price of the asset.
	/// </summary>
	[DataMember]
	public decimal CurrentPrice { get; set; }

	/// <summary>
	/// Price change in the last 24 hours (percentage).
	/// </summary>
	[DataMember]
	public decimal Change24h { get; set; }

	/// <summary>
	/// Date and time when the price was last updated.
	/// </summary>
	[DataMember]
	public DateTime LastUpdated { get; set; }

	/// <summary>
	/// Source of the market data.
	/// </summary>
	[DataMember]
	public string Source { get; set; } = string.Empty;
}
