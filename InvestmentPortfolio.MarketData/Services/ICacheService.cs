// ============================================================================
// File: InvestmentPortfolio.MarketData/Services/ICacheService.cs
// Purpose: Defines a generic cache abstraction for storing and retrieving data.
// ============================================================================

namespace InvestmentPortfolio.MarketData.Services;

/// <summary>
/// Defines a generic cache service abstraction.
/// </summary>
public interface ICacheService
{
	/// <summary>
	/// Retrieves a cached value by key.
	/// </summary>
	/// <typeparam name="T">
	/// The expected type of the cached value.
	/// </typeparam>
	/// <param name="key">
	/// The cache key.
	/// </param>
	/// <returns>
	/// The cached value, or <c>null</c> if the key does not exist.
	/// </returns>
	Task<T?> GetAsync<T>(string key) where T : class;

	/// <summary>
	/// Stores a value in cache with an expiration time.
	/// </summary>
	/// <typeparam name="T">
	/// The type of the value being cached.
	/// </typeparam>
	/// <param name="key">
	/// The cache key.
	/// </param>
	/// <param name="value">
	/// The value to cache.
	/// </param>
	/// <param name="expiration">
	/// The time-to-live for the cached value.
	/// </param>
	Task SetAsync<T>(string key, T value, TimeSpan expiration) where T : class;

	/// <summary>
	/// Removes a value from cache.
	/// </summary>
	/// <param name="key">
	/// The cache key.
	/// </param>
	Task RemoveAsync(string key);
}
