// ============================================================================
// File: InvestmentPortfolio.Application/DTOs/Users/UserDto.cs
// Purpose: DTO representing user information.
// ============================================================================

using System.Runtime.Serialization;

namespace InvestmentPortfolio.Application.DTOs.Users;

/// <summary>
/// DTO representing basic information about a user.
/// </summary>
[DataContract]
public class UserDto
{
	/// <summary>
	/// Unique identifier of the user.
	/// </summary>
	[DataMember]
	public int UserId { get; set; }

	/// <summary>
	/// Email of the user.
	/// </summary>
	[DataMember]
	public string Email { get; set; } = string.Empty;

	/// <summary>
	/// Full name of the user.
	/// </summary>
	[DataMember]
	public string FullName { get; set; } = string.Empty;

	/// <summary>
	/// Date and time when the user was created.
	/// </summary>
	[DataMember]
	public DateTime CreatedAt { get; set; }
}
