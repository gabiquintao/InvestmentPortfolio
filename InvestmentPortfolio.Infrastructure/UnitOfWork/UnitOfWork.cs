// ============================================================================
// File: InvestmentPortfolio.Infrastructure/UnitOfWork/UnitOfWork.cs
// Purpose: Implementation of the Unit of Work pattern to manage multiple
//          repositories and database transactions in a single scope.
// ============================================================================

using System.Data.Common;
using InvestmentPortfolio.Domain.Interfaces;
using InvestmentPortfolio.Infrastructure.Data;

namespace InvestmentPortfolio.Infrastructure.UnitOfWork;

/// <summary>
/// Unit of work implementation for managing database transactions and repositories.
/// </summary>
public class UnitOfWork : IUnitOfWork
{
	private readonly IDbConnectionFactory _connectionFactory;
	private DbConnection? _connection;
	private DbTransaction? _transaction;
	private bool _disposed;

	/// <summary>
	/// Initializes a new instance of the <see cref="UnitOfWork"/> class.
	/// </summary>
	/// <param name="connectionFactory">The database connection factory.</param>
	/// <param name="users">User repository.</param>
	/// <param name="portfolios">Portfolio repository.</param>
	/// <param name="assets">Asset repository.</param>
	/// <param name="transactions">Transaction repository.</param>
	/// <param name="alerts">Alert repository.</param>
	public UnitOfWork(
		IDbConnectionFactory connectionFactory,
		IUserRepository users,
		IPortfolioRepository portfolios,
		IAssetRepository assets,
		ITransactionRepository transactions,
		IAlertRepository alerts)
	{
		_connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
		Users = users ?? throw new ArgumentNullException(nameof(users));
		Portfolios = portfolios ?? throw new ArgumentNullException(nameof(portfolios));
		Assets = assets ?? throw new ArgumentNullException(nameof(assets));
		Transactions = transactions ?? throw new ArgumentNullException(nameof(transactions));
		Alerts = alerts ?? throw new ArgumentNullException(nameof(alerts));
	}

	/// <summary>
	/// Gets the user repository.
	/// </summary>
	public IUserRepository Users { get; }

	/// <summary>
	/// Gets the portfolio repository.
	/// </summary>
	public IPortfolioRepository Portfolios { get; }

	/// <summary>
	/// Gets the asset repository.
	/// </summary>
	public IAssetRepository Assets { get; }

	/// <summary>
	/// Gets the transaction repository.
	/// </summary>
	public ITransactionRepository Transactions { get; }

	/// <summary>
	/// Gets the alert repository.
	/// </summary>
	public IAlertRepository Alerts { get; }

	/// <summary>
	/// Begins a new database transaction.
	/// </summary>
	public async Task BeginTransactionAsync()
	{
		_connection = _connectionFactory.CreateConnection() as DbConnection
			?? throw new InvalidOperationException("Connection is not a DbConnection.");

		await _connection.OpenAsync();
		_transaction = await _connection.BeginTransactionAsync();
	}

	/// <summary>
	/// Commits the current transaction.
	/// </summary>
	/// <exception cref="InvalidOperationException">Thrown if no transaction has been started.</exception>
	public async Task CommitAsync()
	{
		if (_transaction == null)
			throw new InvalidOperationException("Transaction has not been started.");

		try
		{
			await _transaction.CommitAsync();
		}
		catch
		{
			await _transaction.RollbackAsync();
			throw;
		}
		finally
		{
			await DisposeTransactionAndConnectionAsync();
		}
	}

	/// <summary>
	/// Rolls back the current transaction.
	/// </summary>
	/// <exception cref="InvalidOperationException">Thrown if no transaction has been started.</exception>
	public async Task RollbackAsync()
	{
		if (_transaction == null)
			throw new InvalidOperationException("Transaction has not been started.");

		await _transaction.RollbackAsync();
		await DisposeTransactionAndConnectionAsync();
	}

	/// <summary>
	/// Saves changes to the database.
	/// </summary>
	/// <remarks>
	/// In ADO.NET, changes are automatically applied. This method exists to maintain interface consistency.
	/// </remarks>
	/// <returns>An integer indicating the number of affected records (always 0 for ADO.NET).</returns>
	public async Task<int> SaveChangesAsync()
	{
		await Task.CompletedTask;
		return 0;
	}

	/// <summary>
	/// Disposes the transaction and connection.
	/// </summary>
	private async Task DisposeTransactionAndConnectionAsync()
	{
		if (_transaction != null)
		{
			await _transaction.DisposeAsync();
			_transaction = null;
		}

		if (_connection != null)
		{
			await _connection.CloseAsync();
			await _connection.DisposeAsync();
			_connection = null;
		}
	}

	/// <summary>
	/// Disposes the unit of work and its resources.
	/// </summary>
	public void Dispose()
	{
		Dispose(true);
		GC.SuppressFinalize(this);
	}

	/// <summary>
	/// Disposes managed and unmanaged resources.
	/// </summary>
	/// <param name="disposing">True if disposing managed resources; otherwise, false.</param>
	protected virtual void Dispose(bool disposing)
	{
		if (!_disposed)
		{
			if (disposing)
			{
				_transaction?.Dispose();
				_connection?.Dispose();
			}
			_disposed = true;
		}
	}
}
