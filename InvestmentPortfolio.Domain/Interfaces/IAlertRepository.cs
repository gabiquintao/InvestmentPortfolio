// ============================================================================
// File: InvestmentPortfolio.Domain/Interfaces/IAlertRepository.cs
// Purpose: Interface for alert repository operations, including CRUD and trigger management.
// ============================================================================

using InvestmentPortfolio.Domain.Entities;

namespace InvestmentPortfolio.Domain.Interfaces;

/// <summary>
/// Provides methods for accessing and managing alerts in the data store.
/// </summary>
public interface IAlertRepository
{
	/// <summary>
	/// Gets an alert by its unique identifier.
	/// </summary>
	Task<Alert?> GetByIdAsync(int alertId);

	/// <summary>
	/// Gets all alerts associated with a specific user.
	/// </summary>
	Task<IEnumerable<Alert>> GetByUserIdAsync(int userId);

	/// <summary>
	/// Gets all active alerts.
	/// </summary>
	Task<IEnumerable<Alert>> GetActiveAlertsAsync();

	/// <summary>
	/// Gets all active alerts for a specific asset symbol.
	/// </summary>
	Task<IEnumerable<Alert>> GetActiveAlertsBySymbolAsync(string symbol);

	/// <summary>
	/// Creates a new alert in the data store.
	/// </summary>
	Task<int> CreateAsync(Alert alert);

	/// <summary>
	/// Updates an existing alert.
	/// </summary>
	Task<bool> UpdateAsync(Alert alert);

	/// <summary>
	/// Deletes an alert by its unique identifier.
	/// </summary>
	Task<bool> DeleteAsync(int alertId);

	/// <summary>
	/// Marks an alert as triggered.
	/// </summary>
	Task<bool> MarkAsTriggeredAsync(int alertId);
}
