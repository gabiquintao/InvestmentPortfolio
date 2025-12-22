// ============================================================================
// File: InvestmentPortfolio.Infrastructure/Repositories/AlertRepository.cs
// Purpose: Repository implementation for managing alerts in the database.
// ============================================================================

using System.Data;
using Microsoft.Data.SqlClient;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Enums;
using InvestmentPortfolio.Domain.Interfaces;
using InvestmentPortfolio.Infrastructure.Data;

namespace InvestmentPortfolio.Infrastructure.Repositories;

/// <summary>
/// Repository for alerts operations.
/// </summary>
public class AlertRepository : IAlertRepository
{
	private readonly IDbConnectionFactory _connectionFactory;

	/// <summary>
	/// Initializes a new instance of the <see cref="AlertRepository"/> class.
	/// </summary>
	/// <param name="connectionFactory">The database connection factory.</param>
	public AlertRepository(IDbConnectionFactory connectionFactory)
	{
		_connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
	}

	/// <summary>
	/// Gets an alert by its unique identifier.
	/// </summary>
	/// <param name="alertId">The alert ID.</param>
	/// <returns>The alert if found; otherwise, null.</returns>
	public async Task<Alert?> GetByIdAsync(int alertId)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT AlertId, UserId, AssetSymbol, Condition, TargetPrice, 
                   IsActive, CreatedAt, TriggeredAt
            FROM Alerts
            WHERE AlertId = @AlertId";

		command.Parameters.Add(new SqlParameter("@AlertId", alertId));

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		if (await reader.ReadAsync())
		{
			return MapAlert(reader);
		}

		return null;
	}

	/// <summary>
	/// Gets all alerts for a specific user.
	/// </summary>
	/// <param name="userId">The user ID.</param>
	/// <returns>A collection of alerts for the user.</returns>
	public async Task<IEnumerable<Alert>> GetByUserIdAsync(int userId)
	{
		var alerts = new List<Alert>();

		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT AlertId, UserId, AssetSymbol, Condition, TargetPrice, 
                   IsActive, CreatedAt, TriggeredAt
            FROM Alerts
            WHERE UserId = @UserId
            ORDER BY CreatedAt DESC";

		command.Parameters.Add(new SqlParameter("@UserId", userId));

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		while (await reader.ReadAsync())
		{
			alerts.Add(MapAlert(reader));
		}

		return alerts;
	}

	/// <summary>
	/// Gets all active alerts.
	/// </summary>
	/// <returns>A collection of active alerts.</returns>
	public async Task<IEnumerable<Alert>> GetActiveAlertsAsync()
	{
		var alerts = new List<Alert>();

		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT AlertId, UserId, AssetSymbol, Condition, TargetPrice, 
                   IsActive, CreatedAt, TriggeredAt
            FROM Alerts
            WHERE IsActive = 1
            ORDER BY CreatedAt DESC";

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		while (await reader.ReadAsync())
		{
			alerts.Add(MapAlert(reader));
		}

		return alerts;
	}

	/// <summary>
	/// Gets all active alerts for a specific asset symbol.
	/// </summary>
	/// <param name="symbol">The asset symbol.</param>
	/// <returns>A collection of active alerts for the symbol.</returns>
	public async Task<IEnumerable<Alert>> GetActiveAlertsBySymbolAsync(string symbol)
	{
		var alerts = new List<Alert>();

		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT AlertId, UserId, AssetSymbol, Condition, TargetPrice, 
                   IsActive, CreatedAt, TriggeredAt
            FROM Alerts
            WHERE IsActive = 1 AND AssetSymbol = @Symbol
            ORDER BY CreatedAt DESC";

		command.Parameters.Add(new SqlParameter("@Symbol", symbol));

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		while (await reader.ReadAsync())
		{
			alerts.Add(MapAlert(reader));
		}

		return alerts;
	}

	/// <summary>
	/// Creates a new alert in the database.
	/// </summary>
	/// <param name="alert">The alert to create.</param>
	/// <returns>The ID of the created alert.</returns>
	public async Task<int> CreateAsync(Alert alert)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            INSERT INTO Alerts (UserId, AssetSymbol, Condition, TargetPrice, 
                               IsActive, CreatedAt)
            OUTPUT INSERTED.AlertId
            VALUES (@UserId, @AssetSymbol, @Condition, @TargetPrice, 
                    @IsActive, @CreatedAt)";

		command.Parameters.Add(new SqlParameter("@UserId", alert.UserId));
		command.Parameters.Add(new SqlParameter("@AssetSymbol", alert.AssetSymbol));
		command.Parameters.Add(new SqlParameter("@Condition", (int)alert.Condition));
		command.Parameters.Add(new SqlParameter("@TargetPrice", alert.TargetPrice));
		command.Parameters.Add(new SqlParameter("@IsActive", alert.IsActive));
		command.Parameters.Add(new SqlParameter("@CreatedAt", alert.CreatedAt));

		await connection.OpenAsync();

		var alertId = await command.ExecuteScalarAsync();
		return Convert.ToInt32(alertId);
	}

	/// <summary>
	/// Updates an existing alert.
	/// </summary>
	/// <param name="alert">The alert to update.</param>
	/// <returns>True if update succeeded; otherwise, false.</returns>
	public async Task<bool> UpdateAsync(Alert alert)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            UPDATE Alerts
            SET TargetPrice = @TargetPrice,
                IsActive = @IsActive
            WHERE AlertId = @AlertId";

		command.Parameters.Add(new SqlParameter("@AlertId", alert.AlertId));
		command.Parameters.Add(new SqlParameter("@TargetPrice", alert.TargetPrice));
		command.Parameters.Add(new SqlParameter("@IsActive", alert.IsActive));

		await connection.OpenAsync();

		var rowsAffected = await command.ExecuteNonQueryAsync();
		return rowsAffected > 0;
	}

	/// <summary>
	/// Deletes an alert by its ID.
	/// </summary>
	/// <param name="alertId">The alert ID.</param>
	/// <returns>True if deletion succeeded; otherwise, false.</returns>
	public async Task<bool> DeleteAsync(int alertId)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            DELETE FROM Alerts
            WHERE AlertId = @AlertId";

		command.Parameters.Add(new SqlParameter("@AlertId", alertId));

		await connection.OpenAsync();

		var rowsAffected = await command.ExecuteNonQueryAsync();
		return rowsAffected > 0;
	}

	/// <summary>
	/// Marks an alert as triggered, setting IsActive to false and TriggeredAt to now.
	/// </summary>
	/// <param name="alertId">The alert ID.</param>
	/// <returns>True if update succeeded; otherwise, false.</returns>
	public async Task<bool> MarkAsTriggeredAsync(int alertId)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            UPDATE Alerts
            SET IsActive = 0,
                TriggeredAt = @TriggeredAt
            WHERE AlertId = @AlertId";

		command.Parameters.Add(new SqlParameter("@AlertId", alertId));
		command.Parameters.Add(new SqlParameter("@TriggeredAt", DateTime.UtcNow));

		await connection.OpenAsync();

		var rowsAffected = await command.ExecuteNonQueryAsync();
		return rowsAffected > 0;
	}

	/// <summary>
	/// Maps a data reader row to an <see cref="Alert"/> object.
	/// </summary>
	/// <param name="reader">The data reader.</param>
	/// <returns>The mapped <see cref="Alert"/>.</returns>
	private static Alert MapAlert(IDataReader reader)
	{
		return new Alert
		{
			AlertId = reader.GetInt32(reader.GetOrdinal("AlertId")),
			UserId = reader.GetInt32(reader.GetOrdinal("UserId")),
			AssetSymbol = reader.GetString(reader.GetOrdinal("AssetSymbol")),
			Condition = (AlertCondition)reader.GetInt32(reader.GetOrdinal("Condition")),
			TargetPrice = reader.GetDecimal(reader.GetOrdinal("TargetPrice")),
			IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
			CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
			TriggeredAt = reader.IsDBNull(reader.GetOrdinal("TriggeredAt"))
				? null
				: reader.GetDateTime(reader.GetOrdinal("TriggeredAt"))
		};
	}
}
