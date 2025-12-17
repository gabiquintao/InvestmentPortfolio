// ============================================================================
// File: InvestmentPortfolio.Infrastructure/Data/DbConnectionFactory.cs
// ============================================================================

using System.Data.Common;
using Microsoft.Data.SqlClient;


public interface IDbConnectionFactory
{
	DbConnection CreateConnection();
}

/// <summary>
/// Factory for creating connections to the database
/// </summary>
public class DbConnectionFactory : IDbConnectionFactory
{
	private readonly string _connectionString;

	public DbConnectionFactory(string connectionString)
	{
		_connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
	}

	public DbConnection CreateConnection()
	{
		return new SqlConnection(_connectionString);
	}
}
