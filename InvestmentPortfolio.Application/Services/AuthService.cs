// ============================================================================
// File: InvestmentPortfolio.Application/Services/AuthService.cs
// ============================================================================

using AutoMapper;
using InvestmentPortfolio.Application.DTOs.Auth;
using InvestmentPortfolio.Application.DTOs.Users;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Interfaces;

namespace InvestmentPortfolio.Application.Services;

/// <inheritdoc />
/// <summary>
/// Service responsible for user authentication, registration, and profile retrieval.
/// </summary>
public class AuthService : IAuthService
{
	private readonly IUserRepository _userRepository;
	private readonly IJwtService _jwtService;
	private readonly IMapper _mapper;

	/// <summary>
	/// Initializes a new instance of the <see cref="AuthService"/> class.
	/// </summary>
	/// <param name="userRepository">The user repository.</param>
	/// <param name="jwtService">The JWT token service.</param>
	/// <param name="mapper">The mapper for converting entities to DTOs.</param>
	/// <exception cref="ArgumentNullException">
	/// Thrown if <paramref name="userRepository"/>, <paramref name="jwtService"/>, or <paramref name="mapper"/> is null.
	/// </exception>
	public AuthService(
		IUserRepository userRepository,
		IJwtService jwtService,
		IMapper mapper)
	{
		_userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
		_jwtService = jwtService ?? throw new ArgumentNullException(nameof(jwtService));
		_mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
	}

	/// <inheritdoc />
	/// <exception cref="InvalidOperationException">
	/// Thrown if the provided email is already registered.
	/// </exception>
	public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
	{
		if (await _userRepository.EmailExistsAsync(request.Email))
			throw new InvalidOperationException("Email already exists");

		var user = _mapper.Map<User>(request);
		user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
		user.CreatedAt = DateTime.UtcNow;

		var userId = await _userRepository.CreateAsync(user);
		user.UserId = userId;

		var token = _jwtService.GenerateToken(user);

		return new AuthResponseDto
		{
			Token = token,
			ExpiresAt = DateTime.UtcNow.AddHours(24),
			User = _mapper.Map<UserDto>(user)
		};
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the credentials are invalid (email not found or password mismatch).
	/// </exception>
	public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
	{
		var user = await _userRepository.GetByEmailAsync(request.Email);

		if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
			throw new UnauthorizedAccessException("Invalid credentials");

		var token = _jwtService.GenerateToken(user);

		return new AuthResponseDto
		{
			Token = token,
			ExpiresAt = DateTime.UtcNow.AddHours(24),
			User = _mapper.Map<UserDto>(user)
		};
	}

	/// <inheritdoc />
	/// <exception cref="KeyNotFoundException">
	/// Thrown if the user with the specified ID does not exist.
	/// </exception>
	public async Task<UserDto> GetProfileAsync(int userId)
	{
		var user = await _userRepository.GetByIdAsync(userId);

		if (user == null)
			throw new KeyNotFoundException("User not found");

		return _mapper.Map<UserDto>(user);
	}
}
