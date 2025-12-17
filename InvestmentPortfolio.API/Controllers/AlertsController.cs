// ============================================================================
// File: InvestmentPortfolio.API/Services/AlertsController.cs
// ============================================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InvestmentPortfolio.Application.DTOs.Alerts;
using InvestmentPortfolio.Application.DTOs.Common;
using InvestmentPortfolio.Application.Interfaces;

namespace InvestmentPortfolio.API.Controllers;

/// <summary>
/// Controller responsible for managing user alerts,
/// including creation, retrieval, update, and deletion.
/// </summary>
/// <remarks>
/// All endpoints return a standardized <see cref="ApiResponse{T}"/> object:
/// - Success: HTTP 200 (or 201 for creation)
/// - Errors: HTTP 400, 403, or 404 depending on the scenario
/// </remarks>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
	private readonly IAlertService _alertService;

	/// <summary>
	/// Initializes a new instance of the <see cref="AlertsController"/> class.
	/// </summary>
	/// <param name="alertService">Alert service.</param>
	/// <exception cref="ArgumentNullException">Thrown if <paramref name="alertService"/> is null.</exception>
	public AlertsController(IAlertService alertService)
	{
		_alertService = alertService ?? throw new ArgumentNullException(nameof(alertService));
	}

	/// <summary>
	/// Retrieves all alerts for the authenticated user.
	/// </summary>
	/// <returns>
	/// Returns <see cref="ApiResponse{IEnumerable{AlertDto}}"/> containing the user's alerts.
	/// </returns>
	/// <response code="200">Alerts retrieved successfully.</response>
	[HttpGet]
	[ProducesResponseType(typeof(ApiResponse<IEnumerable<AlertDto>>), 200)]
	public async Task<IActionResult> GetAll()
	{
		var userId = GetUserIdFromClaims();
		var alerts = await _alertService.GetUserAlertsAsync(userId);

		return Ok(new ApiResponse<IEnumerable<AlertDto>>
		{
			Success = true,
			Message = "Alerts retrieved successfully",
			Data = alerts
		});
	}

	/// <summary>
	/// Retrieves all active alerts for the authenticated user.
	/// </summary>
	/// <returns>
	/// Returns <see cref="ApiResponse{IEnumerable{AlertDto}}"/> containing active alerts.
	/// </returns>
	/// <response code="200">Active alerts retrieved successfully.</response>
	[HttpGet("active")]
	[ProducesResponseType(typeof(ApiResponse<IEnumerable<AlertDto>>), 200)]
	public async Task<IActionResult> GetActive()
	{
		var userId = GetUserIdFromClaims();
		var alerts = await _alertService.GetActiveAlertsAsync(userId);

		return Ok(new ApiResponse<IEnumerable<AlertDto>>
		{
			Success = true,
			Message = "Active alerts retrieved successfully",
			Data = alerts
		});
	}

	/// <summary>
	/// Retrieves a specific alert by its ID.
	/// </summary>
	/// <param name="id">Alert ID.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{AlertDto}"/> if found; otherwise, 404.
	/// </returns>
	/// <response code="200">Alert retrieved successfully.</response>
	/// <response code="404">Alert not found.</response>
	/// <response code="403">Unauthorized access to the alert.</response>
	[HttpGet("{id}")]
	[ProducesResponseType(typeof(ApiResponse<AlertDto>), 200)]
	[ProducesResponseType(typeof(ApiResponse<object>), 404)]
	public async Task<IActionResult> GetById(int id)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var alert = await _alertService.GetByIdAsync(id, userId);

			if (alert == null)
			{
				return NotFound(new ApiResponse<object>
				{
					Success = false,
					Message = "Alert not found"
				});
			}

			return Ok(new ApiResponse<AlertDto>
			{
				Success = true,
				Message = "Alert retrieved successfully",
				Data = alert
			});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
	}

	/// <summary>
	/// Creates a new alert for the authenticated user.
	/// </summary>
	/// <param name="dto">Alert creation data.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{AlertDto}"/> containing the created alert.
	/// </returns>
	/// <response code="201">Alert created successfully.</response>
	/// <response code="400">Invalid alert data.</response>
	[HttpPost]
	[ProducesResponseType(typeof(ApiResponse<AlertDto>), 201)]
	[ProducesResponseType(typeof(ApiResponse<object>), 400)]
	public async Task<IActionResult> Create([FromBody] CreateAlertDto dto)
	{
		var userId = GetUserIdFromClaims();
		var alert = await _alertService.CreateAsync(dto, userId);

		return CreatedAtAction(
			nameof(GetById),
			new { id = alert.AlertId },
			new ApiResponse<AlertDto>
			{
				Success = true,
				Message = "Alert created successfully",
				Data = alert
			});
	}

	/// <summary>
	/// Updates an existing alert.
	/// </summary>
	/// <param name="id">Alert ID.</param>
	/// <param name="dto">Alert update data.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{AlertDto}"/> containing the updated alert.
	/// </returns>
	/// <response code="200">Alert updated successfully.</response>
	/// <response code="404">Alert not found.</response>
	/// <response code="403">Unauthorized access to the alert.</response>
	[HttpPut("{id}")]
	[ProducesResponseType(typeof(ApiResponse<AlertDto>), 200)]
	[ProducesResponseType(typeof(ApiResponse<object>), 404)]
	public async Task<IActionResult> Update(int id, [FromBody] UpdateAlertDto dto)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var alert = await _alertService.UpdateAsync(id, dto, userId);

			if (alert == null)
			{
				return NotFound(new ApiResponse<object>
				{
					Success = false,
					Message = "Alert not found"
				});
			}

			return Ok(new ApiResponse<AlertDto>
			{
				Success = true,
				Message = "Alert updated successfully",
				Data = alert
			});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
	}

	/// <summary>
	/// Deletes an alert.
	/// </summary>
	/// <param name="id">Alert ID.</param>
	/// <returns>
	/// Returns a success response if the alert was deleted.
	/// </returns>
	/// <response code="200">Alert deleted successfully.</response>
	/// <response code="404">Alert not found.</response>
	/// <response code="403">Unauthorized access to the alert.</response>
	[HttpDelete("{id}")]
	[ProducesResponseType(typeof(ApiResponse<object>), 200)]
	[ProducesResponseType(typeof(ApiResponse<object>), 404)]
	public async Task<IActionResult> Delete(int id)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var success = await _alertService.DeleteAsync(id, userId);

			if (!success)
			{
				return NotFound(new ApiResponse<object>
				{
					Success = false,
					Message = "Alert not found"
				});
			}

			return Ok(new ApiResponse<object>
			{
				Success = true,
				Message = "Alert deleted successfully"
			});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
	}

	/// <summary>
	/// Extracts the authenticated user's ID from JWT claims.
	/// </summary>
	/// <returns>User ID.</returns>
	private int GetUserIdFromClaims()
	{
		var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
		return int.Parse(userIdClaim!.Value);
	}
}
