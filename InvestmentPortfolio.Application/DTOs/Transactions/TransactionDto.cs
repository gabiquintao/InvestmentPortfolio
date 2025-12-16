// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Transactions/TransactionDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Transactions;

/// <summary>
/// DTO for transaction
/// </summary>
public class TransactionDto
{
	/// <summary>
	/// ID of the transaction
	/// </summary>
	public int TransactionId { get; set; }

	/// <summary>
	/// ID of the portfolio
	/// </summary>
	public int PortfolioId { get; set; }

	/// <summary>
	/// ID of the asset
	/// </summary>
	public int AssetId { get; set; }

	/// <summary>
	/// Symbol of the asset
	/// </summary>
	public string AssetSymbol { get; set; } = string.Empty;

	/// <summary>
	/// Type of the transaction
	/// </summary>
	public int Type { get; set; }

	/// <summary>
	/// Name of the transaction type
	/// </summary>
	public string TypeName { get; set; } = string.Empty;

	/// <summary>
	/// Quantity
	/// </summary>
	public decimal Quantity { get; set; }

	/// <summary>
	/// Price per unit
	/// </summary>
	public decimal PricePerUnit { get; set; }

	/// <summary>
	/// Total amount
	/// </summary>
	public decimal TotalAmount { get; set; }

	/// <summary>
	/// Fees
	/// </summary>
	public decimal Fees { get; set; }

	/// <summary>
	/// Transaction date
	/// </summary>
	public DateTime TransactionDate { get; set; }

	/// <summary>
	/// Notes
	/// </summary>
	public string Notes { get; set; } = string.Empty;
}
