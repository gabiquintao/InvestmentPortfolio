// ============================================================================
// File: InvestmentPortfolio.Domain/Entities/Alert.cs
// Purpose: Defines the Alert entity representing a user-configured price alert
//          for a specific asset, including trigger condition and status.
// ============================================================================

using InvestmentPortfolio.Domain.Enums;

namespace InvestmentPortfolio.Domain.Entities;

/// <summary>
/// Represents a price alert set by a user for a specific asset.
/// </summary>
public class Alert
{
	/// <summary>
	/// Unique identifier of the alert.
	/// </summary>
	public int AlertId { get; set; }

	/// <summary>
	/// Identifier of the user who owns the alert.
	/// </summary>
	public int UserId { get; set; }

	/// <summary>
	/// Symbol of the asset to track.
	/// </summary>
	public string AssetSymbol { get; set; } = string.Empty;

	/// <summary>
	/// Condition that triggers the alert (above or below a price).
	/// </summary>
	public AlertCondition Condition { get; set; }

	/// <summary>
	/// Target price that triggers the alert.
	/// </summary>
	public decimal TargetPrice { get; set; }

	/// <summary>
	/// Indicates whether the alert is currently active.
	/// </summary>
	public bool IsActive { get; set; }

	/// <summary>
	/// Date and time when the alert was created.
	/// </summary>
	public DateTime CreatedAt { get; set; }

	/// <summary>
	/// Date and time when the alert was triggered, if applicable.
	/// </summary>
	public DateTime? TriggeredAt { get; set; }

	/// <summary>
	/// The user who owns this alert.
	/// </summary>
	public User User { get; set; } = null!;
}
