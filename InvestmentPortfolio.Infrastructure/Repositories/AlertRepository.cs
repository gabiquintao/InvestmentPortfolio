// ============================================================================
// File: InvestmentPortfolio.Infrastructure/Repositories/AlertRepository.cs
// ============================================================================

using System.Data;
using Microsoft.Data.SqlClient;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Enums;
using InvestmentPortfolio.Domain.Interfaces;
namespace InvestmentPortfolio.Infrastructure.Repositories;

/// <summary>
/// Repository for alerts operations
/// </summary>
public class AlertRepository : IAlertRepository
{
	private readonly IDbConnectionFactory _connectionFactory;

	public AlertRepository(IDbConnectionFactory connectionFactory)
	{
		_connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
	}

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
	/// Maps a DataReader to an Alert object
	/// </summary>
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