// ============================================================================
// File: InvestmentPortfolio.Application/Validators/Auth/RegisterRequestValidator.cs
// ============================================================================

using FluentValidation;
using InvestmentPortfolio.Application.DTOs.Auth;

namespace InvestmentPortfolio.Application.Validators.Auth;

/// <summary>
/// Register request validator
/// </summary>
public class RegisterRequestValidator : AbstractValidator<RegisterRequestDto>
{
	public RegisterRequestValidator()
	{
		RuleFor(x => x.Email)
			.NotEmpty().WithMessage("Email is required")
			.EmailAddress().WithMessage("Invalid email address")
			.MaximumLength(255).WithMessage("Email cannot exceed 255 characters");

		RuleFor(x => x.Password)
			.NotEmpty().WithMessage("Password is required")
			.MinimumLength(8).WithMessage("Password must be at least 8 characters")
			.Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter")
			.Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter")
			.Matches(@"[0-9]").WithMessage("Password must contain at least one number");

		RuleFor(x => x.FullName)
			.NotEmpty().WithMessage("Full name is required")
			.MinimumLength(3).WithMessage("Name must be at least 3 characters")
			.MaximumLength(255).WithMessage("Full name cannot exceed 255 characters");
	}
}