// ============================================================================
// Transaction Service
// Handles transaction operations and history
// ============================================================================
import api from "./api";
import { TransactionType, } from "../types";
const TRANSACTION_ENDPOINTS = {
    BASE: "/transaction",
    BY_ID: (id) => `/transaction/${id}`,
    BY_PORTFOLIO: (portfolioId) => `/transaction/portfolio/${portfolioId}`,
};
// ============================================================================
// TRANSACTION SERVICE
// ============================================================================
class TransactionService {
    /**
     * Get all transactions for the authenticated user
     */
    async getUserTransactions() {
        const response = await api.get(TRANSACTION_ENDPOINTS.BASE);
        return response.data;
    }
    /**
     * Get all transactions for a specific portfolio
     */
    async getPortfolioTransactions(portfolioId) {
        const response = await api.get(TRANSACTION_ENDPOINTS.BY_PORTFOLIO(portfolioId));
        return response.data;
    }
    /**
     * Get a specific transaction by ID
     */
    async getById(id) {
        const response = await api.get(TRANSACTION_ENDPOINTS.BY_ID(id));
        return response.data;
    }
    /**
     * Create a new transaction
     */
    async create(data) {
        const response = await api.post(TRANSACTION_ENDPOINTS.BASE, data);
        return response.data;
    }
    /**
     * Get transactions filtered by type
     */
    async getTransactionsByType(portfolioId, type) {
        const transactions = await this.getPortfolioTransactions(portfolioId);
        return transactions.filter((t) => t.type === type);
    }
    /**
     * Get transactions for a specific asset
     */
    async getAssetTransactions(portfolioId, assetId) {
        const transactions = await this.getPortfolioTransactions(portfolioId);
        return transactions.filter((t) => t.assetId === assetId);
    }
    /**
     * Get transactions within a date range
     */
    async getTransactionsByDateRange(portfolioId, startDate, endDate) {
        const transactions = await this.getPortfolioTransactions(portfolioId);
        return transactions.filter((t) => {
            const transactionDate = new Date(t.transactionDate);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    }
    /**
     * Calculate total amount for a specific transaction type
     */
    async getTotalByType(portfolioId, type) {
        const transactions = await this.getTransactionsByType(portfolioId, type);
        return transactions.reduce((total, t) => total + t.totalAmount, 0);
    }
    /**
     * Calculate total fees paid
     */
    async getTotalFees(portfolioId) {
        const transactions = await this.getPortfolioTransactions(portfolioId);
        return transactions.reduce((total, t) => total + t.fees, 0);
    }
    /**
     * Get recent transactions (last N transactions)
     */
    async getRecentTransactions(portfolioId, limit = 10) {
        const transactions = await this.getPortfolioTransactions(portfolioId);
        return transactions
            .sort((a, b) => new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime())
            .slice(0, limit);
    }
    /**
     * Get transaction statistics for a portfolio
     */
    async getTransactionStats(portfolioId) {
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
    async getTransactionsByMonth(portfolioId, year) {
        const transactions = await this.getPortfolioTransactions(portfolioId);
        const monthlyTransactions = {};
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
