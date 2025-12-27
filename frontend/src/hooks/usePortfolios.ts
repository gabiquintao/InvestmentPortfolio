// ============================================================================
// usePortfolios Hook
// Custom hook for portfolio operations and state management
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import portfolioService from "../services/portfolio.service";
import type {
  Portfolio,
  PortfolioSummary,
  CreatePortfolioDto,
  UpdatePortfolioDto,
} from "../types";
import { getErrorMessage } from "../services/api";

interface UsePortfoliosReturn {
  portfolios: Portfolio[];
  summaries: PortfolioSummary[];
  isLoading: boolean;
  error: string | null;
  fetchPortfolios: () => Promise<void>;
  fetchSummaries: () => Promise<void>;
  getPortfolioById: (id: number) => Promise<Portfolio | null>;
  createPortfolio: (data: CreatePortfolioDto) => Promise<Portfolio | null>;
  updatePortfolio: (
    id: number,
    data: UpdatePortfolioDto
  ) => Promise<Portfolio | null>;
  deletePortfolio: (id: number) => Promise<boolean>;
  refreshPortfolios: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for portfolio management
 * Provides CRUD operations and state management for portfolios
 */
export const usePortfolios = (
  autoFetch: boolean = true
): UsePortfoliosReturn => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [summaries, setSummaries] = useState<PortfolioSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all portfolios
   */
  const fetchPortfolios = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await portfolioService.getUserPortfolios();
      setPortfolios(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setPortfolios([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch portfolio summaries
   */
  const fetchSummaries = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await portfolioService.getPortfolioSummaries();
      setSummaries(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setSummaries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get a specific portfolio by ID
   */
  const getPortfolioById = useCallback(
    async (id: number): Promise<Portfolio | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const portfolio = await portfolioService.getById(id);
        return portfolio;
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
   * Create a new portfolio
   */
  const createPortfolio = useCallback(
    async (data: CreatePortfolioDto): Promise<Portfolio | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const newPortfolio = await portfolioService.create(data);
        setPortfolios((prev) => [...prev, newPortfolio]);
        return newPortfolio;
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
   * Update an existing portfolio
   */
  const updatePortfolio = useCallback(
    async (id: number, data: UpdatePortfolioDto): Promise<Portfolio | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedPortfolio = await portfolioService.update(id, data);
        setPortfolios((prev) =>
          prev.map((p) => (p.portfolioId === id ? updatedPortfolio : p))
        );
        return updatedPortfolio;
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
   * Delete a portfolio
   */
  const deletePortfolio = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await portfolioService.delete(id);
      setPortfolios((prev) => prev.filter((p) => p.portfolioId !== id));
      setSummaries((prev) => prev.filter((s) => s.portfolioId !== id));
      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh portfolios and summaries
   */
  const refreshPortfolios = useCallback(async (): Promise<void> => {
    await Promise.all([fetchPortfolios(), fetchSummaries()]);
  }, [fetchPortfolios, fetchSummaries]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchPortfolios();
    }
  }, [autoFetch, fetchPortfolios]);

  return {
    portfolios,
    summaries,
    isLoading,
    error,
    fetchPortfolios,
    fetchSummaries,
    getPortfolioById,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    refreshPortfolios,
    clearError,
  };
};
