// ============================================================================
// File: InvestmentPortfolio.Domain/Entities/Transaction.cs
// ============================================================================

using InvestmentPortfolio.Domain.Enums;

namespace InvestmentPortfolio.Domain.Entities;

/// <summary>
/// Represents a financial transaction
/// </summary>

public class Transaction
{
	/// <summary>
	/// Unique identifier for the transaction
	/// </summary>
	public int TransactionId { get; set; }

	/// <summary>
	/// Identificador of the portfolio
	/// </summary>
	public int PortfolioId { get; set; }

	/// <summary>
	/// Identifier of the asset
	/// </summary>
	public int AssetId { get; set; }

	/// <summary>
	/// Type of transaction
	/// </summary>
	public TransactionType Type { get; set; }

	/// <summary>
	/// Transacted quantity
	/// </summary>
	public decimal Quantity { get; set; }

	/// <summary>
	/// Price per unit
	/// </summary>
	public decimal PricePerUnit { get; set; }

	/// <summary>
	/// Total amount of the transaction
	/// </summary>
	public decimal TotalAmount { get; set; }

	/// <summary>
	/// Fees of the transactions
	/// </summary>
	public decimal Fees { get; set; }

	/// <summary>
	/// Date and time of the transaction
	/// </summary>
	public DateTime TransactionDate { get; set; }

	/// <summary>
	/// Additional notes of the transaction
	/// </summary>
	public string Notes { get; set; } = string.Empty;

	/// <summary>
	/// Related portfolio
	/// </summary>
	public Portfolio Portfolio { get; set; } = null!;

	/// <summary>
	/// Related active
	/// </summary>
	public Asset Asset { get; set; } = null!;
}