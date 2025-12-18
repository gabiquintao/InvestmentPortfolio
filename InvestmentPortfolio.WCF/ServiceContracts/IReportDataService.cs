// ============================================================================
// File: InvestmentPortfolio.WCF/ServiceContracts/IReportDataService.cs
// ============================================================================

using CoreWCF;
using InvestmentPortfolio.WCF.DataContracts;

namespace InvestmentPortfolio.WCF.ServiceContracts
{
	/// <summary>
	/// Service contract that defines operations related to portfolio reporting.
	/// This contract exposes methods for generating performance reports
	/// and exporting transaction history data.
	/// </summary>
	[ServiceContract]
	public interface IReportDataService
	{
		/// <summary>
		/// Generates a performance report for a specific portfolio
		/// within a given date range.
		/// </summary>
		/// <param name="portfolioId">
		/// The unique identifier of the portfolio.
		/// </param>
		/// <param name="startDate">
		/// The start date of the reporting period.
		/// </param>
		/// <param name="endDate">
		/// The end date of the reporting period.
		/// </param>
		/// <returns>
		/// A data contract containing portfolio performance metrics.
		/// </returns>
		[OperationContract]
		Task<PerformanceReportDataContract> GeneratePerformanceReportAsync(
			int portfolioId,
			DateTime startDate,
			DateTime endDate);

		/// <summary>
		/// Exports the transaction history of a portfolio in the specified format.
		/// </summary>
		/// <param name="portfolioId">
		/// The unique identifier of the portfolio.
		/// </param>
		/// <param name="format">
		/// The export format (e.g., "json" or "csv").
		/// </param>
		/// <returns>
		/// A string containing the exported transaction history.
		/// </returns>
		[OperationContract]
		Task<string> ExportTransactionHistoryAsync(int portfolioId, string format);
	}
}
