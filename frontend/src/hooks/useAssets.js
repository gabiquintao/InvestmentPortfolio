// ============================================================================
// useAssets Hook
// Custom hook for asset operations within portfolios
// ============================================================================
import { useState, useEffect, useCallback } from "react";
import assetService from "../services/asset.service";
import { AssetType, } from "../types";
import { getErrorMessage } from "../services/api";
/**
 * Custom hook for asset management within a portfolio
 */
export const useAssets = (portfolioId, autoFetch = true) => {
    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    /**
     * Fetch all assets for a portfolio
     */
    const fetchAssets = useCallback(async (pId) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await assetService.getPortfolioAssets(pId);
            setAssets(data);
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            setAssets([]);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    /**
     * Get a specific asset by ID
     */
    const getAssetById = useCallback(async (pId, assetId) => {
        setIsLoading(true);
        setError(null);
        try {
            const asset = await assetService.getById(pId, assetId);
            return asset;
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
     * Create a new asset
     */
    const createAsset = useCallback(async (pId, data) => {
        setIsLoading(true);
        setError(null);
        try {
            const newAsset = await assetService.create(pId, data);
            setAssets((prev) => [...prev, newAsset]);
            return newAsset;
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
     * Update an existing asset
     */
    const updateAsset = useCallback(async (pId, assetId, data) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedAsset = await assetService.update(pId, assetId, data);
            setAssets((prev) => prev.map((a) => (a.assetId === assetId ? updatedAsset : a)));
            return updatedAsset;
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
     * Delete an asset
     */
    const deleteAsset = useCallback(async (pId, assetId) => {
        setIsLoading(true);
        setError(null);
        try {
            await assetService.delete(pId, assetId);
            setAssets((prev) => prev.filter((a) => a.assetId !== assetId));
            return true;
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            return false;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    /**
     * Get assets filtered by type
     */
    const getAssetsByType = useCallback((assetType) => {
        return assets.filter((asset) => asset.assetType === assetType);
    }, [assets]);
    /**
     * Calculate total value of all assets
     */
    const getTotalValue = useCallback(() => {
        return assets.reduce((total, asset) => total + asset.currentValue, 0);
    }, [assets]);
    /**
     * Calculate total gain/loss
     */
    const getTotalGainLoss = useCallback(() => {
        return assets.reduce((total, asset) => total + asset.gainLoss, 0);
    }, [assets]);
    /**
     * Get top performing assets
     */
    const getTopPerformers = useCallback((limit = 5) => {
        return [...assets]
            .sort((a, b) => b.gainLoss - a.gainLoss)
            .slice(0, limit);
    }, [assets]);
    /**
     * Get worst performing assets
     */
    const getWorstPerformers = useCallback((limit = 5) => {
        return [...assets]
            .sort((a, b) => a.gainLoss - b.gainLoss)
            .slice(0, limit);
    }, [assets]);
    /**
     * Get largest holdings by value
     */
    const getLargestHoldings = useCallback((limit = 5) => {
        return [...assets]
            .sort((a, b) => b.currentValue - a.currentValue)
            .slice(0, limit);
    }, [assets]);
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
