// ============================================================================
// File: InvestmentPortfolio.Infrastructure/Repositories/TransactionRepository.cs
// ============================================================================

using System.Data;
using Microsoft.Data.SqlClient;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Enums;
using InvestmentPortfolio.Domain.Interfaces;

namespace InvestmentPortfolio.Infrastructure.Repositories;

/// <summary>
/// Repository for transactions operations
/// </summary>
public class TransactionRepository : ITransactionRepository
{
	private readonly IDbConnectionFactory _connectionFactory;

	public TransactionRepository(IDbConnectionFactory connectionFactory)
	{
		_connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
	}

	public async Task<Transaction?> GetByIdAsync(int transactionId)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT t.TransactionId, t.PortfolioId, t.AssetId, t.Type, 
                   t.Quantity, t.PricePerUnit, t.TotalAmount, t.Fees, 
                   t.TransactionDate, t.Notes,
                   a.Symbol
            FROM Transactions t
            INNER JOIN Assets a ON t.AssetId = a.AssetId
            WHERE t.TransactionId = @TransactionId";

		command.Parameters.Add(new SqlParameter("@TransactionId", transactionId));

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		if (await reader.ReadAsync())
		{
			return MapTransaction(reader);
		}

		return null;
	}

	public async Task<IEnumerable<Transaction>> GetByPortfolioIdAsync(int portfolioId)
	{
		var transactions = new List<Transaction>();

		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT t.TransactionId, t.PortfolioId, t.AssetId, t.Type, 
                   t.Quantity, t.PricePerUnit, t.TotalAmount, t.Fees, 
                   t.TransactionDate, t.Notes,
                   a.Symbol
            FROM Transactions t
            INNER JOIN Assets a ON t.AssetId = a.AssetId
            WHERE t.PortfolioId = @PortfolioId
            ORDER BY t.TransactionDate DESC";

		command.Parameters.Add(new SqlParameter("@PortfolioId", portfolioId));

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		while (await reader.ReadAsync())
		{
			transactions.Add(MapTransaction(reader));
		}

		return transactions;
	}

	public async Task<IEnumerable<Transaction>> GetByAssetIdAsync(int assetId)
	{
		var transactions = new List<Transaction>();

		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT t.TransactionId, t.PortfolioId, t.AssetId, t.Type, 
                   t.Quantity, t.PricePerUnit, t.TotalAmount, t.Fees, 
                   t.TransactionDate, t.Notes,
                   a.Symbol
            FROM Transactions t
            INNER JOIN Assets a ON t.AssetId = a.AssetId
            WHERE t.AssetId = @AssetId
            ORDER BY t.TransactionDate DESC";

		command.Parameters.Add(new SqlParameter("@AssetId", assetId));

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		while (await reader.ReadAsync())
		{
			transactions.Add(MapTransaction(reader));
		}

		return transactions;
	}

	public async Task<IEnumerable<Transaction>> GetByUserIdAsync(int userId)
	{
		var transactions = new List<Transaction>();

		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT t.TransactionId, t.PortfolioId, t.AssetId, t.Type, 
                   t.Quantity, t.PricePerUnit, t.TotalAmount, t.Fees, 
                   t.TransactionDate, t.Notes,
                   a.Symbol
            FROM Transactions t
            INNER JOIN Assets a ON t.AssetId = a.AssetId
            INNER JOIN Portfolios p ON t.PortfolioId = p.PortfolioId
            WHERE p.UserId = @UserId
            ORDER BY t.TransactionDate DESC";

		command.Parameters.Add(new SqlParameter("@UserId", userId));

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		while (await reader.ReadAsync())
		{
			transactions.Add(MapTransaction(reader));
		}

		return transactions;
	}

	public async Task<int> CreateAsync(Transaction transaction)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            INSERT INTO Transactions (PortfolioId, AssetId, Type, Quantity, 
                                     PricePerUnit, TotalAmount, Fees, 
                                     TransactionDate, Notes)
            OUTPUT INSERTED.TransactionId
            VALUES (@PortfolioId, @AssetId, @Type, @Quantity, 
                    @PricePerUnit, @TotalAmount, @Fees, 
                    @TransactionDate, @Notes)";

		command.Parameters.Add(new SqlParameter("@PortfolioId", transaction.PortfolioId));
		command.Parameters.Add(new SqlParameter("@AssetId", transaction.AssetId));
		command.Parameters.Add(new SqlParameter("@Type", (int)transaction.Type));
		command.Parameters.Add(new SqlParameter("@Quantity", transaction.Quantity));
		command.Parameters.Add(new SqlParameter("@PricePerUnit", transaction.PricePerUnit));
		command.Parameters.Add(new SqlParameter("@TotalAmount", transaction.TotalAmount));
		command.Parameters.Add(new SqlParameter("@Fees", transaction.Fees));
		command.Parameters.Add(new SqlParameter("@TransactionDate", transaction.TransactionDate));
		command.Parameters.Add(new SqlParameter("@Notes", transaction.Notes ?? (object)DBNull.Value));

		await connection.OpenAsync();

		var transactionId = await command.ExecuteScalarAsync();
		return Convert.ToInt32(transactionId);
	}

	public async Task<IEnumerable<Transaction>> GetByDateRangeAsync(int portfolioId, DateTime start, DateTime end)
	{
		var transactions = new List<Transaction>();

		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT t.TransactionId, t.PortfolioId, t.AssetId, t.Type, 
                   t.Quantity, t.PricePerUnit, t.TotalAmount, t.Fees, 
                   t.TransactionDate, t.Notes,
                   a.Symbol
            FROM Transactions t
            INNER JOIN Assets a ON t.AssetId = a.AssetId
            WHERE t.PortfolioId = @PortfolioId 
              AND t.TransactionDate >= @StartDate 
              AND t.TransactionDate <= @EndDate
            ORDER BY t.TransactionDate DESC";

		command.Parameters.Add(new SqlParameter("@PortfolioId", portfolioId));
		command.Parameters.Add(new SqlParameter("@StartDate", start));
		command.Parameters.Add(new SqlParameter("@EndDate", end));

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		while (await reader.ReadAsync())
		{
			transactions.Add(MapTransaction(reader));
		}

		return transactions;
	}

	/// <summary>
	/// Maps a DataReader to a Transaction object
	/// </summary>
	private static Transaction MapTransaction(IDataReader reader)
	{
		return new Transaction
		{
			TransactionId = reader.GetInt32(reader.GetOrdinal("TransactionId")),
			PortfolioId = reader.GetInt32(reader.GetOrdinal("PortfolioId")),
			AssetId = reader.GetInt32(reader.GetOrdinal("AssetId")),
			Type = (TransactionType)reader.GetInt32(reader.GetOrdinal("Type")),
			Quantity = reader.GetDecimal(reader.GetOrdinal("Quantity")),
			PricePerUnit = reader.GetDecimal(reader.GetOrdinal("PricePerUnit")),
			TotalAmount = reader.GetDecimal(reader.GetOrdinal("TotalAmount")),
			Fees = reader.GetDecimal(reader.GetOrdinal("Fees")),
			TransactionDate = reader.GetDateTime(reader.GetOrdinal("TransactionDate")),
			Notes = reader.IsDBNull(reader.GetOrdinal("Notes"))
				? string.Empty
				: reader.GetString(reader.GetOrdinal("Notes")),
			Asset = new Asset { Symbol = reader.GetString(reader.GetOrdinal("Symbol")) }
		};
	}
}
