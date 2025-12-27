// ============================================================================
// useTransactions Hook
// Custom hook for transaction operations
// ============================================================================
import { useState, useEffect, useCallback } from "react";
import transactionService from "../services/transaction.service";
import { TransactionType, } from "../types";
import { getErrorMessage } from "../services/api";
/**
 * Custom hook for transaction management
 */
export const useTransactions = (portfolioId, autoFetch = true) => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    /**
     * Fetch all transactions for the authenticated user
     */
    const fetchUserTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await transactionService.getUserTransactions();
            setTransactions(data);
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            setTransactions([]);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    /**
     * Fetch all transactions for a specific portfolio
     */
    const fetchPortfolioTransactions = useCallback(async (pId) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await transactionService.getPortfolioTransactions(pId);
            setTransactions(data);
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            setTransactions([]);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    /**
     * Get a specific transaction by ID
     */
    const getTransactionById = useCallback(async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const transaction = await transactionService.getById(id);
            return transaction;
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
     * Create a new transaction
     */
    const createTransaction = useCallback(async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const newTransaction = await transactionService.create(data);
            setTransactions((prev) => [newTransaction, ...prev]);
            return newTransaction;
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
     * Get transactions filtered by type
     */
    const getTransactionsByType = useCallback((type) => {
        return transactions.filter((t) => t.type === type);
    }, [transactions]);
    /**
     * Get recent transactions
     */
    const getRecentTransactions = useCallback((limit = 10) => {
        return [...transactions]
            .sort((a, b) => new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime())
            .slice(0, limit);
    }, [transactions]);
    /**
     * Calculate total amount for a specific transaction type
     */
    const getTotalByType = useCallback((type) => {
        return transactions
            .filter((t) => t.type === type)
            .reduce((total, t) => total + t.totalAmount, 0);
    }, [transactions]);
    /**
     * Calculate total fees paid
     */
    const getTotalFees = useCallback(() => {
        return transactions.reduce((total, t) => total + t.fees, 0);
    }, [transactions]);
    /**
     * Clear error message
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    // Auto-fetch on mount
    useEffect(() => {
        if (autoFetch) {
            if (portfolioId) {
                fetchPortfolioTransactions(portfolioId);
            }
            else {
                fetchUserTransactions();
            }
        }
    }, [
        autoFetch,
        portfolioId,
        fetchPortfolioTransactions,
        fetchUserTransactions,
    ]);
    return {
        transactions,
        isLoading,
        error,
        fetchUserTransactions,
        fetchPortfolioTransactions,
        getTransactionById,
        createTransaction,
        getTransactionsByType,
        getRecentTransactions,
        getTotalByType,
        getTotalFees,
        clearError,
    };
};
