// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Alerts/AlertDto.cs
// Purpose: DTO representing an alert entity in the system.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Alerts;

/// <summary>
/// DTO representing an alert.
/// </summary>
[DataContract]
public class AlertDto
{
	/// <summary>
	/// Unique identifier of the alert.
	/// </summary>
	[DataMember]
	public int AlertId { get; set; }

	/// <summary>
	/// ID of the user who owns the alert.
	/// </summary>
	[DataMember]
	public int UserId { get; set; }

	/// <summary>
	/// Symbol of the related asset.
	/// </summary>
	[DataMember]
	public string AssetSymbol { get; set; } = string.Empty;

	/// <summary>
	/// Numeric condition of the alert (e.g., price above/below).
	/// </summary>
	[DataMember]
	public int Condition { get; set; }

	/// <summary>
	/// Name of the condition (e.g., "Above Target").
	/// </summary>
	[DataMember]
	public string ConditionName { get; set; } = string.Empty;

	/// <summary>
	/// Target price for the alert.
	/// </summary>
	[DataMember]
	public decimal TargetPrice { get; set; }

	/// <summary>
	/// Indicates whether the alert is currently active.
	/// </summary>
	[DataMember]
	public bool IsActive { get; set; }

	/// <summary>
	/// Date and time when the alert was created.
	/// </summary>
	[DataMember]
	public DateTime CreatedAt { get; set; }

	/// <summary>
	/// Date and time when the alert was triggered, if applicable.
	/// </summary>
	[DataMember]
	public DateTime? TriggeredAt { get; set; }
}
