using InvestmentPortfolio.Application.DTOs.Auth;
// ============================================================================
// File: InvestmentPortfolio.Wcf/Services/AuthWcfService.cs
// Purpose: WCF service implementation for authentication operations, forwarding
//          calls to the application service and wrapping results in ServiceResponse<T>.
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Users;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Contracts.Models;
using InvestmentPortfolio.Contracts.ServiceContracts;

namespace InvestmentPortfolio.Wcf.Services;

/// <summary>
/// WCF Service implementation for authentication operations
/// </summary>
public class AuthWcfService : IAuthWcfService
{
	private readonly IAuthService _authService;
	private readonly IJwtService _jwtService;
	private readonly ILogger<AuthWcfService> _logger;

	/// <summary>
	/// WCF Service implementation for authentication operations.
	/// Inherits documentation from <see cref="IAuthWcfService"/>.
	/// </summary>
	public AuthWcfService(
		IAuthService authService,
		IJwtService jwtService,
		ILogger<AuthWcfService> logger)
	{
		_authService = authService ?? throw new ArgumentNullException(nameof(authService));
		_jwtService = jwtService ?? throw new ArgumentNullException(nameof(jwtService));
		_logger = logger ?? throw new ArgumentNullException(nameof(logger));
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto request)
	{
		try
		{
			_logger.LogInformation("=== WCF REGISTER START ===");
			_logger.LogInformation("Registration attempt for email: {Email}", request.Email);

			var result = await _authService.RegisterAsync(request);

			_logger.LogInformation("User registered successfully: {Email}", request.Email);
			_logger.LogInformation("Token generated: {Token}", result.Token?.Substring(0, 20) ?? "NULL");
			_logger.LogInformation("User object is null: {IsNull}", result.User == null);

			if (result.User != null)
			{
				_logger.LogInformation("User ID: {UserId}", result.User.UserId);
				_logger.LogInformation("User Email: {Email}", result.User.Email);
				_logger.LogInformation("User FullName: {FullName}", result.User.FullName);
			}

			var response = ServiceResponse<AuthResponseDto>.SuccessResponse(result, "User registered successfully");

			_logger.LogInformation("=== WCF RESPONSE CREATED ===");
			_logger.LogInformation("Response Success: {Success}", response.Success);
			_logger.LogInformation("Response Message: {Message}", response.Message);
			_logger.LogInformation("Response Data is null: {IsNull}", response.Data == null);
			_logger.LogInformation("=== WCF REGISTER END ===");

			return response;
		}
		catch (InvalidOperationException ex)
		{
			_logger.LogWarning(ex, "Registration failed for email: {Email}", request.Email);
			return ServiceResponse<AuthResponseDto>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error during registration for email: {Email}", request.Email);
			_logger.LogError("Exception Type: {Type}", ex.GetType().FullName);
			_logger.LogError("Stack Trace: {StackTrace}", ex.StackTrace);
			return ServiceResponse<AuthResponseDto>.FailureResponse("An error occurred during registration");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<AuthResponseDto>> LoginAsync(LoginRequestDto request)
	{
		try
		{
			_logger.LogInformation("Login attempt for email: {Email}", request.Email);
			var result = await _authService.LoginAsync(request);
			_logger.LogInformation("User logged in successfully: {Email}", request.Email);
			return ServiceResponse<AuthResponseDto>.SuccessResponse(result, "Login successful");
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Login failed for email: {Email}", request.Email);
			return ServiceResponse<AuthResponseDto>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error during login for email: {Email}", request.Email);
			return ServiceResponse<AuthResponseDto>.FailureResponse("An error occurred during login");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<UserDto>> GetProfileAsync(int userId)
	{
		try
		{
			_logger.LogInformation("Fetching profile for user: {UserId}", userId);
			var result = await _authService.GetProfileAsync(userId);
			return ServiceResponse<UserDto>.SuccessResponse(result);
		}
		catch (KeyNotFoundException ex)
		{
			_logger.LogWarning(ex, "User not found: {UserId}", userId);
			return ServiceResponse<UserDto>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error fetching profile for user: {UserId}", userId);
			return ServiceResponse<UserDto>.FailureResponse("An error occurred while fetching profile");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<int?>> ValidateTokenAsync(string token)
	{
		try
		{
			_logger.LogInformation("Validating token");
			var userId = _jwtService.ValidateToken(token);

			if (userId.HasValue)
			{
				return ServiceResponse<int?>.SuccessResponse(userId, "Token is valid");
			}

			return ServiceResponse<int?>.FailureResponse("Invalid token");
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error validating token");
			return ServiceResponse<int?>.FailureResponse("An error occurred while validating token");
		}
	}
}