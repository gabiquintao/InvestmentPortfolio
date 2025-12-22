// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Portfolios/CreatePortfolioDto.cs
// Purpose: DTO for creating a new portfolio.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Portfolios;

/// <summary>
/// DTO used to create a new portfolio.
/// </summary>
[DataContract]
public class CreatePortfolioDto
{
	/// <summary>
	/// Name of the portfolio.
	/// </summary>
	[DataMember]
	public string Name { get; set; } = string.Empty;

	/// <summary>
	/// Description of the portfolio.
	/// </summary>
	[DataMember]
	public string Description { get; set; } = string.Empty;

	/// <summary>
	/// Base currency of the portfolio (default: EUR).
	/// </summary>
	[DataMember]
	public string Currency { get; set; } = "EUR";
}
