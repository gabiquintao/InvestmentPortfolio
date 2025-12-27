// ============================================================================
// File: InvestmentPortfolio.MarketData/Models/TrendingAsset.cs
// Purpose: Represents an asset that is currently trending based on market activity.
// ============================================================================

namespace InvestmentPortfolio.MarketData.Models;

/// <summary>
/// Represents an asset that is currently trending based on market activity.
/// </summary>
public class TrendingAsset
{
	/// <summary>
	/// The asset symbol.
	/// </summary>
	public string Symbol { get; set; } = string.Empty;

	/// <summary>
	/// The full name of the asset.
	/// </summary>
	public string Name { get; set; } = string.Empty;

	/// <summary>
	/// The current market price of the asset.
	/// </summary>
	public decimal CurrentPrice { get; set; }

	/// <summary>
	/// Percentage price change over the last 24 hours.
	/// </summary>
	public decimal ChangePercent24h { get; set; }

	/// <summary>
	/// Trading volume over the last 24 hours.
	/// </summary>
	public decimal Volume24h { get; set; }
}
