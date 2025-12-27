import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// AssetPerformanceCard Component
// Card displaying performance metrics with visual indicators
// ============================================================================
import { TrendingUp, TrendingDown, Award, AlertCircle } from "lucide-react";
import { formatCurrency, formatPercentage } from "../../../utils/formatters";
// ============================================================================
// ASSET PERFORMANCE CARD COMPONENT
// ============================================================================
export const AssetPerformanceCard = ({ title, assets, currency = "EUR", type, limit = 5, }) => {
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
        return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: `w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`, children: _jsx(Icon, { className: `h-5 w-5 ${iconColor}` }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: title })] }), _jsx("p", { className: "text-sm text-gray-500 text-center py-4", children: "No assets to display" })] }));
    }
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: `w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`, children: _jsx(Icon, { className: `h-5 w-5 ${iconColor}` }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: title })] }), _jsx("div", { className: "space-y-3", children: sortedAssets.map((asset, index) => {
                    const gainLossPercent = (asset.gainLoss / (asset.quantity * asset.avgPurchasePrice)) * 100;
                    const isPositive = asset.gainLoss >= 0;
                    return (_jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [_jsx("div", { className: "shrink-0", children: _jsx("div", { className: "w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center", children: _jsx("span", { className: "text-sm font-semibold text-gray-600", children: index + 1 }) }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-semibold text-gray-900 truncate", children: asset.symbol }), _jsxs("p", { className: "text-sm text-gray-500", children: [asset.quantity, " ", asset.quantity === 1 ? "share" : "shares"] })] })] }), _jsxs("div", { className: "text-right shrink-0", children: [_jsxs("div", { className: "flex items-center justify-end gap-1 mb-1", children: [isPositive ? (_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" })) : (_jsx(TrendingDown, { className: "h-4 w-4 text-red-600" })), _jsx("span", { className: `font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`, children: formatCurrency(Math.abs(asset.gainLoss), currency) })] }), _jsx("p", { className: `text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`, children: formatPercentage(gainLossPercent) })] })] }, asset.assetId));
                }) }), sortedAssets.length > 0 && (_jsx("div", { className: "mt-4 pt-4 border-t border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("span", { className: "text-gray-600", children: ["Showing ", sortedAssets.length, " of ", assets.length, " assets"] }), _jsxs("span", { className: "font-medium text-gray-900", children: ["Total:", " ", formatCurrency(sortedAssets.reduce((sum, asset) => sum + asset.gainLoss, 0), currency)] })] }) }))] }));
};
export const PerformanceComparison = ({ assets, currency = "EUR", }) => {
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(AssetPerformanceCard, { title: "Top Performers", assets: assets, currency: currency, type: "best", limit: 5 }), _jsx(AssetPerformanceCard, { title: "Worst Performers", assets: assets, currency: currency, type: "worst", limit: 5 })] }));
};
export default AssetPerformanceCard;
