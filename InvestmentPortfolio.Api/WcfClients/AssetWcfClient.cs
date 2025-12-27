// ============================================================================
// File: InvestmentPortfolio.Api/WcfClients/AssetWcfClient.cs
// Purpose: WCF client for asset operations.
//          Wraps the IAssetWcfService interface, providing logging, endpoint 
//          configuration, and channel management.
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Assets;
using InvestmentPortfolio.Contracts.Models;
using InvestmentPortfolio.Contracts.ServiceContracts;

namespace InvestmentPortfolio.Api.WcfClients
{
	/// <summary>
	/// WCF client for asset operations.
	/// Wraps the <see cref="IAssetWcfService"/> interface, adding logging and channel management.
	/// </summary>
	public class AssetWcfClient : WcfClientBase<IAssetWcfService>
	{
		public AssetWcfClient(IConfiguration configuration, ILogger<AssetWcfClient> logger)
			: base(
				configuration["WcfServices:AssetService"]
					?? throw new InvalidOperationException("AssetService URL not configured"),
				logger)
		{
		}

		/// <inheritdoc cref="IAssetWcfService.GetPortfolioAssetsAsync"/>
		public async Task<ServiceResponse<List<AssetDto>>> GetPortfolioAssetsAsync(int portfolioId, int userId)
		{
			_logger.LogInformation("Calling WCF GetPortfolioAssetsAsync for portfolioId: {PortfolioId}, userId: {UserId}", portfolioId, userId);
			return await Channel.GetPortfolioAssetsAsync(portfolioId, userId);
		}

		/// <inheritdoc cref="IAssetWcfService.GetByIdAsync"/>
		public async Task<ServiceResponse<AssetDto>> GetByIdAsync(int assetId, int userId)
		{
			_logger.LogInformation("Calling WCF GetByIdAsync for assetId: {AssetId}, userId: {UserId}", assetId, userId);
			return await Channel.GetByIdAsync(assetId, userId);
		}

		/// <inheritdoc cref="IAssetWcfService.CreateAsync"/>
		public async Task<ServiceResponse<AssetDto>> CreateAsync(int portfolioId, CreateAssetDto dto, int userId)
		{
			_logger.LogInformation("Calling WCF CreateAsync for portfolioId: {PortfolioId}, userId: {UserId}", portfolioId, userId);
			return await Channel.CreateAsync(portfolioId, dto, userId);
		}

		/// <inheritdoc cref="IAssetWcfService.UpdateAsync"/>
		public async Task<ServiceResponse<AssetDto>> UpdateAsync(int assetId, UpdateAssetDto dto, int userId)
		{
			_logger.LogInformation("Calling WCF UpdateAsync for assetId: {AssetId}, userId: {UserId}", assetId, userId);
			return await Channel.UpdateAsync(assetId, dto, userId);
		}

		/// <inheritdoc cref="IAssetWcfService.DeleteAsync"/>
		public async Task<ServiceResponse<bool>> DeleteAsync(int assetId, int userId)
		{
			_logger.LogInformation("Calling WCF DeleteAsync for assetId: {AssetId}, userId: {UserId}", assetId, userId);
			return await Channel.DeleteAsync(assetId, userId);
		}
	}
}
