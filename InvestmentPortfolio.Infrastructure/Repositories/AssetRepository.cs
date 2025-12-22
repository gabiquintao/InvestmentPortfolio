// ============================================================================
// File: InvestmentPortfolio.Infrastructure/Repositories/AssetRepository.cs
// Purpose: Repository implementation for managing assets in the database.
// ============================================================================

using System.Data;
using Microsoft.Data.SqlClient;
using InvestmentPortfolio.Domain.Entities;
using InvestmentPortfolio.Domain.Enums;
using InvestmentPortfolio.Domain.Interfaces;
using InvestmentPortfolio.Infrastructure.Data;

namespace InvestmentPortfolio.Infrastructure.Repositories;

/// <summary>
/// Repository for assets operations.
/// </summary>
public class AssetRepository : IAssetRepository
{
	private readonly IDbConnectionFactory _connectionFactory;

	/// <summary>
	/// Initializes a new instance of the <see cref="AssetRepository"/> class.
	/// </summary>
	/// <param name="connectionFactory">The database connection factory.</param>
	public AssetRepository(IDbConnectionFactory connectionFactory)
	{
		_connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
	}

	/// <summary>
	/// Gets an asset by its unique identifier.
	/// </summary>
	/// <param name="assetId">The asset ID.</param>
	/// <returns>The asset if found; otherwise, null.</returns>
	public async Task<Asset?> GetByIdAsync(int assetId)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT AssetId, PortfolioId, Symbol, AssetType, Quantity, 
                   AvgPurchasePrice, PurchaseDate
            FROM Assets
            WHERE AssetId = @AssetId";

		command.Parameters.Add(new SqlParameter("@AssetId", assetId));

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		if (await reader.ReadAsync())
		{
			return MapAsset(reader);
		}

		return null;
	}

	/// <summary>
	/// Gets all assets in a specific portfolio.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <returns>A collection of assets.</returns>
	public async Task<IEnumerable<Asset>> GetByPortfolioIdAsync(int portfolioId)
	{
		var assets = new List<Asset>();

		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT AssetId, PortfolioId, Symbol, AssetType, Quantity, 
                   AvgPurchasePrice, PurchaseDate
            FROM Assets
            WHERE PortfolioId = @PortfolioId
            ORDER BY PurchaseDate DESC";

		command.Parameters.Add(new SqlParameter("@PortfolioId", portfolioId));

		await connection.OpenAsync();

		using var reader = await command.ExecuteReaderAsync();

		while (await reader.ReadAsync())
		{
			assets.Add(MapAsset(reader));
		}

		return assets;
	}

	/// <summary>
	/// Creates a new asset in the database.
	/// </summary>
	/// <param name="asset">The asset to create.</param>
	/// <returns>The ID of the created asset.</returns>
	public async Task<int> CreateAsync(Asset asset)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            INSERT INTO Assets (PortfolioId, Symbol, AssetType, Quantity, 
                               AvgPurchasePrice, PurchaseDate)
            OUTPUT INSERTED.AssetId
            VALUES (@PortfolioId, @Symbol, @AssetType, @Quantity, 
                    @AvgPurchasePrice, @PurchaseDate)";

		command.Parameters.Add(new SqlParameter("@PortfolioId", asset.PortfolioId));
		command.Parameters.Add(new SqlParameter("@Symbol", asset.Symbol));
		command.Parameters.Add(new SqlParameter("@AssetType", (int)asset.AssetType));
		command.Parameters.Add(new SqlParameter("@Quantity", asset.Quantity));
		command.Parameters.Add(new SqlParameter("@AvgPurchasePrice", asset.AvgPurchasePrice));
		command.Parameters.Add(new SqlParameter("@PurchaseDate", asset.PurchaseDate));

		await connection.OpenAsync();

		var assetId = await command.ExecuteScalarAsync();
		return Convert.ToInt32(assetId);
	}

	/// <summary>
	/// Updates an existing asset.
	/// </summary>
	/// <param name="asset">The asset to update.</param>
	/// <returns>True if update succeeded; otherwise, false.</returns>
	public async Task<bool> UpdateAsync(Asset asset)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            UPDATE Assets
            SET Quantity = @Quantity,
                AvgPurchasePrice = @AvgPurchasePrice
            WHERE AssetId = @AssetId";

		command.Parameters.Add(new SqlParameter("@AssetId", asset.AssetId));
		command.Parameters.Add(new SqlParameter("@Quantity", asset.Quantity));
		command.Parameters.Add(new SqlParameter("@AvgPurchasePrice", asset.AvgPurchasePrice));

		await connection.OpenAsync();

		var rowsAffected = await command.ExecuteNonQueryAsync();
		return rowsAffected > 0;
	}

	/// <summary>
	/// Deletes an asset by its ID.
	/// </summary>
	/// <param name="assetId">The asset ID.</param>
	/// <returns>True if deletion succeeded; otherwise, false.</returns>
	public async Task<bool> DeleteAsync(int assetId)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            DELETE FROM Assets
            WHERE AssetId = @AssetId";

		command.Parameters.Add(new SqlParameter("@AssetId", assetId));

		await connection.OpenAsync();

		var rowsAffected = await command.ExecuteNonQueryAsync();
		return rowsAffected > 0;
	}

	/// <summary>
	/// Checks if an asset exists in a portfolio.
	/// </summary>
	/// <param name="portfolioId">The portfolio ID.</param>
	/// <param name="symbol">The asset symbol.</param>
	/// <returns>True if the asset exists; otherwise, false.</returns>
	public async Task<bool> ExistsInPortfolioAsync(int portfolioId, string symbol)
	{
		using var connection = _connectionFactory.CreateConnection();
		using var command = connection.CreateCommand();

		command.CommandText = @"
            SELECT COUNT(1)
            FROM Assets
            WHERE PortfolioId = @PortfolioId AND Symbol = @Symbol";

		command.Parameters.Add(new SqlParameter("@PortfolioId", portfolioId));
		command.Parameters.Add(new SqlParameter("@Symbol", symbol));

		await connection.OpenAsync();

		var count = (int?)await command.ExecuteScalarAsync();
		return count > 0;
	}

	/// <summary>
	/// Maps a data reader row to an <see cref="Asset"/> object.
	/// </summary>
	/// <param name="reader">The data reader.</param>
	/// <returns>The mapped <see cref="Asset"/>.</returns>
	private static Asset MapAsset(IDataReader reader)
	{
		return new Asset
		{
			AssetId = reader.GetInt32(reader.GetOrdinal("AssetId")),
			PortfolioId = reader.GetInt32(reader.GetOrdinal("PortfolioId")),
			Symbol = reader.GetString(reader.GetOrdinal("Symbol")),
			AssetType = (AssetType)reader.GetInt32(reader.GetOrdinal("AssetType")),
			Quantity = reader.GetDecimal(reader.GetOrdinal("Quantity")),
			AvgPurchasePrice = reader.GetDecimal(reader.GetOrdinal("AvgPurchasePrice")),
			PurchaseDate = reader.GetDateTime(reader.GetOrdinal("PurchaseDate"))
		};
	}
}
