// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Alerts/CreateAlertDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Alerts;

/// <summary>
/// DTO for alert creation
/// </summary>
public class CreateAlertDto
{
	/// <summary>
	/// Asset symbol
	/// </summary>
	public string AssetSymbol { get; set; } = string.Empty;

	/// <summary>
	/// Condition
	/// </summary>
	public int Condition { get; set; }

	/// <summary>
	/// Target price
	/// </summary>
	public decimal TargetPrice { get; set; }
}