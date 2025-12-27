// ============================================================================
// Market Data Service
// Handles prices, search, trending assets, and price subscriptions
// ============================================================================
import marketApi from "./marketApi";
import type { MarketPrice, AssetSearchResult, TrendingAsset } from "../types";

const MARKET_ENDPOINTS = {
  PRICE: (symbol: string) => `/price/${symbol}`,
  SEARCH: (query: string) => `/search?query=${encodeURIComponent(query)}`,
  TRENDING: "/trending",
};

class MarketDataService {
  // Store active polling intervals
  private priceSubscriptions = new Map<string, NodeJS.Timeout>();
  private multiPriceSubscriptions = new Set<NodeJS.Timeout>();

  /**
   * Get current price for a single symbol
   */
  async getCurrentPrice(symbol: string): Promise<MarketPrice | null> {
    try {
      const response = await marketApi.get(MARKET_ENDPOINTS.PRICE(symbol));
      return response.data;
    } catch (error: any) {
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
  async getCurrentPrices(symbols: string[]): Promise<Map<string, MarketPrice>> {
    const pricesMap = new Map<string, MarketPrice>();

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
  async searchSymbols(query: string): Promise<AssetSearchResult[]> {
    try {
      const response = await marketApi.get(MARKET_ENDPOINTS.SEARCH(query));
      return response.data;
    } catch (error) {
      console.error(`Error searching symbols "${query}":`, error);
      return [];
    }
  }

  /**
   * Get trending assets
   */
  async getTrendingAssets(): Promise<TrendingAsset[]> {
    try {
      const response = await marketApi.get(MARKET_ENDPOINTS.TRENDING);
      return response.data;
    } catch (error) {
      console.error("Error fetching trending assets:", error);
      return [];
    }
  }

  /**
   * Subscribe to price updates for a single symbol
   * Polls the API at specified interval
   */
  subscribeToPriceUpdates(
    symbol: string,
    callback: (price: MarketPrice) => void,
    intervalMs: number = 30000
  ): () => void {
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
  subscribeToMultiplePrices(
    symbols: string[],
    callback: (prices: Map<string, MarketPrice>) => void,
    intervalMs: number = 30000
  ): () => void {
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
  clearAllSubscriptions(): void {
    // Clear single symbol subscriptions
    this.priceSubscriptions.forEach((interval) => clearInterval(interval));
    this.priceSubscriptions.clear();

    // Clear multiple symbol subscriptions
    this.multiPriceSubscriptions.forEach((interval) => clearInterval(interval));
    this.multiPriceSubscriptions.clear();
  }
}

export default new MarketDataService();