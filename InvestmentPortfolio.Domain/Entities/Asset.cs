// ============================================================================
// File: InvestmentPortfolio.Domain/Entities/Asset.cs
// ============================================================================

using InvestmentPortfolio.Domain.Enums;

namespace InvestmentPortfolio.Domain.Entities;

/// <summary>
/// Represents a tradable asset
/// </summary>
public class Asset
{
	/// <summary>
	/// Unique identifier for the asset
	/// </summary>
	public int AssetId { get; set; }

	/// <summary>
	/// Identifier of the portfolio
	/// </summary>
	public int PortfolioId { get; set; }

	/// <summary>
	/// Trading symbol
	/// </summary>
	public string Symbol { get; set; } = string.Empty;

	/// <summary>
	/// Type of asset
	/// </summary>
	public AssetType AssetType { get; set; }

	/// <summary>
	/// Quantity of the asset
	/// </summary>
	public decimal Quantity { get; set; }

	/// <summary>
	/// Average purchase price
	/// </summary>
	public decimal AvgPurchasePrice { get; set; }

	/// <summary>
	/// Date and time of the purchase
	/// </summary>
	public DateTime PurchaseDate { get; set; }

	/// <summary>
	/// The portfolio which this asset belongs to
	/// </summary>
	public Portfolio Portfolio { get; set; } = null!;

	/// <summary>
	/// Collection of transactions of this asset
	/// </summary>
	public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}