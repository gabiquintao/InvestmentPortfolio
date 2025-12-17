// ============================================================================
// File: InvestmentPortfolio.API/Services/TransactionsController.cs
// ============================================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InvestmentPortfolio.Application.DTOs.Common;
using InvestmentPortfolio.Application.DTOs.Transactions;
using InvestmentPortfolio.Application.Interfaces;

namespace InvestmentPortfolio.API.Controllers;

/// <summary>
/// Controller responsible for managing user transactions,
/// including retrieval and creation of transactions.
/// </summary>
/// <remarks>
/// All endpoints return a standardized <see cref="ApiResponse{T}"/> object:
/// - Success: HTTP 200 (or 201 for creation)
/// - Errors: HTTP 400, 403, or 404 depending on the scenario
/// </remarks>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
	private readonly ITransactionService _transactionService;

	/// <summary>
	/// Initializes a new instance of the <see cref="TransactionsController"/> class.
	/// </summary>
	/// <param name="transactionService">Transaction service.</param>
	/// <exception cref="ArgumentNullException">Thrown if <paramref name="transactionService"/> is null.</exception>
	public TransactionsController(ITransactionService transactionService)
	{
		_transactionService = transactionService ?? throw new ArgumentNullException(nameof(transactionService));
	}

	/// <summary>
	/// Retrieves all transactions for the authenticated user.
	/// </summary>
	/// <returns>
	/// Returns <see cref="ApiResponse{IEnumerable{TransactionDto}}"/> containing the user's transactions.
	/// </returns>
	/// <response code="200">Transactions retrieved successfully.</response>
	[HttpGet]
	[ProducesResponseType(typeof(ApiResponse<IEnumerable<TransactionDto>>), 200)]
	public async Task<IActionResult> GetAll()
	{
		var userId = GetUserIdFromClaims();
		var transactions = await _transactionService.GetUserTransactionsAsync(userId);

		return Ok(new ApiResponse<IEnumerable<TransactionDto>>
		{
			Success = true,
			Message = "Transactions retrieved successfully",
			Data = transactions
		});
	}

	/// <summary>
	/// Retrieves a specific transaction by its ID.
	/// </summary>
	/// <param name="id">Transaction ID.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{TransactionDto}"/> if found, otherwise 404.
	/// </returns>
	/// <response code="200">Transaction retrieved successfully.</response>
	/// <response code="404">Transaction not found.</response>
	/// <response code="403">Unauthorized access to the transaction.</response>
	[HttpGet("{id}")]
	[ProducesResponseType(typeof(ApiResponse<TransactionDto>), 200)]
	[ProducesResponseType(typeof(ApiResponse<object>), 404)]
	public async Task<IActionResult> GetById(int id)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var transaction = await _transactionService.GetByIdAsync(id, userId);

			if (transaction == null)
			{
				return NotFound(new ApiResponse<object>
				{
					Success = false,
					Message = "Transaction not found"
				});
			}

			return Ok(new ApiResponse<TransactionDto>
			{
				Success = true,
				Message = "Transaction retrieved successfully",
				Data = transaction
			});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
	}

	/// <summary>
	/// Retrieves all transactions for a specific portfolio.
	/// </summary>
	/// <param name="portfolioId">Portfolio ID.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{IEnumerable{TransactionDto}}"/> containing the portfolio transactions.
	/// </returns>
	/// <response code="200">Transactions retrieved successfully.</response>
	/// <response code="403">Unauthorized access to the portfolio.</response>
	[HttpGet("portfolio/{portfolioId}")]
	[ProducesResponseType(typeof(ApiResponse<IEnumerable<TransactionDto>>), 200)]
	public async Task<IActionResult> GetByPortfolio(int portfolioId)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var transactions = await _transactionService.GetPortfolioTransactionsAsync(portfolioId, userId);

			return Ok(new ApiResponse<IEnumerable<TransactionDto>>
			{
				Success = true,
				Message = "Transactions retrieved successfully",
				Data = transactions
			});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
	}

	/// <summary>
	/// Creates a new transaction for the authenticated user.
	/// </summary>
	/// <param name="dto">Transaction creation data.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{TransactionDto}"/> containing the created transaction.
	/// </returns>
	/// <response code="201">Transaction created successfully.</response>
	/// <response code="400">Invalid transaction data.</response>
	/// <response code="403">Unauthorized access to the portfolio or asset.</response>
	[HttpPost]
	[ProducesResponseType(typeof(ApiResponse<TransactionDto>), 201)]
	[ProducesResponseType(typeof(ApiResponse<object>), 400)]
	public async Task<IActionResult> Create([FromBody] CreateTransactionDto dto)
	{
		var userId = GetUserIdFromClaims();

		try
		{
			var transaction = await _transactionService.CreateAsync(dto, userId);

			return CreatedAtAction(
				nameof(GetById),
				new { id = transaction.TransactionId },
				new ApiResponse<TransactionDto>
				{
					Success = true,
					Message = "Transaction created successfully",
					Data = transaction
				});
		}
		catch (UnauthorizedAccessException)
		{
			return Forbid();
		}
		catch (Exception ex) when (ex is KeyNotFoundException || ex is InvalidOperationException)
		{
			return BadRequest(new ApiResponse<object>
			{
				Success = false,
				Message = ex.Message
			});
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
