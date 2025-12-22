// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Auth/AuthResponseDto.cs
// Purpose: DTO for returning authentication responses, including JWT token and user info.
// ============================================================================

using System.Runtime.Serialization;
using InvestmentPortfolio.Application.DTOs.Users;

namespace InvestmentPortfolio.Application.DTOs.Auth;

/// <summary>
/// DTO representing the authentication response.
/// </summary>
[DataContract]
public class AuthResponseDto
{
	/// <summary>
	/// JWT token issued upon successful authentication.
	/// </summary>
	[DataMember]
	public string Token { get; set; } = string.Empty;

	/// <summary>
	/// Expiration date and time of the JWT token.
	/// </summary>
	[DataMember]
	public DateTime ExpiresAt { get; set; }

	/// <summary>
	/// Information about the authenticated user.
	/// </summary>
	[DataMember]
	public UserDto User { get; set; } = null!;
}
