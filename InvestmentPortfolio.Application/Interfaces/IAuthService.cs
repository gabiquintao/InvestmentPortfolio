// ============================================================================
// File: InvestmentPortfolio.Application/Interfaces/IAuthService.cs
// Purpose: Handles user authentication, registration, and profile retrieval.
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Auth;
using InvestmentPortfolio.Application.DTOs.Users;

namespace InvestmentPortfolio.Application.Interfaces;

/// <summary>
/// Interface for authentication service, handling user registration, login, and profile retrieval.
/// </summary>
public interface IAuthService
{
	/// <summary>
	/// Registers a new user.
	/// </summary>
	/// <param name="request">The registration request data.</param>
	/// <returns>The authentication response including JWT token and user info.</returns>
	Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);

	/// <summary>
	/// Authenticates a user with credentials.
	/// </summary>
	/// <param name="request">The login request data.</param>
	/// <returns>The authentication response including JWT token and user info.</returns>
	Task<AuthResponseDto> LoginAsync(LoginRequestDto request);

	/// <summary>
	/// Retrieves the profile information of a user.
	/// </summary>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The <see cref="UserDto"/> representing the user's profile.</returns>
	Task<UserDto> GetProfileAsync(int userId);
}