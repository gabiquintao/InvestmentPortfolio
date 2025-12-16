// ============================================================================
// File: InvestmentPortfolio.Domain/Interfaces/IUserRepository.cs
// ============================================================================

using InvestmentPortfolio.Domain.Entities;

namespace InvestmentPortfolio.Domain.Interfaces;

/// <summary>
/// Interface for user repository operations
/// </summary>
public interface IUserRepository
{
	/// <summary>
	/// Gets a user by ID
	/// </summary>
	Task<User?> GetByIdAsync(int userId);

	/// <summary>
	/// Gets an user by email
	/// </summary>
	Task<User?> GetByEmailAsync(string email);

	/// <summary>
	/// Creates a new <see cref="User"/>
	/// </summary>
	Task<int> CreateAsync(User user);

	/// <summary>
	/// Updates an existing <see cref="User"/>
	/// </summary>
	Task<bool> UpdateAsync(User user);

	/// <summary>
	/// Checks whether an email already exists
	/// </summary>
	Task<bool> EmailExistsAsync(string email);
}