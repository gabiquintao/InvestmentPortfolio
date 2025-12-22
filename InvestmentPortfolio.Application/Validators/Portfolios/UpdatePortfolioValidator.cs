// ============================================================================
// File: InvestmentPortfolio.Application/Validators/Portfolios/UpdatePortfolioValidator.cs
// Purpose: Validates the properties of an UpdatePortfolioDto before updating an existing portfolio,
//          ensuring name, description, and currency follow business rules.
// ============================================================================

using FluentValidation;
using InvestmentPortfolio.Application.DTOs.Portfolios;

namespace InvestmentPortfolio.Application.Validators.Portfolios;

/// <summary>
/// Validator for updating portfolios.
/// Ensures portfolio name, description, and currency are valid.
/// </summary>
public class UpdatePortfolioValidator : AbstractValidator<UpdatePortfolioDto>
{
	public UpdatePortfolioValidator()
	{
		RuleFor(x => x.Name)
			.NotEmpty().WithMessage("Portfolio name is required")
			.MinimumLength(3).WithMessage("Name must be at least 3 characters")
			.MaximumLength(255).WithMessage("Name cannot exceed 255 characters");

		RuleFor(x => x.Description)
			.MaximumLength(1000).WithMessage("Name cannot exceed 1000 characters");

		RuleFor(x => x.Currency)
			.NotEmpty().WithMessage("Currency is required")
			.Must(c => new[] { "EUR", "USD", "GBP", "BTC" }.Contains(c.ToUpper()))
			.WithMessage("Currency must be EUR, USD, GBP ou BTC");
	}
}
