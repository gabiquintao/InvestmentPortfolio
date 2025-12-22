// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Alerts/CreateAlertDto.cs
// Purpose: DTO for creating a new alert in the system.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Alerts;

/// <summary>
/// DTO used to create a new alert.
/// </summary>
[DataContract]
public class CreateAlertDto
{
	/// <summary>
	/// Symbol of the asset associated with the alert.
	/// </summary>
	[DataMember]
	public string AssetSymbol { get; set; } = string.Empty;

	/// <summary>
	/// Numeric condition of the alert (e.g., price above/below).
	/// </summary>
	[DataMember]
	public int Condition { get; set; }

	/// <summary>
	/// Target price for triggering the alert.
	/// </summary>
	[DataMember]
	public decimal TargetPrice { get; set; }
}
