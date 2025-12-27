import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// PortfolioStats Component
// Detailed statistics and metrics for a portfolio
// ============================================================================
import { TrendingUp, TrendingDown, DollarSign, Package, Activity, } from "lucide-react";
import { formatCurrency, formatPercentage, formatNumber, } from "../../../utils/formatters";
const StatCard = ({ icon: Icon, label, value, subValue, trend, iconColor = "text-blue-600", iconBgColor = "bg-blue-100", }) => {
    const getTrendIcon = () => {
        if (trend === "up")
            return _jsx(TrendingUp, { className: "h-4 w-4 text-green-600" });
        if (trend === "down")
            return _jsx(TrendingDown, { className: "h-4 w-4 text-red-600" });
        return null;
    };
    return (_jsx("div", { className: "bg-white rounded-lg border border-gray-200 p-5", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: label }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: value }), subValue && (_jsxs("div", { className: "flex items-center gap-1 mt-1", children: [getTrendIcon(), _jsx("p", { className: `text-sm font-medium ${trend === "up"
                                        ? "text-green-600"
                                        : trend === "down"
                                            ? "text-red-600"
                                            : "text-gray-600"}`, children: subValue })] }))] }), _jsx("div", { className: `w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center shrink-0`, children: _jsx(Icon, { className: `h-6 w-6 ${iconColor}` }) })] }) }));
};
// ============================================================================
// PORTFOLIO STATS COMPONENT
// ============================================================================
export const PortfolioStats = ({ portfolio, totalValue, totalGainLoss, totalAssets, totalInvested, bestPerformer, worstPerformer, }) => {
    const invested = totalInvested || totalValue - totalGainLoss;
    const gainLossPercent = invested > 0 ? (totalGainLoss / invested) * 100 : 0;
    const isPositive = totalGainLoss >= 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(StatCard, { icon: DollarSign, label: "Total Portfolio Value", value: formatCurrency(totalValue, portfolio.currency), iconColor: "text-blue-600", iconBgColor: "bg-blue-100" }), _jsx(StatCard, { icon: Activity, label: "Total Invested", value: formatCurrency(invested, portfolio.currency), iconColor: "text-purple-600", iconBgColor: "bg-purple-100" }), _jsx(StatCard, { icon: isPositive ? TrendingUp : TrendingDown, label: "Total Gain/Loss", value: formatCurrency(Math.abs(totalGainLoss), portfolio.currency), subValue: formatPercentage(gainLossPercent), trend: isPositive ? "up" : "down", iconColor: isPositive ? "text-green-600" : "text-red-600", iconBgColor: isPositive ? "bg-green-100" : "bg-red-100" }), _jsx(StatCard, { icon: Package, label: "Total Assets", value: formatNumber(totalAssets, 0), iconColor: "text-orange-600", iconBgColor: "bg-orange-100" })] }), (bestPerformer || worstPerformer) && (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Performance Highlights" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [bestPerformer && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(TrendingUp, { className: "h-5 w-5 text-green-600" }), _jsx("p", { className: "text-sm font-medium text-gray-700", children: "Best Performer" })] }), _jsxs("div", { className: "pl-7", children: [_jsx("p", { className: "font-semibold text-gray-900 text-lg", children: bestPerformer.symbol }), _jsxs("p", { className: "text-green-600 font-medium", children: ["+", formatCurrency(bestPerformer.gainLoss, portfolio.currency)] }), _jsxs("p", { className: "text-sm text-green-600", children: ["+", formatPercentage(bestPerformer.gainLossPercent)] })] })] })), worstPerformer && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(TrendingDown, { className: "h-5 w-5 text-red-600" }), _jsx("p", { className: "text-sm font-medium text-gray-700", children: "Worst Performer" })] }), _jsxs("div", { className: "pl-7", children: [_jsx("p", { className: "font-semibold text-gray-900 text-lg", children: worstPerformer.symbol }), _jsx("p", { className: "text-red-600 font-medium", children: formatCurrency(worstPerformer.gainLoss, portfolio.currency) }), _jsx("p", { className: "text-sm text-red-600", children: formatPercentage(worstPerformer.gainLossPercent) })] })] }))] })] })), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Portfolio Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Portfolio Name" }), _jsx("p", { className: "font-medium text-gray-900 mt-1", children: portfolio.name })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Base Currency" }), _jsx("p", { className: "font-medium text-gray-900 mt-1", children: portfolio.currency })] }), portfolio.description && (_jsxs("div", { className: "md:col-span-2", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Description" }), _jsx("p", { className: "text-gray-900 mt-1", children: portfolio.description })] }))] })] })] }));
};
export default PortfolioStats;
