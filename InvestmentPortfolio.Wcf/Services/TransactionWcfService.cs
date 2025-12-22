// ============================================================================
// File: InvestmentPortfolio.Wcf/Services/TransactionWcfService.cs
// Purpose: WCF service implementation for transaction operations, forwarding
//          calls to the application service and wrapping results in ServiceResponse<T>.
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Transactions;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Contracts.Models;
using InvestmentPortfolio.Contracts.ServiceContracts;

namespace InvestmentPortfolio.Wcf.Services;

/// <summary>
/// WCF Service implementation for transaction operations
/// </summary>
public class TransactionWcfService : ITransactionWcfService
{
	private readonly ITransactionService _transactionService;
	private readonly ILogger<TransactionWcfService> _logger;

	/// <summary>
	/// WCF Service implementation for transaction operations.
	/// Inherits documentation from <see cref="ITransactionWcfService"/>.
	/// </summary>
	public TransactionWcfService(
		ITransactionService transactionService,
		ILogger<TransactionWcfService> logger)
	{
		_transactionService = transactionService ?? throw new ArgumentNullException(nameof(transactionService));
		_logger = logger ?? throw new ArgumentNullException(nameof(logger));
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<List<TransactionDto>>> GetUserTransactionsAsync(int userId)
	{
		try
		{
			_logger.LogInformation("Fetching transactions for user: {UserId}", userId);
			var transactions = await _transactionService.GetUserTransactionsAsync(userId);
			return ServiceResponse<List<TransactionDto>>.SuccessResponse(transactions.ToList());
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error fetching transactions for user: {UserId}", userId);
			return ServiceResponse<List<TransactionDto>>.FailureResponse("An error occurred while fetching transactions");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<List<TransactionDto>>> GetPortfolioTransactionsAsync(int portfolioId, int userId)
	{
		try
		{
			_logger.LogInformation("Fetching transactions for portfolio {PortfolioId} and user {UserId}", portfolioId, userId);
			var transactions = await _transactionService.GetPortfolioTransactionsAsync(portfolioId, userId);
			return ServiceResponse<List<TransactionDto>>.SuccessResponse(transactions.ToList());
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to portfolio {PortfolioId} by user {UserId}", portfolioId, userId);
			return ServiceResponse<List<TransactionDto>>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error fetching transactions for portfolio {PortfolioId}", portfolioId);
			return ServiceResponse<List<TransactionDto>>.FailureResponse("An error occurred while fetching transactions");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<TransactionDto>> GetByIdAsync(int transactionId, int userId)
	{
		try
		{
			_logger.LogInformation("Fetching transaction {TransactionId} for user {UserId}", transactionId, userId);
			var transaction = await _transactionService.GetByIdAsync(transactionId, userId);

			if (transaction == null)
			{
				return ServiceResponse<TransactionDto>.FailureResponse("Transaction not found");
			}

			return ServiceResponse<TransactionDto>.SuccessResponse(transaction);
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to transaction {TransactionId} by user {UserId}", transactionId, userId);
			return ServiceResponse<TransactionDto>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error fetching transaction {TransactionId}", transactionId);
			return ServiceResponse<TransactionDto>.FailureResponse("An error occurred while fetching transaction");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<TransactionDto>> CreateAsync(CreateTransactionDto dto, int userId)
	{
		try
		{
			_logger.LogInformation("Creating transaction for user: {UserId}", userId);
			var transaction = await _transactionService.CreateAsync(dto, userId);
			_logger.LogInformation("Transaction created successfully with ID: {TransactionId}", transaction.TransactionId);
			return ServiceResponse<TransactionDto>.SuccessResponse(transaction, "Transaction created successfully");
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access by user {UserId}", userId);
			return ServiceResponse<TransactionDto>.FailureResponse(ex.Message);
		}
		catch (KeyNotFoundException ex)
		{
			_logger.LogWarning(ex, "Resource not found while creating transaction");
			return ServiceResponse<TransactionDto>.FailureResponse(ex.Message);
		}
		catch (InvalidOperationException ex)
		{
			_logger.LogWarning(ex, "Invalid operation while creating transaction");
			return ServiceResponse<TransactionDto>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error creating transaction for user: {UserId}", userId);
			return ServiceResponse<TransactionDto>.FailureResponse("An error occurred while creating transaction");
		}
	}
}