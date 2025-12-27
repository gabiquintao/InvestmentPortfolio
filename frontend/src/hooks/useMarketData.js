// ============================================================================
// useMarketData Hook
// Custom hook for market data operations (prices, search, trending)
// ============================================================================
import { useState, useEffect, useCallback, useRef } from "react";
import marketDataService from "../services/market.service";
import { getErrorMessage } from "../services/api";
/**
 * Custom hook for market data
 * Handles price fetching, search, trending assets, and live updates
 */
export const useMarketData = () => {
    const [prices, setPrices] = useState(new Map());
    const [searchResults, setSearchResults] = useState([]);
    const [trendingAssets, setTrendingAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const unsubscribeRef = useRef(null);
    /**
     * Get current price for a single symbol
     */
    const getPrice = useCallback(async (symbol) => {
        setIsLoading(true);
        setError(null);
        try {
            const price = await marketDataService.getCurrentPrice(symbol);
            if (price) {
                setPrices((prev) => new Map(prev).set(symbol, price));
            }
            return price;
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    /**
     * Get current prices for multiple symbols
     */
    const getPrices = useCallback(async (symbols) => {
        setIsLoading(true);
        setError(null);
        try {
            const pricesMap = await marketDataService.getCurrentPrices(symbols);
            setPrices(pricesMap);
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    /**
     * Search for asset symbols
     */
    const searchSymbols = useCallback(async (query) => {
        if (!query || query.trim() === "") {
            setSearchResults([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const results = await marketDataService.searchSymbols(query);
            setSearchResults(results);
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            setSearchResults([]);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    /**
     * Get trending assets
     */
    const getTrending = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const trending = await marketDataService.getTrendingAssets();
            setTrendingAssets(trending);
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            setTrendingAssets([]);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    /**
     * Subscribe to price updates for multiple symbols
     * Polls the API at specified interval
     */
    const subscribeToPrices = useCallback((symbols, intervalMs = 30000) => {
        // Unsubscribe from previous subscription if exists
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }
        // Initial fetch
        getPrices(symbols);
        // Subscribe to updates
        const unsubscribe = marketDataService.subscribeToMultiplePrices(symbols, (updatedPrices) => {
            setPrices(updatedPrices);
        }, intervalMs);
        unsubscribeRef.current = unsubscribe;
    }, [getPrices]);
    /**
     * Unsubscribe from price updates
     */
    const unsubscribeFromPrices = useCallback(() => {
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
export const useSymbolPrice = (symbol, autoFetch = true, pollInterval) => {
    const [price, setPrice] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const unsubscribeRef = useRef(null);
    const fetchPrice = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await marketDataService.getCurrentPrice(symbol);
            setPrice(data);
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            setPrice(null);
        }
        finally {
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
            const unsubscribe = marketDataService.subscribeToPriceUpdates(symbol, (updatedPrice) => {
                setPrice(updatedPrice);
            }, pollInterval);
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
