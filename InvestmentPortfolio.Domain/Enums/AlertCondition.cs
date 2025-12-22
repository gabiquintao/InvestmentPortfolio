// ============================================================================
// File: InvestmentPortfolio.Domain/Enums/AlertCondition.cs
// Purpose: Defines the AlertCondition enum representing conditions that trigger an alert,
//          such as price being above or below a specified value.
// ============================================================================

namespace InvestmentPortfolio.Domain.Enums;

/// <summary>
/// Conditions that can trigger a price alert.
/// </summary>
public enum AlertCondition
{
	/// <summary>
	/// Trigger alert when the price is above the target price.
	/// </summary>
	PriceAbove = 1,

	/// <summary>
	/// Trigger alert when the price is below the target price.
	/// </summary>
	PriceBelow = 2
}
