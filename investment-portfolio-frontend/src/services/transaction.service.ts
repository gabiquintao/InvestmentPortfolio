// ============================================================================
// Transaction Service
// Handles transaction operations and history
// ============================================================================

import api from "./api";
import {
  type Transaction,
  type CreateTransactionDto,
  TransactionType,
} from "../types";

const TRANSACTION_ENDPOINTS = {
  BASE: "/transaction",
  BY_ID: (id: number) => `/transaction/${id}`,
  BY_PORTFOLIO: (portfolioId: number) =>
    `/transaction/portfolio/${portfolioId}`,
};

// ============================================================================
// TRANSACTION SERVICE
// ============================================================================

class TransactionService {
  /**
   * Get all transactions for the authenticated user
   */
  async getUserTransactions(): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>(TRANSACTION_ENDPOINTS.BASE);
    return response.data;
  }

  /**
   * Get all transactions for a specific portfolio
   */
  async getPortfolioTransactions(portfolioId: number): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>(
      TRANSACTION_ENDPOINTS.BY_PORTFOLIO(portfolioId)
    );
    return response.data;
  }

  /**
   * Get a specific transaction by ID
   */
  async getById(id: number): Promise<Transaction> {
    const response = await api.get<Transaction>(
      TRANSACTION_ENDPOINTS.BY_ID(id)
    );
    return response.data;
  }

  /**
   * Create a new transaction
   */
  async create(data: CreateTransactionDto): Promise<Transaction> {
    const response = await api.post<Transaction>(
      TRANSACTION_ENDPOINTS.BASE,
      data
    );
    return response.data;
  }

  /**
   * Get transactions filtered by type
   */
  async getTransactionsByType(
    portfolioId: number,
    type: TransactionType
  ): Promise<Transaction[]> {
    const transactions = await this.getPortfolioTransactions(portfolioId);
    return transactions.filter((t) => t.type === type);
  }

  /**
   * Get transactions for a specific asset
   */
  async getAssetTransactions(
    portfolioId: number,
    assetId: number
  ): Promise<Transaction[]> {
    const transactions = await this.getPortfolioTransactions(portfolioId);
    return transactions.filter((t) => t.assetId === assetId);
  }

  /**
   * Get transactions within a date range
   */
  async getTransactionsByDateRange(
    portfolioId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    const transactions = await this.getPortfolioTransactions(portfolioId);
    return transactions.filter((t) => {
      const transactionDate = new Date(t.transactionDate);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  /**
   * Calculate total amount for a specific transaction type
   */
  async getTotalByType(
    portfolioId: number,
    type: TransactionType
  ): Promise<number> {
    const transactions = await this.getTransactionsByType(portfolioId, type);
    return transactions.reduce((total, t) => total + t.totalAmount, 0);
  }

  /**
   * Calculate total fees paid
   */
  async getTotalFees(portfolioId: number): Promise<number> {
    const transactions = await this.getPortfolioTransactions(portfolioId);
    return transactions.reduce((total, t) => total + t.fees, 0);
  }

  /**
   * Get recent transactions (last N transactions)
   */
  async getRecentTransactions(
    portfolioId: number,
    limit: number = 10
  ): Promise<Transaction[]> {
    const transactions = await this.getPortfolioTransactions(portfolioId);
    return transactions
      .sort(
        (a, b) =>
          new Date(b.transactionDate).getTime() -
          new Date(a.transactionDate).getTime()
      )
      .slice(0, limit);
  }

  /**
   * Get transaction statistics for a portfolio
   */
  async getTransactionStats(portfolioId: number): Promise<{
    totalBuyAmount: number;
    totalSellAmount: number;
  }> {
    const transactions = await this.getPortfolioTransactions(portfolioId);

    return {
      totalBuyAmount: transactions
        .filter((t) => t.type === TransactionType.Buy)
        .reduce((sum, t) => sum + t.totalAmount, 0),
      totalSellAmount: transactions
        .filter((t) => t.type === TransactionType.Sell)
        .reduce((sum, t) => sum + t.totalAmount, 0),
    };
  }

  /**
   * Get transactions grouped by month
   */
  async getTransactionsByMonth(
    portfolioId: number,
    year: number
  ): Promise<{ month: number; transactions: Transaction[] }[]> {
    const transactions = await this.getPortfolioTransactions(portfolioId);
    const monthlyTransactions: { [key: number]: Transaction[] } = {};

    transactions.forEach((t) => {
      const date = new Date(t.transactionDate);
      if (date.getFullYear() === year) {
        const month = date.getMonth() + 1;
        if (!monthlyTransactions[month]) {
          monthlyTransactions[month] = [];
        }
        monthlyTransactions[month].push(t);
      }
    });

    return Object.entries(monthlyTransactions).map(([month, txs]) => ({
      month: parseInt(month),
      transactions: txs,
    }));
  }
}

// Export singleton instance
export default new TransactionService();
