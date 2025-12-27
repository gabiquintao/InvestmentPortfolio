// ============================================================================
// File: InvestmentPortfolio.Api/Controllers/PortfolioController.cs
// Purpose: Controller to manage user portfolios via WCF client.
// ============================================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InvestmentPortfolio.Api.WcfClients;
using InvestmentPortfolio.Application.DTOs.Portfolios;
using System.Security.Claims;

namespace InvestmentPortfolio.Api.Controllers
{
	/// <summary>
	/// Controller responsible for managing user portfolios.
	/// All endpoints require authentication.
	/// </summary>
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	[Produces("application/json")]
	public class PortfolioController : ControllerBase
	{
		private readonly PortfolioWcfClient _portfolioClient;
		private readonly AssetWcfClient _assetClient;
		private readonly ILogger<PortfolioController> _logger;

		public PortfolioController(
			PortfolioWcfClient portfolioClient,
			AssetWcfClient assetClient,
			ILogger<PortfolioController> logger)
		{
			_portfolioClient = portfolioClient ?? throw new ArgumentNullException(nameof(portfolioClient));
			_assetClient = assetClient ?? throw new ArgumentNullException(nameof(assetClient));
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
		/// Returns all portfolios of the authenticated user.
		/// </summary>
		[HttpGet]
		[ProducesResponseType(typeof(List<PortfolioDto>), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public async Task<IActionResult> GetUserPortfolios()
		{
			try
			{
				var userId = GetUserId();
				var response = await _portfolioClient.GetUserPortfoliosAsync(userId);

				if (!response.Success)
					return BadRequest(new { message = response.Message, errors = response.Errors });

				return Ok(response.Data);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error retrieving user portfolios");
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Returns a portfolio by ID.
		/// </summary>
		[HttpGet("{id}")]
		[ProducesResponseType(typeof(PortfolioDto), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> GetById(int id)
		{
			try
			{
				var userId = GetUserId();
				var response = await _portfolioClient.GetByIdAsync(id, userId);

				if (!response.Success)
				{
					if (response.Message?.Contains("not belong") == true)
						return Forbid();
					return NotFound(new { message = response.Message });
				}

				return Ok(response.Data);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error retrieving portfolio {PortfolioId}", id);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Creates a new portfolio for the authenticated user.
		/// </summary>
		[HttpPost]
		[ProducesResponseType(typeof(PortfolioDto), StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public async Task<IActionResult> Create([FromBody] CreatePortfolioDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			try
			{
				var userId = GetUserId();
				var response = await _portfolioClient.CreateAsync(dto, userId);

				if (!response.Success)
					return BadRequest(new { message = response.Message, errors = response.Errors });

				return CreatedAtAction(nameof(GetById), new { id = response.Data!.PortfolioId }, response.Data);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating portfolio");
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Updates an existing portfolio.
		/// </summary>
		[HttpPut("{id}")]
		[ProducesResponseType(typeof(PortfolioDto), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> Update(int id, [FromBody] UpdatePortfolioDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			try
			{
				var userId = GetUserId();
				var response = await _portfolioClient.UpdateAsync(id, dto, userId);

				if (!response.Success)
				{
					if (response.Message?.Contains("not belong") == true)
						return Forbid();
					return NotFound(new { message = response.Message });
				}

				return Ok(response.Data);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error updating portfolio {PortfolioId}", id);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Deletes a portfolio.
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
				var response = await _portfolioClient.DeleteAsync(id, userId);

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
				_logger.LogError(ex, "Error deleting portfolio {PortfolioId}", id);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Returns aggregated summaries for all portfolios of the authenticated user.
		/// </summary>
		[HttpGet("summary")]
		[ProducesResponseType(typeof(List<PortfolioSummaryDto>), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status502BadGateway)]
		public async Task<IActionResult> GetPortfolioSummaries()
		{
			try
			{
				var userId = GetUserId();
				var portfoliosResponse = await _portfolioClient.GetUserPortfoliosAsync(userId);

				if (!portfoliosResponse.Success)
					return BadRequest(new { message = portfoliosResponse.Message });

				var summaries = new List<PortfolioSummaryDto>();

				foreach (var portfolio in portfoliosResponse.Data!)
				{
					var assetsResponse = await _assetClient.GetPortfolioAssetsAsync(portfolio.PortfolioId, userId);
					if (!assetsResponse.Success) continue;

					var assets = assetsResponse.Data!;
					var summary = new PortfolioSummaryDto
					{
						PortfolioId = portfolio.PortfolioId,
						PortfolioName = portfolio.Name,
						TotalAssets = assets.Count,
						TotalValue = assets.Sum(a => a.CurrentValue),
						TotalGainLoss = assets.Sum(a => a.GainLoss),
						TopHoldings = assets.OrderByDescending(a => a.CurrentValue).Take(3).ToList()
					};

					summaries.Add(summary);
				}

				return Ok(summaries);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error calculating portfolio summaries");
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}
	}
}
