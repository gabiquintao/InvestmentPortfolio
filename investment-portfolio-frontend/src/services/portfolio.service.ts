// ============================================================================
// Portfolio Service
// Handles portfolio CRUD operations and summaries
// ============================================================================

import api from "./api";
import type {
  Portfolio,
  CreatePortfolioDto,
  UpdatePortfolioDto,
  PortfolioSummary,
} from "../types";

const PORTFOLIO_ENDPOINTS = {
  BASE: "/portfolio",
  BY_ID: (id: number) => `/portfolio/${id}`,
  SUMMARY: "/portfolio/summary",
};

// ============================================================================
// PORTFOLIO SERVICE
// ============================================================================

class PortfolioService {
  /**
   * Get all portfolios for the authenticated user
   */
  async getUserPortfolios(): Promise<Portfolio[]> {
    const response = await api.get<Portfolio[]>(PORTFOLIO_ENDPOINTS.BASE);
    return response.data;
  }

  /**
   * Get a specific portfolio by ID
   */
  async getById(id: number): Promise<Portfolio> {
    const response = await api.get<Portfolio>(PORTFOLIO_ENDPOINTS.BY_ID(id));
    return response.data;
  }

  /**
   * Create a new portfolio
   */
  async create(data: CreatePortfolioDto): Promise<Portfolio> {
    const response = await api.post<Portfolio>(PORTFOLIO_ENDPOINTS.BASE, data);
    return response.data;
  }

  /**
   * Update an existing portfolio
   */
  async update(id: number, data: UpdatePortfolioDto): Promise<Portfolio> {
    const response = await api.put<Portfolio>(
      PORTFOLIO_ENDPOINTS.BY_ID(id),
      data
    );
    return response.data;
  }

  /**
   * Delete a portfolio
   */
  async delete(id: number): Promise<void> {
    await api.delete(PORTFOLIO_ENDPOINTS.BY_ID(id));
  }

  /**
   * Get portfolio summaries for all user portfolios
   * Includes aggregated data like total value, gain/loss, top holdings
   */
  async getPortfolioSummaries(): Promise<PortfolioSummary[]> {
    const response = await api.get<PortfolioSummary[]>(
      PORTFOLIO_ENDPOINTS.SUMMARY
    );
    return response.data;
  }

  /**
   * Calculate total portfolio value across all portfolios
   */
  async getTotalPortfolioValue(): Promise<number> {
    const summaries = await this.getPortfolioSummaries();
    return summaries.reduce((total, summary) => total + summary.totalValue, 0);
  }

  /**
   * Calculate total gain/loss across all portfolios
   */
  async getTotalGainLoss(): Promise<number> {
    const summaries = await this.getPortfolioSummaries();
    return summaries.reduce(
      (total, summary) => total + summary.totalGainLoss,
      0
    );
  }

  /**
   * Get total number of assets across all portfolios
   */
  async getTotalAssets(): Promise<number> {
    const summaries = await this.getPortfolioSummaries();
    return summaries.reduce((total, summary) => total + summary.totalAssets, 0);
  }
}

// Export singleton instance
export default new PortfolioService();
