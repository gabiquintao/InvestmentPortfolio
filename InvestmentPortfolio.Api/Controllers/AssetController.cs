// ============================================================================
// File: InvestmentPortfolio.Api/Controllers/AssetController.cs
// Purpose: Controller to manage portfolio assets via WCF client and market data.
//          Enriches asset data with real-time market prices.
// ============================================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InvestmentPortfolio.Api.WcfClients;
using InvestmentPortfolio.Application.DTOs.Assets;
using System.Security.Claims;
using System.Text.Json;

namespace InvestmentPortfolio.Api.Controllers
{
	/// <summary>
	/// Controller responsible for managing assets in user portfolios.
	/// All endpoints require authentication.
	/// </summary>
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	[Produces("application/json")]
	public class AssetController : ControllerBase
	{
		private readonly AssetWcfClient _assetClient;
		private readonly IHttpClientFactory _httpClientFactory;
		private readonly ILogger<AssetController> _logger;

		public AssetController(
			AssetWcfClient assetClient,
			IHttpClientFactory httpClientFactory,
			ILogger<AssetController> logger)
		{
			_assetClient = assetClient ?? throw new ArgumentNullException(nameof(assetClient));
			_httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
			_logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		/// <summary>
		/// Gets the authenticated user's ID from JWT.
		/// </summary>
		private int GetUserId()
		{
			var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
				throw new UnauthorizedAccessException("Invalid token");
			return userId;
		}

		/// <summary>
		/// Enriches assets with current market prices from Market Data Service.
		/// </summary>
		private async Task<List<AssetDto>> EnrichWithMarketDataAsync(List<AssetDto> assets)
		{
			if (assets == null || !assets.Any())
				return assets ?? new List<AssetDto>();

			try
			{
				var httpClient = _httpClientFactory.CreateClient("MarketDataService");

				foreach (var asset in assets)
				{
					try
					{
						var response = await httpClient.GetAsync($"/api/marketdata/{asset.Symbol}");

						if (response.IsSuccessStatusCode)
						{
							var content = await response.Content.ReadAsStringAsync();
							var priceData = JsonSerializer.Deserialize<MarketDataResponse>(content,
								new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

							if (priceData?.CurrentPrice > 0)
							{
								asset.CurrentValue = asset.Quantity * priceData.CurrentPrice;
							}
							else
							{
								asset.CurrentValue = asset.Quantity * asset.AvgPurchasePrice;
							}
						}
						else
						{
							_logger.LogWarning("Failed to fetch price for {Symbol}: {StatusCode}",
								asset.Symbol, response.StatusCode);
							asset.CurrentValue = asset.Quantity * asset.AvgPurchasePrice;
						}

						// ✅ ADICIONADO: Recalcula GainLoss após atualizar CurrentValue
						asset.GainLoss = asset.CurrentValue - (asset.Quantity * asset.AvgPurchasePrice);
					}
					catch (Exception ex)
					{
						_logger.LogWarning(ex, "Error fetching price for {Symbol}, using purchase price",
							asset.Symbol);
						asset.CurrentValue = asset.Quantity * asset.AvgPurchasePrice;
						asset.GainLoss = 0; // ✅ Sem ganho/perda se usar preço de compra
					}
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error enriching assets with market data");
				foreach (var asset in assets)
				{
					asset.CurrentValue = asset.Quantity * asset.AvgPurchasePrice;
					asset.GainLoss = 0; // ✅ Sem ganho/perda se falhar completamente
				}
			}

			return assets;
		}

		/// <summary>
		/// Returns all assets for a specific portfolio with current market prices.
		/// </summary>
		[HttpGet("portfolio/{portfolioId}")]
		[ProducesResponseType(typeof(List<AssetDto>), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> GetPortfolioAssets(int portfolioId)
		{
			try
			{
				var userId = GetUserId();
				var response = await _assetClient.GetPortfolioAssetsAsync(portfolioId, userId);

				if (!response.Success)
				{
					if (response.Message?.Contains("not belong") == true)
						return Forbid();
					return BadRequest(new { message = response.Message });
				}

				// Enrich with current market data
				var enrichedAssets = await EnrichWithMarketDataAsync(response.Data!);

				return Ok(enrichedAssets);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error retrieving assets for portfolio {PortfolioId}", portfolioId);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Returns a specific asset by ID with current market price.
		/// </summary>
		[HttpGet("{id}")]
		[ProducesResponseType(typeof(AssetDto), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> GetById(int id)
		{
			try
			{
				var userId = GetUserId();
				var response = await _assetClient.GetByIdAsync(id, userId);

				if (!response.Success)
				{
					if (response.Message?.Contains("not belong") == true)
						return Forbid();
					return NotFound(new { message = response.Message });
				}

				// Enrich with current market data
				var enrichedAssets = await EnrichWithMarketDataAsync(new List<AssetDto> { response.Data! });

				return Ok(enrichedAssets.First());
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error retrieving asset {AssetId}", id);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Creates a new asset in a portfolio.
		/// </summary>
		[HttpPost("portfolio/{portfolioId}")]
		[ProducesResponseType(typeof(AssetDto), StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> Create(int portfolioId, [FromBody] CreateAssetDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			try
			{
				var userId = GetUserId();
				var response = await _assetClient.CreateAsync(portfolioId, dto, userId);

				if (!response.Success)
				{
					if (response.Message?.Contains("not belong") == true)
						return Forbid();
					return BadRequest(new { message = response.Message, errors = response.Errors });
				}

				// Enrich with current market data
				var enrichedAssets = await EnrichWithMarketDataAsync(new List<AssetDto> { response.Data! });

				return CreatedAtAction(nameof(GetById), new { id = response.Data!.AssetId }, enrichedAssets.First());
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating asset in portfolio {PortfolioId}", portfolioId);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Updates an existing asset.
		/// </summary>
		[HttpPut("{id}")]
		[ProducesResponseType(typeof(AssetDto), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> Update(int id, [FromBody] UpdateAssetDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			try
			{
				var userId = GetUserId();
				var response = await _assetClient.UpdateAsync(id, dto, userId);

				if (!response.Success)
				{
					if (response.Message?.Contains("not belong") == true)
						return Forbid();
					return NotFound(new { message = response.Message });
				}

				// Enrich with current market data
				var enrichedAssets = await EnrichWithMarketDataAsync(new List<AssetDto> { response.Data! });

				return Ok(enrichedAssets.First());
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error updating asset {AssetId}", id);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Deletes an asset.
		/// </summary>
		[HttpDelete("{id}")]
		[ProducesResponseType(StatusCodes.Status204NoContent)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> Delete(int id)
		{
			try
			{
				var userId = GetUserId();
				var response = await _assetClient.DeleteAsync(id, userId);

				if (!response.Success)
				{
					if (response.Message?.Contains("not belong") == true)
						return Forbid();
					return NotFound(new { message = response.Message });
				}

				return NoContent();
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error deleting asset {AssetId}", id);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Gets current market price for a symbol from Market Data Service.
		/// </summary>
		[HttpGet("price/{symbol}")]
		[ProducesResponseType(typeof(MarketDataResponse), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status502BadGateway)]
		public async Task<IActionResult> GetPrice(string symbol)
		{
			try
			{
				var httpClient = _httpClientFactory.CreateClient("MarketDataService");
				var response = await httpClient.GetAsync($"/api/marketdata/{symbol}");

				if (response.IsSuccessStatusCode)
				{
					var content = await response.Content.ReadAsStringAsync();
					var data = JsonSerializer.Deserialize<MarketDataResponse>(content,
						new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
					return Ok(data);
				}

				if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
				{
					return NotFound(new { message = $"Symbol {symbol} not found" });
				}

				_logger.LogWarning("Market Data Service returned {StatusCode} for symbol {Symbol}",
					response.StatusCode, symbol);
				return StatusCode(StatusCodes.Status502BadGateway,
					new { message = "Market data service unavailable" });
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error fetching price for symbol {Symbol}", symbol);
				return StatusCode(StatusCodes.Status502BadGateway,
					new { message = "Failed to fetch market data" });
			}
		}

		/// <summary>
		/// Gets asset allocation breakdown for a portfolio.
		/// </summary>
		[HttpGet("portfolio/{portfolioId}/allocation")]
		[ProducesResponseType(typeof(List<AssetAllocationDto>), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> GetAssetAllocation(int portfolioId)
		{
			try
			{
				var userId = GetUserId();
				var assetsResponse = await _assetClient.GetPortfolioAssetsAsync(portfolioId, userId);

				if (!assetsResponse.Success)
				{
					if (assetsResponse.Message?.Contains("not belong") == true)
						return Forbid();
					return BadRequest(new { message = assetsResponse.Message });
				}

				// Enrich with current market data
				var assets = await EnrichWithMarketDataAsync(assetsResponse.Data!);
				var totalValue = assets.Sum(a => a.CurrentValue);

				var allocation = assets
					.GroupBy(a => a.AssetTypeName)
					.Select(g => new AssetAllocationDto
					{
						Type = g.Key,
						Value = g.Sum(a => a.CurrentValue),
						Percentage = totalValue > 0 ? (g.Sum(a => a.CurrentValue) / totalValue) * 100 : 0
					})
					.OrderByDescending(a => a.Value)
					.ToList();

				return Ok(allocation);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error calculating asset allocation for portfolio {PortfolioId}", portfolioId);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Searches for asset symbols using the Market Data Service.
		/// </summary>
		[HttpGet("search")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status502BadGateway)]
		public async Task<IActionResult> SearchSymbols([FromQuery] string query)
		{
			if (string.IsNullOrWhiteSpace(query))
				return BadRequest(new { message = "Search query is required" });

			try
			{
				var httpClient = _httpClientFactory.CreateClient("MarketDataService");
				var response = await httpClient.GetAsync($"/api/marketdata/search?query={Uri.EscapeDataString(query)}");

				if (response.IsSuccessStatusCode)
				{
					var content = await response.Content.ReadAsStringAsync();
					var data = JsonSerializer.Deserialize<object>(content);
					return Ok(data);
				}

				_logger.LogWarning("Market Data Service search returned {StatusCode} for query {Query}",
					response.StatusCode, query);
				return StatusCode(StatusCodes.Status502BadGateway,
					new { message = "Market data service unavailable" });
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error searching symbols with query {Query}", query);
				return StatusCode(StatusCodes.Status502BadGateway,
					new { message = "Failed to search market data" });
			}
		}
	}

	/// <summary>
	/// DTO for asset allocation response.
	/// </summary>
	public class AssetAllocationDto
	{
		public string Type { get; set; } = string.Empty;
		public decimal Value { get; set; }
		public decimal Percentage { get; set; }
	}

	/// <summary>
	/// DTO for market data response from Market Data Service.
	/// </summary>
	public class MarketDataResponse
	{
		public string Symbol { get; set; } = string.Empty;
		public string Name { get; set; } = string.Empty;
		public decimal CurrentPrice { get; set; }
		public decimal? Change { get; set; }
		public decimal? ChangePercent { get; set; }
		public DateTime Timestamp { get; set; }
	}
}