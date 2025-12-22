// ============================================================================
// File: InvestmentPortfolio.Domain/Entities/Asset.cs
// Purpose: Defines the Asset entity representing a tradable asset within a portfolio,
//          including quantity, type, and associated transactions.
// ============================================================================

using InvestmentPortfolio.Domain.Enums;

namespace InvestmentPortfolio.Domain.Entities;

/// <summary>
/// Represents a tradable asset in a portfolio.
/// </summary>
public class Asset
{
	/// <summary>
	/// Unique identifier of the asset.
	/// </summary>
	public int AssetId { get; set; }

	/// <summary>
	/// Identifier of the portfolio containing this asset.
	/// </summary>
	public int PortfolioId { get; set; }

	/// <summary>
	/// Trading symbol of the asset.
	/// </summary>
	public string Symbol { get; set; } = string.Empty;

	/// <summary>
	/// Type of asset (e.g., stock, crypto, fund).
	/// </summary>
	public AssetType AssetType { get; set; }

	/// <summary>
	/// Quantity of the asset owned.
	/// </summary>
	public decimal Quantity { get; set; }

	/// <summary>
	/// Average purchase price of the asset in portfolio currency.
	/// </summary>
	public decimal AvgPurchasePrice { get; set; }

	/// <summary>
	/// Date and time when the asset was purchased.
	/// </summary>
	public DateTime PurchaseDate { get; set; }

	/// <summary>
	/// The portfolio which owns this asset.
	/// </summary>
	public Portfolio Portfolio { get; set; } = null!;

	/// <summary>
	/// Collection of transactions associated with this asset.
	/// </summary>
	public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
