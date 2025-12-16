// ============================================================================
// File: InvestmentPortfolio.Domain/Entities/Alert.cs
// ============================================================================

using InvestmentPortfolio.Domain.Enums;

namespace InvestmentPortfolio.Domain.Entities;

/// <summary>
/// Represents a price alert set by the user
/// </summary>
public class Alert
{
	/// <summary>
	/// Unique identifier of the alert
	/// </summary>
	public int AlertId { get; set; }

	/// <summary>
	/// Identifier of the user
	/// </summary>
	public int UserId { get; set; }

	/// <summary>
	/// Symbol of the asset to track
	/// </summary>
	public string AssetSymbol { get; set; } = string.Empty;

	/// <summary>
	/// Condition of the alert
	/// </summary>
	public AlertCondition Condition { get; set; }

	/// <summary>
	/// Target price that triggers the alert
	/// </summary>
	public decimal TargetPrice { get; set; }

	/// <summary>
	/// Indicates whether the alert is active
	/// </summary>
	public bool IsActive { get; set; }

	/// <summary>
	/// Date and time of the alert creation
	/// </summary>
	public DateTime CreatedAt { get; set; }

	/// <summary>
	/// Date and time the alert was triggered
	/// </summary>
	public DateTime? TriggeredAt { get; set; }

	/// <summary>
	/// The user who this alert belongs to
	/// </summary>
	public User User { get; set; } = null!;
}
