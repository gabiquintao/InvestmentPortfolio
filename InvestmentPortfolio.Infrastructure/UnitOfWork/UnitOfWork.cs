using System.Data.Common;
using InvestmentPortfolio.Domain.Interfaces;

namespace InvestmentPortfolio.Infrastructure.UnitOfWork;

/// <summary>
/// Unit of work implementation for managing transactions
/// </summary>
public class UnitOfWork : IUnitOfWork
{
	private readonly IDbConnectionFactory _connectionFactory;
	private DbConnection? _connection;
	private DbTransaction? _transaction;
	private bool _disposed;

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

	public IUserRepository Users { get; }
	public IPortfolioRepository Portfolios { get; }
	public IAssetRepository Assets { get; }
	public ITransactionRepository Transactions { get; }
	public IAlertRepository Alerts { get; }

	public async Task BeginTransactionAsync()
	{
		_connection = _connectionFactory.CreateConnection() as DbConnection
			?? throw new InvalidOperationException("Connection is not a DbConnection.");

		await _connection.OpenAsync();
		_transaction = await _connection.BeginTransactionAsync();
	}

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

	public async Task RollbackAsync()
	{
		if (_transaction == null)
			throw new InvalidOperationException("Transaction has not been started.");

		await _transaction.RollbackAsync();
		await DisposeTransactionAndConnectionAsync();
	}

	public async Task<int> SaveChangesAsync()
	{
		// On ADO.NET, changes are automatically applied
		// This method exists to maintain the interface consistent.
		await Task.CompletedTask;
		return 0;
	}

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

	public void Dispose()
	{
		Dispose(true);
		GC.SuppressFinalize(this);
	}

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
