import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================================
// AssetRow Component
// Single table row for displaying an asset
// ============================================================================
import { useState } from "react";
import { TrendingUp, TrendingDown, Edit, Trash2, MoreVertical, } from "lucide-react";
import { useSymbolPrice } from "../../../hooks/useMarketData";
import { formatCurrency, formatAssetType } from "../../../utils/formatters";
// ============================================================================
// ASSET ROW COMPONENT
// ============================================================================
export const AssetRow = ({ asset, currency = "EUR", onEdit, onDelete, showLivePrice = true, }) => {
    const [showMenu, setShowMenu] = useState(false);
    // Get live price if enabled
    const { price } = useSymbolPrice(asset.symbol, showLivePrice, 60000); // Poll every 60s
    const currentValue = price
        ? price.currentPrice * asset.quantity
        : asset.currentValue;
    const gainLoss = currentValue - asset.quantity * asset.avgPurchasePrice;
    const gainLossPercent = (gainLoss / (asset.quantity * asset.avgPurchasePrice)) * 100;
    const isPositive = gainLoss >= 0;
    return (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-4 py-4", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-semibold text-gray-900", children: asset.symbol }), showLivePrice && price && (_jsx("span", { className: "text-xs text-gray-500", children: "Live" }))] }) }), _jsx("td", { className: "px-4 py-4", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: formatAssetType(asset.assetType) }) }), _jsx("td", { className: "px-4 py-4 text-right", children: _jsx("span", { className: "text-sm text-gray-900 font-medium", children: asset.quantity.toLocaleString() }) }), _jsx("td", { className: "px-4 py-4 text-right", children: _jsx("span", { className: "text-sm text-gray-900", children: formatCurrency(asset.avgPurchasePrice, currency) }) }), _jsx("td", { className: "px-4 py-4 text-right", children: _jsxs("div", { className: "flex flex-col items-end", children: [_jsx("span", { className: "text-sm font-semibold text-gray-900", children: formatCurrency(currentValue, currency) }), price && (_jsxs("span", { className: "text-xs text-gray-500", children: ["@ ", formatCurrency(price.currentPrice, currency)] }))] }) }), _jsx("td", { className: "px-4 py-4 text-right", children: _jsxs("div", { className: "flex flex-col items-end", children: [_jsxs("div", { className: "flex items-center gap-1", children: [isPositive ? (_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" })) : (_jsx(TrendingDown, { className: "h-4 w-4 text-red-600" })), _jsxs("span", { className: `text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`, children: [isPositive ? "+" : "", formatCurrency(gainLoss, currency)] })] }), _jsxs("span", { className: `text-xs ${isPositive ? "text-green-600" : "text-red-600"}`, children: [isPositive ? "+" : "", gainLossPercent.toFixed(2), "%"] })] }) }), _jsx("td", { className: "px-4 py-4 text-center", children: _jsxs("div", { className: "relative inline-block", children: [_jsx("button", { onClick: () => setShowMenu(!showMenu), className: "p-1.5 hover:bg-gray-100 rounded transition-colors", "aria-label": "Asset actions", children: _jsx(MoreVertical, { className: "h-5 w-5 text-gray-500" }) }), showMenu && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-10", onClick: () => setShowMenu(false) }), _jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20", children: [_jsxs("button", { onClick: () => {
                                                onEdit(asset);
                                                setShowMenu(false);
                                            }, className: "w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors", children: [_jsx(Edit, { className: "h-4 w-4" }), "Edit"] }), _jsxs("button", { onClick: () => {
                                                onDelete(asset);
                                                setShowMenu(false);
                                            }, className: "w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg", children: [_jsx(Trash2, { className: "h-4 w-4" }), "Delete"] })] })] }))] }) })] }));
};
export default AssetRow;
