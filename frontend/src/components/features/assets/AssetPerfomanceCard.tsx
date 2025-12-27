// ============================================================================
// AssetPerformanceCard Component
// Card displaying performance metrics with visual indicators
// ============================================================================

import { TrendingUp, TrendingDown, Award, AlertCircle } from "lucide-react";
import type { Asset } from "../../../types";
import { formatCurrency, formatPercentage } from "../../../utils/formatters";

// ============================================================================
// TYPES
// ============================================================================

interface AssetPerformanceCardProps {
  title: string;
  assets: Asset[];
  currency?: string;
  type: "best" | "worst";
  limit?: number;
}

// ============================================================================
// ASSET PERFORMANCE CARD COMPONENT
// ============================================================================

export const AssetPerformanceCard = ({
  title,
  assets,
  currency = "EUR",
  type,
  limit = 5,
}: AssetPerformanceCardProps) => {
  // Sort assets by performance
  const sortedAssets = [...assets]
    .sort((a, b) => {
      const aPercent = (a.gainLoss / (a.quantity * a.avgPurchasePrice)) * 100;
      const bPercent = (b.gainLoss / (b.quantity * b.avgPurchasePrice)) * 100;
      return type === "best" ? bPercent - aPercent : aPercent - bPercent;
    })
    .slice(0, limit);

  const Icon = type === "best" ? Award : AlertCircle;
  const iconColor = type === "best" ? "text-green-600" : "text-red-600";
  const iconBgColor = type === "best" ? "bg-green-100" : "bg-red-100";

  if (sortedAssets.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-500 text-center py-4">
          No assets to display
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Assets List */}
      <div className="space-y-3">
        {sortedAssets.map((asset, index) => {
          const gainLossPercent =
            (asset.gainLoss / (asset.quantity * asset.avgPurchasePrice)) * 100;
          const isPositive = asset.gainLoss >= 0;

          return (
            <div
              key={asset.assetId}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Left side - Asset info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {asset.symbol}
                  </p>
                  <p className="text-sm text-gray-500">
                    {asset.quantity} {asset.quantity === 1 ? "share" : "shares"}
                  </p>
                </div>
              </div>

              {/* Right side - Performance */}
              <div className="text-right shrink-0">
                <div className="flex items-center justify-end gap-1 mb-1">
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`font-semibold ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(Math.abs(asset.gainLoss), currency)}
                  </span>
                </div>
                <p
                  className={`text-sm font-medium ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatPercentage(gainLossPercent)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      {sortedAssets.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing {sortedAssets.length} of {assets.length} assets
            </span>
            <span className="font-medium text-gray-900">
              Total:{" "}
              {formatCurrency(
                sortedAssets.reduce((sum, asset) => sum + asset.gainLoss, 0),
                currency
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// PERFORMANCE COMPARISON CARD (Side-by-side best and worst)
// ============================================================================

interface PerformanceComparisonProps {
  assets: Asset[];
  currency?: string;
}

export const PerformanceComparison = ({
  assets,
  currency = "EUR",
}: PerformanceComparisonProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AssetPerformanceCard
        title="Top Performers"
        assets={assets}
        currency={currency}
        type="best"
        limit={5}
      />
      <AssetPerformanceCard
        title="Worst Performers"
        assets={assets}
        currency={currency}
        type="worst"
        limit={5}
      />
    </div>
  );
};

export default AssetPerformanceCard;
