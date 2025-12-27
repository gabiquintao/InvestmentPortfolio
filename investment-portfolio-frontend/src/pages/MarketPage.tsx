// ============================================================================
// MarketPage
// Page for viewing market data and trending assets
// ============================================================================

import { useState, useEffect } from "react";
import { useMarketData } from "../hooks/useMarketData";
import { Layout } from "../components/layout/Layout";
import { PageLoader } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import AssetSearchBar from "../components/features/assets/AssetSearchBar";
import { TrendingUp, TrendingDown, Search, Activity } from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";

// ============================================================================
// MARKET PAGE COMPONENT
// ============================================================================

export const MarketPage = () => {
  const {
    prices,
    searchResults,
    trendingAssets,
    isLoading,
    error,
    getPrice,
    getTrending,
    clearError,
  } = useMarketData();

  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [searchError, setSearchError] = useState<string | null>(null);

  // Fetch trending on mount
  useEffect(() => {
    if (trendingAssets.length === 0) {
      getTrending();
    }
  }, [getTrending, trendingAssets.length]);

  // Handle symbol selection
  const handleSymbolSelect = async (symbol: string) => {
    setSelectedSymbol(symbol);
    setSearchError(null);

    const priceData = await getPrice(symbol);
    if (!priceData) {
      setSearchError(`Could not fetch price data for ${symbol}`);
    }
  };

  const selectedPrice = selectedSymbol ? prices.get(selectedSymbol) : null;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Data</h1>
          <p className="text-gray-600 mt-1">
            Search for assets and view trending market data
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Search Assets
            </h2>
          </div>

          <AssetSearchBar
            onSelect={handleSymbolSelect}
            placeholder="Search for stocks, cryptocurrencies..."
          />

          {searchError && (
            <div className="mt-4">
              <ErrorMessage
                message={searchError}
                onClose={() => setSearchError(null)}
              />
            </div>
          )}

          {/* Selected Asset Price */}
          {selectedPrice && (
            <div className="mt-6 p-6 bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedSymbol}
                  </h3>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {formatCurrency(selectedPrice.currentPrice, "USD")}
                  </p>
                  <div className="flex items-center gap-2">
                    {selectedPrice.changePercent24h >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                    <p
                      className={`text-lg font-semibold ${
                        selectedPrice.changePercent24h >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatPercentage(selectedPrice.changePercent24h)} (24h)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">24h Volume</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(selectedPrice.volume24h, "USD")}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Source: {selectedPrice.source}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trending Assets */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Trending Assets
            </h2>
          </div>

          {isLoading && trendingAssets.length === 0 ? (
            <PageLoader text="Loading trending assets..." />
          ) : error ? (
            <ErrorMessage message={error} onClose={clearError} />
          ) : trendingAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingAssets.map((asset, index) => (
                <button
                  key={`${asset.symbol}-${index}`}
                  onClick={() => handleSymbolSelect(asset.symbol)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {asset.symbol}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {asset.name}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-lg font-bold text-gray-900">
                      ${asset.currentPrice.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1">
                      {asset.changePercent24h >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          asset.changePercent24h >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatPercentage(asset.changePercent24h)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No trending assets available
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MarketPage;
