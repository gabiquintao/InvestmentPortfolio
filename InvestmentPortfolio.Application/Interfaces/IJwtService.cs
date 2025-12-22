// ============================================================================
// File: InvestmentPortfolio.Application/Interfaces/IJwtService.cs
// Purpose: Provides JWT token generation and validation services for users.
// ============================================================================

using InvestmentPortfolio.Domain.Entities;

namespace InvestmentPortfolio.Application.Interfaces;

/// <summary>
/// Interface for JWT token generation and validation.
/// </summary>
public interface IJwtService
{
	/// <summary>
	/// Generates a JWT token for a given user.
	/// </summary>
	/// <param name="user">The user for whom to generate the token.</param>
	/// <returns>The JWT token as a string.</returns>
	string GenerateToken(User user);

	/// <summary>
	/// Validates a JWT token and returns the user ID if valid.
	/// </summary>
	/// <param name="token">The JWT token to validate.</param>
	/// <returns>The user ID if token is valid; otherwise, null.</returns>
	int? ValidateToken(string token);
}
