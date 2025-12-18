// ============================================================================
// File: InvestmentPortfolio.WCF/ServiceContracts/ITransactionDataService.cs
// ============================================================================

using CoreWCF;
using InvestmentPortfolio.WCF.DataContracts;

namespace InvestmentPortfolio.WCF.ServiceContracts;

/// <summary>
/// Service contract for transaction data operations.
/// Provides methods to create transactions, retrieve them by portfolio or date range,
/// and calculate portfolio values.
/// </summary>
[ServiceContract]
public interface ITransactionDataService
{
	/// <summary>
	/// Creates a new transaction.
	/// </summary>
	/// <param name="transaction">The transaction data contract.</param>
	/// <returns>The ID of the newly created transaction.</returns>
	[OperationContract]
	Task<int> CreateTransactionAsync(TransactionDataContract transaction);

	/// <summary>
	/// Retrieves all transactions for a specific portfolio.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <returns>List of transaction data contracts.</returns>
	[OperationContract]
	Task<List<TransactionDataContract>> GetTransactionsByPortfolioAsync(int portfolioId);

	/// <summary>
	/// Calculates the total value of a portfolio based on its assets.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <returns>Total value of the portfolio.</returns>
	[OperationContract]
	Task<decimal> CalculatePortfolioValueAsync(int portfolioId);

	/// <summary>
	/// Retrieves transactions for a specific portfolio within a date range.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <param name="startDate">Start date of the range.</param>
	/// <param name="endDate">End date of the range.</param>
	/// <returns>List of transaction data contracts within the specified date range.</returns>
	[OperationContract]
	Task<List<TransactionDataContract>> GetTransactionsByDateRangeAsync(
		int portfolioId,
		DateTime startDate,
		DateTime endDate);
}
