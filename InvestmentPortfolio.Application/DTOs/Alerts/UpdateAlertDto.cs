// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Alerts/UpdateAlertDto.cs
// Purpose: DTO for updating an existing alert in the system.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Alerts;

/// <summary>
/// DTO used to update an existing alert.
/// </summary>
[DataContract]
public class UpdateAlertDto
{
	/// <summary>
	/// Updated target price for the alert.
	/// </summary>
	[DataMember]
	public decimal TargetPrice { get; set; }

	/// <summary>
	/// Updated active status of the alert.
	/// </summary>
	[DataMember]
	public bool IsActive { get; set; }
}
