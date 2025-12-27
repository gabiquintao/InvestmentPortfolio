// ============================================================================
// Asset Service
// Handles asset CRUD operations within portfolios
// ============================================================================
import api from "./api";
import { AssetType, } from "../types";
// Updated endpoints to match backend routes
const ASSET_ENDPOINTS = {
    // GET /api/asset/portfolio/{portfolioId}
    PORTFOLIO_ASSETS: (portfolioId) => `/asset/portfolio/${portfolioId}`,
    // GET /api/asset/{assetId}
    BY_ID: (assetId) => `/asset/${assetId}`,
    // POST /api/asset/portfolio/{portfolioId}
    CREATE: (portfolioId) => `/asset/portfolio/${portfolioId}`,
    // PUT /api/asset/{assetId}
    UPDATE: (assetId) => `/asset/${assetId}`,
    // DELETE /api/asset/{assetId}
    DELETE: (assetId) => `/asset/${assetId}`,
    // GET /api/asset/portfolio/{portfolioId}/allocation
    ALLOCATION: (portfolioId) => `/asset/portfolio/${portfolioId}/allocation`,
    // GET /api/asset/price/{symbol}
    PRICE: (symbol) => `/asset/price/${symbol}`,
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
    async getPortfolioAssets(portfolioId) {
        const response = await api.get(ASSET_ENDPOINTS.PORTFOLIO_ASSETS(portfolioId));
        return response.data;
    }
    async getById(portfolioIdOrAssetId, assetId) {
        // Support both signatures for backwards compatibility
        const id = assetId !== undefined ? assetId : portfolioIdOrAssetId;
        const response = await api.get(ASSET_ENDPOINTS.BY_ID(id));
        return response.data;
    }
    /**
     * Create a new asset in a portfolio
     */
    async create(portfolioId, data) {
        const response = await api.post(ASSET_ENDPOINTS.CREATE(portfolioId), data);
        return response.data;
    }
    async update(portfolioIdOrAssetId, assetIdOrData, data) {
        // Support both signatures for backwards compatibility
        let id;
        let updateData;
        if (data !== undefined) {
            // Called with (portfolioId, assetId, data)
            id = assetIdOrData;
            updateData = data;
        }
        else {
            // Called with (assetId, data)
            id = portfolioIdOrAssetId;
            updateData = assetIdOrData;
        }
        const response = await api.put(ASSET_ENDPOINTS.UPDATE(id), updateData);
        return response.data;
    }
    async delete(portfolioIdOrAssetId, assetId) {
        // Support both signatures for backwards compatibility
        const id = assetId !== undefined ? assetId : portfolioIdOrAssetId;
        await api.delete(ASSET_ENDPOINTS.DELETE(id));
    }
    /**
     * Get current market price for a symbol
     */
    async getPrice(symbol) {
        const response = await api.get(ASSET_ENDPOINTS.PRICE(symbol));
        return response.data;
    }
    /**
     * Search for asset symbols
     */
    async searchSymbols(query) {
        const response = await api.get(ASSET_ENDPOINTS.SEARCH, {
            params: { query },
        });
        return response.data;
    }
    /**
     * Get assets filtered by type
     */
    async getAssetsByType(portfolioId, assetType) {
        const allAssets = await this.getPortfolioAssets(portfolioId);
        return allAssets.filter((asset) => asset.assetType === assetType);
    }
    /**
     * Calculate total value of all assets in a portfolio
     */
    async getPortfolioValue(portfolioId) {
        const assets = await this.getPortfolioAssets(portfolioId);
        return assets.reduce((total, asset) => total + asset.currentValue, 0);
    }
    /**
     * Calculate total gain/loss for a portfolio
     */
    async getPortfolioGainLoss(portfolioId) {
        const assets = await this.getPortfolioAssets(portfolioId);
        return assets.reduce((total, asset) => total + asset.gainLoss, 0);
    }
    /**
     * Get top performing assets by gain/loss
     */
    async getTopPerformers(portfolioId, limit = 5) {
        const assets = await this.getPortfolioAssets(portfolioId);
        return assets.sort((a, b) => b.gainLoss - a.gainLoss).slice(0, limit);
    }
    /**
     * Get worst performing assets by gain/loss
     */
    async getWorstPerformers(portfolioId, limit = 5) {
        const assets = await this.getPortfolioAssets(portfolioId);
        return assets.sort((a, b) => a.gainLoss - b.gainLoss).slice(0, limit);
    }
    /**
     * Get assets sorted by current value (largest holdings)
     */
    async getLargestHoldings(portfolioId, limit = 5) {
        const assets = await this.getPortfolioAssets(portfolioId);
        return assets
            .sort((a, b) => b.currentValue - a.currentValue)
            .slice(0, limit);
    }
    /**
     * Get asset allocation by type - uses backend endpoint for better performance
     */
    async getAssetAllocation(portfolioId) {
        try {
            // Try to use the backend allocation endpoint first
            const response = await api.get(ASSET_ENDPOINTS.ALLOCATION(portfolioId));
            return response.data;
        }
        catch (error) {
            // Fallback to client-side calculation if backend endpoint fails
            const assets = await this.getPortfolioAssets(portfolioId);
            const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
            const allocationMap = new Map();
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
