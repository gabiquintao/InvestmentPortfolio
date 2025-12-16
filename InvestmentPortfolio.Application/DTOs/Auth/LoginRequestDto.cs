// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Auth/LoginRequestDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Auth;

/// <summary>
/// DTO for authentication request
/// </summary>
public class LoginRequestDto
{
	/// <summary>
	/// Email of the user
	/// </summary>
	public string Email { get; set; } = string.Empty;

	/// <summary>
	/// Password of the user
	/// </summary>
	public string Password { get; set; } = string.Empty;
}