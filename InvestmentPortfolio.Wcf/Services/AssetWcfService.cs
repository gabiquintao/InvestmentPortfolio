// ============================================================================
// File: InvestmentPortfolio.Wcf/Services/AssetWcfService.cs
// Purpose: WCF service implementation for asset operations, forwarding calls
//          to the application service and wrapping results in ServiceResponse<T>.
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Assets;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Contracts.Models;
using InvestmentPortfolio.Contracts.ServiceContracts;

namespace InvestmentPortfolio.Wcf.Services;

public class AssetWcfService : IAssetWcfService
{
	private readonly IAssetService _assetService;
	private readonly ILogger<AssetWcfService> _logger;

	/// <summary>
	/// WCF Service implementation for asset operations.
	/// Inherits documentation from <see cref="IAssetWcfService"/>.
	/// </summary>
	public AssetWcfService(
		IAssetService assetService,
		ILogger<AssetWcfService> logger)
	{
		_assetService = assetService ?? throw new ArgumentNullException(nameof(assetService));
		_logger = logger ?? throw new ArgumentNullException(nameof(logger));
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<List<AssetDto>>> GetPortfolioAssetsAsync(int portfolioId, int userId)
	{
		try
		{
			_logger.LogInformation("Fetching assets for portfolio {PortfolioId} and user {UserId}", portfolioId, userId);
			var assets = await _assetService.GetPortfolioAssetsAsync(portfolioId, userId);
			return ServiceResponse<List<AssetDto>>.SuccessResponse(assets.ToList());
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to portfolio {PortfolioId} by user {UserId}", portfolioId, userId);
			return ServiceResponse<List<AssetDto>>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error fetching assets for portfolio {PortfolioId}", portfolioId);
			return ServiceResponse<List<AssetDto>>.FailureResponse("An error occurred while fetching assets");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<AssetDto>> GetByIdAsync(int assetId, int userId)
	{
		try
		{
			_logger.LogInformation("Fetching asset {AssetId} for user {UserId}", assetId, userId);
			var asset = await _assetService.GetByIdAsync(assetId, userId);

			if (asset == null)
			{
				return ServiceResponse<AssetDto>.FailureResponse("Asset not found");
			}

			return ServiceResponse<AssetDto>.SuccessResponse(asset);
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to asset {AssetId} by user {UserId}", assetId, userId);
			return ServiceResponse<AssetDto>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error fetching asset {AssetId}", assetId);
			return ServiceResponse<AssetDto>.FailureResponse("An error occurred while fetching asset");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<AssetDto>> CreateAsync(int portfolioId, CreateAssetDto dto, int userId)
	{
		try
		{
			_logger.LogInformation("Creating asset in portfolio {PortfolioId} for user {UserId}", portfolioId, userId);
			var asset = await _assetService.CreateAsync(portfolioId, dto, userId);
			_logger.LogInformation("Asset created successfully with ID: {AssetId}", asset.AssetId);
			return ServiceResponse<AssetDto>.SuccessResponse(asset, "Asset created successfully");
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to portfolio {PortfolioId} by user {UserId}", portfolioId, userId);
			return ServiceResponse<AssetDto>.FailureResponse(ex.Message);
		}
		catch (InvalidOperationException ex)
		{
			_logger.LogWarning(ex, "Invalid operation while creating asset in portfolio {PortfolioId}", portfolioId);
			return ServiceResponse<AssetDto>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error creating asset in portfolio {PortfolioId}", portfolioId);
			return ServiceResponse<AssetDto>.FailureResponse("An error occurred while creating asset");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<AssetDto>> UpdateAsync(int assetId, UpdateAssetDto dto, int userId)
	{
		try
		{
			_logger.LogInformation("Updating asset {AssetId} for user {UserId}", assetId, userId);
			var asset = await _assetService.UpdateAsync(assetId, dto, userId);

			if (asset == null)
			{
				return ServiceResponse<AssetDto>.FailureResponse("Asset not found");
			}

			_logger.LogInformation("Asset updated successfully: {AssetId}", assetId);
			return ServiceResponse<AssetDto>.SuccessResponse(asset, "Asset updated successfully");
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to asset {AssetId} by user {UserId}", assetId, userId);
			return ServiceResponse<AssetDto>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error updating asset {AssetId}", assetId);
			return ServiceResponse<AssetDto>.FailureResponse("An error occurred while updating asset");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<bool>> DeleteAsync(int assetId, int userId)
	{
		try
		{
			_logger.LogInformation("Deleting asset {AssetId} for user {UserId}", assetId, userId);
			var success = await _assetService.DeleteAsync(assetId, userId);

			if (!success)
			{
				return ServiceResponse<bool>.FailureResponse("Asset not found or could not be deleted");
			}

			_logger.LogInformation("Asset deleted successfully: {AssetId}", assetId);
			return ServiceResponse<bool>.SuccessResponse(true, "Asset deleted successfully");
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to asset {AssetId} by user {UserId}", assetId, userId);
			return ServiceResponse<bool>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error deleting asset {AssetId}", assetId);
			return ServiceResponse<bool>.FailureResponse("An error occurred while deleting asset");
		}
	}
}