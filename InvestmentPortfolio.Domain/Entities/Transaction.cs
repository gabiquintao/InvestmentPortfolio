// ============================================================================
// File: InvestmentPortfolio.Domain/Entities/Transaction.cs
// Purpose: Defines the Transaction entity representing a financial operation
//          (buy/sell) within a portfolio, including quantity, price, fees, and total amount.
// ============================================================================

using InvestmentPortfolio.Domain.Enums;

namespace InvestmentPortfolio.Domain.Entities;

/// <summary>
/// Represents a financial transaction in a portfolio.
/// </summary>
public class Transaction
{
	/// <summary>
	/// Unique identifier of the transaction.
	/// </summary>
	public int TransactionId { get; set; }

	/// <summary>
	/// Identifier of the portfolio where the transaction occurred.
	/// </summary>
	public int PortfolioId { get; set; }

	/// <summary>
	/// Identifier of the asset involved in the transaction.
	/// </summary>
	public int AssetId { get; set; }

	/// <summary>
	/// Type of transaction (buy or sell).
	/// </summary>
	public TransactionType Type { get; set; }

	/// <summary>
	/// Quantity of the asset transacted.
	/// </summary>
	public decimal Quantity { get; set; }

	/// <summary>
	/// Price per unit of the asset in portfolio currency.
	/// </summary>
	public decimal PricePerUnit { get; set; }

	/// <summary>
	/// Total amount of the transaction including fees.
	/// </summary>
	public decimal TotalAmount { get; set; }

	/// <summary>
	/// Transaction fees applied.
	/// </summary>
	public decimal Fees { get; set; }

	/// <summary>
	/// Date and time when the transaction occurred.
	/// </summary>
	public DateTime TransactionDate { get; set; }

	/// <summary>
	/// Additional notes or comments for the transaction.
	/// </summary>
	public string Notes { get; set; } = string.Empty;

	/// <summary>
	/// Portfolio associated with this transaction.
	/// </summary>
	public Portfolio Portfolio { get; set; } = null!;

	/// <summary>
	/// Asset associated with this transaction.
	/// </summary>
	public Asset Asset { get; set; } = null!;
}
