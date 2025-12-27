// ============================================================================
// TransactionSummary Component
// Summary statistics for transactions
// ============================================================================

import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { type Transaction, TransactionType } from "../../../types";
import { formatCurrency } from "../../../utils/formatters";

// ============================================================================
// TYPES
// ============================================================================

interface TransactionSummaryProps {
  transactions: Transaction[];
  currency?: string;
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  iconColor: string;
  iconBgColor: string;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  iconColor,
  iconBgColor,
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
        </div>
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TRANSACTION SUMMARY COMPONENT
// ============================================================================

export const TransactionSummary = ({
  transactions,
  currency = "EUR",
}: TransactionSummaryProps) => {
  // Calculate statistics
  const stats = transactions.reduce(
    (acc, tx) => {
      switch (tx.type) {
        case TransactionType.Buy:
          acc.totalBuys += tx.totalAmount;
          acc.buyCount++;
          break;
        case TransactionType.Sell:
          acc.totalSells += tx.totalAmount;
          acc.sellCount++;
          break;
      }
      acc.allFees += tx.fees;
      return acc;
    },
    {
      totalBuys: 0,
      totalSells: 0,
      totalDividends: 0,
      totalFees: 0,
      allFees: 0,
      buyCount: 0,
      sellCount: 0,
      dividendCount: 0,
      feeCount: 0,
    }
  );

  const netCashFlow =
    stats.totalSells +
    stats.totalDividends -
    stats.totalBuys -
    stats.totalFees -
    stats.allFees;

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Purchases */}
        <StatCard
          icon={ShoppingCart}
          label="Total Purchases"
          value={formatCurrency(stats.totalBuys, currency)}
          subValue={`${stats.buyCount} ${
            stats.buyCount === 1 ? "transaction" : "transactions"
          }`}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />

        {/* Total Sales */}
        <StatCard
          icon={TrendingUp}
          label="Total Sales"
          value={formatCurrency(stats.totalSells, currency)}
          subValue={`${stats.sellCount} ${
            stats.sellCount === 1 ? "transaction" : "transactions"
          }`}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />

        {/* Total Dividends */}
        <StatCard
          icon={DollarSign}
          label="Total Dividends"
          value={formatCurrency(stats.totalDividends, currency)}
          subValue={`${stats.dividendCount} ${
            stats.dividendCount === 1 ? "payment" : "payments"
          }`}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />

        {/* Total Fees */}
        <StatCard
          icon={AlertCircle}
          label="Total Fees"
          value={formatCurrency(stats.allFees, currency)}
          subValue="All transaction fees"
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Net Cash Flow Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Net Cash Flow
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Total income minus expenses across all transactions
            </p>
            <p
              className={`text-4xl font-bold ${
                netCashFlow >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {netCashFlow >= 0 ? "+" : ""}
              {formatCurrency(netCashFlow, currency)}
            </p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Income</p>
              <p className="text-sm font-semibold text-green-600">
                +
                {formatCurrency(
                  stats.totalSells + stats.totalDividends,
                  currency
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Expenses</p>
              <p className="text-sm font-semibold text-red-600">
                -
                {formatCurrency(
                  stats.totalBuys + stats.totalFees + stats.allFees,
                  currency
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
              <p className="text-sm font-semibold text-gray-900">
                {transactions.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Avg Fee per Tx</p>
              <p className="text-sm font-semibold text-gray-900">
                {transactions.length > 0
                  ? formatCurrency(
                      stats.allFees / transactions.length,
                      currency
                    )
                  : formatCurrency(0, currency)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;
