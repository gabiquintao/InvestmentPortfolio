// ============================================================================
// File: InvestmentPortfolio.Domain/Interfaces/IUnitOfWork.cs
// ============================================================================

namespace InvestmentPortfolio.Domain.Interfaces;

/// <summary>
/// Interface for Unit of Work pattern
/// Manages transactions between multiple repositories
/// </summary>
public interface IUnitOfWork : IDisposable
{
	IUserRepository Users { get; }
	IPortfolioRepository Portfolios { get; }
	IAssetRepository Assets { get; }
	ITransactionRepository Transactions { get; }
	IAlertRepository Alerts { get; }

	/// <summary>
	/// Begins a database transaction
	/// </summary>
	Task BeginTransactionAsync();

	/// <summary>
	/// Commits the transaction
	/// </summary>
	Task CommitAsync();

	/// <summary>
	/// Rolls back the transaction
	/// </summary>
	Task RollbackAsync();

	/// <summary>
	/// Saves all pending changes
	/// </summary>
	Task<int> SaveChangesAsync();
}