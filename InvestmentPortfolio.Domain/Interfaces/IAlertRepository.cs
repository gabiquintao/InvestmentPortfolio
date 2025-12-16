// ============================================================================
// File: InvestmentPortfolio.Domain/Interfaces/IAlertRepository.cs
// ============================================================================

using InvestmentPortfolio.Domain.Entities;

namespace InvestmentPortfolio.Domain.Interfaces;

/// <summary>
/// Interface for alert repository operations
/// </summary>
public interface IAlertRepository
{
	/// <summary>
	/// Gets an alert by ID
	/// </summary>
	Task<Alert?> GetByIdAsync(int alertId);

	/// <summary>
	/// Gets all alerts for a user
	/// </summary>
	Task<IEnumerable<Alert>> GetByUserIdAsync(int userId);

	/// <summary>
	/// Gets all active alerts
	/// </summary>
	Task<IEnumerable<Alert>> GetActiveAlertsAsync();

	/// <summary>
	/// Gets all active alerts for a symbol
	/// </summary>
	Task<IEnumerable<Alert>> GetActiveAlertsBySymbolAsync(string symbol);

	/// <summary>
	/// Creates a new <see cref="Alert"/>
	/// </summary>
	Task<int> CreateAsync(Alert alert);

	/// <summary>
	/// Updates an existing <see cref="Alert"/>
	/// </summary>
	Task<bool> UpdateAsync(Alert alert);

	/// <summary>
	/// Deletes an alert
	/// </summary>
	Task<bool> DeleteAsync(int alertId);

	/// <summary>
	/// Marks an alert as triggered
	/// </summary>
	Task<bool> MarkAsTriggeredAsync(int alertId);
}
