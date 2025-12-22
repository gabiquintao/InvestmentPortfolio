// =========================// ============================================================================
// File: InvestmentPortfolio.Application/Services/PortfolioService.cs
// Purpose: Manages user portfolios, including creating, retrieving, updating,
//          and deleting portfolios.
// ============================================================================

using AutoMapper;
using InvestmentPortfolio.Application.DTOs.Portfolios;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Interfaces;

namespace InvestmentPortfolio.Application.Services;

/// <inheritdoc />
/// <summary>
/// Service responsible for managing user portfolios.
/// </summary>
public class PortfolioService : IPortfolioService
{
	private readonly IPortfolioRepository _portfolioRepository;
	private readonly IMapper _mapper;

	/// <summary>
	/// Initializes a new instance of the <see cref="PortfolioService"/> class.
	/// </summary>
	/// <param name="portfolioRepository">The portfolio repository.</param>
	/// <param name="mapper">The mapper for converting entities to DTOs.</param>
	/// <exception cref="ArgumentNullException">
	/// Thrown if <paramref name="portfolioRepository"/> or <paramref name="mapper"/> is null.
	/// </exception>
	public PortfolioService(
		IPortfolioRepository portfolioRepository,
		IMapper mapper)
	{
		_portfolioRepository = portfolioRepository ?? throw new ArgumentNullException(nameof(portfolioRepository));
		_mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
	}

	/// <inheritdoc />
	public async Task<IEnumerable<PortfolioDto>> GetUserPortfoliosAsync(int userId)
	{
		var portfolios = await _portfolioRepository.GetByUserIdAsync(userId);
		return _mapper.Map<IEnumerable<PortfolioDto>>(portfolios);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the portfolio does not belong to the specified user.
	/// </exception>
	public async Task<PortfolioDto?> GetByIdAsync(int portfolioId, int userId)
	{
		if (!await _portfolioRepository.BelongsToUserAsync(portfolioId, userId))
			throw new UnauthorizedAccessException("Portfolio does not belong to user");

		var portfolio = await _portfolioRepository.GetByIdAsync(portfolioId);
		if (portfolio == null)
			return null;

		return _mapper.Map<PortfolioDto>(portfolio);
	}

	/// <inheritdoc />
	public async Task<PortfolioDto> CreateAsync(CreatePortfolioDto dto, int userId)
	{
		var portfolio = _mapper.Map<Portfolio>(dto);
		portfolio.UserId = userId;
		portfolio.CreatedAt = DateTime.UtcNow;

		var portfolioId = await _portfolioRepository.CreateAsync(portfolio);
		portfolio.PortfolioId = portfolioId;

		return _mapper.Map<PortfolioDto>(portfolio);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the portfolio does not belong to the specified user.
	/// </exception>
	public async Task<PortfolioDto?> UpdateAsync(int portfolioId, UpdatePortfolioDto dto, int userId)
	{
		if (!await _portfolioRepository.BelongsToUserAsync(portfolioId, userId))
			throw new UnauthorizedAccessException("Portfolio does not belong to user");

		var portfolio = await _portfolioRepository.GetByIdAsync(portfolioId);
		if (portfolio == null)
			return null;

		portfolio.Name = dto.Name;
		portfolio.Description = dto.Description;
		portfolio.Currency = dto.Currency;

		var success = await _portfolioRepository.UpdateAsync(portfolio);
		if (!success)
			return null;

		return _mapper.Map<PortfolioDto>(portfolio);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the portfolio does not belong to the specified user.
	/// </exception>
	public async Task<bool> DeleteAsync(int portfolioId, int userId)
	{
		if (!await _portfolioRepository.BelongsToUserAsync(portfolioId, userId))
			throw new UnauthorizedAccessException("Portfolio does not belong to user");

		return await _portfolioRepository.DeleteAsync(portfolioId);
	}
}
