// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Portfolios/UpdatePortfolioDto.cs
// Purpose: DTO for updating an existing portfolio.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Portfolios;

/// <summary>
/// DTO used to update portfolio details.
/// </summary>
[DataContract]
public class UpdatePortfolioDto
{
	/// <summary>
	/// Updated name of the portfolio.
	/// </summary>
	[DataMember]
	public string Name { get; set; } = string.Empty;

	/// <summary>
	/// Updated description of the portfolio.
	/// </summary>
	[DataMember]
	public string Description { get; set; } = string.Empty;

	/// <summary>
	/// Updated base currency of the portfolio.
	/// </summary>
	[DataMember]
	public string Currency { get; set; } = string.Empty;
}
