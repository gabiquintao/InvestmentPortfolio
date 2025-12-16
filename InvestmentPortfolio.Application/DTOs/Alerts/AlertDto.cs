// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Alerts/AlertDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Alerts;

/// <summary>
/// DTO for alert
/// </summary>
public class AlertDto
{
	/// <summary>
	/// ID of the alert
	/// </summary>
	public int AlertId { get; set; }

	/// <summary>
	/// ID do utilizador
	/// </summary>
	public int UserId { get; set; }

	/// <summary>
	/// Symbol of the asset
	/// </summary>
	public string AssetSymbol { get; set; } = string.Empty;

	/// <summary>
	/// Condition
	/// </summary>
	public int Condition { get; set; }

	/// <summary>
	/// Condition name
	/// </summary>
	public string ConditionName { get; set; } = string.Empty;

	/// <summary>
	/// Target price
	/// </summary>
	public decimal TargetPrice { get; set; }

	/// <summary>
	/// Is active
	/// </summary>
	public bool IsActive { get; set; }

	/// <summary>
	/// Date of creation
	/// </summary>
	public DateTime CreatedAt { get; set; }

	/// <summary>
	/// Date when it was triggered
	/// </summary>
	public DateTime? TriggeredAt { get; set; }
}