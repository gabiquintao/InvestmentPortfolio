// ============================================================================
// Portfolio Service
// Handles portfolio CRUD operations and summaries
// ============================================================================
import api from "./api";
const PORTFOLIO_ENDPOINTS = {
    BASE: "/portfolio",
    BY_ID: (id) => `/portfolio/${id}`,
    SUMMARY: "/portfolio/summary",
};
// ============================================================================
// PORTFOLIO SERVICE
// ============================================================================
class PortfolioService {
    /**
     * Get all portfolios for the authenticated user
     */
    async getUserPortfolios() {
        const response = await api.get(PORTFOLIO_ENDPOINTS.BASE);
        return response.data;
    }
    /**
     * Get a specific portfolio by ID
     */
    async getById(id) {
        const response = await api.get(PORTFOLIO_ENDPOINTS.BY_ID(id));
        return response.data;
    }
    /**
     * Create a new portfolio
     */
    async create(data) {
        const response = await api.post(PORTFOLIO_ENDPOINTS.BASE, data);
        return response.data;
    }
    /**
     * Update an existing portfolio
     */
    async update(id, data) {
        const response = await api.put(PORTFOLIO_ENDPOINTS.BY_ID(id), data);
        return response.data;
    }
    /**
     * Delete a portfolio
     */
    async delete(id) {
        await api.delete(PORTFOLIO_ENDPOINTS.BY_ID(id));
    }
    /**
     * Get portfolio summaries for all user portfolios
     * Includes aggregated data like total value, gain/loss, top holdings
     */
    async getPortfolioSummaries() {
        const response = await api.get(PORTFOLIO_ENDPOINTS.SUMMARY);
        return response.data;
    }
    /**
     * Calculate total portfolio value across all portfolios
     */
    async getTotalPortfolioValue() {
        const summaries = await this.getPortfolioSummaries();
        return summaries.reduce((total, summary) => total + summary.totalValue, 0);
    }
    /**
     * Calculate total gain/loss across all portfolios
     */
    async getTotalGainLoss() {
        const summaries = await this.getPortfolioSummaries();
        return summaries.reduce((total, summary) => total + summary.totalGainLoss, 0);
    }
    /**
     * Get total number of assets across all portfolios
     */
    async getTotalAssets() {
        const summaries = await this.getPortfolioSummaries();
        return summaries.reduce((total, summary) => total + summary.totalAssets, 0);
    }
}
// Export singleton instance
export default new PortfolioService();
