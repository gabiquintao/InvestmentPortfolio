// ============================================================================
// File: InvestmentPortfolio.Domain/Enums/AssetType.cs
// Purpose: Defines the AssetType enum representing supported types of assets.
// ============================================================================

namespace InvestmentPortfolio.Domain.Enums;

/// <summary>
/// Types of assets supported by the system.
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
