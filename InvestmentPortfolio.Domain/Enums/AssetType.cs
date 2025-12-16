// ============================================================================
// File: InvestmentPortfolio.Domain/Enums/AssetType.cs
// ============================================================================

namespace InvestmentPortfolio.Domain.Enums;

/// <summary>
/// Type of supported assets
/// </summary>
public enum AssetType
{
	/// <summary>
	/// Stock
	/// </summary>
	Stock = 1,

	/// <summary>
	/// Cryptocurrency
	/// </summary>
	Crypto = 2,

	/// <summary>
	/// Investment fund
	/// </summary>
	Fund = 3
}