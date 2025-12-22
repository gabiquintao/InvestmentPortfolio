// ============================================================================
// File: InvestmentPortfolio.Wcf/Services/AlertWcfService.cs
// Purpose: WCF service implementation for alert operations, forwarding calls
//			to the application service and wrapping results in ServiceResponse<T>.
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Alerts;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Contracts.Models;
using InvestmentPortfolio.Contracts.ServiceContracts;

namespace InvestmentPortfolio.Wcf.Services;

public class AlertWcfService : IAlertWcfService
{
	private readonly IAlertService _alertService;
	private readonly ILogger<AlertWcfService> _logger;

	/// <summary>
	/// WCF Service implementation for alert operations.
	/// Inherits documentation from <see cref="IAlertWcfService"/>.
	/// </summary>
	public AlertWcfService(
		IAlertService alertService,
		ILogger<AlertWcfService> logger)
	{
		_alertService = alertService ?? throw new ArgumentNullException(nameof(alertService));
		_logger = logger ?? throw new ArgumentNullException(nameof(logger));
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<List<AlertDto>>> GetUserAlertsAsync(int userId)
	{
		try
		{
			_logger.LogInformation("Fetching alerts for user: {UserId}", userId);
			var alerts = await _alertService.GetUserAlertsAsync(userId);
			return ServiceResponse<List<AlertDto>>.SuccessResponse(alerts.ToList());
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error fetching alerts for user: {UserId}", userId);
			return ServiceResponse<List<AlertDto>>.FailureResponse("An error occurred while fetching alerts");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<List<AlertDto>>> GetActiveAlertsAsync(int userId)
	{
		try
		{
			_logger.LogInformation("Fetching active alerts for user: {UserId}", userId);
			var alerts = await _alertService.GetActiveAlertsAsync(userId);
			return ServiceResponse<List<AlertDto>>.SuccessResponse(alerts.ToList());
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error fetching active alerts for user: {UserId}", userId);
			return ServiceResponse<List<AlertDto>>.FailureResponse("An error occurred while fetching active alerts");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<AlertDto>> GetByIdAsync(int alertId, int userId)
	{
		try
		{
			_logger.LogInformation("Fetching alert {AlertId} for user {UserId}", alertId, userId);
			var alert = await _alertService.GetByIdAsync(alertId, userId);

			if (alert == null)
			{
				return ServiceResponse<AlertDto>.FailureResponse("Alert not found");
			}

			return ServiceResponse<AlertDto>.SuccessResponse(alert);
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to alert {AlertId} by user {UserId}", alertId, userId);
			return ServiceResponse<AlertDto>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error fetching alert {AlertId}", alertId);
			return ServiceResponse<AlertDto>.FailureResponse("An error occurred while fetching alert");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<AlertDto>> CreateAsync(CreateAlertDto dto, int userId)
	{
		try
		{
			_logger.LogInformation("Creating alert for user: {UserId}", userId);
			var alert = await _alertService.CreateAsync(dto, userId);
			_logger.LogInformation("Alert created successfully with ID: {AlertId}", alert.AlertId);
			return ServiceResponse<AlertDto>.SuccessResponse(alert, "Alert created successfully");
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error creating alert for user: {UserId}", userId);
			return ServiceResponse<AlertDto>.FailureResponse("An error occurred while creating alert");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<AlertDto>> UpdateAsync(int alertId, UpdateAlertDto dto, int userId)
	{
		try
		{
			_logger.LogInformation("Updating alert {AlertId} for user {UserId}", alertId, userId);
			var alert = await _alertService.UpdateAsync(alertId, dto, userId);

			if (alert == null)
			{
				return ServiceResponse<AlertDto>.FailureResponse("Alert not found");
			}

			_logger.LogInformation("Alert updated successfully: {AlertId}", alertId);
			return ServiceResponse<AlertDto>.SuccessResponse(alert, "Alert updated successfully");
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to alert {AlertId} by user {UserId}", alertId, userId);
			return ServiceResponse<AlertDto>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error updating alert {AlertId}", alertId);
			return ServiceResponse<AlertDto>.FailureResponse("An error occurred while updating alert");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<bool>> DeleteAsync(int alertId, int userId)
	{
		try
		{
			_logger.LogInformation("Deleting alert {AlertId} for user {UserId}", alertId, userId);
			var success = await _alertService.DeleteAsync(alertId, userId);

			if (!success)
			{
				return ServiceResponse<bool>.FailureResponse("Alert not found or could not be deleted");
			}

			_logger.LogInformation("Alert deleted successfully: {AlertId}", alertId);
			return ServiceResponse<bool>.SuccessResponse(true, "Alert deleted successfully");
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to alert {AlertId} by user {UserId}", alertId, userId);
			return ServiceResponse<bool>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error deleting alert {AlertId}", alertId);
			return ServiceResponse<bool>.FailureResponse("An error occurred while deleting alert");
		}
	}
}