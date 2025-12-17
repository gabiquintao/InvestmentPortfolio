// ============================================================================
// File: InvestmentPortfolio.Infrastructure/Repositories/UserRepository.cs
// ============================================================================

using System.Data;
using Microsoft.Data.SqlClient;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Interfaces;

namespace InvestmentPortfolio.Infrastructure.Repositories;

/// <summary>
/// Repository for user operations
/// </summary>
public class UserRepository : IUserRepository
{
	private readonly IDbConnectionFactory _connectionFactory;

	public UserRepository(IDbConnectionFactory connectionFactory)
	{
		_connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
	}

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
	/// Maps a DataReader to a User object
	/// </summary>
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
