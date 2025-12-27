// ============================================================================
// Market Data Service
// Handles prices, search, trending assets, and price subscriptions
// ============================================================================
import marketApi from "./marketApi";
const MARKET_ENDPOINTS = {
    PRICE: (symbol) => `/price/${symbol}`,
    SEARCH: (query) => `/search?query=${encodeURIComponent(query)}`,
    TRENDING: "/trending",
};
class MarketDataService {
    // Store active polling intervals
    priceSubscriptions = new Map();
    multiPriceSubscriptions = new Set();
    /**
     * Get current price for a single symbol
     */
    async getCurrentPrice(symbol) {
        try {
            const response = await marketApi.get(MARKET_ENDPOINTS.PRICE(symbol));
            return response.data;
        }
        catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error(`Error fetching price for ${symbol}:`, error);
            return null;
        }
    }
    /**
     * Get current prices for multiple symbols
     */
    async getCurrentPrices(symbols) {
        const pricesMap = new Map();
        // Fetch all prices in parallel
        const promises = symbols.map(async (symbol) => {
            const price = await this.getCurrentPrice(symbol);
            if (price) {
                pricesMap.set(symbol, price);
            }
        });
        await Promise.all(promises);
        return pricesMap;
    }
    /**
     * Search for asset symbols
     */
    async searchSymbols(query) {
        try {
            const response = await marketApi.get(MARKET_ENDPOINTS.SEARCH(query));
            return response.data;
        }
        catch (error) {
            console.error(`Error searching symbols "${query}":`, error);
            return [];
        }
    }
    /**
     * Get trending assets
     */
    async getTrendingAssets() {
        try {
            const response = await marketApi.get(MARKET_ENDPOINTS.TRENDING);
            return response.data;
        }
        catch (error) {
            console.error("Error fetching trending assets:", error);
            return [];
        }
    }
    /**
     * Subscribe to price updates for a single symbol
     * Polls the API at specified interval
     */
    subscribeToPriceUpdates(symbol, callback, intervalMs = 30000) {
        // Clear existing subscription for this symbol
        const existingInterval = this.priceSubscriptions.get(symbol);
        if (existingInterval) {
            clearInterval(existingInterval);
        }
        // Initial fetch
        this.getCurrentPrice(symbol).then((price) => {
            if (price) {
                callback(price);
            }
        });
        // Set up polling
        const interval = setInterval(async () => {
            const price = await this.getCurrentPrice(symbol);
            if (price) {
                callback(price);
            }
        }, intervalMs);
        this.priceSubscriptions.set(symbol, interval);
        // Return unsubscribe function
        return () => {
            clearInterval(interval);
            this.priceSubscriptions.delete(symbol);
        };
    }
    /**
     * Subscribe to price updates for multiple symbols
     * Polls the API at specified interval
     */
    subscribeToMultiplePrices(symbols, callback, intervalMs = 30000) {
        // Initial fetch
        this.getCurrentPrices(symbols).then((prices) => {
            callback(prices);
        });
        // Set up polling
        const interval = setInterval(async () => {
            const prices = await this.getCurrentPrices(symbols);
            callback(prices);
        }, intervalMs);
        this.multiPriceSubscriptions.add(interval);
        // Return unsubscribe function
        return () => {
            clearInterval(interval);
            this.multiPriceSubscriptions.delete(interval);
        };
    }
    /**
     * Clear all subscriptions (cleanup)
     */
    clearAllSubscriptions() {
        // Clear single symbol subscriptions
        this.priceSubscriptions.forEach((interval) => clearInterval(interval));
        this.priceSubscriptions.clear();
        // Clear multiple symbol subscriptions
        this.multiPriceSubscriptions.forEach((interval) => clearInterval(interval));
        this.multiPriceSubscriptions.clear();
    }
}
export default new MarketDataService();
