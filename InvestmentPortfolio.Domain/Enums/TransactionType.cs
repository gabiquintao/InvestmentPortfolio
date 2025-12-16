// ============================================================================
// File: InvestmentPortfolio.Domain/Enums/TransactionType.cs
// ============================================================================

namespace InvestmentPortfolio.Domain.Enums;

/// <summary>
/// Types of transaction
/// </summary>
public enum TransactionType
{
	/// <summary>
	/// Buy of an asset
	/// </summary>
	Buy = 1,

	/// <summary>
	/// Sale of an asset
	/// </summary>
	Sell = 2
}