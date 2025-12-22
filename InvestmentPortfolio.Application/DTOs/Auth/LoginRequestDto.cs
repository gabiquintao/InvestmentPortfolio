// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Auth/LoginRequestDto.cs
// Purpose: DTO for sending login requests.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Auth;

/// <summary>
/// DTO representing login credentials for authentication.
/// </summary>
[DataContract]
public class LoginRequestDto
{
	/// <summary>
	/// Email of the user attempting to log in.
	/// </summary>
	[DataMember]
	public string Email { get; set; } = string.Empty;

	/// <summary>
	/// Password of the user.
	/// </summary>
	[DataMember]
	public string Password { get; set; } = string.Empty;
}
