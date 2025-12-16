// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Transactions/CreateTransactionDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Transactions;

/// <summary>
/// DTO for transaction creation
/// </summary>
public class CreateTransactionDto
{
	/// <summary>
	/// ID of the portfolio
	/// </summary>
	public int PortfolioId { get; set; }

	/// <summary>
	/// ID of the asset
	/// </summary>
	public int AssetId { get; set; }

	/// <summary>
	/// Type of transaction
	/// </summary>
	public int Type { get; set; }

	/// <summary>
	/// Quantity
	/// </summary>
	public decimal Quantity { get; set; }

	/// <summary>
	/// Price per unit
	/// </summary>
	public decimal PricePerUnit { get; set; }

	/// <summary>
	/// Fees
	/// </summary>
	public decimal Fees { get; set; }

	/// <summary>
	/// Date of the transaction
	/// </summary>
	public DateTime TransactionDate { get; set; }

	/// <summary>
	/// Notes
	/// </summary>
	public string Notes { get; set; } = string.Empty;
}
