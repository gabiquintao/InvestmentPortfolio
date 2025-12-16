// ============================================================================
// File: InvestmentPortfolio.Domain/Enums/AlertCondition.cs
// ============================================================================

namespace InvestmentPortfolio.Domain.Enums;

/// <summary>
/// Conditions of an alert trigger
/// </summary>
public enum AlertCondition
{
	/// <summary>
	/// Alert when price is above the price trigger
	/// </summary>
	PriceAbove = 1,

	/// <summary>
	/// Alert when price is below the price trigger
	/// </summary>
	PriceBelow = 2
}