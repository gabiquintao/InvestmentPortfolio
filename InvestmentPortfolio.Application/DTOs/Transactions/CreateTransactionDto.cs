// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Transactions/CreateTransactionDto.cs
// Purpose: DTO for creating a new transaction in a portfolio.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Transactions;

/// <summary>
/// DTO used to create a new transaction for an asset within a portfolio.
/// </summary>
[DataContract]
public class CreateTransactionDto
{
	/// <summary>
	/// ID of the portfolio where the transaction occurs.
	/// </summary>
	[DataMember]
	public int PortfolioId { get; set; }

	/// <summary>
	/// ID of the asset involved in the transaction.
	/// </summary>
	[DataMember]
	public int AssetId { get; set; }

	/// <summary>
	/// Type of transaction (e.g., buy/sell).
	/// </summary>
	[DataMember]
	public int Type { get; set; }

	/// <summary>
	/// Quantity of the asset in the transaction.
	/// </summary>
	[DataMember]
	public decimal Quantity { get; set; }

	/// <summary>
	/// Price per unit of the asset.
	/// </summary>
	[DataMember]
	public decimal PricePerUnit { get; set; }

	/// <summary>
	/// Transaction fees applied.
	/// </summary>
	[DataMember]
	public decimal Fees { get; set; }

	/// <summary>
	/// Date and time when the transaction occurred.
	/// </summary>
	[DataMember]
	public DateTime TransactionDate { get; set; }

	/// <summary>
	/// Additional notes about the transaction.
	/// </summary>
	[DataMember]
	public string Notes { get; set; } = string.Empty;
}
