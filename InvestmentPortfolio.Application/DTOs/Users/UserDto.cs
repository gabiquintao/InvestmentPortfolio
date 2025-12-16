// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Users/UserDto.cs
// ============================================================================

namespace InvestmentPortfolio.Application.DTOs.Users;

/// <summary>
/// DTO for user info
/// </summary>
public class UserDto
{
	/// <summary>
	/// ID of the user
	/// </summary>
	public int UserId { get; set; }

	/// <summary>
	/// Email of the user
	/// </summary>
	public string Email { get; set; } = string.Empty;

	/// <summary>
	/// Full name of the user
	/// </summary>
	public string FullName { get; set; } = string.Empty;

	/// <summary>
	/// Date and time when the user was created
	/// </summary>
	public DateTime CreatedAt { get; set; }
}