// ============================================================================
// File: InvestmentPortfolio.Api/WcfClients/AlertWcfClient.cs
// Purpose: WCF client for alert operations.
//          Wraps the IAlertWcfService interface, providing logging, endpoint 
//          configuration, and channel management.
// ============================================================================

using InvestmentPortfolio.Contracts.ServiceContracts;
using InvestmentPortfolio.Contracts.Models;
using InvestmentPortfolio.Application.DTOs.Alerts;

namespace InvestmentPortfolio.Api.WcfClients
{
	/// <summary>
	/// WCF client for alert operations.
	/// Wraps the <see cref="IAlertWcfService"/> interface, adding logging and channel management.
	/// </summary>
	public class AlertWcfClient : WcfClientBase<IAlertWcfService>
	{
		public AlertWcfClient(IConfiguration configuration, ILogger<AlertWcfClient> logger)
			: base(
				configuration["WcfServices:AlertService"]
					?? throw new InvalidOperationException("AlertService URL not configured"),
				logger)
		{
		}

		/// <inheritdoc cref="IAlertWcfService.GetUserAlertsAsync"/>
		public async Task<ServiceResponse<List<AlertDto>>> GetUserAlertsAsync(int userId)
		{
			_logger.LogInformation("Calling WCF GetUserAlertsAsync for userId: {UserId}", userId);
			return await Channel.GetUserAlertsAsync(userId);
		}

		/// <inheritdoc cref="IAlertWcfService.GetActiveAlertsAsync"/>
		public async Task<ServiceResponse<List<AlertDto>>> GetActiveAlertsAsync(int userId)
		{
			_logger.LogInformation("Calling WCF GetActiveAlertsAsync for userId: {UserId}", userId);
			return await Channel.GetActiveAlertsAsync(userId);
		}

		/// <inheritdoc cref="IAlertWcfService.GetByIdAsync"/>
		public async Task<ServiceResponse<AlertDto>> GetByIdAsync(int alertId, int userId)
		{
			_logger.LogInformation("Calling WCF GetByIdAsync for alertId: {AlertId}, userId: {UserId}", alertId, userId);
			return await Channel.GetByIdAsync(alertId, userId);
		}

		/// <inheritdoc cref="IAlertWcfService.CreateAsync"/>
		public async Task<ServiceResponse<AlertDto>> CreateAsync(CreateAlertDto dto, int userId)
		{
			_logger.LogInformation("Calling WCF CreateAsync for userId: {UserId}", userId);
			return await Channel.CreateAsync(dto, userId);
		}

		/// <inheritdoc cref="IAlertWcfService.UpdateAsync"/>
		public async Task<ServiceResponse<AlertDto>> UpdateAsync(int alertId, UpdateAlertDto dto, int userId)
		{
			_logger.LogInformation("Calling WCF UpdateAsync for alertId: {AlertId}, userId: {UserId}", alertId, userId);
			return await Channel.UpdateAsync(alertId, dto, userId);
		}

		/// <inheritdoc cref="IAlertWcfService.DeleteAsync"/>
		public async Task<ServiceResponse<bool>> DeleteAsync(int alertId, int userId)
		{
			_logger.LogInformation("Calling WCF DeleteAsync for alertId: {AlertId}, userId: {UserId}", alertId, userId);
			return await Channel.DeleteAsync(alertId, userId);
		}
	}
}
