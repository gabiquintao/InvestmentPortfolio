// ============================================================================
// File: InvestmentPortfolio.Domain/Entities/Portfolio.cs
// ============================================================================

namespace InvestmentPortfolio.Domain.Entities;

/// <summary>
/// Represents an investment portfolio
/// </summary>
public class Portfolio
{
	/// <summary>
	/// Unique identifier for the portfolio
	/// </summary>
	public int PortfolioId { get; set; }

	/// <summary>
	/// ID of the user who owns this portfolio
	/// </summary>
	public int UserId { get; set; }

	/// <summary>
	/// Name of the portfolio
	/// </summary>
	public string Name { get; set; } = string.Empty;

	/// <summary>
	/// Description of the portfolio
	/// </summary>
	public string Description { get; set; } = string.Empty;

	/// <summary>
	/// Base currency for the portfolio
	/// </summary>
	public string Currency { get; set; } = "EUR";

	/// <summary>
	/// Date and time when the portfolio was created
	/// </summary>
	public DateTime CreatedAt { get; set; }

	/// <summary>
	/// The user who owns this portfolio
	/// </summary>
	public User User { get; set; } = null!;

	/// <summary>
	/// Collection of assets in this portfolio
	/// </summary>
	public ICollection<Asset> Assets { get; set; } = new List<Asset>();

	/// <summary>
	/// Collection of transactions for this portfolio
	/// </summary>
	public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
