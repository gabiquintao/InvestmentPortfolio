import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================================
// PortfolioCard Component
// Visual card displaying portfolio summary information
// ============================================================================
import { Link } from "react-router-dom";
import { Briefcase, TrendingUp, TrendingDown, MoreVertical, Edit, Trash2, } from "lucide-react";
import { useState } from "react";
import { formatCurrency, formatDate, formatPercentage, } from "../../../utils/formatters";
// ============================================================================
// PORTFOLIO CARD COMPONENT
// ============================================================================
export const PortfolioCard = ({ portfolio, totalValue = 0, totalGainLoss = 0, totalAssets = 0, onEdit, onDelete, }) => {
    const [showMenu, setShowMenu] = useState(false);
    const gainLossPercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;
    const isPositive = totalGainLoss >= 0;
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200", children: [_jsx("div", { className: "p-4 border-b border-gray-200", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs(Link, { to: `/portfolios/${portfolio.portfolioId}`, className: "flex items-center gap-3 flex-1 min-w-0 group", children: [_jsx("div", { className: "shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors", children: _jsx(Briefcase, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors", children: portfolio.name }), _jsx("p", { className: "text-sm text-gray-500 truncate", children: portfolio.description || "No description" })] })] }), (onEdit || onDelete) && (_jsxs("div", { className: "relative shrink-0 ml-2", children: [_jsx("button", { onClick: () => setShowMenu(!showMenu), className: "p-1 hover:bg-gray-100 rounded transition-colors", "aria-label": "Portfolio actions", children: _jsx(MoreVertical, { className: "h-5 w-5 text-gray-500" }) }), showMenu && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-10", onClick: () => setShowMenu(false) }), _jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20", children: [onEdit && (_jsxs("button", { onClick: () => {
                                                        onEdit(portfolio);
                                                        setShowMenu(false);
                                                    }, className: "w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors", children: [_jsx(Edit, { className: "h-4 w-4" }), "Edit"] })), onDelete && (_jsxs("button", { onClick: () => {
                                                        onDelete(portfolio);
                                                        setShowMenu(false);
                                                    }, className: "w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors", children: [_jsx(Trash2, { className: "h-4 w-4" }), "Delete"] }))] })] }))] }))] }) }), _jsx("div", { className: "p-4", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Total Value" }), _jsx("p", { className: "text-lg font-bold text-gray-900", children: formatCurrency(totalValue, portfolio.currency) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Gain/Loss" }), _jsxs("div", { className: "flex items-center gap-1", children: [isPositive ? (_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" })) : (_jsx(TrendingDown, { className: "h-4 w-4 text-red-600" })), _jsx("p", { className: `text-lg font-bold ${isPositive ? "text-green-600" : "text-red-600"}`, children: formatCurrency(Math.abs(totalGainLoss), portfolio.currency) })] }), _jsx("p", { className: `text-xs ${isPositive ? "text-green-600" : "text-red-600"}`, children: formatPercentage(gainLossPercent) })] })] }) }), _jsx("div", { className: "px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg", children: _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("div", { className: "text-gray-600", children: [_jsx("span", { className: "font-medium text-gray-900", children: totalAssets }), " ", "assets"] }), _jsxs("div", { className: "text-gray-500", children: ["Created ", formatDate(portfolio.createdAt, "MMM dd, yyyy")] })] }) })] }));
};
export default PortfolioCard;
