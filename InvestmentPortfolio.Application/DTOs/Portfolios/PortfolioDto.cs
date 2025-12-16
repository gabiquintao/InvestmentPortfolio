// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Portfolios/PortfolioDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Portfolios;

/// <summary>
/// DTO for portfolio
/// </summary>
public class PortfolioDto
{
	/// <summary>
	/// ID of the portfolio
	/// </summary>
	public int PortfolioId { get; set; }

	/// <summary>
	/// ID of the owner
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
	/// Base currency
	/// </summary>
	public string Currency { get; set; } = string.Empty;

	/// <summary>
	/// Creation date
	/// </summary>
	public DateTime CreatedAt { get; set; }
}