// ============================================================================
// File: InvestmentPortfolio.MarketData/Controllers/MarketController.cs
// Purpose: Exposes REST endpoints for market data operations.
//          Provides access to asset prices, symbol search, trending assets,
//          and service health status. Integrates caching, logging, and
//          external market data services.
// ============================================================================

using Microsoft.AspNetCore.Mvc;
using InvestmentPortfolio.MarketData.Models;
using InvestmentPortfolio.MarketData.Services;

namespace InvestmentPortfolio.MarketData.Controllers
{
	/// <summary>
	/// API controller responsible for market data operations.
	/// Provides endpoints for retrieving asset prices, searching symbols,
	/// fetching trending assets, and checking service health.
	/// </summary>
	[ApiController]
	[Route("api/[controller]")]
	public class MarketController : ControllerBase
	{
		private readonly IMarketDataService _marketDataService;
		private readonly ICacheService _cacheService;
		private readonly ILogger<MarketController> _logger;

		/// <summary>
		/// Initializes a new instance of the <see cref="MarketController"/> class.
		/// </summary>
		/// <param name="marketDataService">Service responsible for retrieving market data.</param>
		/// <param name="cacheService">Cache service used to store and retrieve market data.</param>
		/// <param name="logger">Logger instance for diagnostic and error logging.</param>
		public MarketController(
			IMarketDataService marketDataService,
			ICacheService cacheService,
			ILogger<MarketController> logger)
		{
			_marketDataService = marketDataService ?? throw new ArgumentNullException(nameof(marketDataService));
			_cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));
			_logger = logger;
		}

		/// <summary>
		/// Retrieves the current market price for a given asset symbol.
		/// Results are cached to reduce external service calls.
		/// </summary>
		/// <param name="symbol">The asset symbol (e.g., AAPL, MSFT).</param>
		/// <returns>The current market price for the specified symbol.</returns>
		/// <response code="200">Returns the market price.</response>
		/// <response code="404">If price data is unavailable for the symbol.</response>
		/// <response code="500">If an internal error occurs.</response>
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

		/// <summary>
		/// Searches for asset symbols matching the provided query.
		/// </summary>
		/// <param name="query">Partial symbol or asset name.</param>
		/// <returns>A list of matching asset search results.</returns>
		/// <response code="200">Returns the list of matching assets.</response>
		/// <response code="400">If the query is invalid.</response>
		/// <response code="500">If an internal error occurs.</response>
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

		/// <summary>
		/// Retrieves a list of currently trending assets.
		/// Results are cached to improve performance.
		/// </summary>
		/// <returns>A list of trending assets.</returns>
		/// <response code="200">Returns the list of trending assets.</response>
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
					return Ok(new List<TrendingAsset>());
				}

				await _cacheService.SetAsync("trending", trending, TimeSpan.FromMinutes(30));
				return Ok(trending);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error getting trending assets");
				return Ok(new List<TrendingAsset>());
			}
		}

		/// <summary>
		/// Health check endpoint for the Market Data API.
		/// </summary>
		/// <returns>Service health status and timestamp.</returns>
		/// <response code="200">Indicates the service is healthy.</response>
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
}
