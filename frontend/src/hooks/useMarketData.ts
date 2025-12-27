// ============================================================================
// useMarketData Hook
// Custom hook for market data operations (prices, search, trending)
// ============================================================================

import { useState, useEffect, useCallback, useRef } from "react";
import marketDataService from "../services/market.service";
import type { MarketPrice, AssetSearchResult, TrendingAsset } from "../types";
import { getErrorMessage } from "../services/api";

interface UseMarketDataReturn {
  prices: Map<string, MarketPrice>;
  searchResults: AssetSearchResult[];
  trendingAssets: TrendingAsset[];
  isLoading: boolean;
  error: string | null;
  getPrice: (symbol: string) => Promise<MarketPrice | null>;
  getPrices: (symbols: string[]) => Promise<void>;
  searchSymbols: (query: string) => Promise<void>;
  getTrending: () => Promise<void>;
  subscribeToPrices: (symbols: string[], intervalMs?: number) => void;
  unsubscribeFromPrices: () => void;
  clearError: () => void;
}

/**
 * Custom hook for market data
 * Handles price fetching, search, trending assets, and live updates
 */
export const useMarketData = (): UseMarketDataReturn => {
  const [prices, setPrices] = useState<Map<string, MarketPrice>>(new Map());
  const [searchResults, setSearchResults] = useState<AssetSearchResult[]>([]);
  const [trendingAssets, setTrendingAssets] = useState<TrendingAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  /**
   * Get current price for a single symbol
   */
  const getPrice = useCallback(
    async (symbol: string): Promise<MarketPrice | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const price = await marketDataService.getCurrentPrice(symbol);
        if (price) {
          setPrices((prev) => new Map(prev).set(symbol, price));
        }
        return price;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Get current prices for multiple symbols
   */
  const getPrices = useCallback(async (symbols: string[]): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const pricesMap = await marketDataService.getCurrentPrices(symbols);
      setPrices(pricesMap);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Search for asset symbols
   */
  const searchSymbols = useCallback(async (query: string): Promise<void> => {
    if (!query || query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await marketDataService.searchSymbols(query);
      setSearchResults(results);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get trending assets
   */
  const getTrending = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const trending = await marketDataService.getTrendingAssets();
      setTrendingAssets(trending);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setTrendingAssets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Subscribe to price updates for multiple symbols
   * Polls the API at specified interval
   */
  const subscribeToPrices = useCallback(
    (symbols: string[], intervalMs: number = 30000): void => {
      // Unsubscribe from previous subscription if exists
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      // Initial fetch
      getPrices(symbols);

      // Subscribe to updates
      const unsubscribe = marketDataService.subscribeToMultiplePrices(
        symbols,
        (updatedPrices) => {
          setPrices(updatedPrices);
        },
        intervalMs
      );

      unsubscribeRef.current = unsubscribe;
    },
    [getPrices]
  );

  /**
   * Unsubscribe from price updates
   */
  const unsubscribeFromPrices = useCallback((): void => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    prices,
    searchResults,
    trendingAssets,
    isLoading,
    error,
    getPrice,
    getPrices,
    searchSymbols,
    getTrending,
    subscribeToPrices,
    unsubscribeFromPrices,
    clearError,
  };
};

/**
 * Hook for single symbol price tracking
 */
export const useSymbolPrice = (
  symbol: string,
  autoFetch: boolean = true,
  pollInterval?: number
) => {
  const [price, setPrice] = useState<MarketPrice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  const fetchPrice = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await marketDataService.getCurrentPrice(symbol);
      setPrice(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setPrice(null);
    } finally {
      setIsLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    if (autoFetch && symbol) {
      fetchPrice();
    }
  }, [autoFetch, symbol, fetchPrice]);

  useEffect(() => {
    if (pollInterval && symbol) {
      // Subscribe to price updates
      const unsubscribe = marketDataService.subscribeToPriceUpdates(
        symbol,
        (updatedPrice) => {
          setPrice(updatedPrice);
        },
        pollInterval
      );

      unsubscribeRef.current = unsubscribe;

      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }
      };
    }
  }, [symbol, pollInterval]);

  return {
    price,
    isLoading,
    error,
    refreshPrice: fetchPrice,
  };
};
