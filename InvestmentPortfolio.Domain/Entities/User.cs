// ============================================================================
// File: InvestmentPortfolio.Domain/Entities/User.cs
// Purpose: Defines the User entity representing a system user, including authentication
//          information, portfolios, and alerts.
// ============================================================================

namespace InvestmentPortfolio.Domain.Entities;

/// <summary>
/// Represents a user in the system.
/// </summary>
public class User
{
	/// <summary>
	/// Unique identifier of the user.
	/// </summary>
	public int UserId { get; set; }

	/// <summary>
	/// Email of the user.
	/// </summary>
	public string Email { get; set; } = string.Empty;

	/// <summary>
	/// Hashed password for authentication.
	/// </summary>
	public string PasswordHash { get; set; } = string.Empty;

	/// <summary>
	/// Full name of the user.
	/// </summary>
	public string FullName { get; set; } = string.Empty;

	/// <summary>
	/// Date and time when the user was created.
	/// </summary>
	public DateTime CreatedAt { get; set; }

	/// <summary>
	/// Collection of portfolios owned by the user.
	/// </summary>
	public ICollection<Portfolio> Portfolios { get; set; } = new List<Portfolio>();

	/// <summary>
	/// Collection of alerts set by the user.
	/// </summary>
	public ICollection<Alert> Alerts { get; set; } = new List<Alert>();
}
