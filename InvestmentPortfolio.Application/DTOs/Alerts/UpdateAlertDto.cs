// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Alerts/UpdateAlertDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Alerts;

/// <summary>
/// DTO for alert update
/// </summary>
public class UpdateAlertDto
{
	/// <summary>
	/// Target price
	/// </summary>
	public decimal TargetPrice { get; set; }

	/// <summary>
	/// Is active
	/// </summary>
	public bool IsActive { get; set; }
}
