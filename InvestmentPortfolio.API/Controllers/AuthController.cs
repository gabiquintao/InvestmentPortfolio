// ============================================================================
// File: InvestmentPortfolio.API/Services/AuthController.cs
// ============================================================================

using Microsoft.AspNetCore.Mvc;
using InvestmentPortfolio.Application.DTOs.Auth;
using InvestmentPortfolio.Application.DTOs.Common;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Application.DTOs.Users;

namespace InvestmentPortfolio.API.Controllers;

/// <summary>
/// Controller responsible for user authentication, including registration,
/// login, and profile retrieval.
/// </summary>
/// <remarks>
/// All endpoints return a standardized <see cref="ApiResponse{T}"/> object:
/// - Success: HTTP 200 (or 401 for unauthorized login/profile)
/// - Errors: HTTP 400, 401 with list of error messages
/// </remarks>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
	private readonly IAuthService _authService;

	/// <summary>
	/// Initializes a new instance of the <see cref="AuthController"/> class.
	/// </summary>
	/// <param name="authService">Authentication service.</param>
	/// <exception cref="ArgumentNullException">Thrown if <paramref name="authService"/> is null.</exception>
	public AuthController(IAuthService authService)
	{
		_authService = authService ?? throw new ArgumentNullException(nameof(authService));
	}

	/// <summary>
	/// Registers a new user.
	/// </summary>
	/// <param name="request">User registration data.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{AuthResponseDto}"/> containing JWT token and user info.
	/// </returns>
	/// <response code="200">User registered successfully.</response>
	/// <response code="400">Email already exists or registration failed.</response>
	[HttpPost("register")]
	[ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), 200)]
	[ProducesResponseType(typeof(ApiResponse<object>), 400)]
	public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
	{
		try
		{
			var result = await _authService.RegisterAsync(request);
			return Ok(new ApiResponse<AuthResponseDto>
			{
				Success = true,
				Message = "User registered successfully",
				Data = result
			});
		}
		catch (InvalidOperationException ex)
		{
			return BadRequest(new ApiResponse<object>
			{
				Success = false,
				Message = ex.Message,
				Errors = new List<string> { ex.Message }
			});
		}
	}

	/// <summary>
	/// Authenticates a user.
	/// </summary>
	/// <param name="request">User login data.</param>
	/// <returns>
	/// Returns <see cref="ApiResponse{AuthResponseDto}"/> containing JWT token and user info.
	/// </returns>
	/// <response code="200">Login successful.</response>
	/// <response code="401">Invalid credentials.</response>
	[HttpPost("login")]
	[ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), 200)]
	[ProducesResponseType(typeof(ApiResponse<object>), 401)]
	public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
	{
		try
		{
			var result = await _authService.LoginAsync(request);
			return Ok(new ApiResponse<AuthResponseDto>
			{
				Success = true,
				Message = "Login successful",
				Data = result
			});
		}
		catch (UnauthorizedAccessException ex)
		{
			return Unauthorized(new ApiResponse<object>
			{
				Success = false,
				Message = ex.Message,
				Errors = new List<string> { ex.Message }
			});
		}
	}

	/// <summary>
	/// Retrieves the authenticated user's profile.
	/// </summary>
	/// <returns>
	/// Returns <see cref="ApiResponse{UserDto}"/> containing the user's profile data.
	/// </returns>
	/// <response code="200">Profile retrieved successfully.</response>
	/// <response code="401">Unauthorized if user is not authenticated.</response>
	[HttpGet("profile")]
	[ProducesResponseType(typeof(ApiResponse<UserDto>), 200)]
	[ProducesResponseType(401)]
	public async Task<IActionResult> GetProfile()
	{
		var userId = GetUserIdFromClaims();
		if (userId == null)
		{
			return Unauthorized();
		}

		var user = await _authService.GetProfileAsync(userId.Value);
		return Ok(new ApiResponse<UserDto>
		{
			Success = true,
			Message = "Profile retrieved successfully",
			Data = user
		});
	}

	/// <summary>
	/// Extracts the user ID from JWT claims.
	/// </summary>
	/// <returns>User ID if present; otherwise, null.</returns>
	private int? GetUserIdFromClaims()
	{
		var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
		if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId))
		{
			return userId;
		}
		return null;
	}
}
