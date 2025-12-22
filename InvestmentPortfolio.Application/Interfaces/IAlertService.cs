// ============================================================================
// File: InvestmentPortfolio.Application/Interfaces/IAlertService.cs
// Purpose: Provides operations for managing user alerts in the investment portfolio application.
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Alerts;

namespace InvestmentPortfolio.Application.Interfaces;

/// <summary>
/// Interface for alert service, providing operations to manage user alerts.
/// </summary>
public interface IAlertService
{
	/// <summary>
	/// Retrieves all alerts for a specific user.
	/// </summary>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A collection of <see cref="AlertDto"/> representing the user's alerts.</returns>
	Task<IEnumerable<AlertDto>> GetUserAlertsAsync(int userId);

	/// <summary>
	/// Retrieves all active alerts for a specific user.
	/// </summary>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A collection of <see cref="AlertDto"/> representing active alerts.</returns>
	Task<IEnumerable<AlertDto>> GetActiveAlertsAsync(int userId);

	/// <summary>
	/// Retrieves a specific alert by its ID for a user.
	/// </summary>
	/// <param name="alertId">The ID of the alert.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The <see cref="AlertDto"/> if found; otherwise, null.</returns>
	Task<AlertDto?> GetByIdAsync(int alertId, int userId);

	/// <summary>
	/// Creates a new alert for a user.
	/// </summary>
	/// <param name="dto">The alert creation data.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The created <see cref="AlertDto"/>.</returns>
	Task<AlertDto> CreateAsync(CreateAlertDto dto, int userId);

	/// <summary>
	/// Updates an existing alert for a user.
	/// </summary>
	/// <param name="alertId">The ID of the alert to update.</param>
	/// <param name="dto">The alert update data.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The updated <see cref="AlertDto"/> if successful; otherwise, null.</returns>
	Task<AlertDto?> UpdateAsync(int alertId, UpdateAlertDto dto, int userId);

	/// <summary>
	/// Deletes a user's alert by its ID.
	/// </summary>
	/// <param name="alertId">The ID of the alert to delete.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>True if the alert was successfully deleted; otherwise, false.</returns>
	Task<bool> DeleteAsync(int alertId, int userId);
}
