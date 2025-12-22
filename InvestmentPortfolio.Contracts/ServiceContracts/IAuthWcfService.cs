// ============================================================================
// File: InvestmentPortfolio.Contracts/ServiceContracts/IAuthWcfService.cs
// Purpose: WCF service contract defining operations for user authentication, registration, and profile retrieval.
// ============================================================================

using System.ServiceModel;
using InvestmentPortfolio.Application.DTOs.Auth;
using InvestmentPortfolio.Application.DTOs.Users;
using InvestmentPortfolio.Contracts.Models;

namespace InvestmentPortfolio.Contracts.ServiceContracts;

/// <summary>
/// Defines WCF operations for authentication and user profile management.
/// </summary>
[ServiceContract]
public interface IAuthWcfService
{
	/// <summary>
	/// Registers a new user.
	/// </summary>
	/// <param name="request">The DTO containing user registration details.</param>
	/// <returns>A service response containing authentication details and user info.</returns>
	[OperationContract]
	Task<ServiceResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto request);

	/// <summary>
	/// Logs in an existing user.
	/// </summary>
	/// <param name="request">The DTO containing user login credentials.</param>
	/// <returns>A service response containing authentication details and user info.</returns>
	[OperationContract]
	Task<ServiceResponse<AuthResponseDto>> LoginAsync(LoginRequestDto request);

	/// <summary>
	/// Retrieves a user's profile by user ID.
	/// </summary>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>A service response containing the user DTO.</returns>
	[OperationContract]
	Task<ServiceResponse<UserDto>> GetProfileAsync(int userId);

	/// <summary>
	/// Validates a JWT token and returns the associated user ID.
	/// </summary>
	/// <param name="token">The JWT token to validate.</param>
	/// <returns>A service response containing the user ID if valid, or null if invalid.</returns>
	[OperationContract]
	Task<ServiceResponse<int?>> ValidateTokenAsync(string token);
}
