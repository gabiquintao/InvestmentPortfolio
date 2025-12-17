// ============================================================================
// File: InvestmentPortfolio.API/Services/PortfoliosController.cs
// ============================================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InvestmentPortfolio.Application.DTOs.Common;
using InvestmentPortfolio.Application.DTOs.Portfolios;
using InvestmentPortfolio.Application.Interfaces;

namespace InvestmentPortfolio.API.Controllers;

/// <summary>
/// Controller responsible for managing user portfolios, including
/// retrieval, creation, update, and deletion.
/// </summary>
/// <remarks>
/// All endpoints return a standardized <see cref="ApiResponse{T}"/> object:
/// - Success: HTTP 200 (or 201 for creation)
/// - Errors: HTTP 400, 404, or 403 depending on the scenario
/// </remarks>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PortfoliosController : ControllerBase
{
	private readonly IPortfolioService _portfolioService;

	/// <summary>
	/// Initializes a new instance of the <see cref="PortfoliosController"/> class.
	/// </summary>
	/// <param name="portfolioService">Portfolio service.</param>
	/// <exception cref="ArgumentNullException">Thrown if <paramref name="portfolioService"/> is null.</exception>
	public PortfoliosController(IPortfolioService portfolioService)
	{
		_portfolioService = portfolioService ?? throw new ArgumentNullException(nameof(portfolioService));
	}

	/// <summary>
	/// Retrieves all portfolios for the authenticated user.
	/// </summary>
	/// <returns>
	/// Returns <see cref="ApiResponse{IEnumerable{PortfolioDto}}"/> containing a list of portfolios.
	/// </returns>
	/// <response code="200">Portfolios retrieved successfully.</response>
	[HttpGet]
	[ProducesResponseType(typeof(ApiResponse<IEnumerable<PortfolioDto>>), 200)]
	public async Task<IActionResult> GetAll()
	{
		var userId = GetUserIdFromClaims();
		var portfolios = await _portfolioService.GetUserPortfoliosAsync(userId);

		return Ok(new ApiResponse<IEnumerable<PortfolioDto>>
		{
			Success = true,
			Message = "Portfolios retrieved successfully",
			Data = portfolios
		});
	}

	/// <summary>
	/// Retrieves a specific portfolio by ID.
	/// </summary>
	/// <param name="id">Portfolio ID.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{PortfolioDto}"/> if found, otherwise 404.
	/// </returns>
	/// <response code="200">Portfolio retrieved successfully.</response>
	/// <response code="404">Portfolio not found.</response>
	/// <response code="403">Unauthorized access to the portfolio.</response>
	[HttpGet("{id}")]
	[ProducesResponseType(typeof(ApiResponse<PortfolioDto>), 200)]
	[ProducesResponseType(typeof(ApiResponse<object>), 404)]
	public async Task<IActionResult> GetById(int id)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var portfolio = await _portfolioService.GetByIdAsync(id, userId);

			if (portfolio == null)
			{
				return NotFound(new ApiResponse<object>
				{
					Success = false,
					Message = "Portfolio not found"
				});
			}

			return Ok(new ApiResponse<PortfolioDto>
			{
				Success = true,
				Message = "Portfolio retrieved successfully",
				Data = portfolio
			});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
	}

	/// <summary>
	/// Creates a new portfolio for the authenticated user.
	/// </summary>
	/// <param name="dto">Portfolio creation data.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{PortfolioDto}"/> containing the created portfolio.
	/// </returns>
	/// <response code="201">Portfolio created successfully.</response>
	/// <response code="400">Invalid portfolio data.</response>
	[HttpPost]
	[ProducesResponseType(typeof(ApiResponse<PortfolioDto>), 201)]
	[ProducesResponseType(typeof(ApiResponse<object>), 400)]
	public async Task<IActionResult> Create([FromBody] CreatePortfolioDto dto)
	{
		var userId = GetUserIdFromClaims();
		var portfolio = await _portfolioService.CreateAsync(dto, userId);

		return CreatedAtAction(
			nameof(GetById),
			new { id = portfolio.PortfolioId },
			new ApiResponse<PortfolioDto>
			{
				Success = true,
				Message = "Portfolio created successfully",
				Data = portfolio
			});
	}

	/// <summary>
	/// Updates an existing portfolio.
	/// </summary>
	/// <param name="id">Portfolio ID.</param>
	/// <param name="dto">Portfolio update data.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{PortfolioDto}"/> if updated, otherwise 404.
	/// </returns>
	/// <response code="200">Portfolio updated successfully.</response>
	/// <response code="404">Portfolio not found.</response>
	/// <response code="403">Unauthorized access to the portfolio.</response>
	[HttpPut("{id}")]
	[ProducesResponseType(typeof(ApiResponse<PortfolioDto>), 200)]
	[ProducesResponseType(typeof(ApiResponse<object>), 404)]
	public async Task<IActionResult> Update(int id, [FromBody] UpdatePortfolioDto dto)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var portfolio = await _portfolioService.UpdateAsync(id, dto, userId);

			if (portfolio == null)
			{
				return NotFound(new ApiResponse<object>
				{
					Success = false,
					Message = "Portfolio not found"
				});
			}

			return Ok(new ApiResponse<PortfolioDto>
			{
				Success = true,
				Message = "Portfolio updated successfully",
				Data = portfolio
			});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
	}

	/// <summary>
	/// Deletes a portfolio by ID.
	/// </summary>
	/// <param name="id">Portfolio ID.</param>
	/// <returns>
	/// Returns success message if deleted, otherwise 404.
	/// </returns>
	/// <response code="200">Portfolio deleted successfully.</response>
	/// <response code="404">Portfolio not found.</response>
	/// <response code="403">Unauthorized access to the portfolio.</response>
	[HttpDelete("{id}")]
	[ProducesResponseType(typeof(ApiResponse<object>), 200)]
	[ProducesResponseType(typeof(ApiResponse<object>), 404)]
	public async Task<IActionResult> Delete(int id)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var success = await _portfolioService.DeleteAsync(id, userId);

			if (!success)
			{
				return NotFound(new ApiResponse<object>
				{
					Success = false,
					Message = "Portfolio not found"
				});
			}

			return Ok(new ApiResponse<object>
			{
				Success = true,
				Message = "Portfolio deleted successfully"
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
