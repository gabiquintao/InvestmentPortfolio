// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Portfolios/PortfolioDto.cs
// Purpose: DTO representing portfolio details.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Portfolios;

/// <summary>
/// DTO representing a portfolio.
/// </summary>
[DataContract]
public class PortfolioDto
{
	/// <summary>
	/// Unique identifier of the portfolio.
	/// </summary>
	[DataMember]
	public int PortfolioId { get; set; }

	/// <summary>
	/// ID of the portfolio owner.
	/// </summary>
	[DataMember]
	public int UserId { get; set; }

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
	/// Base currency of the portfolio.
	/// </summary>
	[DataMember]
	public string Currency { get; set; } = string.Empty;

	/// <summary>
	/// Date and time when the portfolio was created.
	/// </summary>
	[DataMember]
	public DateTime CreatedAt { get; set; }
}
