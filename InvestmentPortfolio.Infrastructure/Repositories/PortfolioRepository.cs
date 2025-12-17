// ============================================================================
// File: InvestmentPortfolio.Infrastructure/Repositories/PortfolioRepository.cs
// ============================================================================

using System.Data;
using Microsoft.Data.SqlClient;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Interfaces;

namespace InvestmentPortfolio.Infrastructure.Repositories;

/// <summary>
/// Repository for portfolios operations.
/// </summary>
public class PortfolioRepository : IPortfolioRepository
{
	private readonly IDbConnectionFactory _connectionFactory;

	/// <summary>
	/// Initializes a new instance of the <see cref="PortfolioRepository"/> class.
	/// </summary>
	/// <param name="connectionFactory">The database connection factory.</param>
	public PortfolioRepository(IDbConnectionFactory connectionFactory)
	{
		_connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
	}

	/// <summary>
	/// Gets a portfolio by its unique identifier.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <returns>The portfolio if found; otherwise, null.</returns>
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

	/// <summary>
	/// Gets all portfolios belonging to a specific user.
	/// </summary>
	/// <param name="userId">The user ID.</param>
	/// <returns>A collection of portfolios.</returns>
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

	/// <summary>
	/// Creates a new portfolio in the database.
	/// </summary>
	/// <param name="portfolio">The portfolio to create.</param>
	/// <returns>The ID of the created portfolio.</returns>
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

	/// <summary>
	/// Updates an existing portfolio.
	/// </summary>
	/// <param name="portfolio">The portfolio to update.</param>
	/// <returns>True if update succeeded; otherwise, false.</returns>
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

	/// <summary>
	/// Deletes a portfolio by its ID.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <returns>True if deletion succeeded; otherwise, false.</returns>
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

	/// <summary>
	/// Checks if a portfolio belongs to a specific user.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <param name="userId">The user ID.</param>
	/// <returns>True if the portfolio belongs to the user; otherwise, false.</returns>
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
	/// Maps a data reader row to a <see cref="Portfolio"/> object.
	/// </summary>
	/// <param name="reader">The data reader.</param>
	/// <returns>The mapped <see cref="Portfolio"/>.</returns>
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
