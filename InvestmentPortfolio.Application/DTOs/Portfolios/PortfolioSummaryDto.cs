// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Portfolios/PortfolioSummaryDto.cs
// Purpose: DTO representing a portfolio summary for frontend display.
// ============================================================================

using System.Runtime.Serialization;
using InvestmentPortfolio.Application.DTOs.Assets;

namespace InvestmentPortfolio.Application.DTOs.Portfolios;

/// <summary>
/// DTO representing a summary of a user's portfolio.
/// Includes aggregated values and top holdings.
/// </summary>
[DataContract]
public class PortfolioSummaryDto
{
	/// <summary>
	/// Unique identifier of the portfolio.
	/// </summary>
	[DataMember]
	public int PortfolioId { get; set; }

	/// <summary>
	/// Name of the portfolio.
	/// </summary>
	[DataMember]
	public string PortfolioName { get; set; } = string.Empty;

	/// <summary>
	/// Total current value of the portfolio (sum of asset values).
	/// </summary>
	[DataMember]
	public decimal TotalValue { get; set; }

	/// <summary>
	/// Total gain or loss across all assets in the portfolio.
	/// </summary>
	[DataMember]
	public decimal TotalGainLoss { get; set; }

	/// <summary>
	/// Total number of assets in the portfolio.
	/// </summary>
	[DataMember]
	public int TotalAssets { get; set; }

	/// <summary>
	/// List of top holdings by current value (limited, e.g., top 3).
	/// </summary>
	[DataMember]
	public List<AssetDto> TopHoldings { get; set; } = new();
}
