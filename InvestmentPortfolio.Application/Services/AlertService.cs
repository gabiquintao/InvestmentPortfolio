// ============================================================================
// File: InvestmentPortfolio.Application/Services/AlertService.cs
// Purpose: Provides business logic for managing user alerts, including creation,
//          retrieval, updating, and deletion of alerts.
// ============================================================================

using AutoMapper;
using InvestmentPortfolio.Application.DTOs.Alerts;
using InvestmentPortfolio.Application.Interfaces;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Interfaces;

namespace InvestmentPortfolio.Application.Services;

/// <inheritdoc />
/// <summary>
/// Service responsible for managing user alerts.
/// </summary>
public class AlertService : IAlertService
{
	private readonly IAlertRepository _alertRepository;
	private readonly IMapper _mapper;

	/// <summary>
	/// Initializes a new instance of the <see cref="AlertService"/> class.
	/// </summary>
	/// <param name="alertRepository">The alert repository.</param>
	/// <param name="mapper">The mapper for converting entities to DTOs.</param>
	/// <exception cref="ArgumentNullException">
	/// Thrown if <paramref name="alertRepository"/> or <paramref name="mapper"/> is null.
	/// </exception>
	public AlertService(IAlertRepository alertRepository, IMapper mapper)
	{
		_alertRepository = alertRepository ?? throw new ArgumentNullException(nameof(alertRepository));
		_mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
	}

	/// <inheritdoc />
	public async Task<IEnumerable<AlertDto>> GetUserAlertsAsync(int userId)
	{
		var alerts = await _alertRepository.GetByUserIdAsync(userId);
		return _mapper.Map<IEnumerable<AlertDto>>(alerts);
	}

	/// <inheritdoc />
	public async Task<IEnumerable<AlertDto>> GetActiveAlertsAsync(int userId)
	{
		var alerts = await _alertRepository.GetByUserIdAsync(userId);
		var activeAlerts = alerts.Where(a => a.IsActive);
		return _mapper.Map<IEnumerable<AlertDto>>(activeAlerts);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the alert does not belong to the specified user.
	/// </exception>
	public async Task<AlertDto?> GetByIdAsync(int alertId, int userId)
	{
		var alert = await _alertRepository.GetByIdAsync(alertId);

		if (alert == null)
			return null;

		if (alert.UserId != userId)
			throw new UnauthorizedAccessException("Alert does not belong to user");

		return _mapper.Map<AlertDto>(alert);
	}

	/// <inheritdoc />
	public async Task<AlertDto> CreateAsync(CreateAlertDto dto, int userId)
	{
		var alert = _mapper.Map<Alert>(dto);
		alert.UserId = userId;

		var alertId = await _alertRepository.CreateAsync(alert);
		alert.AlertId = alertId;

		return _mapper.Map<AlertDto>(alert);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the alert does not belong to the specified user.
	/// </exception>
	public async Task<AlertDto?> UpdateAsync(int alertId, UpdateAlertDto dto, int userId)
	{
		var alert = await _alertRepository.GetByIdAsync(alertId);

		if (alert == null)
			return null;

		if (alert.UserId != userId)
			throw new UnauthorizedAccessException("Alert does not belong to user");

		alert.TargetPrice = dto.TargetPrice;
		alert.IsActive = dto.IsActive;

		var success = await _alertRepository.UpdateAsync(alert);

		if (!success)
			return null;

		return _mapper.Map<AlertDto>(alert);
	}

	/// <inheritdoc />
	/// <exception cref="UnauthorizedAccessException">
	/// Thrown if the alert does not belong to the specified user.
	/// </exception>
	public async Task<bool> DeleteAsync(int alertId, int userId)
	{
		var alert = await _alertRepository.GetByIdAsync(alertId);

		if (alert == null)
			return false;

		if (alert.UserId != userId)
			throw new UnauthorizedAccessException("Alert does not belong to user");

		return await _alertRepository.DeleteAsync(alertId);
	}
}
