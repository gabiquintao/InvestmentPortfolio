// ============================================================================
// File: InvestmentPortfolio.Application/Services/Asset.cs
// ============================================================================

using AutoMapper;
using InvestmentPortfolio.Application.DTOs.Assets;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Interfaces;

namespace InvestmentPortfolio.Application.Services;

/// <inheritdoc />
/// <summary>
/// Service responsible for managing assets in user portfolios.
/// </summary>
public class AssetService : IAssetService
{
	private readonly IAssetRepository _assetRepository;
	private readonly IPortfolioRepository _portfolioRepository;
	private readonly IMapper _mapper;

	/// <summary>
	/// Initializes a new instance of the <see cref="AssetService"/> class.
	/// </summary>
	/// <param name="assetRepository">The asset repository.</param>
	/// <param name="portfolioRepository">The portfolio repository.</param>
	/// <param name="mapper">The mapper for converting entities to DTOs.</param>
	/// <exception cref="ArgumentNullException">
	/// Thrown if <paramref name="assetRepository"/>, <paramref name="portfolioRepository"/>, or <paramref name="mapper"/> is null.
	/// </exception>
	public AssetService(
		IAssetRepository assetRepository,
		IPortfolioRepository portfolioRepository,
		IMapper mapper)
	{
		_assetRepository = assetRepository ?? throw new ArgumentNullException(nameof(assetRepository));
		_portfolioRepository = portfolioRepository ?? throw new ArgumentNullException(nameof(portfolioRepository));
		_mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the portfolio does not belong to the specified user.
	/// </exception>
	public async Task<IEnumerable<AssetDto>> GetPortfolioAssetsAsync(int portfolioId, int userId)
	{
		if (!await _portfolioRepository.BelongsToUserAsync(portfolioId, userId))
			throw new UnauthorizedAccessException("Portfolio does not belong to user");

		var assets = await _assetRepository.GetByPortfolioIdAsync(portfolioId);
		return _mapper.Map<IEnumerable<AssetDto>>(assets);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the asset does not belong to the specified user.
	/// </exception>
	public async Task<AssetDto?> GetByIdAsync(int assetId, int userId)
	{
		var asset = await _assetRepository.GetByIdAsync(assetId);

		if (asset == null)
			return null;

		if (!await _portfolioRepository.BelongsToUserAsync(asset.PortfolioId, userId))
			throw new UnauthorizedAccessException("Asset does not belong to user");

		return _mapper.Map<AssetDto>(asset);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the portfolio does not belong to the specified user.
	/// </exception>
	/// <exception cref="InvalidOperationException">
	/// Thrown if the asset already exists in the portfolio.
	/// </exception>
	public async Task<AssetDto> CreateAsync(int portfolioId, CreateAssetDto dto, int userId)
	{
		if (!await _portfolioRepository.BelongsToUserAsync(portfolioId, userId))
			throw new UnauthorizedAccessException("Portfolio does not belong to user");

		if (await _assetRepository.ExistsInPortfolioAsync(portfolioId, dto.Symbol))
			throw new InvalidOperationException("Asset already exists in portfolio");

		var asset = _mapper.Map<Asset>(dto);
		asset.PortfolioId = portfolioId;

		var assetId = await _assetRepository.CreateAsync(asset);
		asset.AssetId = assetId;

		return _mapper.Map<AssetDto>(asset);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the asset does not belong to the specified user.
	/// </exception>
	public async Task<AssetDto?> UpdateAsync(int assetId, UpdateAssetDto dto, int userId)
	{
		var asset = await _assetRepository.GetByIdAsync(assetId);

		if (asset == null)
			return null;

		if (!await _portfolioRepository.BelongsToUserAsync(asset.PortfolioId, userId))
			throw new UnauthorizedAccessException("Asset does not belong to user");

		asset.Quantity = dto.Quantity;
		asset.AvgPurchasePrice = dto.AvgPurchasePrice;

		var success = await _assetRepository.UpdateAsync(asset);

		if (!success)
			return null;

		return _mapper.Map<AssetDto>(asset);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the asset does not belong to the specified user.
	/// </exception>
	public async Task<bool> DeleteAsync(int assetId, int userId)
	{
		var asset = await _assetRepository.GetByIdAsync(assetId);

		if (asset == null)
			return false;

		if (!await _portfolioRepository.BelongsToUserAsync(asset.PortfolioId, userId))
			throw new UnauthorizedAccessException("Asset does not belong to user");

		return await _assetRepository.DeleteAsync(assetId);
	}
}
