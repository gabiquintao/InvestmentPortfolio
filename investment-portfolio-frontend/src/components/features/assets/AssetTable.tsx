// ============================================================================
// AssetTable Component
// Table view of assets with sorting, filtering, and actions
// ============================================================================

import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { type Asset, AssetType } from "../../../types";
import AssetRow from "./AssetRow";
import { Button } from "../../common/Button";
import { EmptyState } from "../../common/ErrorMessage";

// ============================================================================
// TYPES
// ============================================================================

interface AssetTableProps {
  assets: Asset[];
  currency?: string;
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
  onAddNew?: () => void;
  showLivePrice?: boolean;
}

type SortField =
  | "symbol"
  | "type"
  | "quantity"
  | "avgPrice"
  | "currentValue"
  | "gainLoss"
  | "gainLossPercent";
type SortDirection = "asc" | "desc" | null;

// ============================================================================
// ASSET TABLE COMPONENT
// ============================================================================

export const AssetTable = ({
  assets,
  currency = "EUR",
  onEdit,
  onDelete,
  onAddNew,
  showLivePrice = true,
}: AssetTableProps) => {
  const [sortField, setSortField] = useState<SortField>("currentValue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterType, setFilterType] = useState<AssetType | "all">("all");

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
      );
      if (sortDirection === "desc") {
        setSortField("currentValue");
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

  // Filter and sort assets
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((asset) => asset.assetType === filterType);
    }

    // Sort
    if (sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: number | string = 0;
        let bValue: number | string = 0;

        switch (sortField) {
          case "symbol":
            aValue = a.symbol;
            bValue = b.symbol;
            break;
          case "type":
            aValue = a.assetTypeName;
            bValue = b.assetTypeName;
            break;
          case "quantity":
            aValue = a.quantity;
            bValue = b.quantity;
            break;
          case "avgPrice":
            aValue = a.avgPurchasePrice;
            bValue = b.avgPurchasePrice;
            break;
          case "currentValue":
            aValue = a.currentValue;
            bValue = b.currentValue;
            break;
          case "gainLoss":
            aValue = a.gainLoss;
            bValue = b.gainLoss;
            break;
          case "gainLossPercent":
            aValue = (a.gainLoss / (a.quantity * a.avgPurchasePrice)) * 100;
            bValue = (b.gainLoss / (b.quantity * b.avgPurchasePrice)) * 100;
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
  }, [assets, sortField, sortDirection, filterType]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredAndSortedAssets.reduce(
      (acc, asset) => ({
        currentValue: acc.currentValue + asset.currentValue,
        gainLoss: acc.gainLoss + asset.gainLoss,
      }),
      { currentValue: 0, gainLoss: 0 }
    );
  }, [filteredAndSortedAssets]);

  // Empty state
  if (assets.length === 0) {
    return (
      <EmptyState
        title="No assets yet"
        message="Add your first asset to start tracking your portfolio"
        icon={<Plus className="h-8 w-8 text-gray-400" />}
        action={
          onAddNew
            ? {
                label: "Add Asset",
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
          <h3 className="text-lg font-semibold text-gray-900">Assets</h3>
          <p className="text-sm text-gray-600">
            {filteredAndSortedAssets.length} of {assets.length} assets
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter by Type */}
          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(
                e.target.value === "all"
                  ? "all"
                  : (Number(e.target.value) as AssetType)
              )
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Types</option>
            <option value={AssetType.Stock}>Stocks</option>
            <option value={AssetType.Crypto}>Crypto</option>
          </select>

          {onAddNew && (
            <Button
              variant="primary"
              onClick={onAddNew}
              leftIcon={<Plus className="h-5 w-5" />}
            >
              Add Asset
            </Button>
          )}
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
                    onClick={() => handleSort("symbol")}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                  >
                    Symbol
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
                    onClick={() => handleSort("avgPrice")}
                    className="flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                  >
                    Avg Price
                    {getSortIcon("avgPrice")}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort("currentValue")}
                    className="flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                  >
                    Current Value
                    {getSortIcon("currentValue")}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleSort("gainLoss")}
                    className="flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors"
                  >
                    Gain/Loss
                    {getSortIcon("gainLoss")}
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedAssets.map((asset) => (
                <AssetRow
                  key={asset.assetId}
                  asset={asset}
                  currency={currency}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  showLivePrice={showLivePrice}
                />
              ))}
            </tbody>
            {/* Footer with Totals */}
            <tfoot className="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-3 text-sm font-semibold text-gray-900"
                >
                  Total
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                  {currency} {totals.currentValue.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold">
                  <span
                    className={
                      totals.gainLoss >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {totals.gainLoss >= 0 ? "+" : ""}
                    {currency} {totals.gainLoss.toFixed(2)}
                  </span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetTable;
