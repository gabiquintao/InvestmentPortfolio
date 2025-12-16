// ============================================================================
// File: InvestmentPortfolio.Application/Validators/Alerts/UpdateAlertValidator.cs
// ============================================================================

using FluentValidation;
using InvestmentPortfolio.Application.DTOs.Alerts;

namespace InvestmentPortfolio.Application.Validators.Alerts;

/// <summary>
/// Alert update validator
/// </summary>
public class UpdateAlertValidator : AbstractValidator<UpdateAlertDto>
{
	public UpdateAlertValidator()
	{
		RuleFor(x => x.TargetPrice)
			.GreaterThan(0).WithMessage("Target price must be greater than 0");
	}
}