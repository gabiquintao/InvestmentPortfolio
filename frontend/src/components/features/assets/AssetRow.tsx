// ============================================================================
// AssetRow Component
// Single table row for displaying an asset
// ============================================================================

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import type { Asset } from "../../../types";
import { useSymbolPrice } from "../../../hooks/useMarketData";
import { formatCurrency, formatAssetType } from "../../../utils/formatters";

// ============================================================================
// TYPES
// ============================================================================

interface AssetRowProps {
  asset: Asset;
  currency?: string;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
  showLivePrice?: boolean;
}

// ============================================================================
// ASSET ROW COMPONENT
// ============================================================================

export const AssetRow = ({
  asset,
  currency = "EUR",
  onEdit,
  onDelete,
  showLivePrice = true,
}: AssetRowProps) => {
  const [showMenu, setShowMenu] = useState(false);

  // Get live price if enabled
  const { price } = useSymbolPrice(asset.symbol, showLivePrice, 60000); // Poll every 60s

  const currentValue = price
    ? price.currentPrice * asset.quantity
    : asset.currentValue;
  const gainLoss = currentValue - asset.quantity * asset.avgPurchasePrice;
  const gainLossPercent =
    (gainLoss / (asset.quantity * asset.avgPurchasePrice)) * 100;
  const isPositive = gainLoss >= 0;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Symbol */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{asset.symbol}</span>
          {showLivePrice && price && (
            <span className="text-xs text-gray-500">Live</span>
          )}
        </div>
      </td>

      {/* Type */}
      <td className="px-4 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {formatAssetType(asset.assetType)}
        </span>
      </td>

      {/* Quantity */}
      <td className="px-4 py-4 text-right">
        <span className="text-sm text-gray-900 font-medium">
          {asset.quantity.toLocaleString()}
        </span>
      </td>

      {/* Avg Price */}
      <td className="px-4 py-4 text-right">
        <span className="text-sm text-gray-900">
          {formatCurrency(asset.avgPurchasePrice, currency)}
        </span>
      </td>

      {/* Current Value */}
      <td className="px-4 py-4 text-right">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(currentValue, currency)}
          </span>
          {price && (
            <span className="text-xs text-gray-500">
              @ {formatCurrency(price.currentPrice, currency)}
            </span>
          )}
        </div>
      </td>

      {/* Gain/Loss */}
      <td className="px-4 py-4 text-right">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span
              className={`text-sm font-semibold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {formatCurrency(gainLoss, currency)}
            </span>
          </div>
          <span
            className={`text-xs ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {gainLossPercent.toFixed(2)}%
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-4 text-center">
        <div className="relative inline-block">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            aria-label="Asset actions"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
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
                <button
                  onClick={() => {
                    onDelete(asset);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default AssetRow;
