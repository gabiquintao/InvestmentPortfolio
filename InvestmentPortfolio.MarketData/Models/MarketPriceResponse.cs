// ============================================================================
// File: InvestmentPortfolio.MarketData/Models/MarketPriceResponse.cs
// Purpose: Represents the current market price and related metrics for an asset.
// ============================================================================

namespace InvestmentPortfolio.MarketData.Models;

/// <summary>
/// Represents the current market price information for an asset.
/// </summary>
public class MarketPriceResponse
{
	/// <summary>
	/// The asset symbol (e.g., AAPL, MSFT, BTC).
	/// </summary>
	public string Symbol { get; set; } = string.Empty;

	/// <summary>
	/// The current market price of the asset.
	/// </summary>
	public decimal CurrentPrice { get; set; }

	/// <summary>
	/// Absolute price change over the last 24 hours.
	/// </summary>
	public decimal Change24h { get; set; }

	/// <summary>
	/// Percentage price change over the last 24 hours.
	/// </summary>
	public decimal ChangePercent24h { get; set; }

	/// <summary>
	/// Trading volume over the last 24 hours.
	/// </summary>
	public decimal Volume24h { get; set; }

	/// <summary>
	/// The UTC date and time when the price was last updated.
	/// </summary>
	public DateTime LastUpdated { get; set; }

	/// <summary>
	/// The data source that provided the market price (e.g., Yahoo Finance, CoinGecko).
	/// </summary>
	public string Source { get; set; } = string.Empty;
}
