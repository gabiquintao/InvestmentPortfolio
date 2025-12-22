// ============================================================================
// File: InvestmentPortfolio.Domain/Interfaces/IUnitOfWork.cs
// Purpose: Interface for the Unit of Work pattern, coordinating multiple repositories and transaction management.
// ============================================================================

namespace InvestmentPortfolio.Domain.Interfaces;

/// <summary>
/// Manages transactions across multiple repositories and ensures atomic operations.
/// </summary>
public interface IUnitOfWork : IDisposable
{
	/// <summary>
	/// User repository.
	/// </summary>
	IUserRepository Users { get; }

	/// <summary>
	/// Portfolio repository.
	/// </summary>
	IPortfolioRepository Portfolios { get; }

	/// <summary>
	/// Asset repository.
	/// </summary>
	IAssetRepository Assets { get; }

	/// <summary>
	/// Transaction repository.
	/// </summary>
	ITransactionRepository Transactions { get; }

	/// <summary>
	/// Alert repository.
	/// </summary>
	IAlertRepository Alerts { get; }

	/// <summary>
	/// Begins a database transaction.
	/// </summary>
	Task BeginTransactionAsync();

	/// <summary>
	/// Commits the current transaction.
	/// </summary>
	Task CommitAsync();

	/// <summary>
	/// Rolls back the current transaction.
	/// </summary>
	Task RollbackAsync();

	/// <summary>
	/// Saves all pending changes to the data store.
	/// </summary>
	Task<int> SaveChangesAsync();
}
