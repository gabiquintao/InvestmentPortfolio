// ============================================================================
// File: InvestmentPortfolio.Application/Validators/Assets/UpdateAssetValidator.cs
// ============================================================================

using FluentValidation;
using InvestmentPortfolio.Application.DTOs.Assets;

namespace InvestmentPortfolio.Application.Validators.Assets;

/// <summary>
/// Asset update validator
/// </summary>
public class UpdateAssetValidator : AbstractValidator<UpdateAssetDto>
{
	public UpdateAssetValidator()
	{
		RuleFor(x => x.Quantity)
			.GreaterThan(0).WithMessage("Quantity must be greater than zero");

		RuleFor(x => x.AvgPurchasePrice)
			.GreaterThan(0).WithMessage("Average purchase price must be greater than zero");
	}
}