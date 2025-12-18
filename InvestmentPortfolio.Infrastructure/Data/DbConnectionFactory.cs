// ============================================================================
// File: InvestmentPortfolio.Infrastructure/Data/DbConnectionFactory.cs
// ============================================================================

using System.Data.Common;
using Microsoft.Data.SqlClient;

namespace InvestmentPortfolio.Infrastructure.Data;

/// <summary>
/// Factory interface for creating database connections.
/// </summary>
public interface IDbConnectionFactory
{
	/// <summary>
	/// Creates a new <see cref="DbConnection"/> instance.
	/// </summary>
	/// <returns>A new database connection.</returns>
	DbConnection CreateConnection();
}

/// <summary>
/// Factory for creating connections to the database.
/// </summary>
public class DbConnectionFactory : IDbConnectionFactory
{
	private readonly string _connectionString;

	/// <summary>
	/// Initializes a new instance of the <see cref="DbConnectionFactory"/> class.
	/// </summary>
	/// <param name="connectionString">The database connection string.</param>
	/// <exception cref="ArgumentNullException">Thrown if <paramref name="connectionString"/> is null.</exception>
	public DbConnectionFactory(string connectionString)
	{
		_connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
	}

	/// <summary>
	/// Creates a new <see cref="SqlConnection"/> using the configured connection string.
	/// </summary>
	/// <returns>A new <see cref="DbConnection"/> instance.</returns>
	public DbConnection CreateConnection()
	{
		return new SqlConnection(_connectionString);
	}
}
