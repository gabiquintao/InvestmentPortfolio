// ============================================================================
// File: InvestmentPortfolio.Domain/Entities/Portfolio.cs
// Purpose: Defines the Portfolio entity representing an investment portfolio
//          containing assets, transactions, and associated user information.
// ============================================================================

namespace InvestmentPortfolio.Domain.Entities;

/// <summary>
/// Represents an investment portfolio owned by a user.
/// </summary>
public class Portfolio
{
	/// <summary>
	/// Unique identifier of the portfolio.
	/// </summary>
	public int PortfolioId { get; set; }

	/// <summary>
	/// Identifier of the user who owns the portfolio.
	/// </summary>
	public int UserId { get; set; }

	/// <summary>
	/// Name of the portfolio.
	/// </summary>
	public string Name { get; set; } = string.Empty;

	/// <summary>
	/// Description of the portfolio.
	/// </summary>
	public string Description { get; set; } = string.Empty;

	/// <summary>
	/// Base currency used for the portfolio.
	/// </summary>
	public string Currency { get; set; } = "EUR";

	/// <summary>
	/// Date and time when the portfolio was created.
	/// </summary>
	public DateTime CreatedAt { get; set; }

	/// <summary>
	/// The user who owns this portfolio.
	/// </summary>
	public User User { get; set; } = null!;

	/// <summary>
	/// Collection of assets contained in this portfolio.
	/// </summary>
	public ICollection<Asset> Assets { get; set; } = new List<Asset>();

	/// <summary>
	/// Collection of transactions associated with this portfolio.
	/// </summary>
	public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
