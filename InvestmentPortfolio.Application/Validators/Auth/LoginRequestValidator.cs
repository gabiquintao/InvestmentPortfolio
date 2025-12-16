// ============================================================================
// File: InvestmentPortfolio.Application/Validators/Auth/LoginRequestValidator.cs
// ============================================================================

using FluentValidation;
using InvestmentPortfolio.Application.DTOs.Auth;

namespace InvestmentPortfolio.Application.Validators.Auth;

/// <summary>
/// Login request validator
/// </summary>
public class LoginRequestValidator : AbstractValidator<LoginRequestDto>
{
	public LoginRequestValidator()
	{
		RuleFor(x => x.Email)
			.NotEmpty().WithMessage("Email is required")
			.EmailAddress().WithMessage("Email is invalid");

		RuleFor(x => x.Password)
			.NotEmpty().WithMessage("Password is required");
	}
}