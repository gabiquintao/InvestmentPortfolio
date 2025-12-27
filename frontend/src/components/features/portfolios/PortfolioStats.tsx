// ============================================================================
// PortfolioStats Component
// Detailed statistics and metrics for a portfolio
// ============================================================================

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Activity,
} from "lucide-react";
import type { Portfolio } from "../../../types";
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
} from "../../../utils/formatters";

// ============================================================================
// TYPES
// ============================================================================

interface PortfolioStatsProps {
  portfolio: Portfolio;
  totalValue: number;
  totalGainLoss: number;
  totalAssets: number;
  totalInvested?: number;
  bestPerformer?: {
    symbol: string;
    gainLoss: number;
    gainLossPercent: number;
  };
  worstPerformer?: {
    symbol: string;
    gainLoss: number;
    gainLossPercent: number;
  };
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  iconColor?: string;
  iconBgColor?: string;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-100",
}: StatCardProps) => {
  const getTrendIcon = () => {
    if (trend === "up")
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down")
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subValue && (
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon()}
              <p
                className={`text-sm font-medium ${
                  trend === "up"
                    ? "text-green-600"
                    : trend === "down"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {subValue}
              </p>
            </div>
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
// PORTFOLIO STATS COMPONENT
// ============================================================================

export const PortfolioStats = ({
  portfolio,
  totalValue,
  totalGainLoss,
  totalAssets,
  totalInvested,
  bestPerformer,
  worstPerformer,
}: PortfolioStatsProps) => {
  const invested = totalInvested || totalValue - totalGainLoss;
  const gainLossPercent = invested > 0 ? (totalGainLoss / invested) * 100 : 0;
  const isPositive = totalGainLoss >= 0;

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value */}
        <StatCard
          icon={DollarSign}
          label="Total Portfolio Value"
          value={formatCurrency(totalValue, portfolio.currency)}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />

        {/* Total Invested */}
        <StatCard
          icon={Activity}
          label="Total Invested"
          value={formatCurrency(invested, portfolio.currency)}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />

        {/* Gain/Loss */}
        <StatCard
          icon={isPositive ? TrendingUp : TrendingDown}
          label="Total Gain/Loss"
          value={formatCurrency(Math.abs(totalGainLoss), portfolio.currency)}
          subValue={formatPercentage(gainLossPercent)}
          trend={isPositive ? "up" : "down"}
          iconColor={isPositive ? "text-green-600" : "text-red-600"}
          iconBgColor={isPositive ? "bg-green-100" : "bg-red-100"}
        />

        {/* Total Assets */}
        <StatCard
          icon={Package}
          label="Total Assets"
          value={formatNumber(totalAssets, 0)}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Performance Highlights */}
      {(bestPerformer || worstPerformer) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Performer */}
            {bestPerformer && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-gray-700">
                    Best Performer
                  </p>
                </div>
                <div className="pl-7">
                  <p className="font-semibold text-gray-900 text-lg">
                    {bestPerformer.symbol}
                  </p>
                  <p className="text-green-600 font-medium">
                    +
                    {formatCurrency(bestPerformer.gainLoss, portfolio.currency)}
                  </p>
                  <p className="text-sm text-green-600">
                    +{formatPercentage(bestPerformer.gainLossPercent)}
                  </p>
                </div>
              </div>
            )}

            {/* Worst Performer */}
            {worstPerformer && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <p className="text-sm font-medium text-gray-700">
                    Worst Performer
                  </p>
                </div>
                <div className="pl-7">
                  <p className="font-semibold text-gray-900 text-lg">
                    {worstPerformer.symbol}
                  </p>
                  <p className="text-red-600 font-medium">
                    {formatCurrency(
                      worstPerformer.gainLoss,
                      portfolio.currency
                    )}
                  </p>
                  <p className="text-sm text-red-600">
                    {formatPercentage(worstPerformer.gainLossPercent)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Portfolio Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Portfolio Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Portfolio Name</p>
            <p className="font-medium text-gray-900 mt-1">{portfolio.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Base Currency</p>
            <p className="font-medium text-gray-900 mt-1">
              {portfolio.currency}
            </p>
          </div>
          {portfolio.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-gray-900 mt-1">{portfolio.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioStats;
