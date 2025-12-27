import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// AssetTable Component
// Table view of assets with sorting, filtering, and actions
// ============================================================================
import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { AssetType } from "../../../types";
import AssetRow from "./AssetRow";
import { Button } from "../../common/Button";
import { EmptyState } from "../../common/ErrorMessage";
// ============================================================================
// ASSET TABLE COMPONENT
// ============================================================================
export const AssetTable = ({ assets, currency = "EUR", onEdit, onDelete, onAddNew, showLivePrice = true, }) => {
    const [sortField, setSortField] = useState("currentValue");
    const [sortDirection, setSortDirection] = useState("desc");
    const [filterType, setFilterType] = useState("all");
    // Handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection((prev) => prev === "asc" ? "desc" : prev === "desc" ? null : "asc");
            if (sortDirection === "desc") {
                setSortField("currentValue");
                setSortDirection("desc");
            }
        }
        else {
            setSortField(field);
            setSortDirection("asc");
        }
    };
    // Get sort icon
    const getSortIcon = (field) => {
        if (sortField !== field) {
            return _jsx(ArrowUpDown, { className: "h-4 w-4 text-gray-400" });
        }
        if (sortDirection === "asc") {
            return _jsx(ArrowUp, { className: "h-4 w-4 text-blue-600" });
        }
        if (sortDirection === "desc") {
            return _jsx(ArrowDown, { className: "h-4 w-4 text-blue-600" });
        }
        return _jsx(ArrowUpDown, { className: "h-4 w-4 text-gray-400" });
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
                let aValue = 0;
                let bValue = 0;
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
                    ? aValue - bValue
                    : bValue - aValue;
            });
        }
        return filtered;
    }, [assets, sortField, sortDirection, filterType]);
    // Calculate totals
    const totals = useMemo(() => {
        return filteredAndSortedAssets.reduce((acc, asset) => ({
            currentValue: acc.currentValue + asset.currentValue,
            gainLoss: acc.gainLoss + asset.gainLoss,
        }), { currentValue: 0, gainLoss: 0 });
    }, [filteredAndSortedAssets]);
    // Empty state
    if (assets.length === 0) {
        return (_jsx(EmptyState, { title: "No assets yet", message: "Add your first asset to start tracking your portfolio", icon: _jsx(Plus, { className: "h-8 w-8 text-gray-400" }), action: onAddNew
                ? {
                    label: "Add Asset",
                    onClick: onAddNew,
                }
                : undefined }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Assets" }), _jsxs("p", { className: "text-sm text-gray-600", children: [filteredAndSortedAssets.length, " of ", assets.length, " assets"] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value === "all"
                                    ? "all"
                                    : Number(e.target.value)), className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm", children: [_jsx("option", { value: "all", children: "All Types" }), _jsx("option", { value: AssetType.Stock, children: "Stocks" }), _jsx("option", { value: AssetType.Crypto, children: "Crypto" })] }), onAddNew && (_jsx(Button, { variant: "primary", onClick: onAddNew, leftIcon: _jsx(Plus, { className: "h-5 w-5" }), children: "Add Asset" }))] })] }), _jsx("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left", children: _jsxs("button", { onClick: () => handleSort("symbol"), className: "flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors", children: ["Symbol", getSortIcon("symbol")] }) }), _jsx("th", { className: "px-4 py-3 text-left", children: _jsxs("button", { onClick: () => handleSort("type"), className: "flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors", children: ["Type", getSortIcon("type")] }) }), _jsx("th", { className: "px-4 py-3 text-right", children: _jsxs("button", { onClick: () => handleSort("quantity"), className: "flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors", children: ["Quantity", getSortIcon("quantity")] }) }), _jsx("th", { className: "px-4 py-3 text-right", children: _jsxs("button", { onClick: () => handleSort("avgPrice"), className: "flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors", children: ["Avg Price", getSortIcon("avgPrice")] }) }), _jsx("th", { className: "px-4 py-3 text-right", children: _jsxs("button", { onClick: () => handleSort("currentValue"), className: "flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors", children: ["Current Value", getSortIcon("currentValue")] }) }), _jsx("th", { className: "px-4 py-3 text-right", children: _jsxs("button", { onClick: () => handleSort("gainLoss"), className: "flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors", children: ["Gain/Loss", getSortIcon("gainLoss")] }) }), _jsx("th", { className: "px-4 py-3 text-center", children: _jsx("span", { className: "text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Actions" }) })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: filteredAndSortedAssets.map((asset) => (_jsx(AssetRow, { asset: asset, currency: currency, onEdit: onEdit, onDelete: onDelete, showLivePrice: showLivePrice }, asset.assetId))) }), _jsx("tfoot", { className: "bg-gray-50 border-t-2 border-gray-300", children: _jsxs("tr", { children: [_jsx("td", { colSpan: 4, className: "px-4 py-3 text-sm font-semibold text-gray-900", children: "Total" }), _jsxs("td", { className: "px-4 py-3 text-right text-sm font-bold text-gray-900", children: [currency, " ", totals.currentValue.toFixed(2)] }), _jsx("td", { className: "px-4 py-3 text-right text-sm font-bold", children: _jsxs("span", { className: totals.gainLoss >= 0 ? "text-green-600" : "text-red-600", children: [totals.gainLoss >= 0 ? "+" : "", currency, " ", totals.gainLoss.toFixed(2)] }) }), _jsx("td", {})] }) })] }) }) })] }));
};
export default AssetTable;
