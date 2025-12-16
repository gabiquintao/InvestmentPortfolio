// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Portfolios/CreatePortfolioDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Portfolios;

/// <summary>
/// DTO for portfolio creation
/// </summary>
public class CreatePortfolioDto
{
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
	public string Currency { get; set; } = "EUR";
}
