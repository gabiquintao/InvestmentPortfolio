// ============================================================================
// File: InvestmentPortfolio.WCF/DataContracts/PerformanceReportDataContract.cs
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.WCF.DataContracts;

/// <summary>
/// Data contract that represents a performance report for an investment portfolio.
/// This contract is used to transfer aggregated portfolio performance data
/// between the WCF service and its consumers.
/// </summary>
[DataContract]
public class PerformanceReportDataContract
{
	/// <summary>
	/// Gets or sets the unique identifier of the portfolio.
	/// </summary>
	[DataMember]
	public int PortfolioId { get; set; }

	/// <summary>
	/// Gets or sets the name of the portfolio.
	/// </summary>
	[DataMember]
	public string PortfolioName { get; set; } = string.Empty;

	/// <summary>
	/// Gets or sets the start date of the reporting period.
	/// </summary>
	[DataMember]
	public DateTime StartDate { get; set; }

	/// <summary>
	/// Gets or sets the end date of the reporting period.
	/// </summary>
	[DataMember]
	public DateTime EndDate { get; set; }

	/// <summary>
	/// Gets or sets the total amount invested during the reporting period.
	/// </summary>
	[DataMember]
	public decimal TotalInvested { get; set; }

	/// <summary>
	/// Gets or sets the current market value of the portfolio.
	/// </summary>
	[DataMember]
	public decimal CurrentValue { get; set; }

	/// <summary>
	/// Gets or sets the total profit or loss of the portfolio.
	/// </summary>
	[DataMember]
	public decimal TotalProfit { get; set; }

	/// <summary>
	/// Gets or sets the profit or loss percentage relative to the total invested amount.
	/// </summary>
	[DataMember]
	public decimal ProfitPercentage { get; set; }

	/// <summary>
	/// Gets or sets the total number of transactions considered in the report.
	/// </summary>
	[DataMember]
	public int TotalTransactions { get; set; }

	/// <summary>
	/// Gets or sets the date and time when the report was generated.
	/// </summary>
	[DataMember]
	public DateTime GeneratedAt { get; set; }
}
