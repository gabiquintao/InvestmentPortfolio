// ============================================================================
// File: InvestmentPortfolio.Application/Validators/Portfolios/CreatePortfolioValidator.cs
// ============================================================================

using FluentValidation;
using InvestmentPortfolio.Application.DTOs.Portfolios;

namespace InvestmentPortfolio.Application.Validators.Portfolios;

/// <summary>
/// Portfolio creation validator
/// </summary>
public class CreatePortfolioValidator : AbstractValidator<CreatePortfolioDto>
{
	public CreatePortfolioValidator()
	{
		RuleFor(x => x.Name)
			.NotEmpty().WithMessage("Portfolio name is required")
			.MinimumLength(3).WithMessage("Name must be at least 3 characters")
			.MaximumLength(255).WithMessage("Name cannot exceed 255 characters");

		RuleFor(x => x.Description)
			.MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters");

		RuleFor(x => x.Currency)
			.NotEmpty().WithMessage("Currency is required")
			.Must(c => new[] { "EUR", "USD", "GBP", "BTC" }.Contains(c.ToUpper()))
			.WithMessage("Currency must be EUR, USD, GBP ou BTC");
	}
}
