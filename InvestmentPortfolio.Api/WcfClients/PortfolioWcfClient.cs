// ============================================================================
// File: InvestmentPortfolio.Api/WcfClients/PortfolioWcfClient.cs
// Purpose: WCF client for portfolio operations.
//          Wraps the IPortfolioWcfService interface, providing logging, endpoint 
//          configuration, and channel management.
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Portfolios;
using InvestmentPortfolio.Contracts.Models;
using InvestmentPortfolio.Contracts.ServiceContracts;

namespace InvestmentPortfolio.Api.WcfClients
{
	/// <summary>
	/// WCF client for portfolio operations.
	/// Wraps the <see cref="IPortfolioWcfService"/> interface, adding logging and channel management.
	/// </summary>
	public class PortfolioWcfClient : WcfClientBase<IPortfolioWcfService>
	{
		public PortfolioWcfClient(IConfiguration configuration, ILogger<PortfolioWcfClient> logger)
			: base(
				configuration["WcfServices:PortfolioService"]
					?? throw new InvalidOperationException("PortfolioService URL not configured"),
				logger)
		{
		}

		/// <inheritdoc cref="IPortfolioWcfService.GetUserPortfoliosAsync"/>
		public async Task<ServiceResponse<List<PortfolioDto>>> GetUserPortfoliosAsync(int userId)
		{
			_logger.LogInformation("Calling WCF GetUserPortfoliosAsync for userId: {UserId}", userId);
			return await Channel.GetUserPortfoliosAsync(userId);
		}

		/// <inheritdoc cref="IPortfolioWcfService.GetByIdAsync"/>
		public async Task<ServiceResponse<PortfolioDto>> GetByIdAsync(int portfolioId, int userId)
		{
			_logger.LogInformation("Calling WCF GetByIdAsync for portfolioId: {PortfolioId}, userId: {UserId}", portfolioId, userId);
			return await Channel.GetByIdAsync(portfolioId, userId);
		}

		/// <inheritdoc cref="IPortfolioWcfService.CreateAsync"/>
		public async Task<ServiceResponse<PortfolioDto>> CreateAsync(CreatePortfolioDto dto, int userId)
		{
			_logger.LogInformation("Calling WCF CreateAsync for userId: {UserId}", userId);
			return await Channel.CreateAsync(dto, userId);
		}

		/// <inheritdoc cref="IPortfolioWcfService.UpdateAsync"/>
		public async Task<ServiceResponse<PortfolioDto>> UpdateAsync(int portfolioId, UpdatePortfolioDto dto, int userId)
		{
			_logger.LogInformation("Calling WCF UpdateAsync for portfolioId: {PortfolioId}, userId: {UserId}", portfolioId, userId);
			return await Channel.UpdateAsync(portfolioId, dto, userId);
		}

		/// <inheritdoc cref="IPortfolioWcfService.DeleteAsync"/>
		public async Task<ServiceResponse<bool>> DeleteAsync(int portfolioId, int userId)
		{
			_logger.LogInformation("Calling WCF DeleteAsync for portfolioId: {PortfolioId}, userId: {UserId}", portfolioId, userId);
			return await Channel.DeleteAsync(portfolioId, userId);
		}
	}
}
