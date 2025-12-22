// ============================================================================
// File: InvestmentPortfolio.Application/Validators/Alerts/UpdateAlertValidator.cs
// Purpose: Validates the properties of an UpdateAlertDto before updating an alert,
//          ensuring target price is valid and business rules are respected.
// ============================================================================

using FluentValidation;
using InvestmentPortfolio.Application.DTOs.Alerts;

namespace InvestmentPortfolio.Application.Validators.Alerts;

/// <summary>
/// Validator for updating alerts.
/// Ensures target price is greater than zero.
/// </summary>
public class UpdateAlertValidator : AbstractValidator<UpdateAlertDto>
{
	public UpdateAlertValidator()
	{
		RuleFor(x => x.TargetPrice)
			.GreaterThan(0).WithMessage("Target price must be greater than 0");
	}
}