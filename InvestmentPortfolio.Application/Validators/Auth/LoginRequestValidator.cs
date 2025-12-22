// ============================================================================
// File: InvestmentPortfolio.Application/Validators/Auth/LoginRequestValidator.cs
// Purpose: Validates the properties of a LoginRequestDto for user authentication,
//          ensuring email and password are provided and correctly formatted.
// ============================================================================

using FluentValidation;
using InvestmentPortfolio.Application.DTOs.Auth;

namespace InvestmentPortfolio.Application.Validators.Auth;

/// <summary>
/// Validator for user login requests.
/// Checks that email and password are provided and email has a valid format.
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