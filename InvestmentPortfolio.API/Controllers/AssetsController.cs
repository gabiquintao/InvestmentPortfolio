// ============================================================================
// File: InvestmentPortfolio.API/Services/AssetsController.cs
// ============================================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InvestmentPortfolio.Application.DTOs.Assets;
using InvestmentPortfolio.Application.DTOs.Common;
using InvestmentPortfolio.Application.Interfaces;

namespace InvestmentPortfolio.API.Controllers;

/// <summary>
/// Controller responsible for managing assets within portfolios.
/// </summary>
/// <remarks>
/// All endpoints require authentication and return a standardized
/// <see cref="ApiResponse{T}"/> object.
/// </remarks>
[Authorize]
[ApiController]
[Route("api/portfolios/{portfolioId}/[controller]")]
public class AssetsController : ControllerBase
{
	private readonly IAssetService _assetService;

	/// <summary>
	/// Initializes a new instance of the <see cref="AssetsController"/> class.
	/// </summary>
	/// <param name="assetService">Asset service.</param>
	/// <exception cref="ArgumentNullException">Thrown if <paramref name="assetService"/> is null.</exception>
	public AssetsController(IAssetService assetService)
	{
		_assetService = assetService ?? throw new ArgumentNullException(nameof(assetService));
	}

	/// <summary>
	/// Retrieves all assets for a specific portfolio.
	/// </summary>
	/// <param name="portfolioId">Portfolio ID.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{IEnumerable{AssetDto}}"/> containing the portfolio assets.
	/// </returns>
	/// <response code="200">Assets retrieved successfully.</response>
	/// <response code="403">Unauthorized access to the portfolio.</response>
	[HttpGet]
	[ProducesResponseType(typeof(ApiResponse<IEnumerable<AssetDto>>), 200)]
	public async Task<IActionResult> GetAll(int portfolioId)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var assets = await _assetService.GetPortfolioAssetsAsync(portfolioId, userId);

			return Ok(new ApiResponse<IEnumerable<AssetDto>>
			{
				Success = true,
				Message = "Assets retrieved successfully",
				Data = assets
			});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
	}

	/// <summary>
	/// Creates a new asset within a portfolio.
	/// </summary>
	/// <param name="portfolioId">Portfolio ID.</param>
	/// <param name="dto">Asset creation data.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{AssetDto}"/> containing the created asset.
	/// </returns>
	/// <response code="201">Asset created successfully.</response>
	/// <response code="400">Invalid asset data.</response>
	/// <response code="403">Unauthorized access to the portfolio.</response>
	[HttpPost]
	[ProducesResponseType(typeof(ApiResponse<AssetDto>), 201)]
	[ProducesResponseType(typeof(ApiResponse<object>), 400)]
	public async Task<IActionResult> Create(int portfolioId, [FromBody] CreateAssetDto dto)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var asset = await _assetService.CreateAsync(portfolioId, dto, userId);

			return CreatedAtAction(
				nameof(GetById),
				new { portfolioId, id = asset.AssetId },
				new ApiResponse<AssetDto>
				{
					Success = true,
					Message = "Asset created successfully",
					Data = asset
				});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
		catch (InvalidOperationException ex)
		{
			return BadRequest(new ApiResponse<object>
			{
				Success = false,
				Message = ex.Message
			});
		}
	}

	/// <summary>
	/// Retrieves a specific asset by its ID.
	/// </summary>
	/// <param name="portfolioId">Portfolio ID.</param>
	/// <param name="id">Asset ID.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{AssetDto}"/> if found; otherwise, 404.
	/// </returns>
	/// <response code="200">Asset retrieved successfully.</response>
	/// <response code="404">Asset not found.</response>
	/// <response code="403">Unauthorized access to the asset.</response>
	[HttpGet("{id}")]
	[ProducesResponseType(typeof(ApiResponse<AssetDto>), 200)]
	[ProducesResponseType(typeof(ApiResponse<object>), 404)]
	public async Task<IActionResult> GetById(int portfolioId, int id)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var asset = await _assetService.GetByIdAsync(id, userId);

			if (asset == null)
			{
				return NotFound(new ApiResponse<object>
				{
					Success = false,
					Message = "Asset not found"
				});
			}

			return Ok(new ApiResponse<AssetDto>
			{
				Success = true,
				Message = "Asset retrieved successfully",
				Data = asset
			});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
	}

	/// <summary>
	/// Updates an existing asset.
	/// </summary>
	/// <param name="portfolioId">Portfolio ID.</param>
	/// <param name="id">Asset ID.</param>
	/// <param name="dto">Asset update data.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{AssetDto}"/> containing the updated asset.
	/// </returns>
	/// <response code="200">Asset updated successfully.</response>
	/// <response code="404">Asset not found.</response>
	/// <response code="403">Unauthorized access to the asset.</response>
	[HttpPut("{id}")]
	[ProducesResponseType(typeof(ApiResponse<AssetDto>), 200)]
	[ProducesResponseType(typeof(ApiResponse<object>), 404)]
	public async Task<IActionResult> Update(int portfolioId, int id, [FromBody] UpdateAssetDto dto)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var asset = await _assetService.UpdateAsync(id, dto, userId);

			if (asset == null)
			{
				return NotFound(new ApiResponse<object>
				{
					Success = false,
					Message = "Asset not found"
				});
			}

			return Ok(new ApiResponse<AssetDto>
			{
				Success = true,
				Message = "Asset updated successfully",
				Data = asset
			});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
	}

	/// <summary>
	/// Deletes an asset.
	/// </summary>
	/// <param name="portfolioId">Portfolio ID.</param>
	/// <param name="id">Asset ID.</param>
	/// <returns>
	/// Returns a success response if the asset was deleted.
	/// </returns>
	/// <response code="200">Asset deleted successfully.</response>
	/// <response code="404">Asset not found.</response>
	/// <response code="403">Unauthorized access to the asset.</response>
	[HttpDelete("{id}")]
	[ProducesResponseType(typeof(ApiResponse<object>), 200)]
	[ProducesResponseType(typeof(ApiResponse<object>), 404)]
	public async Task<IActionResult> Delete(int portfolioId, int id)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var success = await _assetService.DeleteAsync(id, userId);

			if (!success)
			{
				return NotFound(new ApiResponse<object>
				{
					Success = false,
					Message = "Asset not found"
				});
			}

			return Ok(new ApiResponse<object>
			{
				Success = true,
				Message = "Asset deleted successfully"
			});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
	}

	/// <summary>
	/// Extracts the authenticated user's ID from JWT claims.
	/// </summary>
	/// <returns>User ID.</returns>
	private int GetUserIdFromClaims()
	{
		var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
		return int.Parse(userIdClaim!.Value);
	}
}
