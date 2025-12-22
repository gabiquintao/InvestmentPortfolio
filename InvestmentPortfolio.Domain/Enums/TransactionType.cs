// ============================================================================
// File: InvestmentPortfolio.Domain/Enums/TransactionType.cs
// Purpose: Defines the TransactionType enum representing types of financial transactions.
// ============================================================================

namespace InvestmentPortfolio.Domain.Enums;

/// <summary>
/// Types of transactions supported by the system.
/// </summary>
public enum TransactionType
{
	/// <summary>
	/// Purchase of an asset.
	/// </summary>
	Buy = 1,

	/// <summary>
	/// Sale of an asset.
	/// </summary>
	Sell = 2
}
