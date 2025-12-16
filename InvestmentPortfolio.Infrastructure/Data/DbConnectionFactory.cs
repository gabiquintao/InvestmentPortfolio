// ============================================================================
// File: InvestmentPortfolio.Infrastructure/Data/DbConnectionFactory.cs
// ============================================================================

using System.Data;
using Microsoft.Data.SqlClient;

namespace InvestmentPortfolio.Infrastructure.Data;

/// <summary>
/// Factory for creating connections to the database
/// </summary>
public interface IDbConnectionFactory
{
	IDbConnection CreateConnection();
}

public class DbConnectionFactory : IDbConnectionFactory
{
	private readonly string _connectionString;

	public DbConnectionFactory(string connectionString)
	{
		_connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
	}

	public IDbConnection CreateConnection()
	{
		return new SqlConnection(_connectionString);
	}
}