// ============================================================================
// File: InvestmentPortfolio.Wcf/Services/PortfolioWcfService.cs
// Purpose: WCF service implementation for portfolio operations, forwarding calls
//          to the application service and wrapping results in ServiceResponse<T>.
// ============================================================================

using InvestmentPortfolio.Application.DTOs.Portfolios;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Contracts.Models;
using InvestmentPortfolio.Contracts.ServiceContracts;

namespace InvestmentPortfolio.Wcf.Services;

/// <summary>
/// WCF Service implementation for portfolio operations
/// </summary>
public class PortfolioWcfService : IPortfolioWcfService
{
	private readonly IPortfolioService _portfolioService;
	private readonly ILogger<PortfolioWcfService> _logger;

	/// <summary>
	/// WCF Service implementation for portfolio operations.
	/// Inherits documentation from <see cref="IPortfolioWcfService"/>.
	/// </summary>
	public PortfolioWcfService(
		IPortfolioService portfolioService,
		ILogger<PortfolioWcfService> logger)
	{
		_portfolioService = portfolioService ?? throw new ArgumentNullException(nameof(portfolioService));
		_logger = logger ?? throw new ArgumentNullException(nameof(logger));
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<List<PortfolioDto>>> GetUserPortfoliosAsync(int userId)
	{
		try
		{
			_logger.LogInformation("Fetching portfolios for user: {UserId}", userId);
			var portfolios = await _portfolioService.GetUserPortfoliosAsync(userId);
			return ServiceResponse<List<PortfolioDto>>.SuccessResponse(portfolios.ToList());
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error fetching portfolios for user: {UserId}", userId);
			return ServiceResponse<List<PortfolioDto>>.FailureResponse("An error occurred while fetching portfolios");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<PortfolioDto>> GetByIdAsync(int portfolioId, int userId)
	{
		try
		{
			_logger.LogInformation("Fetching portfolio {PortfolioId} for user {UserId}", portfolioId, userId);
			var portfolio = await _portfolioService.GetByIdAsync(portfolioId, userId);

			if (portfolio == null)
			{
				return ServiceResponse<PortfolioDto>.FailureResponse("Portfolio not found");
			}

			return ServiceResponse<PortfolioDto>.SuccessResponse(portfolio);
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to portfolio {PortfolioId} by user {UserId}", portfolioId, userId);
			return ServiceResponse<PortfolioDto>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error fetching portfolio {PortfolioId} for user {UserId}", portfolioId, userId);
			return ServiceResponse<PortfolioDto>.FailureResponse("An error occurred while fetching portfolio");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<PortfolioDto>> CreateAsync(CreatePortfolioDto dto, int userId)
	{
		try
		{
			_logger.LogInformation("Creating portfolio for user: {UserId}", userId);
			var portfolio = await _portfolioService.CreateAsync(dto, userId);
			_logger.LogInformation("Portfolio created successfully with ID: {PortfolioId}", portfolio.PortfolioId);
			return ServiceResponse<PortfolioDto>.SuccessResponse(portfolio, "Portfolio created successfully");
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error creating portfolio for user: {UserId}", userId);
			return ServiceResponse<PortfolioDto>.FailureResponse("An error occurred while creating portfolio");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<PortfolioDto>> UpdateAsync(int portfolioId, UpdatePortfolioDto dto, int userId)
	{
		try
		{
			_logger.LogInformation("Updating portfolio {PortfolioId} for user {UserId}", portfolioId, userId);
			var portfolio = await _portfolioService.UpdateAsync(portfolioId, dto, userId);

			if (portfolio == null)
			{
				return ServiceResponse<PortfolioDto>.FailureResponse("Portfolio not found");
			}

			_logger.LogInformation("Portfolio updated successfully: {PortfolioId}", portfolioId);
			return ServiceResponse<PortfolioDto>.SuccessResponse(portfolio, "Portfolio updated successfully");
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to portfolio {PortfolioId} by user {UserId}", portfolioId, userId);
			return ServiceResponse<PortfolioDto>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error updating portfolio {PortfolioId} for user {UserId}", portfolioId, userId);
			return ServiceResponse<PortfolioDto>.FailureResponse("An error occurred while updating portfolio");
		}
	}

	/// <inheritdoc />
	public async Task<ServiceResponse<bool>> DeleteAsync(int portfolioId, int userId)
	{
		try
		{
			_logger.LogInformation("Deleting portfolio {PortfolioId} for user {UserId}", portfolioId, userId);
			var success = await _portfolioService.DeleteAsync(portfolioId, userId);

			if (!success)
			{
				return ServiceResponse<bool>.FailureResponse("Portfolio not found or could not be deleted");
			}

			_logger.LogInformation("Portfolio deleted successfully: {PortfolioId}", portfolioId);
			return ServiceResponse<bool>.SuccessResponse(true, "Portfolio deleted successfully");
		}
		catch (UnauthorizedAccessException ex)
		{
			_logger.LogWarning(ex, "Unauthorized access to portfolio {PortfolioId} by user {UserId}", portfolioId, userId);
			return ServiceResponse<bool>.FailureResponse(ex.Message);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error deleting portfolio {PortfolioId} for user {UserId}", portfolioId, userId);
			return ServiceResponse<bool>.FailureResponse("An error occurred while deleting portfolio");
		}
	}
}