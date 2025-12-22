// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Transactions/TransactionDto.cs
// Purpose: DTO representing transaction details.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Transactions;

/// <summary>
/// DTO representing a transaction of an asset within a portfolio.
/// </summary>
[DataContract]
public class TransactionDto
{
	/// <summary>
	/// Unique identifier of the transaction.
	/// </summary>
	[DataMember]
	public int TransactionId { get; set; }

	/// <summary>
	/// ID of the portfolio where the transaction occurred.
	/// </summary>
	[DataMember]
	public int PortfolioId { get; set; }

	/// <summary>
	/// ID of the asset involved in the transaction.
	/// </summary>
	[DataMember]
	public int AssetId { get; set; }

	/// <summary>
	/// Symbol of the asset.
	/// </summary>
	[DataMember]
	public string AssetSymbol { get; set; } = string.Empty;

	/// <summary>
	/// Numeric type of the transaction (e.g., buy/sell).
	/// </summary>
	[DataMember]
	public int Type { get; set; }

	/// <summary>
	/// Human-readable name of the transaction type.
	/// </summary>
	[DataMember]
	public string TypeName { get; set; } = string.Empty;

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
	/// Total amount of the transaction (Quantity * PricePerUnit).
	/// </summary>
	[DataMember]
	public decimal TotalAmount { get; set; }

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
