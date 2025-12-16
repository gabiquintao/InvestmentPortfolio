// ============================================================================
// File: InvestmentPortfolio.Domain/Entities/User.cs
// ============================================================================

namespace InvestmentPortfolio.Domain.Entities;

/// <summary>
/// Represents a user in the system
/// </summary>
public class User
{
    /// <summary>
    /// Unique identifier for the user
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// User's email
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Hashed password
    /// </summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// User's full name
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Date and time when the user was created
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Collection of Portfolios owned by this user
    /// </summary>
    public ICollection<Portfolio> Portfolios { get; set; } = new List<Portfolio>();

    /// <summary>
    /// Collection of alerts set by this user
    /// </summary>
    public ICollection<Alert> Alerts { get; set; } = new List<Alert>();
}