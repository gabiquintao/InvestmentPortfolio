// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Auth/RegisterRequestDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Auth;

/// <summary>
/// DTO for registering a new user
/// </summary>
public class RegisterRequestDto
{
	/// <summary>
	/// Email of the user
	/// </summary>
	public string Email { get; set; } = string.Empty;

	/// <summary>
	/// Password of the user
	/// </summary>
	public string Password { get; set; } = string.Empty;

	/// <summary>
	/// Full name of the user
	/// </summary>
	public string FullName { get; set; } = string.Empty;
}
