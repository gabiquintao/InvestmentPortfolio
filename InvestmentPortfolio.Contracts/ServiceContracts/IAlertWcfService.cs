// ============================================================================
// File: InvestmentPortfolio.Contracts/ServiceContracts/IAlertWcfService.cs
// Purpose: WCF service contract defining operations for managing user alerts.
// ============================================================================

using System.ServiceModel;
using InvestmentPortfolio.Application.DTOs.Alerts;
using InvestmentPortfolio.Contracts.Models;

namespace InvestmentPortfolio.Contracts.ServiceContracts;

/// <summary>
/// Defines WCF operations for managing alerts.
/// </summary>
[ServiceContract]
public interface IAlertWcfService
{
	/// <summary>
	/// Retrieves all alerts belonging to a user.
	/// </summary>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A service response containing a list of alert DTOs.</returns>
	[OperationContract]
	Task<ServiceResponse<List<AlertDto>>> GetUserAlertsAsync(int userId);

	/// <summary>
	/// Retrieves all active alerts belonging to a user.
	/// </summary>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A service response containing a list of active alert DTOs.</returns>
	[OperationContract]
	Task<ServiceResponse<List<AlertDto>>> GetActiveAlertsAsync(int userId);

	/// <summary>
	/// Retrieves an alert by its ID for a given user.
	/// </summary>
	/// <param name="alertId">The ID of the alert.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A service response containing the alert DTO, or null if not found.</returns>
	[OperationContract]
	Task<ServiceResponse<AlertDto>> GetByIdAsync(int alertId, int userId);

	/// <summary>
	/// Creates a new alert for a user.
	/// </summary>
	/// <param name="dto">The data transfer object containing alert details.</param>
	/// <param name="userId">The ID of the user creating the alert.</param>
	/// <returns>A service response containing the created alert DTO.</returns>
	[OperationContract]
	Task<ServiceResponse<AlertDto>> CreateAsync(CreateAlertDto dto, int userId);

	/// <summary>
	/// Updates an existing alert for a user.
	/// </summary>
	/// <param name="alertId">The ID of the alert to update.</param>
	/// <param name="dto">The data transfer object containing updated alert details.</param>
	/// <param name="userId">The ID of the user updating the alert.</param>
	/// <returns>A service response containing the updated alert DTO.</returns>
	[OperationContract]
	Task<ServiceResponse<AlertDto>> UpdateAsync(int alertId, UpdateAlertDto dto, int userId);

	/// <summary>
	/// Deletes an alert for a user.
	/// </summary>
	/// <param name="alertId">The ID of the alert to delete.</param>
	/// <param name="userId">The ID of the user deleting the alert.</param>
	/// <returns>A service response indicating whether the deletion was successful.</returns>
	[OperationContract]
	Task<ServiceResponse<bool>> DeleteAsync(int alertId, int userId);
}
