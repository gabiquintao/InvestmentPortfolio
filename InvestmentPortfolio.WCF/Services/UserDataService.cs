// ============================================================================
// File: InvestmentPortfolio.WCF/Services/UserDataService.cs
// ============================================================================

using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Interfaces;
using InvestmentPortfolio.WCF.DataContracts;
using InvestmentPortfolio.WCF.ServiceContracts;

namespace InvestmentPortfolio.WCF.Services;

/// <summary>
/// Implementation of the user data service.
/// Provides methods to create, retrieve, validate, and update users.
/// </summary>
public class UserDataService : IUserDataService
{
	private readonly IUserRepository _userRepository;

	/// <summary>
	/// Initializes a new instance of the <see cref="UserDataService"/> class.
	/// </summary>
	/// <param name="userRepository">The user repository.</param>
	/// <exception cref="ArgumentNullException">Thrown if <paramref name="userRepository"/> is null.</exception>
	public UserDataService(IUserRepository userRepository)
	{
		_userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
	}

	/// <summary>
	/// Creates a new user in the system.
	/// </summary>
	/// <param name="user">The user data contract.</param>
	/// <returns>The ID of the newly created user.</returns>
	public async Task<int> CreateUserAsync(UserDataContract user)
	{
		var entity = new User
		{
			Email = user.Email,
			PasswordHash = user.PasswordHash,
			FullName = user.FullName,
			CreatedAt = user.CreatedAt
		};

		return await _userRepository.CreateAsync(entity);
	}

	/// <summary>
	/// Retrieves a user by their ID.
	/// </summary>
	/// <param name="userId">The user ID.</param>
	/// <returns>The user data contract, or null if not found.</returns>
	public async Task<UserDataContract?> GetUserByIdAsync(int userId)
	{
		var user = await _userRepository.GetByIdAsync(userId);

		if (user == null)
			return null;

		return new UserDataContract
		{
			UserId = user.UserId,
			Email = user.Email,
			PasswordHash = user.PasswordHash,
			FullName = user.FullName,
			CreatedAt = user.CreatedAt
		};
	}

	/// <summary>
	/// Validates a user's credentials.
	/// </summary>
	/// <param name="email">The user's email.</param>
	/// <param name="passwordHash">The hashed password.</param>
	/// <returns>True if credentials are valid, otherwise false.</returns>
	public async Task<bool> ValidateCredentialsAsync(string email, string passwordHash)
	{
		var user = await _userRepository.GetByEmailAsync(email);

		if (user == null)
			return false;

		return user.PasswordHash == passwordHash;
	}

	/// <summary>
	/// Updates an existing user's information.
	/// </summary>
	/// <param name="user">The updated user data contract.</param>
	/// <returns>True if the update succeeded, otherwise false.</returns>
	public async Task<bool> UpdateUserAsync(UserDataContract user)
	{
		var entity = new User
		{
			UserId = user.UserId,
			Email = user.Email,
			FullName = user.FullName,
			PasswordHash = user.PasswordHash,
			CreatedAt = user.CreatedAt
		};

		return await _userRepository.UpdateAsync(entity);
	}
}
