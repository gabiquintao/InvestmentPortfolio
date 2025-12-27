// ============================================================================
// File: InvestmentPortfolio.Api/Controllers/AuthController.cs
// Purpose: Controller to handle user authentication via WCF client.
// ============================================================================

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InvestmentPortfolio.Api.WcfClients;
using InvestmentPortfolio.Application.DTOs.Auth;
using System.Security.Claims;

namespace InvestmentPortfolio.Api.Controllers
{
	/// <summary>
	/// Controller responsible for user authentication and profile management.
	/// </summary>
	[ApiController]
	[Route("api/[controller]")]
	[Produces("application/json")]
	public class AuthController : ControllerBase
	{
		private readonly AuthWcfClient _authClient;
		private readonly ILogger<AuthController> _logger;

		public AuthController(AuthWcfClient authClient, ILogger<AuthController> logger)
		{
			_authClient = authClient ?? throw new ArgumentNullException(nameof(authClient));
			_logger = logger ?? throw new ArgumentNullException(nameof(logger));
		}

		/// <summary>
		/// Registers a new user.
		/// </summary>
		[HttpPost("register")]
		[ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		[ProducesResponseType(StatusCodes.Status502BadGateway)]
		public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			try
			{
				var response = await _authClient.RegisterAsync(request);

				if (!response.Success)
					return BadRequest(new { message = response.Message, errors = response.Errors });

				return Ok(response.Data);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error during registration");
				return StatusCode(StatusCodes.Status502BadGateway, new { message = "Authentication service unavailable", error = ex.Message });
			}
		}

		/// <summary>
		/// Logs in a user and returns authentication token.
		/// </summary>
		[HttpPost("login")]
		[ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			var response = await _authClient.LoginAsync(request);

			if (!response.Success)
				return Unauthorized(new { message = response.Message });

			return Ok(response.Data);
		}

		/// <summary>
		/// Returns the profile of the authenticated user.
		/// </summary>
		[HttpGet("profile")]
		[Authorize]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status401Unauthorized)]
		[ProducesResponseType(StatusCodes.Status404NotFound)]
		public async Task<IActionResult> GetProfile()
		{
			var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
				return Unauthorized(new { message = "Invalid token" });

			var response = await _authClient.GetProfileAsync(userId);

			if (!response.Success)
				return NotFound(new { message = response.Message });

			return Ok(response.Data);
		}

		/// <summary>
		/// Validates a given authentication token.
		/// </summary>
		[HttpPost("validate")]
		[ProducesResponseType(StatusCodes.Status200OK)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> ValidateToken([FromBody] string token)
		{
			if (string.IsNullOrEmpty(token))
				return BadRequest(new { message = "Token is required" });

			var response = await _authClient.ValidateTokenAsync(token);

			if (!response.Success || !response.Data.HasValue)
				return BadRequest(new { message = "Invalid token" });

			return Ok(new { valid = true, userId = response.Data.Value });
		}
	}
}
