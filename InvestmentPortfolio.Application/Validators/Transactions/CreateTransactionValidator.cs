// ============================================================================
// File: InvestmentPortfolio.Application/Validators/Transactions/CreateTransactionValidator.cs
// Purpose: Validates the properties of a CreateTransactionDto before creating a new transaction,
//          enforcing rules for portfolio, asset, transaction type, quantity, price, fees, date, and notes.
// ============================================================================

using FluentValidation;
using InvestmentPortfolio.Application.DTOs.Transactions;

namespace InvestmentPortfolio.Application.Validators.Transactions;

/// <summary>
/// Validator for creating transactions.
/// Ensures portfolio ID, asset ID, type, quantity, price per unit, fees, transaction date, and notes are valid.
/// </summary>
public class CreateTransactionValidator : AbstractValidator<CreateTransactionDto>
{
	public CreateTransactionValidator()
	{
		RuleFor(x => x.PortfolioId)
			.GreaterThan(0).WithMessage("Portfolio ID is required");

		RuleFor(x => x.AssetId)
			.GreaterThan(0).WithMessage("Asset ID is required");

		RuleFor(x => x.Type)
			.Must(t => new[] { 1, 2 }.Contains(t))
			.WithMessage("Invalid transaction type (1=Buy, 2=Sell)");

		RuleFor(x => x.Quantity)
			.GreaterThan(0).WithMessage("Quantity must be greather than 0");

		RuleFor(x => x.PricePerUnit)
			.GreaterThanOrEqualTo(0).WithMessage("Price per unnit cannot be negative");

		RuleFor(x => x.Fees)
			.GreaterThanOrEqualTo(0).WithMessage("Fees cannot be negative");

		RuleFor(x => x.TransactionDate)
			.NotEmpty().WithMessage("Transaction date is required")
			.LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Transaction date cannot be in the future");

		RuleFor(x => x.Notes)
			.MaximumLength(500).WithMessage("Notes cannot exceed 500 characters");
	}
}
