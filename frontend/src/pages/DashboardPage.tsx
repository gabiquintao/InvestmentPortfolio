// ============================================================================
// DashboardPage
// Main dashboard showing portfolio overview, alerts, and quick stats
// ============================================================================

import { useEffect } from "react";
import { usePortfolios } from "../hooks/usePortfolios";
import { useAlerts } from "../hooks/useAlerts";
import { useTransactions } from "../hooks/useTransactions";
import { Layout } from "../components/layout/Layout";
import {
  LoadingSpinner,
  PageLoader,
} from "../components/common/LoadingSpinner";
import { ErrorMessage, PageError } from "../components/common/ErrorMessage";
import PortfolioSummaryCard from "../components/features/portfolios/PortfolioSummaryCard";
import AlertsWidget from "../components/features/alerts/AlertsWidget";
import {
  TrendingUp,
  Briefcase,
  Bell,
  DollarSign,
  Activity,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  iconColor: string;
  iconBgColor: string;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  changePositive,
  iconColor,
  iconBgColor,
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {change && (
            <p
              className={`text-sm font-medium ${
                changePositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {changePositive ? "+" : ""}
              {change}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center shrink-0`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DASHBOARD PAGE COMPONENT
// ============================================================================

export const DashboardPage = () => {
  const {
    portfolios,
    summaries,
    isLoading: portfoliosLoading,
    error: portfoliosError,
    fetchPortfolios,
    fetchSummaries,
  } = usePortfolios(false);

  const {
    alerts,
    activeAlerts,
    isLoading: alertsLoading,
    fetchAlerts,
    fetchActiveAlerts,
  } = useAlerts(false);

  const {
    transactions,
    isLoading: transactionsLoading,
    fetchUserTransactions,
  } = useTransactions(undefined, false);

  // Fetch all data on mount
  useEffect(() => {
    fetchPortfolios();
    fetchSummaries();
    fetchAlerts();
    fetchActiveAlerts();
    fetchUserTransactions();
  }, [
    fetchPortfolios,
    fetchSummaries,
    fetchAlerts,
    fetchActiveAlerts,
    fetchUserTransactions,
  ]);

  // Calculate dashboard statistics
  const stats = {
    totalValue: summaries.reduce((sum, s) => sum + s.totalValue, 0),
    totalGainLoss: summaries.reduce((sum, s) => sum + s.totalGainLoss, 0),
    totalAssets: summaries.reduce((sum, s) => sum + s.totalAssets, 0),
    totalPortfolios: portfolios.length,
    activeAlerts: activeAlerts.length,
    recentTransactions: transactions.length,
  };

  const gainLossPercent =
    stats.totalValue > 0
      ? (stats.totalGainLoss / (stats.totalValue - stats.totalGainLoss)) * 100
      : 0;

  // Loading state
  if (portfoliosLoading && summaries.length === 0) {
    return (
      <Layout>
        <PageLoader text="Loading your dashboard..." />
      </Layout>
    );
  }

  // Error state
  if (portfoliosError) {
    return (
      <Layout>
        <PageError
          title="Failed to load dashboard"
          message={portfoliosError}
          onRetry={() => {
            fetchPortfolios();
            fetchSummaries();
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's an overview of your investment portfolio.
          </p>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={DollarSign}
            label="Total Portfolio Value"
            value={formatCurrency(stats.totalValue)}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />

          <StatCard
            icon={TrendingUp}
            label="Total Gain/Loss"
            value={formatCurrency(Math.abs(stats.totalGainLoss))}
            change={formatPercentage(gainLossPercent)}
            changePositive={stats.totalGainLoss >= 0}
            iconColor={
              stats.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
            }
            iconBgColor={
              stats.totalGainLoss >= 0 ? "bg-green-100" : "bg-red-100"
            }
          />

          <StatCard
            icon={Briefcase}
            label="Active Portfolios"
            value={stats.totalPortfolios.toString()}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
          />

          <StatCard
            icon={Bell}
            label="Active Alerts"
            value={stats.activeAlerts.toString()}
            iconColor="text-orange-600"
            iconBgColor="bg-orange-100"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio Summaries (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Summaries */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Your Portfolios
                </h2>
                {portfoliosLoading && <LoadingSpinner size="sm" />}
              </div>

              {summaries.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {summaries.map((summary) => (
                    <PortfolioSummaryCard
                      key={summary.portfolioId}
                      summary={summary}
                      currency="EUR"
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No portfolios yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first portfolio to start tracking your
                    investments
                  </p>
                  <a
                    href="/portfolios"
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Create Portfolio
                  </a>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.transactionId}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {tx.assetSymbol}
                      </p>
                      <p className="text-sm text-gray-600">{tx.typeName}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          tx.type === 1 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {tx.type === 1 ? "-" : "+"}
                        {formatCurrency(tx.totalAmount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.transactionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No recent transactions
                  </p>
                )}
              </div>
              {transactions.length > 5 && (
                <a
                  href="/transactions"
                  className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all transactions
                </a>
              )}
            </div>
          </div>

          {/* Right Column - Alerts Widget (1/3 width) */}
          <div className="lg:col-span-1">
            <AlertsWidget alerts={alerts} currency="EUR" maxItems={5} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
