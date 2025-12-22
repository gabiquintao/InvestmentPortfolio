// ============================================================================
// File: InvestmentPortfolio.Application/Validators/Assets/CreateAssetValidator.cs
// Purpose: Validates the properties of a CreateAssetDto before adding a new asset to a portfolio,
//          ensuring symbol, type, quantity, average purchase price, and purchase date are valid.
// ============================================================================

using FluentValidation;
using InvestmentPortfolio.Application.DTOs.Assets;

namespace InvestmentPortfolio.Application.Validators.Assets;

/// <summary>
/// Validator for creating assets.
/// Checks symbol format, asset type, quantity, average purchase price, and purchase date.
/// </summary>
public class CreateAssetValidator : AbstractValidator<CreateAssetDto>
{
	public CreateAssetValidator()
	{
		RuleFor(x => x.Symbol)
			.NotEmpty().WithMessage("Asset symbol is required")
			.MaximumLength(20).WithMessage("Symbol cannot exceed 20 characters")
			.Matches(@"^[A-Z0-9\-]+$").WithMessage("Symbol must contain only uppercase letters, number e hyphen");

		RuleFor(x => x.AssetType)
			.Must(t => new[] { 1, 2, 3 }.Contains(t))
			.WithMessage("Invalid type of asset (1=Stock, 2=Crypto, 3=Fund)");

		RuleFor(x => x.Quantity)
			.GreaterThan(0).WithMessage("Quantity must be greater than zero");

		RuleFor(x => x.AvgPurchasePrice)
			.GreaterThan(0).WithMessage("Average purchase price must be greater than zero");

		RuleFor(x => x.PurchaseDate)
			.NotEmpty().WithMessage("Purchase date is required")
			.LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Purchase date cannot be in the future");
	}
}