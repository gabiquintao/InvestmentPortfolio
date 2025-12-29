// ============================================================================
// File: InvestmentPortfolio.MarketData/Services/MemoryCacheService.cs
// Purpose: In-memory implementation of <see cref="ICacheService"/>.
//          Used as a fallback cache when distributed cache is unavailable.
// ============================================================================

using Microsoft.Extensions.Caching.Memory;

namespace InvestmentPortfolio.MarketData.Services
{
	/// <summary>
	/// In-memory cache service implementation using <see cref="IMemoryCache"/>.
	/// Intended as a fallback when a distributed cache (e.g., Redis) is unavailable.
	/// </summary>
	public class MemoryCacheService : ICacheService
	{
		private readonly IMemoryCache _cache;
		private readonly ILogger<MemoryCacheService> _logger;

		/// <summary>
		/// Initializes a new instance of the <see cref="MemoryCacheService"/> class.
		/// </summary>
		public MemoryCacheService(IMemoryCache cache, ILogger<MemoryCacheService> logger)
		{
			_cache = cache ?? throw new ArgumentNullException(nameof(cache));
			_logger = logger;
		}

		/// <inheritdoc />
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

		/// <inheritdoc />
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

		/// <inheritdoc />
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
}
