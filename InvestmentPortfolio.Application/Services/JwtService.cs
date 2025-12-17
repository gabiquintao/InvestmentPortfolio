// ============================================================================
// File: InvestmentPortfolio.Application/Services/JwtService.cs
// ============================================================================

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Domain.Entities;

namespace InvestmentPortfolio.Application.Services;

/// <inheritdoc />
/// <summary>
/// Service responsible for generating and validating JWT tokens for users.
/// </summary>
public class JwtService : IJwtService
{
	private readonly IConfiguration _configuration;
	private readonly string _secretKey;
	private readonly string _issuer;
	private readonly string _audience;

	/// <summary>
	/// Initializes a new instance of the <see cref="JwtService"/> class.
	/// </summary>
	/// <param name="configuration">Application configuration containing JWT settings.</param>
	/// <exception cref="ArgumentNullException">Thrown if <paramref name="configuration"/> is null.</exception>
	/// <exception cref="InvalidOperationException">Thrown if JWT SecretKey is not configured.</exception>
	public JwtService(IConfiguration configuration)
	{
		_configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
		_secretKey = _configuration["Jwt:SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
		_issuer = _configuration["Jwt:Issuer"] ?? "InvestmentPortfolio";
		_audience = _configuration["Jwt:Audience"] ?? "InvestmentPortfolio";
	}

	/// <inheritdoc />
	public string GenerateToken(User user)
	{
		var tokenHandler = new JwtSecurityTokenHandler();
		var key = Encoding.ASCII.GetBytes(_secretKey);

		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Subject = new ClaimsIdentity(new[]
			{
				new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
				new Claim(ClaimTypes.Email, user.Email),
				new Claim(ClaimTypes.Name, user.FullName)
			}),
			Expires = DateTime.UtcNow.AddHours(24),
			Issuer = _issuer,
			Audience = _audience,
			SigningCredentials = new SigningCredentials(
				new SymmetricSecurityKey(key),
				SecurityAlgorithms.HmacSha256Signature)
		};

		var token = tokenHandler.CreateToken(tokenDescriptor);
		return tokenHandler.WriteToken(token);
	}

	/// <inheritdoc />
	/// <remarks>
	/// Returns null if the token is null, invalid, expired, or does not contain a valid user ID.
	/// </remarks>
	public int? ValidateToken(string token)
	{
		if (string.IsNullOrEmpty(token))
			return null;

		var tokenHandler = new JwtSecurityTokenHandler();
		var key = Encoding.ASCII.GetBytes(_secretKey);

		try
		{
			tokenHandler.ValidateToken(token, new TokenValidationParameters
			{
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = new SymmetricSecurityKey(key),
				ValidateIssuer = true,
				ValidIssuer = _issuer,
				ValidateAudience = true,
				ValidAudience = _audience,
				ValidateLifetime = true,
				ClockSkew = TimeSpan.Zero
			}, out SecurityToken validatedToken);

			var jwtToken = (JwtSecurityToken)validatedToken;
			var userIdClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);

			if (userIdClaim == null)
				return null;

			return int.Parse(userIdClaim.Value);
		}
		catch
		{
			return null;
		}
	}
}
