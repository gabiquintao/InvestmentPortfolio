using Microsoft.AspNetCore.Mvc;
using InvestmentPortfolio.MarketData.Models;
using InvestmentPortfolio.MarketData.Services;

namespace InvestmentPortfolio.MarketData.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MarketController : ControllerBase
{
	private readonly IMarketDataService _marketDataService;
	private readonly ICacheService _cacheService;
	private readonly ILogger<MarketController> _logger;

	public MarketController(
		IMarketDataService marketDataService,
		ICacheService cacheService,
		ILogger<MarketController> logger)
	{
		_marketDataService = marketDataService ?? throw new ArgumentNullException(nameof(marketDataService));
		_cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));
		_logger = logger;
	}

	[HttpGet("price/{symbol}")]
	[ProducesResponseType(typeof(MarketPriceResponse), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status404NotFound)]
	[ProducesResponseType(StatusCodes.Status500InternalServerError)]
	public async Task<IActionResult> GetPrice(string symbol)
	{
		try
		{
			var cacheKey = $"price:{symbol.ToUpperInvariant()}";
			var cachedPrice = await _cacheService.GetAsync<MarketPriceResponse>(cacheKey);

			if (cachedPrice != null)
				return Ok(cachedPrice);

			var price = await _marketDataService.GetCurrentPriceAsync(symbol);

			if (price == null)
				return NotFound(new { Message = $"Price data unavailable for '{symbol}'." });

			await _cacheService.SetAsync(cacheKey, price, TimeSpan.FromMinutes(5));
			return Ok(price);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error getting price for {Symbol}", symbol);
			return StatusCode(500, new { Message = "An error occurred while retrieving price data." });
		}
	}

	[HttpGet("search")]
	[ProducesResponseType(typeof(List<AssetSearchResult>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status400BadRequest)]
	[ProducesResponseType(StatusCodes.Status500InternalServerError)]
	public async Task<IActionResult> Search([FromQuery] string query)
	{
		try
		{
			if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
				return BadRequest(new { Message = "Query must contain at least 2 characters." });

			var results = await _marketDataService.SearchSymbolsAsync(query);
			return Ok(results);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error searching symbols with query: {Query}", query);
			return StatusCode(500, new { Message = "An error occurred while searching symbols." });
		}
	}

	[HttpGet("trending")]
	[ProducesResponseType(typeof(List<TrendingAsset>), StatusCodes.Status200OK)]
	[ProducesResponseType(StatusCodes.Status500InternalServerError)]
	public async Task<IActionResult> GetTrending()
	{
		try
		{
			var cached = await _cacheService.GetAsync<List<TrendingAsset>>("trending");
			if (cached != null && cached.Count > 0)
			{
				_logger.LogInformation("Returning cached trending assets");
				return Ok(cached);
			}

			_logger.LogInformation("Fetching fresh trending assets data");
			var trending = await _marketDataService.GetTrendingAssetsAsync();

			if (trending == null || trending.Count == 0)
			{
				_logger.LogWarning("No trending assets found");
				return Ok(new List<TrendingAsset>()); // Return empty list instead of error
			}

			await _cacheService.SetAsync("trending", trending, TimeSpan.FromMinutes(30));
			return Ok(trending);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error getting trending assets");
			// Return empty list with error logged instead of 500
			return Ok(new List<TrendingAsset>());
		}
	}

	[HttpGet("health")]
	[ProducesResponseType(StatusCodes.Status200OK)]
	public IActionResult Health()
	{
		return Ok(new
		{
			Status = "Healthy",
			Service = "Market Data API",
			Timestamp = DateTime.UtcNow
		});
	}
}