// ============================================================================
// TransactionsPage
// Page for viewing and managing all transactions
// ============================================================================

import { useState, useEffect, useMemo } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { usePortfolios } from "../hooks/usePortfolios";
import { useAssets } from "../hooks/useAssets";
import { Layout } from "../components/layout/Layout";
import { PageLoader } from "../components/common/LoadingSpinner";
import { PageError, ErrorMessage } from "../components/common/ErrorMessage";
import { Modal } from "../components/common/Modal";
import TransactionTable from "../components/features/transactions/TransactionTable";
import TransactionForm from "../components/features/transactions/TransactionForm";
import TransactionSummary from "../components/features/transactions/TransactionSummary";
import TransactionFilters, {
  type TransactionFilterValues,
} from "../components/features/transactions/TransactionFilters";
import type { CreateTransactionDto } from "../types";

// ============================================================================
// TRANSACTIONS PAGE COMPONENT
// ============================================================================

export const TransactionsPage = () => {
  const {
    transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
    fetchUserTransactions,
    createTransaction,
  } = useTransactions(undefined, false);

  const { portfolios, fetchPortfolios } = usePortfolios(false);
  const { assets, fetchAssets } = useAssets(undefined, false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<TransactionFilterValues>({
    type: "all",
    assetSymbol: "",
    dateFrom: "",
    dateTo: "",
  });

  // Fetch data on mount
  useEffect(() => {
    fetchUserTransactions();
    fetchPortfolios();
  }, [fetchUserTransactions, fetchPortfolios]);

  // Fetch all assets when portfolios are loaded
  useEffect(() => {
    const loadAllAssets = async () => {
      for (const portfolio of portfolios) {
        await fetchAssets(portfolio.portfolioId);
      }
    };
    if (portfolios.length > 0) {
      loadAllAssets();
    }
  }, [portfolios, fetchAssets]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by type
    if (filters.type !== "all") {
      filtered = filtered.filter((tx) => tx.type === filters.type);
    }

    // Filter by asset symbol
    if (filters.assetSymbol) {
      filtered = filtered.filter(
        (tx) => tx.assetSymbol === filters.assetSymbol
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (tx) => new Date(tx.transactionDate) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999); // Include entire day
      filtered = filtered.filter(
        (tx) => new Date(tx.transactionDate) <= endDate
      );
    }

    return filtered;
  }, [transactions, filters]);

  // Get unique asset symbols for filter
  const assetSymbols = useMemo(() => {
    const symbols = new Set(transactions.map((tx) => tx.assetSymbol));
    return Array.from(symbols).sort();
  }, [transactions]);

  // Handle create transaction
  const handleCreateTransaction = async (data: CreateTransactionDto) => {
    setFormLoading(true);
    setFormError(null);

    const result = await createTransaction(data);

    if (result) {
      setIsCreateModalOpen(false);
      await fetchUserTransactions(); // Refresh transactions
    } else {
      setFormError("Failed to create transaction");
    }

    setFormLoading(false);
  };

  // Loading state
  if (transactionsLoading && transactions.length === 0) {
    return (
      <Layout>
        <PageLoader text="Loading transactions..." />
      </Layout>
    );
  }

  // Error state
  if (transactionsError) {
    return (
      <Layout>
        <PageError
          title="Failed to load transactions"
          message={transactionsError}
          onRetry={fetchUserTransactions}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">
            View and manage all your investment transactions
          </p>
        </div>

        {/* Summary Statistics */}
        {transactions.length > 0 && (
          <TransactionSummary
            transactions={filteredTransactions}
            currency="EUR"
          />
        )}

        {/* Filters */}
        <TransactionFilters
          filters={filters}
          onFiltersChange={setFilters}
          assetSymbols={assetSymbols}
        />

        {/* Transactions Table */}
        <TransactionTable
          transactions={filteredTransactions}
          currency="EUR"
          onAddNew={() => setIsCreateModalOpen(true)}
        />

        {/* Create Transaction Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => !formLoading && setIsCreateModalOpen(false)}
          title="Create Transaction"
          size="lg"
        >
          {formError && (
            <div className="mb-4">
              <ErrorMessage
                message={formError}
                onClose={() => setFormError(null)}
              />
            </div>
          )}
          <TransactionForm
            portfolios={portfolios}
            assets={assets}
            onSubmit={handleCreateTransaction}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={formLoading}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default TransactionsPage;
