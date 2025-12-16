// ============================================================================
// File: InvestmentPortfolio.Application/Validators/Alerts/CreateAlertValidator.cs
// ============================================================================

using FluentValidation;
using InvestmentPortfolio.Application.DTOs.Alerts;

namespace InvestmentPortfolio.Application.Validators.Alerts;

/// <summary>
/// Alert creation validator
/// </summary>
public class CreateAlertValidator : AbstractValidator<CreateAlertDto>
{
	public CreateAlertValidator()
	{
		RuleFor(x => x.AssetSymbol)
			.NotEmpty().WithMessage("Asset symbol is required")
			.MaximumLength(20).WithMessage("Symbol cannot exceed 20 characters")
			.Matches(@"^[A-Z0-9\-]+$").WithMessage("ymbol must contain only uppercase letters, number e hyphen");

		RuleFor(x => x.Condition)
			.Must(c => new[] { 1, 2 }.Contains(c))
			.WithMessage("Invalid condition (1=PriceAbove, 2=PriceBelow)");

		RuleFor(x => x.TargetPrice)
			.GreaterThan(0).WithMessage("Target price must be greater than 0");
	}
}