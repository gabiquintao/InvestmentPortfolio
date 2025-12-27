// ============================================================================
// useAssets Hook
// Custom hook for asset operations within portfolios
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import assetService from "../services/asset.service";
import {
  type Asset,
  type CreateAssetDto,
  type UpdateAssetDto,
  AssetType,
} from "../types";
import { getErrorMessage } from "../services/api";

interface UseAssetsReturn {
  assets: Asset[];
  isLoading: boolean;
  error: string | null;
  fetchAssets: (portfolioId: number) => Promise<void>;
  getAssetById: (portfolioId: number, assetId: number) => Promise<Asset | null>;
  createAsset: (
    portfolioId: number,
    data: CreateAssetDto
  ) => Promise<Asset | null>;
  updateAsset: (
    portfolioId: number,
    assetId: number,
    data: UpdateAssetDto
  ) => Promise<Asset | null>;
  deleteAsset: (portfolioId: number, assetId: number) => Promise<boolean>;
  getAssetsByType: (assetType: AssetType) => Asset[];
  getTotalValue: () => number;
  getTotalGainLoss: () => number;
  getTopPerformers: (limit?: number) => Asset[];
  getWorstPerformers: (limit?: number) => Asset[];
  getLargestHoldings: (limit?: number) => Asset[];
  clearError: () => void;
}

/**
 * Custom hook for asset management within a portfolio
 */
export const useAssets = (
  portfolioId?: number,
  autoFetch: boolean = true
): UseAssetsReturn => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all assets for a portfolio
   */
  const fetchAssets = useCallback(async (pId: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await assetService.getPortfolioAssets(pId);
      setAssets(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setAssets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get a specific asset by ID
   */
  const getAssetById = useCallback(
    async (pId: number, assetId: number): Promise<Asset | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const asset = await assetService.getById(pId, assetId);
        return asset;
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
   * Create a new asset
   */
  const createAsset = useCallback(
    async (pId: number, data: CreateAssetDto): Promise<Asset | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const newAsset = await assetService.create(pId, data);
        setAssets((prev) => [...prev, newAsset]);
        return newAsset;
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
   * Update an existing asset
   */
  const updateAsset = useCallback(
    async (
      pId: number,
      assetId: number,
      data: UpdateAssetDto
    ): Promise<Asset | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedAsset = await assetService.update(pId, assetId, data);
        setAssets((prev) =>
          prev.map((a) => (a.assetId === assetId ? updatedAsset : a))
        );
        return updatedAsset;
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
   * Delete an asset
   */
  const deleteAsset = useCallback(
    async (pId: number, assetId: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await assetService.delete(pId, assetId);
        setAssets((prev) => prev.filter((a) => a.assetId !== assetId));
        return true;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Get assets filtered by type
   */
  const getAssetsByType = useCallback(
    (assetType: AssetType): Asset[] => {
      return assets.filter((asset) => asset.assetType === assetType);
    },
    [assets]
  );

  /**
   * Calculate total value of all assets
   */
  const getTotalValue = useCallback((): number => {
    return assets.reduce((total, asset) => total + asset.currentValue, 0);
  }, [assets]);

  /**
   * Calculate total gain/loss
   */
  const getTotalGainLoss = useCallback((): number => {
    return assets.reduce((total, asset) => total + asset.gainLoss, 0);
  }, [assets]);

  /**
   * Get top performing assets
   */
  const getTopPerformers = useCallback(
    (limit: number = 5): Asset[] => {
      return [...assets]
        .sort((a, b) => b.gainLoss - a.gainLoss)
        .slice(0, limit);
    },
    [assets]
  );

  /**
   * Get worst performing assets
   */
  const getWorstPerformers = useCallback(
    (limit: number = 5): Asset[] => {
      return [...assets]
        .sort((a, b) => a.gainLoss - b.gainLoss)
        .slice(0, limit);
    },
    [assets]
  );

  /**
   * Get largest holdings by value
   */
  const getLargestHoldings = useCallback(
    (limit: number = 5): Asset[] => {
      return [...assets]
        .sort((a, b) => b.currentValue - a.currentValue)
        .slice(0, limit);
    },
    [assets]
  );

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount if portfolioId is provided and autoFetch is enabled
  useEffect(() => {
    if (autoFetch && portfolioId) {
      fetchAssets(portfolioId);
    }
  }, [autoFetch, portfolioId, fetchAssets]);

  return {
    assets,
    isLoading,
    error,
    fetchAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset,
    getAssetsByType,
    getTotalValue,
    getTotalGainLoss,
    getTopPerformers,
    getWorstPerformers,
    getLargestHoldings,
    clearError,
  };
};
