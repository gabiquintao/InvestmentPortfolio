using Microsoft.Extensions.Caching.Memory;

namespace InvestmentPortfolio.MarketData.Services;

/// <summary>
/// In-memory cache service implementation as fallback when Redis is unavailable
/// </summary>
public class MemoryCacheService : ICacheService
{
	private readonly IMemoryCache _cache;
	private readonly ILogger<MemoryCacheService> _logger;

	public MemoryCacheService(IMemoryCache cache, ILogger<MemoryCacheService> logger)
	{
		_cache = cache ?? throw new ArgumentNullException(nameof(cache));
		_logger = logger;
	}

	public Task<T?> GetAsync<T>(string key) where T : class
	{
		try
		{
			_cache.TryGetValue(key, out T? value);
			return Task.FromResult(value);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error getting value from memory cache for key: {Key}", key);
			return Task.FromResult<T?>(null);
		}
	}

	public Task SetAsync<T>(string key, T value, TimeSpan expiration) where T : class
	{
		try
		{
			_cache.Set(key, value, new MemoryCacheEntryOptions
			{
				AbsoluteExpirationRelativeToNow = expiration
			});
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error setting value in memory cache for key: {Key}", key);
		}

		return Task.CompletedTask;
	}

	public Task RemoveAsync(string key)
	{
		try
		{
			_cache.Remove(key);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error removing value from memory cache for key: {Key}", key);
		}

		return Task.CompletedTask;
	}
}