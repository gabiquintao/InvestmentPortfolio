// ============================================================================
// File: InvestmentPortfolio.Api/WcfClients/AuthWcfClient.cs
// Purpose: WCF client for authentication operations.
//          Wraps the IAuthWcfService interface, providing logging, endpoint 
//          configuration, and channel management.
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Auth;
using InvestmentPortfolio.Application.DTOs.Users;
using InvestmentPortfolio.Contracts.Models;
using InvestmentPortfolio.Contracts.ServiceContracts;

namespace InvestmentPortfolio.Api.WcfClients
{
	/// <summary>
	/// WCF client for authentication operations.
	/// Wraps the <see cref="IAuthWcfService"/> interface, adding logging and channel management.
	/// </summary>
	public class AuthWcfClient : WcfClientBase<IAuthWcfService>
	{
		public AuthWcfClient(IConfiguration configuration, ILogger<AuthWcfClient> logger)
			: base(
				configuration["WcfServices:AuthService"]
					?? throw new InvalidOperationException("AuthService URL not configured"),
				logger)
		{
		}

		/// <inheritdoc cref="IAuthWcfService.RegisterAsync"/>
		public async Task<ServiceResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto request)
		{
			_logger.LogInformation("Calling WCF RegisterAsync for email: {Email}", request.Email);
			return await Channel.RegisterAsync(request);
		}

		/// <inheritdoc cref="IAuthWcfService.LoginAsync"/>
		public async Task<ServiceResponse<AuthResponseDto>> LoginAsync(LoginRequestDto request)
		{
			_logger.LogInformation("Calling WCF LoginAsync for email: {Email}", request.Email);
			return await Channel.LoginAsync(request);
		}

		/// <inheritdoc cref="IAuthWcfService.GetProfileAsync"/>
		public async Task<ServiceResponse<UserDto>> GetProfileAsync(int userId)
		{
			_logger.LogInformation("Calling WCF GetProfileAsync for userId: {UserId}", userId);
			return await Channel.GetProfileAsync(userId);
		}

		/// <inheritdoc cref="IAuthWcfService.ValidateTokenAsync"/>
		public async Task<ServiceResponse<int?>> ValidateTokenAsync(string token)
		{
			_logger.LogInformation("Calling WCF ValidateTokenAsync");
			return await Channel.ValidateTokenAsync(token);
		}
	}
}
