using System.Text.Json;
using InvestmentPortfolio.MarketData.Models;
using Microsoft.Extensions.Caching.Memory;

namespace InvestmentPortfolio.MarketData.Services;

/// <summary>
/// Market data service supporting both cryptocurrencies (CoinGecko) and stocks (Alpha Vantage)
/// </summary>
public class MarketDataService : IMarketDataService
{
	private readonly HttpClient _httpClient;
	private readonly ILogger<MarketDataService> _logger;
	private readonly IConfiguration _configuration;
	private readonly IMemoryCache _cache;

	private const string CoinListCacheKey = "coingecko_coin_list";
	private readonly string _alphaVantageApiKey;

	/// <summary>
	/// Well-known crypto symbol → CoinGecko ID mapping.
	/// Prevents ambiguity and lookup failures for major assets.
	/// </summary>
	private static readonly Dictionary<string, string> KnownCryptoMap =
		new(StringComparer.OrdinalIgnoreCase)
		{
			{ "BTC", "bitcoin" },
			{ "ETH", "ethereum" },
			{ "USDT", "tether" },
			{ "BNB", "binancecoin" },
			{ "SOL", "solana" },
			{ "ADA", "cardano" },
			{ "XRP", "ripple" }
		};

	public MarketDataService(
		HttpClient httpClient,
		ILogger<MarketDataService> logger,
		IConfiguration configuration,
		IMemoryCache cache)
	{
		_httpClient = httpClient;
		_logger = logger;
		_configuration = configuration;
		_cache = cache;
		_alphaVantageApiKey = configuration["ApiKeys:AlphaVantage"] ?? "";
	}

	/// <inheritdoc />
	public async Task<List<AssetSearchResult>> SearchSymbolsAsync(string query)
	{
		var results = new List<AssetSearchResult>();

		if (string.IsNullOrWhiteSpace(query))
			return results;

		// --------------------------------------------------------------------
		// Search cryptocurrencies (CoinGecko)
		// --------------------------------------------------------------------
		try
		{
			var coinList = await GetAllCoinGeckoCoinsAsync();

			foreach (var coin in coinList.Values)
			{
				if (coin.Name.Contains(query, StringComparison.OrdinalIgnoreCase) ||
					coin.Symbol.Equals(query, StringComparison.OrdinalIgnoreCase))
				{
					results.Add(new AssetSearchResult
					{
						Symbol = coin.Symbol.ToUpperInvariant(),
						Name = coin.Name,
						Type = "Crypto",
						Exchange = "CoinGecko"
					});

					if (results.Count >= 10)
						break;
				}
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error searching crypto symbols");
		}

		// --------------------------------------------------------------------
		// Search stocks (Alpha Vantage)
		// --------------------------------------------------------------------
		try
		{
			if (!string.IsNullOrEmpty(_alphaVantageApiKey))
			{
				var url =
					$"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={query}&apikey={_alphaVantageApiKey}";

				var response = await _httpClient.GetAsync(url);
				if (!response.IsSuccessStatusCode)
					return results;

				var json = await response.Content.ReadAsStringAsync();
				using var doc = JsonDocument.Parse(json);

				if (!doc.RootElement.TryGetProperty("bestMatches", out var matches))
					return results;

				foreach (var match in matches.EnumerateArray())
				{
					results.Add(new AssetSearchResult
					{
						Symbol = match.GetProperty("1. symbol").GetString() ?? "",
						Name = match.GetProperty("2. name").GetString() ?? "",
						Type = "Stock",
						Exchange = match.GetProperty("4. region").GetString() ?? "US"
					});

					if (results.Count >= 20)
						break;
				}
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error searching stock symbols");
		}

		return results;
	}

	/// <inheritdoc />
	public async Task<List<TrendingAsset>> GetTrendingAssetsAsync()
	{
		var trending = new List<TrendingAsset>();

		// --------------------------------------------------------------------
		// Trending cryptocurrencies (CoinGecko)
		// --------------------------------------------------------------------
		try
		{
			var response =
				await _httpClient.GetAsync("https://api.coingecko.com/api/v3/search/trending");

			if (response.IsSuccessStatusCode)
			{
				var json = await response.Content.ReadAsStringAsync();
				using var doc = JsonDocument.Parse(json);

				if (doc.RootElement.TryGetProperty("coins", out var coins))
				{
					foreach (var item in coins.EnumerateArray())
					{
						var coin = item.GetProperty("item");

						var symbol = coin.GetProperty("symbol").GetString() ?? "";
						var name = coin.GetProperty("name").GetString() ?? "";

						var priceData = await GetCryptoPriceAsync(symbol);

						trending.Add(new TrendingAsset
						{
							Symbol = symbol.ToUpperInvariant(),
							Name = name,
							CurrentPrice = priceData?.CurrentPrice ?? 0,
							ChangePercent24h = priceData?.ChangePercent24h ?? 0,
							Volume24h = priceData?.Volume24h ?? 0
						});

						if (trending.Count >= 10)
							break;
					}
				}
			}
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error retrieving trending crypto assets");
		}

		// --------------------------------------------------------------------
		// Popular stocks (stable fallback)
		// --------------------------------------------------------------------
		var popularStocks = new[] { "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA" };

		foreach (var stock in popularStocks)
		{
			var stockData = await GetStockPriceAsync(stock);
			if (stockData == null)
				continue;

			trending.Add(new TrendingAsset
			{
				Symbol = stock,
				Name = stock,
				CurrentPrice = stockData.CurrentPrice,
				ChangePercent24h = stockData.ChangePercent24h,
				Volume24h = stockData.Volume24h
			});
		}

		return trending;
	}

	public async Task<MarketPriceResponse?> GetCurrentPriceAsync(string symbol)
	{
		var cryptoPrice = await GetCryptoPriceAsync(symbol);
		if (cryptoPrice != null) return cryptoPrice;

		return await GetStockPriceAsync(symbol);
	}

	private async Task<MarketPriceResponse?> GetCryptoPriceAsync(string symbol)
	{
		try
		{
			var coinId = await GetCoinGeckoIdAsync(symbol);
			if (coinId == null) return null;

			var response = await _httpClient.GetAsync(
				$"https://api.coingecko.com/api/v3/simple/price" +
				$"?ids={coinId}&vs_currencies=usd" +
				$"&include_24hr_vol=true&include_24hr_change=true");

			if (!response.IsSuccessStatusCode)
				return null;

			if (!response.Content.Headers.ContentType?.MediaType.Contains("json") == true)
			{
				_logger.LogWarning("CoinGecko returned non-JSON response");
				return null;
			}

			var json = await response.Content.ReadAsStringAsync();
			using var doc = JsonDocument.Parse(json);

			if (!doc.RootElement.TryGetProperty(coinId, out var priceProp))
				return null;

			var price = priceProp.GetProperty("usd").GetDecimal();
			var change = priceProp.GetProperty("usd_24h_change").GetDecimal();
			var volume = priceProp.GetProperty("usd_24h_vol").GetDecimal();

			return new MarketPriceResponse
			{
				Symbol = symbol.ToUpperInvariant(),
				CurrentPrice = price,
				Change24h = change,
				ChangePercent24h = price != 0 ? (change / price) * 100 : 0,
				Volume24h = volume,
				LastUpdated = DateTime.UtcNow,
				Source = "CoinGecko"
			};
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error retrieving crypto price for {Symbol}", symbol);
			return null;
		}
	}

	private async Task<MarketPriceResponse?> GetStockPriceAsync(string symbol)
	{
		if (string.IsNullOrEmpty(_alphaVantageApiKey))
		{
			_logger.LogWarning("Alpha Vantage API key is missing.");
			return null;
		}

		try
		{
			var url = $"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={_alphaVantageApiKey}";
			var response = await _httpClient.GetAsync(url);

			if (!response.IsSuccessStatusCode)
			{
				_logger.LogWarning("Alpha Vantage request failed: {StatusCode}", response.StatusCode);
				return null;
			}

			var json = await response.Content.ReadAsStringAsync();
			using var doc = JsonDocument.Parse(json);

			if (!doc.RootElement.TryGetProperty("Global Quote", out var quote))
			{
				_logger.LogWarning("Alpha Vantage response missing 'Global Quote' for symbol {Symbol}", symbol);
				return null;
			}

			decimal price = 0, change = 0, changePercent = 0, volume = 0;

			// Parsing seguro de cada propriedade
			if (quote.TryGetProperty("05. price", out var priceProp))
				decimal.TryParse(priceProp.GetString(), out price);

			if (quote.TryGetProperty("09. change", out var changeProp))
				decimal.TryParse(changeProp.GetString(), out change);

			if (quote.TryGetProperty("10. change percent", out var percentProp))
			{
				var percentStr = percentProp.GetString()?.Replace("%", "") ?? "0";
				decimal.TryParse(percentStr, out changePercent);
			}

			if (quote.TryGetProperty("06. volume", out var volumeProp))
				decimal.TryParse(volumeProp.GetString(), out volume);

			return new MarketPriceResponse
			{
				Symbol = symbol.ToUpperInvariant(),
				CurrentPrice = price,
				Change24h = change,
				ChangePercent24h = changePercent,
				Volume24h = volume,
				LastUpdated = DateTime.UtcNow,
				Source = "Alpha Vantage"
			};
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error retrieving stock price for {Symbol}", symbol);
			return null;
		}
	}

	private async Task<string?> GetCoinGeckoIdAsync(string symbol)
	{
		if (KnownCryptoMap.TryGetValue(symbol, out var knownId))
			return knownId;

		var coinList = await GetAllCoinGeckoCoinsAsync();
		return coinList.Values
			.FirstOrDefault(c => c.Symbol.Equals(symbol, StringComparison.OrdinalIgnoreCase))
			?.Id;
	}

	private async Task<Dictionary<string, CoinInfo>> GetAllCoinGeckoCoinsAsync()
	{
		if (_cache.TryGetValue(CoinListCacheKey, out Dictionary<string, CoinInfo>? cached) && cached != null)
			return cached;

		try
		{
			var response = await _httpClient.GetAsync("https://api.coingecko.com/api/v3/coins/list");
			response.EnsureSuccessStatusCode();

			var json = await response.Content.ReadAsStringAsync();
			var coins = JsonSerializer.Deserialize<List<CoinInfo>>(json) ?? new();

			var dict = coins.ToDictionary(c => c.Id, c => c);
			_cache.Set(CoinListCacheKey, dict, TimeSpan.FromHours(6));
			return dict;
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error loading CoinGecko coin list");
			return new Dictionary<string, CoinInfo>();
		}
	}

	private record CoinInfo
	{
		public string Id { get; init; } = string.Empty;
		public string Symbol { get; init; } = string.Empty;
		public string Name { get; init; } = string.Empty;
	}
}