// ============================================================================
// File: InvestmentPortfolio.Api/Controllers/TransactionController.cs
// Purpose: Controller to manage user transactions via WCF client.
// ============================================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InvestmentPortfolio.Api.WcfClients;
using InvestmentPortfolio.Application.DTOs.Transactions;
using System.Security.Claims;

namespace InvestmentPortfolio.Api.Controllers
{
	/// <summary>
	/// Controller responsible for managing transactions.
	/// All endpoints require authentication.
	/// </summary>
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	[Produces("application/json")]
	public class TransactionController : ControllerBase
	{
		private readonly TransactionWcfClient _transactionClient;
		private readonly ILogger<TransactionController> _logger;

		public TransactionController(TransactionWcfClient transactionClient, ILogger<TransactionController> logger)
		{
			_transactionClient = transactionClient ?? throw new ArgumentNullException(nameof(transactionClient));
			_logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		/// <summary>
		/// Gets the authenticated user's ID from JWT.
		/// </summary>
		private int GetUserId()
		{
			var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
				throw new UnauthorizedAccessException("Invalid token");
			return userId;
		}

		/// <summary>
		/// Returns all transactions of the authenticated user.
		/// </summary>
		[HttpGet]
		[ProducesResponseType(typeof(List<TransactionDto>), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public async Task<IActionResult> GetUserTransactions()
		{
			try
			{
				var userId = GetUserId();
				var response = await _transactionClient.GetUserTransactionsAsync(userId);

				if (!response.Success)
					return BadRequest(new { message = response.Message });

				return Ok(response.Data);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error retrieving user transactions");
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Returns all transactions for a specific portfolio.
		/// </summary>
		[HttpGet("portfolio/{portfolioId}")]
		[ProducesResponseType(typeof(List<TransactionDto>), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> GetPortfolioTransactions(int portfolioId)
		{
			try
			{
				var userId = GetUserId();
				var response = await _transactionClient.GetPortfolioTransactionsAsync(portfolioId, userId);

				if (!response.Success)
				{
					if (response.Message?.Contains("not belong") == true)
						return Forbid();
					return BadRequest(new { message = response.Message });
				}

				return Ok(response.Data);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error retrieving transactions for portfolio {PortfolioId}", portfolioId);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Returns a specific transaction by ID.
		/// </summary>
		[HttpGet("{id}")]
		[ProducesResponseType(typeof(TransactionDto), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> GetById(int id)
		{
			try
			{
				var userId = GetUserId();
				var response = await _transactionClient.GetByIdAsync(id, userId);

				if (!response.Success)
				{
					if (response.Message?.Contains("not belong") == true)
						return Forbid();
					return NotFound(new { message = response.Message });
				}

				return Ok(response.Data);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error retrieving transaction {TransactionId}", id);
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}

		/// <summary>
		/// Creates a new transaction.
		/// </summary>
		[HttpPost]
		[ProducesResponseType(typeof(TransactionDto), StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status403Forbidden)]
		public async Task<IActionResult> Create([FromBody] CreateTransactionDto dto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			try
			{
				var userId = GetUserId();
				var response = await _transactionClient.CreateAsync(dto, userId);

				if (!response.Success)
					return BadRequest(new { message = response.Message, errors = response.Errors });

				return CreatedAtAction(nameof(GetById), new { id = response.Data!.TransactionId }, response.Data);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error creating transaction");
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Service unavailable" });
			}
		}
	}
}
