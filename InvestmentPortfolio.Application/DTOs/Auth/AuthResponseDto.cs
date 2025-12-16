// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Auth/AuthResponseDto.cs
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Users;

namespace InvestmentPortfolio.Application.DTOs.Auth;

/// <summary>
/// DTO for authentication response
/// </summary>
public class AuthResponseDto
{
	/// <summary>
	/// Token JWT
	/// </summary>
	public string Token { get; set; } = string.Empty;

	/// <summary>
	/// Expiration date of the token
	/// </summary>
	public DateTime ExpiresAt { get; set; }

	/// <summary>
	/// Info of the user
	/// </summary>
	public UserDto User { get; set; } = null!;
}
