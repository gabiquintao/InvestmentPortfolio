// ============================================================================
// File: InvestmentPortfolio.WCF/ServiceContracts/IUserDataService.cs
// ============================================================================

using CoreWCF;
using InvestmentPortfolio.WCF.DataContracts;

namespace InvestmentPortfolio.WCF.ServiceContracts;

/// <summary>
/// Service contract for user data operations.
/// Provides methods to create, retrieve, validate, and update user information.
/// </summary>
[ServiceContract]
public interface IUserDataService
{
	/// <summary>
	/// Creates a new user.
	/// </summary>
	/// <param name="user">The user data contract.</param>
	/// <returns>The ID of the newly created user.</returns>
	[OperationContract]
	Task<int> CreateUserAsync(UserDataContract user);

	/// <summary>
	/// Retrieves a user by their ID.
	/// </summary>
	/// <param name="userId">The ID of the user.</param>
	/// <returns>The user data contract if found; otherwise, null.</returns>
	[OperationContract]
	Task<UserDataContract?> GetUserByIdAsync(int userId);

	/// <summary>
	/// Validates a user's credentials.
	/// </summary>
	/// <param name="email">The user's email.</param>
	/// <param name="passwordHash">The hashed password.</param>
	/// <returns>True if credentials are valid; otherwise, false.</returns>
	[OperationContract]
	Task<bool> ValidateCredentialsAsync(string email, string passwordHash);

	/// <summary>
	/// Updates user information.
	/// </summary>
	/// <param name="user">The user data contract with updated information.</param>
	/// <returns>True if the update was successful; otherwise, false.</returns>
	[OperationContract]
	Task<bool> UpdateUserAsync(UserDataContract user);
}
