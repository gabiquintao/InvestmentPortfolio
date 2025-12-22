// ============================================================================
// File: InvestmentPortfolio.Contracts/ServiceContracts/ITransactionWcfService.cs
// Purpose: WCF service contract defining operations for managing transactions in user portfolios.
// ============================================================================

using System.ServiceModel;
using InvestmentPortfolio.Application.DTOs.Transactions;
using InvestmentPortfolio.Contracts.Models;

namespace InvestmentPortfolio.Contracts.ServiceContracts;

/// <summary>
/// Defines WCF operations for managing portfolio transactions.
/// </summary>
[ServiceContract]
public interface ITransactionWcfService
{
	/// <summary>
	/// Retrieves all transactions for a specific user.
	/// </summary>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A service response containing a list of transaction DTOs.</returns>
	[OperationContract]
	Task<ServiceResponse<List<TransactionDto>>> GetUserTransactionsAsync(int userId);

	/// <summary>
	/// Retrieves all transactions for a specific portfolio belonging to a user.
	/// </summary>
	/// <param name="portfolioId">The ID of the portfolio.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A service response containing a list of transaction DTOs.</returns>
	[OperationContract]
	Task<ServiceResponse<List<TransactionDto>>> GetPortfolioTransactionsAsync(int portfolioId, int userId);

	/// <summary>
	/// Retrieves a specific transaction by its ID for a given user.
	/// </summary>
	/// <param name="transactionId">The ID of the transaction.</param>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A service response containing the transaction DTO, or null if not found.</returns>
	[OperationContract]
	Task<ServiceResponse<TransactionDto>> GetByIdAsync(int transactionId, int userId);

	/// <summary>
	/// Creates a new transaction for a user.
	/// </summary>
	/// <param name="dto">The DTO containing transaction creation details.</param>
	/// <param name="userId">The ID of the user creating the transaction.</param>
	/// <returns>A service response containing the created transaction DTO.</returns>
	[OperationContract]
	Task<ServiceResponse<TransactionDto>> CreateAsync(CreateTransactionDto dto, int userId);
}
