// ============================================================================
// File: InvestmentPortfolio.MarketData/Services/RedisCacheService.cs
// Purpose: Redis-based implementation of <see cref="ICacheService"/>.
// ============================================================================

using System.Text.Json;
using StackExchange.Redis;

namespace InvestmentPortfolio.MarketData.Services;

/// <summary>
/// Redis-based cache service implementation using StackExchange.Redis.
/// </summary>
public class RedisCacheService : ICacheService
{
	private readonly IConnectionMultiplexer _redis;
	private readonly IDatabase _database;

	/// <summary>
	/// Initializes a new instance of the <see cref="RedisCacheService"/> class.
	/// </summary>
	/// <param name="redis">Redis connection multiplexer.</param>
	/// <exception cref="ArgumentNullException">Thrown when <paramref name="redis"/> is null.</exception>
	public RedisCacheService(IConnectionMultiplexer redis)
	{
		_redis = redis ?? throw new ArgumentNullException(nameof(redis));
		_database = _redis.GetDatabase();
	}

	/// <inheritdoc />
	public async Task<T?> GetAsync<T>(string key) where T : class
	{
		var value = await _database.StringGetAsync(key);
		if (value.IsNullOrEmpty) return null;
		return JsonSerializer.Deserialize<T>(value.ToString());
	}

	/// <inheritdoc />
	public async Task SetAsync<T>(string key, T value, TimeSpan expiration) where T : class
	{
		var json = JsonSerializer.Serialize(value);
		await _database.StringSetAsync(key, json, expiration);
	}

	/// <inheritdoc />
	public async Task RemoveAsync(string key)
	{
		await _database.KeyDeleteAsync(key);
	}
}