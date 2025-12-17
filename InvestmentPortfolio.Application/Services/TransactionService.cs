// ============================================================================
// File: InvestmentPortfolio.Application/Services/TransactionService.cs
// ============================================================================

using AutoMapper;
using InvestmentPortfolio.Application.DTOs.Transactions;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Interfaces;

namespace InvestmentPortfolio.Application.Services;

/// <inheritdoc />
/// <summary>
/// Service responsible for managing user transactions in portfolios.
/// </summary>
public class TransactionService : ITransactionService
{
	private readonly ITransactionRepository _transactionRepository;
	private readonly IPortfolioRepository _portfolioRepository;
	private readonly IAssetRepository _assetRepository;
	private readonly IMapper _mapper;

	/// <summary>
	/// Initializes a new instance of the <see cref="TransactionService"/> class.
	/// </summary>
	/// <param name="transactionRepository">The transaction repository.</param>
	/// <param name="portfolioRepository">The portfolio repository.</param>
	/// <param name="assetRepository">The asset repository.</param>
	/// <param name="mapper">The mapper for converting entities to DTOs.</param>
	/// <exception cref="ArgumentNullException">
	/// Thrown if any of the dependencies are null.
	/// </exception>
	public TransactionService(
		ITransactionRepository transactionRepository,
		IPortfolioRepository portfolioRepository,
		IAssetRepository assetRepository,
		IMapper mapper)
	{
		_transactionRepository = transactionRepository ?? throw new ArgumentNullException(nameof(transactionRepository));
		_portfolioRepository = portfolioRepository ?? throw new ArgumentNullException(nameof(portfolioRepository));
		_assetRepository = assetRepository ?? throw new ArgumentNullException(nameof(assetRepository));
		_mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
	}

	/// <inheritdoc />
	public async Task<IEnumerable<TransactionDto>> GetUserTransactionsAsync(int userId)
	{
		var transactions = await _transactionRepository.GetByUserIdAsync(userId);
		return _mapper.Map<IEnumerable<TransactionDto>>(transactions);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the portfolio does not belong to the specified user.
	/// </exception>
	public async Task<IEnumerable<TransactionDto>> GetPortfolioTransactionsAsync(int portfolioId, int userId)
	{
		if (!await _portfolioRepository.BelongsToUserAsync(portfolioId, userId))
			throw new UnauthorizedAccessException("Portfolio does not belong to user");

		var transactions = await _transactionRepository.GetByPortfolioIdAsync(portfolioId);
		return _mapper.Map<IEnumerable<TransactionDto>>(transactions);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the transaction does not belong to the user's portfolio.
	/// </exception>
	public async Task<TransactionDto?> GetByIdAsync(int transactionId, int userId)
	{
		var transaction = await _transactionRepository.GetByIdAsync(transactionId);
		if (transaction == null)
			return null;

		if (!await _portfolioRepository.BelongsToUserAsync(transaction.PortfolioId, userId))
			throw new UnauthorizedAccessException("Transaction does not belong to user");

		return _mapper.Map<TransactionDto>(transaction);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the portfolio does not belong to the specified user.
	/// </exception>
	/// <exception cref="KeyNotFoundException">
	/// Thrown if the specified asset does not exist.
	/// </exception>
	/// <exception cref="InvalidOperationException">
	/// Thrown if the asset does not belong to the portfolio or if selling more than owned quantity.
	/// </exception>
	public async Task<TransactionDto> CreateAsync(CreateTransactionDto dto, int userId)
	{
		if (!await _portfolioRepository.BelongsToUserAsync(dto.PortfolioId, userId))
			throw new UnauthorizedAccessException("Portfolio does not belong to user");

		var asset = await _assetRepository.GetByIdAsync(dto.AssetId);
		if (asset == null)
			throw new KeyNotFoundException("Asset not found");

		if (asset.PortfolioId != dto.PortfolioId)
			throw new InvalidOperationException("Asset does not belong to portfolio");

		var transaction = _mapper.Map<Transaction>(dto);
		var transactionId = await _transactionRepository.CreateAsync(transaction);
		transaction.TransactionId = transactionId;

		await UpdateAssetAfterTransactionAsync(transaction, asset);

		return _mapper.Map<TransactionDto>(transaction);
	}

	/// <summary>
	/// Updates the asset's quantity and average purchase price after a transaction.
	/// </summary>
	/// <param name="transaction">The transaction applied.</param>
	/// <param name="asset">The asset to update.</param>
	/// <exception cref="InvalidOperationException">
	/// Thrown if selling more than the owned quantity.
	/// </exception>
	private async Task UpdateAssetAfterTransactionAsync(Transaction transaction, Asset asset)
	{
		if (transaction.Type == Domain.Enums.TransactionType.Buy)
		{
			var totalCost = (asset.Quantity * asset.AvgPurchasePrice) + transaction.TotalAmount;
			asset.Quantity += transaction.Quantity;
			asset.AvgPurchasePrice = totalCost / asset.Quantity;
		}
		else if (transaction.Type == Domain.Enums.TransactionType.Sell)
		{
			asset.Quantity -= transaction.Quantity;
			if (asset.Quantity < 0)
				throw new InvalidOperationException("Cannot sell more than owned quantity");
		}

		await _assetRepository.UpdateAsync(asset);
	}
}
