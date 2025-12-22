// ============================================================================
// File: InvestmentPortfolio.Application/Validators/Assets/UpdateAssetValidator.cs
// Purpose: Validates the properties of an UpdateAssetDto before updating an existing asset,
//          ensuring quantity and average purchase price are positive and valid.
// ============================================================================

using FluentValidation;
using InvestmentPortfolio.Application.DTOs.Assets;

namespace InvestmentPortfolio.Application.Validators.Assets;

/// <summary>
/// Validator for updating assets.
/// Ensures quantity and average purchase price are greater than zero.
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