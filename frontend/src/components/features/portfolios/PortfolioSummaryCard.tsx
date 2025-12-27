// ============================================================================
// PortfolioSummaryCard Component
// Aggregated summary card for portfolio overview on dashboard
// ============================================================================

import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, PieChart, ArrowRight } from "lucide-react";
import type { PortfolioSummary } from "../../../types";
import { formatCurrency, formatPercentage } from "../../../utils/formatters";

// ============================================================================
// TYPES
// ============================================================================

interface PortfolioSummaryCardProps {
  summary: PortfolioSummary;
  currency?: string;
}

// ============================================================================
// PORTFOLIO SUMMARY CARD COMPONENT
// ============================================================================

export const PortfolioSummaryCard = ({
  summary,
  currency = "EUR",
}: PortfolioSummaryCardProps) => {
  const gainLossPercent =
    summary.totalValue > 0
      ? (summary.totalGainLoss / (summary.totalValue - summary.totalGainLoss)) *
        100
      : 0;
  const isPositive = summary.totalGainLoss >= 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <PieChart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <Link
                to={`/portfolios/${summary.portfolioId}`}
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {summary.portfolioName}
              </Link>
              <p className="text-sm text-gray-500">
                {summary.totalAssets} assets
              </p>
            </div>
          </div>

          <Link
            to={`/portfolios/${summary.portfolioId}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="View portfolio details"
          >
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Total Value Section */}
      <div className="p-5 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600 mb-1">Total Portfolio Value</p>
        <p className="text-3xl font-bold text-gray-900">
          {formatCurrency(summary.totalValue, currency)}
        </p>
      </div>

      {/* Gain/Loss Section */}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Gain/Loss</p>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <p
                className={`text-2xl font-bold ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(Math.abs(summary.totalGainLoss), currency)}
              </p>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isPositive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {formatPercentage(gainLossPercent)}
          </div>
        </div>
      </div>

      {/* Top Holdings Section */}
      {summary.topHoldings && summary.topHoldings.length > 0 && (
        <div className="p-5 border-t border-gray-200 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-3">Top Holdings</p>
          <div className="space-y-2">
            {summary.topHoldings.slice(0, 3).map((asset, index) => (
              <div
                key={asset.assetId}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 font-mono w-4">
                    {index + 1}.
                  </span>
                  <span className="font-medium text-gray-900">
                    {asset.symbol}
                  </span>
                  <span className="text-gray-500">{asset.assetTypeName}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(asset.currentValue, currency)}
                  </p>
                  <p
                    className={`text-xs ${
                      asset.gainLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {asset.gainLoss >= 0 ? "+" : ""}
                    {formatCurrency(asset.gainLoss, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioSummaryCard;
