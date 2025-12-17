// ============================================================================
// File: InvestmentPortfolio.Application/Interfaces/ITransactionService.cs
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Transactions;

namespace InvestmentPortfolio.Application.Interfaces;

/// <summary>
/// Interface for transaction service, providing operations to manage user transactions.
/// </summary>
public interface ITransactionService
{
	/// <summary>
	/// Retrieves all transactions for a specific user.
	/// </summary>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A collection of <see cref="TransactionDto"/> representing the user's transactions.</returns>
	Task<IEnumerable<TransactionDto>> GetUserTransactionsAsync(int userId);

	/// <summary>
	/// Retrieves all transactions in a specific portfolio for a user.
	/// </summary>
	/// <param name="portfolioId">The ID of the portfolio.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A collection of <see cref="TransactionDto"/> representing the portfolio's transactions.</returns>
	Task<IEnumerable<TransactionDto>> GetPortfolioTransactionsAsync(int portfolioId, int userId);

	/// <summary>
	/// Retrieves a specific transaction by its ID for a user.
	/// </summary>
	/// <param name="transactionId">The ID of the transaction.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The <see cref="TransactionDto"/> if found; otherwise, null.</returns>
	Task<TransactionDto?> GetByIdAsync(int transactionId, int userId);

	/// <summary>
	/// Creates a new transaction for a user.
	/// </summary>
	/// <param name="dto">The transaction creation data.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The created <see cref="TransactionDto"/>.</returns>
	Task<TransactionDto> CreateAsync(CreateTransactionDto dto, int userId);
}