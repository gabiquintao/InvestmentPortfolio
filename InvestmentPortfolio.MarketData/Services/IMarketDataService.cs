// ============================================================================
// File: InvestmentPortfolio.MarketData/Services/IMarketDataService.cs
// Purpose: Defines operations for retrieving market data from external providers.
// ============================================================================

using InvestmentPortfolio.MarketData.Models;

namespace InvestmentPortfolio.MarketData.Services;

/// <summary>
/// Defines a service for retrieving market data such as prices, symbol search
/// results, and trending assets from external data providers.
/// </summary>
public interface IMarketDataService
{
	/// <summary>
	/// Retrieves the current market price for the specified asset symbol.
	/// </summary>
	/// <param name="symbol">
	/// The asset symbol (e.g., AAPL, BTC).
	/// </param>
	/// <returns>
	/// A <see cref="MarketPriceResponse"/> containing current price information,
	/// or <c>null</c> if the symbol is not found.
	/// </returns>
	Task<MarketPriceResponse?> GetCurrentPriceAsync(string symbol);

	/// <summary>
	/// Searches for asset symbols that match the specified query.
	/// </summary>
	/// <param name="query">
	/// A partial symbol or asset name used for searching.
	/// </param>
	/// <returns>
	/// A list of matching <see cref="AssetSearchResult"/> entries.
	/// </returns>
	Task<List<AssetSearchResult>> SearchSymbolsAsync(string query);

	/// <summary>
	/// Retrieves a list of assets that are currently trending based on market activity.
	/// </summary>
	/// <returns>
	/// A list of <see cref="TrendingAsset"/> entries.
	/// </returns>
	Task<List<TrendingAsset>> GetTrendingAssetsAsync();
}
