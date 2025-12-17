// ============================================================================
// File: InvestmentPortfolio.Infrastructure/Repositories/PortfolioRepository.cs
// ============================================================================

using System.Data;
using Microsoft.Data.SqlClient;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Interfaces;

namespace InvestmentPortfolio.Infrastructure.Repositories;

/// <summary>
/// Repository for portfolios operations
/// </summary>
public class PortfolioRepository : IPortfolioRepository
{
	private readonly IDbConnectionFactory _connectionFactory;

	public PortfolioRepository(IDbConnectionFactory connectionFactory)
	{
		_connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
	}

	public async Task<Portfolio?> GetByIdAsync(int portfolioId)
	{
		await using var connection = _connectionFactory.CreateConnection();
		await using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT PortfolioId, UserId, Name, Description, Currency, CreatedAt
            FROM Portfolios
            WHERE PortfolioId = @PortfolioId";

		command.Parameters.Add(new SqlParameter("@PortfolioId", portfolioId));

		await connection.OpenAsync();

		await using var reader = await command.ExecuteReaderAsync();

		if (await reader.ReadAsync())
		{
			return MapPortfolio(reader);
		}

		return null;
	}

	public async Task<IEnumerable<Portfolio>> GetByUserIdAsync(int userId)
	{
		var portfolios = new List<Portfolio>();

		await using var connection = _connectionFactory.CreateConnection();
		await using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT PortfolioId, UserId, Name, Description, Currency, CreatedAt
            FROM Portfolios
            WHERE UserId = @UserId
            ORDER BY CreatedAt DESC";

		command.Parameters.Add(new SqlParameter("@UserId", userId));

		await connection.OpenAsync();

		await using var reader = await command.ExecuteReaderAsync();

		while (await reader.ReadAsync())
		{
			portfolios.Add(MapPortfolio(reader));
		}

		return portfolios;
	}

	public async Task<int> CreateAsync(Portfolio portfolio)
	{
		await using var connection = _connectionFactory.CreateConnection();
		await using var command = connection.CreateCommand();

		command.CommandText = @"
            INSERT INTO Portfolios (UserId, Name, Description, Currency, CreatedAt)
            OUTPUT INSERTED.PortfolioId
            VALUES (@UserId, @Name, @Description, @Currency, @CreatedAt)";

		command.Parameters.Add(new SqlParameter("@UserId", portfolio.UserId));
		command.Parameters.Add(new SqlParameter("@Name", portfolio.Name));
		command.Parameters.Add(new SqlParameter("@Description", portfolio.Description ?? (object)DBNull.Value));
		command.Parameters.Add(new SqlParameter("@Currency", portfolio.Currency));
		command.Parameters.Add(new SqlParameter("@CreatedAt", portfolio.CreatedAt));

		await connection.OpenAsync();

		var portfolioId = await command.ExecuteScalarAsync();
		return Convert.ToInt32(portfolioId);
	}

	public async Task<bool> UpdateAsync(Portfolio portfolio)
	{
		await using var connection = _connectionFactory.CreateConnection();
		await using var command = connection.CreateCommand();

		command.CommandText = @"
            UPDATE Portfolios
            SET Name = @Name,
                Description = @Description,
                Currency = @Currency
            WHERE PortfolioId = @PortfolioId";

		command.Parameters.Add(new SqlParameter("@PortfolioId", portfolio.PortfolioId));
		command.Parameters.Add(new SqlParameter("@Name", portfolio.Name));
		command.Parameters.Add(new SqlParameter("@Description", portfolio.Description ?? (object)DBNull.Value));
		command.Parameters.Add(new SqlParameter("@Currency", portfolio.Currency));

		await connection.OpenAsync();

		var rowsAffected = await command.ExecuteNonQueryAsync();
		return rowsAffected > 0;
	}

	public async Task<bool> DeleteAsync(int portfolioId)
	{
		await using var connection = _connectionFactory.CreateConnection();
		await using var command = connection.CreateCommand();

		command.CommandText = @"
            DELETE FROM Portfolios
            WHERE PortfolioId = @PortfolioId";

		command.Parameters.Add(new SqlParameter("@PortfolioId", portfolioId));

		await connection.OpenAsync();

		var rowsAffected = await command.ExecuteNonQueryAsync();
		return rowsAffected > 0;
	}

	public async Task<bool> BelongsToUserAsync(int portfolioId, int userId)
	{
		await using var connection = _connectionFactory.CreateConnection();
		await using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT COUNT(1)
            FROM Portfolios
            WHERE PortfolioId = @PortfolioId AND UserId = @UserId";

		command.Parameters.Add(new SqlParameter("@PortfolioId", portfolioId));
		command.Parameters.Add(new SqlParameter("@UserId", userId));

		await connection.OpenAsync();

		var count = (int)(await command.ExecuteScalarAsync() ?? 0);
		return count > 0;
	}

	/// <summary>
	/// Maps a DataReader to a Portfolio object
	/// </summary>
	private static Portfolio MapPortfolio(IDataReader reader)
	{
		return new Portfolio
		{
			PortfolioId = reader.GetInt32(reader.GetOrdinal("PortfolioId")),
			UserId = reader.GetInt32(reader.GetOrdinal("UserId")),
			Name = reader.GetString(reader.GetOrdinal("Name")),
			Description = reader.IsDBNull(reader.GetOrdinal("Description"))
				? string.Empty
				: reader.GetString(reader.GetOrdinal("Description")),
			Currency = reader.GetString(reader.GetOrdinal("Currency")),
			CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt"))
		};
	}
}