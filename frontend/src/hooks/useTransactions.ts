// ============================================================================
// useTransactions Hook
// Custom hook for transaction operations
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import transactionService from "../services/transaction.service";
import {
  type Transaction,
  type CreateTransactionDto,
  TransactionType,
} from "../types";
import { getErrorMessage } from "../services/api";

interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchUserTransactions: () => Promise<void>;
  fetchPortfolioTransactions: (portfolioId: number) => Promise<void>;
  getTransactionById: (id: number) => Promise<Transaction | null>;
  createTransaction: (
    data: CreateTransactionDto
  ) => Promise<Transaction | null>;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getRecentTransactions: (limit?: number) => Transaction[];
  getTotalByType: (type: TransactionType) => number;
  getTotalFees: () => number;
  clearError: () => void;
}

/**
 * Custom hook for transaction management
 */
export const useTransactions = (
  portfolioId?: number,
  autoFetch: boolean = true
): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all transactions for the authenticated user
   */
  const fetchUserTransactions = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await transactionService.getUserTransactions();
      setTransactions(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch all transactions for a specific portfolio
   */
  const fetchPortfolioTransactions = useCallback(
    async (pId: number): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await transactionService.getPortfolioTransactions(pId);
        setTransactions(data);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Get a specific transaction by ID
   */
  const getTransactionById = useCallback(
    async (id: number): Promise<Transaction | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const transaction = await transactionService.getById(id);
        return transaction;
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
   * Create a new transaction
   */
  const createTransaction = useCallback(
    async (data: CreateTransactionDto): Promise<Transaction | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const newTransaction = await transactionService.create(data);
        setTransactions((prev) => [newTransaction, ...prev]);
        return newTransaction;
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
   * Get transactions filtered by type
   */
  const getTransactionsByType = useCallback(
    (type: TransactionType): Transaction[] => {
      return transactions.filter((t) => t.type === type);
    },
    [transactions]
  );

  /**
   * Get recent transactions
   */
  const getRecentTransactions = useCallback(
    (limit: number = 10): Transaction[] => {
      return [...transactions]
        .sort(
          (a, b) =>
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime()
        )
        .slice(0, limit);
    },
    [transactions]
  );

  /**
   * Calculate total amount for a specific transaction type
   */
  const getTotalByType = useCallback(
    (type: TransactionType): number => {
      return transactions
        .filter((t) => t.type === type)
        .reduce((total, t) => total + t.totalAmount, 0);
    },
    [transactions]
  );

  /**
   * Calculate total fees paid
   */
  const getTotalFees = useCallback((): number => {
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
      } else {
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
