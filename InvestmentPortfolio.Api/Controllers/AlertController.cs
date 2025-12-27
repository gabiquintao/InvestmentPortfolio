// ============================================================================
// File: InvestmentPortfolio.Api/Controllers/AlertController.cs
// Purpose: Controller to manage user alerts via WCF client.
// ============================================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InvestmentPortfolio.Api.WcfClients;
using InvestmentPortfolio.Application.DTOs.Alerts;
using System.Security.Claims;

namespace InvestmentPortfolio.Api.Controllers
{
	/// <summary>
	/// Controller responsible for managing user alerts.
	/// All endpoints require authentication.
	/// </summary>
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	[Produces("application/json")]
	public class AlertController : ControllerBase
	{
		private readonly AlertWcfClient _alertClient;
		private readonly ILogger<AlertController> _logger;

		/// <summary>
		/// Controller constructor.
		/// </summary>
		public AlertController(AlertWcfClient alertClient, ILogger<AlertController> logger)
		{
			_alertClient = alertClient ?? throw new ArgumentNullException(nameof(alertClient));
			_logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		/// <summary>
		/// Gets the authenticated user's ID from the JWT token.
		/// </summary>
		/// <exception cref="UnauthorizedAccessException">Thrown when the token is invalid or missing.</exception>
		private int GetUserId()
		{
			var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
				throw new UnauthorizedAccessException("Invalid token");
			return userId;
		}

		/// <summary>
		/// Returns all alerts of the authenticated user.
		/// </summary>
		[HttpGet]
		[ProducesResponseType(typeof(List<AlertDto>), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public async Task<IActionResult> GetUserAlerts()
		{
			try
			{
				var userId = GetUserId();
				var response = await _alertClient.GetUserAlertsAsync(userId);

				if (!response.Success)
					return BadRequest(new { message = response.Message });

				return Ok(response.Data);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error retrieving user alerts");
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Returns only the active alerts of the authenticated user.
		/// </summary>
		[HttpGet("active")]
		[ProducesResponseType(typeof(List<AlertDto>), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public async Task<IActionResult> GetActiveAlerts()
		{
			try
			{
				var userId = GetUserId();
				var response = await _alertClient.GetActiveAlertsAsync(userId);

				if (!response.Success)
					return BadRequest(new { message = response.Message });

				return Ok(response.Data);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error retrieving active alerts");
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Returns a specific alert by ID.
		/// </summary>
		[HttpGet("{id}")]
		[ProducesResponseType(typeof(AlertDto), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> GetById(int id)
		{
			try
			{
				var userId = GetUserId();
				var response = await _alertClient.GetByIdAsync(id, userId);

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
				_logger.LogError(ex, "Error retrieving alert {AlertId}", id);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Creates a new alert for the authenticated user.
		/// </summary>
		[HttpPost]
		[ProducesResponseType(typeof(AlertDto), StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> Create([FromBody] CreateAlertDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			try
			{
				var userId = GetUserId();
				var response = await _alertClient.CreateAsync(dto, userId);

				if (!response.Success)
					return BadRequest(new { message = response.Message, errors = response.Errors });

				return CreatedAtAction(nameof(GetById), new { id = response.Data!.AlertId }, response.Data);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating alert");
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Updates an existing alert for the authenticated user.
		/// </summary>
		[HttpPut("{id}")]
		[ProducesResponseType(typeof(AlertDto), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> Update(int id, [FromBody] UpdateAlertDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			try
			{
				var userId = GetUserId();
				var response = await _alertClient.UpdateAsync(id, dto, userId);

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
				_logger.LogError(ex, "Error updating alert {AlertId}", id);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Deletes an alert for the authenticated user.
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
				var response = await _alertClient.DeleteAsync(id, userId);

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
				_logger.LogError(ex, "Error deleting alert {AlertId}", id);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}
	}
}
