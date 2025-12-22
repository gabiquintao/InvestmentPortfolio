// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Auth/RegisterRequestDto.cs
// Purpose: DTO for sending registration requests for new users.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Auth;

/// <summary>
/// DTO representing user registration data.
/// </summary>
[DataContract]
public class RegisterRequestDto
{
	/// <summary>
	/// Email of the user to register.
	/// </summary>
	[DataMember]
	public string Email { get; set; } = string.Empty;

	/// <summary>
	/// Password for the user account.
	/// </summary>
	[DataMember]
	public string Password { get; set; } = string.Empty;

	/// <summary>
	/// Full name of the user.
	/// </summary>
	[DataMember]
	public string FullName { get; set; } = string.Empty;
}
