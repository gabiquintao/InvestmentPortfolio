import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// PortfolioSummaryCard Component
// Aggregated summary card for portfolio overview on dashboard
// ============================================================================
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, PieChart, ArrowRight } from "lucide-react";
import { formatCurrency, formatPercentage } from "../../../utils/formatters";
// ============================================================================
// PORTFOLIO SUMMARY CARD COMPONENT
// ============================================================================
export const PortfolioSummaryCard = ({ summary, currency = "EUR", }) => {
    const gainLossPercent = summary.totalValue > 0
        ? (summary.totalGainLoss / (summary.totalValue - summary.totalGainLoss)) *
            100
        : 0;
    const isPositive = summary.totalGainLoss >= 0;
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200", children: [_jsx("div", { className: "p-5 border-b border-gray-200", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(PieChart, { className: "h-6 w-6 text-blue-600" }) }), _jsxs("div", { children: [_jsx(Link, { to: `/portfolios/${summary.portfolioId}`, className: "font-semibold text-gray-900 hover:text-blue-600 transition-colors", children: summary.portfolioName }), _jsxs("p", { className: "text-sm text-gray-500", children: [summary.totalAssets, " assets"] })] })] }), _jsx(Link, { to: `/portfolios/${summary.portfolioId}`, className: "p-2 hover:bg-gray-100 rounded-lg transition-colors", "aria-label": "View portfolio details", children: _jsx(ArrowRight, { className: "h-5 w-5 text-gray-400" }) })] }) }), _jsxs("div", { className: "p-5 border-b border-gray-200 bg-gray-50", children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Total Portfolio Value" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: formatCurrency(summary.totalValue, currency) })] }), _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Total Gain/Loss" }), _jsxs("div", { className: "flex items-center gap-2", children: [isPositive ? (_jsx(TrendingUp, { className: "h-5 w-5 text-green-600" })) : (_jsx(TrendingDown, { className: "h-5 w-5 text-red-600" })), _jsx("p", { className: `text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`, children: formatCurrency(Math.abs(summary.totalGainLoss), currency) })] })] }), _jsx("div", { className: `px-3 py-1 rounded-full text-sm font-semibold ${isPositive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"}`, children: formatPercentage(gainLossPercent) })] }) }), summary.topHoldings && summary.topHoldings.length > 0 && (_jsxs("div", { className: "p-5 border-t border-gray-200 bg-gray-50", children: [_jsx("p", { className: "text-sm font-medium text-gray-700 mb-3", children: "Top Holdings" }), _jsx("div", { className: "space-y-2", children: summary.topHoldings.slice(0, 3).map((asset, index) => (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-gray-500 font-mono w-4", children: [index + 1, "."] }), _jsx("span", { className: "font-medium text-gray-900", children: asset.symbol }), _jsx("span", { className: "text-gray-500", children: asset.assetTypeName })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "font-medium text-gray-900", children: formatCurrency(asset.currentValue, currency) }), _jsxs("p", { className: `text-xs ${asset.gainLoss >= 0 ? "text-green-600" : "text-red-600"}`, children: [asset.gainLoss >= 0 ? "+" : "", formatCurrency(asset.gainLoss, currency)] })] })] }, asset.assetId))) })] }))] }));
};
export default PortfolioSummaryCard;
