import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================================
// AssetCard Component
// Individual asset card with live price and performance metrics
// ============================================================================
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, MoreVertical, Edit, Trash2, RefreshCw, } from "lucide-react";
import { useSymbolPrice } from "../../../hooks/useMarketData";
import { formatCurrency, formatPercentage, formatAssetType, } from "../../../utils/formatters";
// ============================================================================
// ASSET CARD COMPONENT
// ============================================================================
export const AssetCard = ({ asset, currency = "EUR", onEdit, onDelete, showLivePrice = true, }) => {
    const [showMenu, setShowMenu] = useState(false);
    // Get live price if enabled
    const { price, isLoading: isPriceLoading, refreshPrice, } = useSymbolPrice(asset.symbol, showLivePrice, 30000 // Poll every 30 seconds
    );
    const currentValue = price
        ? price.currentPrice * asset.quantity
        : asset.currentValue;
    const gainLoss = currentValue - asset.quantity * asset.avgPurchasePrice;
    const gainLossPercent = (gainLoss / (asset.quantity * asset.avgPurchasePrice)) * 100;
    const isPositive = gainLoss >= 0;
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200", children: [_jsx("div", { className: "p-4 border-b border-gray-200", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "font-bold text-lg text-gray-900", children: asset.symbol }), _jsx("span", { className: "text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded", children: formatAssetType(asset.assetType) })] }), _jsxs("p", { className: "text-sm text-gray-500", children: [asset.quantity, " ", asset.quantity === 1 ? "share" : "shares"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [showLivePrice && (_jsx("button", { onClick: refreshPrice, disabled: isPriceLoading, className: "p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50", "aria-label": "Refresh price", children: _jsx(RefreshCw, { className: `h-4 w-4 text-gray-500 ${isPriceLoading ? "animate-spin" : ""}` }) })), (onEdit || onDelete) && (_jsxs("div", { className: "relative", children: [_jsx("button", { onClick: () => setShowMenu(!showMenu), className: "p-1.5 hover:bg-gray-100 rounded transition-colors", "aria-label": "Asset actions", children: _jsx(MoreVertical, { className: "h-4 w-4 text-gray-500" }) }), showMenu && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-10", onClick: () => setShowMenu(false) }), _jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20", children: [onEdit && (_jsxs("button", { onClick: () => {
                                                                onEdit(asset);
                                                                setShowMenu(false);
                                                            }, className: "w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors", children: [_jsx(Edit, { className: "h-4 w-4" }), "Edit"] })), onDelete && (_jsxs("button", { onClick: () => {
                                                                onDelete(asset);
                                                                setShowMenu(false);
                                                            }, className: "w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors", children: [_jsx(Trash2, { className: "h-4 w-4" }), "Delete"] }))] })] }))] }))] })] }) }), _jsxs("div", { className: "p-4 bg-gray-50", children: [_jsxs("div", { className: "flex items-baseline justify-between mb-2", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Current Value" }), showLivePrice && price && (_jsx("span", { className: "text-xs text-gray-500", children: "Live" }))] }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(currentValue, currency) }), price && (_jsxs("p", { className: "text-sm text-gray-600 mt-1", children: ["@ ", formatCurrency(price.currentPrice, currency), " per share"] }))] }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Avg. Purchase" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: formatCurrency(asset.avgPurchasePrice, currency) })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Gain/Loss" }), _jsxs("div", { className: "flex items-center justify-end gap-1", children: [isPositive ? (_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" })) : (_jsx(TrendingDown, { className: "h-4 w-4 text-red-600" })), _jsx("p", { className: `text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`, children: formatCurrency(Math.abs(gainLoss), currency) })] }), _jsx("p", { className: `text-xs ${isPositive ? "text-green-600" : "text-red-600"}`, children: formatPercentage(gainLossPercent) })] })] }), showLivePrice && price && (_jsx("div", { className: "mt-3 pt-3 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "text-gray-500", children: "24h Change" }), _jsx("span", { className: price.changePercent24h >= 0
                                        ? "text-green-600"
                                        : "text-red-600", children: formatPercentage(price.changePercent24h) })] }) }))] })] }));
};
export default AssetCard;
