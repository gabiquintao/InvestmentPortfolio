// ============================================================================
// AssetCard Component
// Individual asset card with live price and performance metrics
// ============================================================================

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";
import type { Asset } from "../../../types";
import { useSymbolPrice } from "../../../hooks/useMarketData";
import {
  formatCurrency,
  formatPercentage,
  formatAssetType,
} from "../../../utils/formatters";

// ============================================================================
// TYPES
// ============================================================================

interface AssetCardProps {
  asset: Asset;
  currency?: string;
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
  showLivePrice?: boolean;
}

// ============================================================================
// ASSET CARD COMPONENT
// ============================================================================

export const AssetCard = ({
  asset,
  currency = "EUR",
  onEdit,
  onDelete,
  showLivePrice = true,
}: AssetCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  // Get live price if enabled
  const {
    price,
    isLoading: isPriceLoading,
    refreshPrice,
  } = useSymbolPrice(
    asset.symbol,
    showLivePrice,
    30000 // Poll every 30 seconds
  );

  const currentValue = price
    ? price.currentPrice * asset.quantity
    : asset.currentValue;
  const gainLoss = currentValue - asset.quantity * asset.avgPurchasePrice;
  const gainLossPercent =
    (gainLoss / (asset.quantity * asset.avgPurchasePrice)) * 100;
  const isPositive = gainLoss >= 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-gray-900">
                {asset.symbol}
              </h3>
              <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                {formatAssetType(asset.assetType)}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {asset.quantity} {asset.quantity === 1 ? "share" : "shares"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh Price Button */}
            {showLivePrice && (
              <button
                onClick={refreshPrice}
                disabled={isPriceLoading}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                aria-label="Refresh price"
              >
                <RefreshCw
                  className={`h-4 w-4 text-gray-500 ${
                    isPriceLoading ? "animate-spin" : ""
                  }`}
                />
              </button>
            )}

            {/* Actions Menu */}
            {(onEdit || onDelete) && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Asset actions"
                >
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      {onEdit && (
                        <button
                          onClick={() => {
                            onEdit(asset);
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            onDelete(asset);
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body - Current Value */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-sm text-gray-600">Current Value</p>
          {showLivePrice && price && (
            <span className="text-xs text-gray-500">Live</span>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(currentValue, currency)}
        </p>
        {price && (
          <p className="text-sm text-gray-600 mt-1">
            @ {formatCurrency(price.currentPrice, currency)} per share
          </p>
        )}
      </div>

      {/* Card Footer - Performance */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Purchase Price */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Avg. Purchase</p>
            <p className="text-sm font-medium text-gray-900">
              {formatCurrency(asset.avgPurchasePrice, currency)}
            </p>
          </div>

          {/* Gain/Loss */}
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Gain/Loss</p>
            <div className="flex items-center justify-end gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <p
                className={`text-sm font-bold ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(Math.abs(gainLoss), currency)}
              </p>
            </div>
            <p
              className={`text-xs ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatPercentage(gainLossPercent)}
            </p>
          </div>
        </div>

        {/* 24h Change (if live price available) */}
        {showLivePrice && price && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">24h Change</span>
              <span
                className={
                  price.changePercent24h >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {formatPercentage(price.changePercent24h)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
