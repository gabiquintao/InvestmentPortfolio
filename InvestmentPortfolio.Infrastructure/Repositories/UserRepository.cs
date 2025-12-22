// ============================================================================
// File: InvestmentPortfolio.Infrastructure/Repositories/UserRepository.cs
// Purpose: Repository implementation for managing users in the database.
// ============================================================================

using System.Data;
using Microsoft.Data.SqlClient;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Interfaces;
using InvestmentPortfolio.Infrastructure.Data;

namespace InvestmentPortfolio.Infrastructure.Repositories;

/// <summary>
/// Repository for user operations.
/// </summary>
public class UserRepository : IUserRepository
{
	private readonly IDbConnectionFactory _connectionFactory;

	/// <summary>
	/// Initializes a new instance of the <see cref="UserRepository"/> class.
	/// </summary>
	/// <param name="connectionFactory">The database connection factory.</param>
	public UserRepository(IDbConnectionFactory connectionFactory)
	{
		_connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
	}

	/// <summary>
	/// Gets a user by their unique identifier.
	/// </summary>
	/// <param name="userId">The user ID.</param>
	/// <returns>The user if found; otherwise, null.</returns>
	public async Task<User?> GetByIdAsync(int userId)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT UserId, Email, PasswordHash, FullName, CreatedAt
            FROM Users
            WHERE UserId = @UserId";

		command.Parameters.Add(new SqlParameter("@UserId", userId));

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		if (await reader.ReadAsync())
		{
			return MapUser(reader);
		}

		return null;
	}

	/// <summary>
	/// Gets a user by their email address.
	/// </summary>
	/// <param name="email">The user's email.</param>
	/// <returns>The user if found; otherwise, null.</returns>
	public async Task<User?> GetByEmailAsync(string email)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT UserId, Email, PasswordHash, FullName, CreatedAt
            FROM Users
            WHERE Email = @Email";

		command.Parameters.Add(new SqlParameter("@Email", email));

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		if (await reader.ReadAsync())
		{
			return MapUser(reader);
		}

		return null;
	}

	/// <summary>
	/// Creates a new user in the database.
	/// </summary>
	/// <param name="user">The user to create.</param>
	/// <returns>The ID of the created user.</returns>
	public async Task<int> CreateAsync(User user)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            INSERT INTO Users (Email, PasswordHash, FullName, CreatedAt)
            OUTPUT INSERTED.UserId
            VALUES (@Email, @PasswordHash, @FullName, @CreatedAt)";

		command.Parameters.Add(new SqlParameter("@Email", user.Email));
		command.Parameters.Add(new SqlParameter("@PasswordHash", user.PasswordHash));
		command.Parameters.Add(new SqlParameter("@FullName", user.FullName));
		command.Parameters.Add(new SqlParameter("@CreatedAt", user.CreatedAt));

		await connection.OpenAsync();

		var userId = await command.ExecuteScalarAsync();
		return Convert.ToInt32(userId);
	}

	/// <summary>
	/// Updates an existing user.
	/// </summary>
	/// <param name="user">The user to update.</param>
	/// <returns>True if update succeeded; otherwise, false.</returns>
	public async Task<bool> UpdateAsync(User user)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            UPDATE Users
            SET Email = @Email,
                FullName = @FullName
            WHERE UserId = @UserId";

		command.Parameters.Add(new SqlParameter("@UserId", user.UserId));
		command.Parameters.Add(new SqlParameter("@Email", user.Email));
		command.Parameters.Add(new SqlParameter("@FullName", user.FullName));

		await connection.OpenAsync();

		var rowsAffected = await command.ExecuteNonQueryAsync();
		return rowsAffected > 0;
	}

	/// <summary>
	/// Checks whether a user with the given email exists.
	/// </summary>
	/// <param name="email">The email to check.</param>
	/// <returns>True if email exists; otherwise, false.</returns>
	public async Task<bool> EmailExistsAsync(string email)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT COUNT(1)
            FROM Users
            WHERE Email = @Email";

		command.Parameters.Add(new SqlParameter("@Email", email));

		await connection.OpenAsync();

		var count = (int?)await command.ExecuteScalarAsync();
		return count > 0;
	}

	/// <summary>
	/// Maps a data reader row to a <see cref="User"/> object.
	/// </summary>
	/// <param name="reader">The data reader.</param>
	/// <returns>The mapped <see cref="User"/>.</returns>
	private static User MapUser(IDataReader reader)
	{
		return new User
		{
			UserId = reader.GetInt32(reader.GetOrdinal("UserId")),
			Email = reader.GetString(reader.GetOrdinal("Email")),
			PasswordHash = reader.GetString(reader.GetOrdinal("PasswordHash")),
			FullName = reader.GetString(reader.GetOrdinal("FullName")),
			CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt"))
		};
	}
}
