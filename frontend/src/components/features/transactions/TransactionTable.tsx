// ============================================================================
// TransactionTable Component
// Table view of transactions with filtering and sorting
// ============================================================================

import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus, Filter } from "lucide-react";
import { type Transaction, TransactionType } from "../../../types";
import TransactionRow from "./TransactionRow";
import { Button } from "../../common/Button";
import { EmptyState } from "../../common/ErrorMessage";

// ============================================================================
// TYPES
// ============================================================================

interface TransactionTableProps {
  transactions: Transaction[];
  currency?: string;
  onAddNew?: () => void;
  showPortfolioColumn?: boolean;
}

type SortField =
  | "date"
  | "symbol"
  | "type"
  | "quantity"
  | "pricePerUnit"
  | "totalAmount";
type SortDirection = "asc" | "desc" | null;

// ============================================================================
// TRANSACTION TABLE COMPONENT
// ============================================================================

export const TransactionTable = ({
  transactions,
  currency = "EUR",
  onAddNew,
  showPortfolioColumn = false,
}: TransactionTableProps) => {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
      );
      if (sortDirection === "desc") {
        setSortField("date");
        setSortDirection("desc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4 text-blue-600" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="h-4 w-4 text-blue-600" />;
    }
    return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((tx) => tx.type === filterType);
    }

    // Sort
    if (sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: number | string = 0;
        let bValue: number | string = 0;

        switch (sortField) {
          case "date":
            aValue = new Date(a.transactionDate).getTime();
            bValue = new Date(b.transactionDate).getTime();
            break;
          case "symbol":
            aValue = a.assetSymbol;
            bValue = b.assetSymbol;
            break;
          case "type":
            aValue = a.typeName;
            bValue = b.typeName;
            break;
          case "quantity":
            aValue = a.quantity;
            bValue = b.quantity;
            break;
          case "pricePerUnit":
            aValue = a.pricePerUnit;
            bValue = b.pricePerUnit;
            break;
          case "totalAmount":
            aValue = a.totalAmount;
            bValue = b.totalAmount;
            break;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortDirection === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });
    }

    return filtered;
  }, [transactions, sortField, sortDirection, filterType]);

  // Calculate totals
  const totals = useMemo(() => {
    const filtered = filteredAndSortedTransactions;
    return {
      totalAmount: filtered.reduce(
        (sum, tx) =>
          tx.type === TransactionType.Buy ? sum + tx.totalAmount : sum,
        0
      ),
      totalSold: filtered.reduce(
        (sum, tx) =>
          tx.type === TransactionType.Sell ? sum + tx.totalAmount : sum,
        0
      ),
      totalFees: filtered.reduce((sum, tx) => sum + tx.fees, 0),
    };
  }, [filteredAndSortedTransactions]);

  // Empty state
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        message="Record your first transaction to start tracking your portfolio activity"
        icon={<Plus className="h-8 w-8 text-gray-400" />}
        action={
          onAddNew
            ? {
                label: "Add Transaction",
                onClick: onAddNew,
              }
            : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Transaction History
          </h3>
          <p className="text-sm text-gray-600">
            {filteredAndSortedTransactions.length} of {transactions.length}{" "}
            transactions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter by Type */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(
                  e.target.value === "all"
                    ? "all"
                    : (Number(e.target.value) as TransactionType)
                )
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Types</option>
              <option value={TransactionType.Buy}>Buy</option>
              <option value={TransactionType.Sell}>Sell</option>
            </select>
          </div>

          {onAddNew && (
            <Button
              variant="primary"
              onClick={onAddNew}
              leftIcon={<Plus className="h-5 w-5" />}
            >
              Add Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Purchases</p>
          <p className="text-xl font-bold text-gray-900">
            {currency} {totals.totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Sales</p>
          <p className="text-xl font-bold text-gray-900">
            {currency} {totals.totalSold.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Fees</p>
          <p className="text-xl font-bold text-gray-900">
            {currency} {totals.totalFees.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                  >
                    Date
                    {getSortIcon("date")}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("symbol")}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                  >
                    Asset
                    {getSortIcon("symbol")}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("type")}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                  >
                    Type
                    {getSortIcon("type")}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort("quantity")}
                    className="flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                  >
                    Quantity
                    {getSortIcon("quantity")}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort("pricePerUnit")}
                    className="flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                  >
                    Price/Unit
                    {getSortIcon("pricePerUnit")}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort("totalAmount")}
                    className="flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                  >
                    Total
                    {getSortIcon("totalAmount")}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fees
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.transactionId}
                  transaction={transaction}
                  currency={currency}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
