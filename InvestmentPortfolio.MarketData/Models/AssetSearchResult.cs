// ============================================================================
// File: InvestmentPortfolio.MarketData/Models/AssetSearchResult.cs
// Purpose: Represents a search result entry for an asset symbol.
// ============================================================================

namespace InvestmentPortfolio.MarketData.Models;

/// <summary>
/// Represents a result returned from an asset symbol search operation.
/// </summary>
public class AssetSearchResult
{
	/// <summary>
	/// The asset symbol (e.g., AAPL, BTC, EURUSD).
	/// </summary>
	public string Symbol { get; set; } = string.Empty;

	/// <summary>
	/// The full name of the asset or company.
	/// </summary>
	public string Name { get; set; } = string.Empty;

	/// <summary>
	/// The asset type (e.g., Stock, Crypto, Fund).
	/// </summary>
	public string Type { get; set; } = string.Empty;

	/// <summary>
	/// The exchange or market where the asset is traded.
	/// </summary>
	public string Exchange { get; set; } = string.Empty;
}
