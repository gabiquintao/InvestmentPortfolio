// ============================================================================
// Asset Service
// Handles asset CRUD operations within portfolios
// ============================================================================

import api from "./api";
import {
  type Asset,
  type CreateAssetDto,
  type UpdateAssetDto,
  AssetType,
} from "../types";

// Updated endpoints to match backend routes
const ASSET_ENDPOINTS = {
  // GET /api/asset/portfolio/{portfolioId}
  PORTFOLIO_ASSETS: (portfolioId: number) => `/asset/portfolio/${portfolioId}`,
  
  // GET /api/asset/{assetId}
  BY_ID: (assetId: number) => `/asset/${assetId}`,
  
  // POST /api/asset/portfolio/{portfolioId}
  CREATE: (portfolioId: number) => `/asset/portfolio/${portfolioId}`,
  
  // PUT /api/asset/{assetId}
  UPDATE: (assetId: number) => `/asset/${assetId}`,
  
  // DELETE /api/asset/{assetId}
  DELETE: (assetId: number) => `/asset/${assetId}`,
  
  // GET /api/asset/portfolio/{portfolioId}/allocation
  ALLOCATION: (portfolioId: number) => `/asset/portfolio/${portfolioId}/allocation`,
  
  // GET /api/asset/price/{symbol}
  PRICE: (symbol: string) => `/asset/price/${symbol}`,
  
  // GET /api/asset/search?query={query}
  SEARCH: `/asset/search`,
};

// ============================================================================
// ASSET SERVICE
// ============================================================================

class AssetService {
  /**
   * Get all assets for a specific portfolio
   */
  async getPortfolioAssets(portfolioId: number): Promise<Asset[]> {
    const response = await api.get<Asset[]>(
      ASSET_ENDPOINTS.PORTFOLIO_ASSETS(portfolioId)
    );
    return response.data;
  }

  /**
   * Get a specific asset by ID
   */
  async getById(portfolioId: number, assetId: number): Promise<Asset>;
  async getById(assetId: number): Promise<Asset>;
  async getById(portfolioIdOrAssetId: number, assetId?: number): Promise<Asset> {
    // Support both signatures for backwards compatibility
    const id = assetId !== undefined ? assetId : portfolioIdOrAssetId;
    const response = await api.get<Asset>(ASSET_ENDPOINTS.BY_ID(id));
    return response.data;
  }

  /**
   * Create a new asset in a portfolio
   */
  async create(portfolioId: number, data: CreateAssetDto): Promise<Asset> {
    const response = await api.post<Asset>(
      ASSET_ENDPOINTS.CREATE(portfolioId),
      data
    );
    return response.data;
  }

  /**
   * Update an existing asset
   */
  async update(
    portfolioId: number,
    assetId: number,
    data: UpdateAssetDto
  ): Promise<Asset>;
  async update(assetId: number, data: UpdateAssetDto): Promise<Asset>;
  async update(
    portfolioIdOrAssetId: number,
    assetIdOrData: number | UpdateAssetDto,
    data?: UpdateAssetDto
  ): Promise<Asset> {
    // Support both signatures for backwards compatibility
    let id: number;
    let updateData: UpdateAssetDto;
    
    if (data !== undefined) {
      // Called with (portfolioId, assetId, data)
      id = assetIdOrData as number;
      updateData = data;
    } else {
      // Called with (assetId, data)
      id = portfolioIdOrAssetId;
      updateData = assetIdOrData as UpdateAssetDto;
    }
    
    const response = await api.put<Asset>(
      ASSET_ENDPOINTS.UPDATE(id),
      updateData
    );
    return response.data;
  }

  /**
   * Delete an asset from a portfolio
   */
  async delete(portfolioId: number, assetId: number): Promise<void>;
  async delete(assetId: number): Promise<void>;
  async delete(portfolioIdOrAssetId: number, assetId?: number): Promise<void> {
    // Support both signatures for backwards compatibility
    const id = assetId !== undefined ? assetId : portfolioIdOrAssetId;
    await api.delete(ASSET_ENDPOINTS.DELETE(id));
  }

  /**
   * Get current market price for a symbol
   */
  async getPrice(symbol: string): Promise<{
    symbol: string;
    name: string;
    currentPrice: number;
    change?: number;
    changePercent?: number;
    timestamp: string;
  }> {
    const response = await api.get(ASSET_ENDPOINTS.PRICE(symbol));
    return response.data;
  }

  /**
   * Search for asset symbols
   */
  async searchSymbols(query: string): Promise<any[]> {
    const response = await api.get(ASSET_ENDPOINTS.SEARCH, {
      params: { query },
    });
    return response.data;
  }

  /**
   * Get assets filtered by type
   */
  async getAssetsByType(
    portfolioId: number,
    assetType: AssetType
  ): Promise<Asset[]> {
    const allAssets = await this.getPortfolioAssets(portfolioId);
    return allAssets.filter((asset) => asset.assetType === assetType);
  }

  /**
   * Calculate total value of all assets in a portfolio
   */
  async getPortfolioValue(portfolioId: number): Promise<number> {
    const assets = await this.getPortfolioAssets(portfolioId);
    return assets.reduce((total, asset) => total + asset.currentValue, 0);
  }

  /**
   * Calculate total gain/loss for a portfolio
   */
  async getPortfolioGainLoss(portfolioId: number): Promise<number> {
    const assets = await this.getPortfolioAssets(portfolioId);
    return assets.reduce((total, asset) => total + asset.gainLoss, 0);
  }

  /**
   * Get top performing assets by gain/loss
   */
  async getTopPerformers(
    portfolioId: number,
    limit: number = 5
  ): Promise<Asset[]> {
    const assets = await this.getPortfolioAssets(portfolioId);
    return assets.sort((a, b) => b.gainLoss - a.gainLoss).slice(0, limit);
  }

  /**
   * Get worst performing assets by gain/loss
   */
  async getWorstPerformers(
    portfolioId: number,
    limit: number = 5
  ): Promise<Asset[]> {
    const assets = await this.getPortfolioAssets(portfolioId);
    return assets.sort((a, b) => a.gainLoss - b.gainLoss).slice(0, limit);
  }

  /**
   * Get assets sorted by current value (largest holdings)
   */
  async getLargestHoldings(
    portfolioId: number,
    limit: number = 5
  ): Promise<Asset[]> {
    const assets = await this.getPortfolioAssets(portfolioId);
    return assets
      .sort((a, b) => b.currentValue - a.currentValue)
      .slice(0, limit);
  }

  /**
   * Get asset allocation by type - uses backend endpoint for better performance
   */
  async getAssetAllocation(
    portfolioId: number
  ): Promise<{ type: string; value: number; percentage: number }[]> {
    try {
      // Try to use the backend allocation endpoint first
      const response = await api.get<{ type: string; value: number; percentage: number }[]>(
        ASSET_ENDPOINTS.ALLOCATION(portfolioId)
      );
      return response.data;
    } catch (error) {
      // Fallback to client-side calculation if backend endpoint fails
      const assets = await this.getPortfolioAssets(portfolioId);
      const totalValue = assets.reduce(
        (sum, asset) => sum + asset.currentValue,
        0
      );

      const allocationMap = new Map<string, number>();

      assets.forEach((asset) => {
        const currentValue = allocationMap.get(asset.assetTypeName) || 0;
        allocationMap.set(asset.assetTypeName, currentValue + asset.currentValue);
      });

      return Array.from(allocationMap.entries()).map(([type, value]) => ({
        type,
        value,
        percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
      }));
    }
  }
}

// Export singleton instance
export default new AssetService();