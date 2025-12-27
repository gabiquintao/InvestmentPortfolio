// ============================================================================
// File: InvestmentPortfolio.Api/WcfClients/TransactionWcfClient.cs
// Purpose: WCF client for transaction operations.
//          Wraps the ITransactionWcfService interface, providing logging, endpoint 
//          configuration, and channel management.
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Transactions;
using InvestmentPortfolio.Contracts.Models;
using InvestmentPortfolio.Contracts.ServiceContracts;

namespace InvestmentPortfolio.Api.WcfClients
{
	/// <summary>
	/// WCF client for transaction operations.
	/// Wraps the <see cref="ITransactionWcfService"/> interface, adding logging and channel management.
	/// </summary>
	public class TransactionWcfClient : WcfClientBase<ITransactionWcfService>
	{
		public TransactionWcfClient(IConfiguration configuration, ILogger<TransactionWcfClient> logger)
			: base(
				configuration["WcfServices:TransactionService"]
					?? throw new InvalidOperationException("TransactionService URL not configured"),
				logger)
		{
		}

		/// <inheritdoc cref="ITransactionWcfService.GetUserTransactionsAsync"/>
		public async Task<ServiceResponse<List<TransactionDto>>> GetUserTransactionsAsync(int userId)
		{
			_logger.LogInformation("Calling WCF GetUserTransactionsAsync for userId: {UserId}", userId);
			return await Channel.GetUserTransactionsAsync(userId);
		}

		/// <inheritdoc cref="ITransactionWcfService.GetPortfolioTransactionsAsync"/>
		public async Task<ServiceResponse<List<TransactionDto>>> GetPortfolioTransactionsAsync(int portfolioId, int userId)
		{
			_logger.LogInformation("Calling WCF GetPortfolioTransactionsAsync for portfolioId: {PortfolioId}, userId: {UserId}", portfolioId, userId);
			return await Channel.GetPortfolioTransactionsAsync(portfolioId, userId);
		}

		/// <inheritdoc cref="ITransactionWcfService.GetByIdAsync"/>
		public async Task<ServiceResponse<TransactionDto>> GetByIdAsync(int transactionId, int userId)
		{
			_logger.LogInformation("Calling WCF GetByIdAsync for transactionId: {TransactionId}, userId: {UserId}", transactionId, userId);
			return await Channel.GetByIdAsync(transactionId, userId);
		}

		/// <inheritdoc cref="ITransactionWcfService.CreateAsync"/>
		public async Task<ServiceResponse<TransactionDto>> CreateAsync(CreateTransactionDto dto, int userId)
		{
			_logger.LogInformation("Calling WCF CreateAsync for userId: {UserId}", userId);
			return await Channel.CreateAsync(dto, userId);
		}
	}
}
