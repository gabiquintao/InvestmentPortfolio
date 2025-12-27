// ============================================================================
// File: InvestmentPortfolio.Domain/Interfaces/IUserRepository.cs
// Purpose: Interface for user repository operations, including CRUD and email validation.
// ============================================================================

using InvestmentPortfolio.Domain.Entities;

namespace InvestmentPortfolio.Domain.Interfaces;

/// <summary>
/// Provides methods for accessing and managing users in the data store.
/// </summary>
public interface IUserRepository
{
	/// <summary>
	/// Gets a user by their unique identifier.
	/// </summary>
	Task<User?> GetByIdAsync(int userId);

	/// <summary>
	/// Gets a user by their email address.
	/// </summary>
	Task<User?> GetByEmailAsync(string email);

	/// <summary>
	/// Creates a new user in the data store.
	/// </summary>
	Task<int> CreateAsync(User user);

	/// <summary>
	/// Updates an existing user in the data store.
	/// </summary>
	Task<bool> UpdateAsync(User user);

	/// <summary>
	/// Checks whether an email address is already registered.
	Task<bool> EmailExistsAsync(string email);
}
