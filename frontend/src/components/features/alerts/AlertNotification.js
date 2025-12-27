import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// AlertNotification Component
// Notification toast when an alert is triggered
// ============================================================================
import { useEffect } from "react";
import { Bell, X, TrendingUp, TrendingDown } from "lucide-react";
import { AlertCondition } from "../../../types";
import { formatCurrency } from "../../../utils/formatters";
// ============================================================================
// ALERT NOTIFICATION COMPONENT
// ============================================================================
export const AlertNotification = ({ alert, currentPrice, currency = "EUR", onClose, onViewDetails, autoClose = true, autoCloseDelay = 10000, }) => {
    const isAbove = alert.condition === AlertCondition.Above;
    const ConditionIcon = isAbove ? TrendingUp : TrendingDown;
    // Auto close after delay
    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);
            return () => clearTimeout(timer);
        }
    }, [autoClose, autoCloseDelay, onClose]);
    return (_jsx("div", { className: "fixed bottom-4 right-4 z-50 max-w-sm w-full animate-slide-in", children: _jsxs("div", { className: "bg-white rounded-lg shadow-2xl border-2 border-yellow-400 overflow-hidden", children: [_jsx("div", { className: "bg-yellow-50 px-4 py-3 border-b border-yellow-200", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center", children: _jsx(Bell, { className: "h-4 w-4 text-yellow-600 animate-pulse" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900", children: "Price Alert Triggered!" }), _jsx("p", { className: "text-xs text-gray-600", children: alert.assetSymbol })] })] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", "aria-label": "Close notification", children: _jsx(X, { className: "h-5 w-5" }) })] }) }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(ConditionIcon, { className: `h-5 w-5 ${isAbove ? "text-green-600" : "text-red-600"}` }), _jsxs("p", { className: "text-sm text-gray-700", children: ["Price went", " ", _jsx("span", { className: "font-semibold", children: alert.conditionName.toLowerCase() })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Target Price:" }), _jsx("span", { className: "font-semibold text-gray-900", children: formatCurrency(alert.targetPrice, currency) })] }), currentPrice && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Current Price:" }), _jsx("span", { className: `font-bold text-lg ${isAbove ? "text-green-600" : "text-red-600"}`, children: formatCurrency(currentPrice, currency) })] }))] }), onViewDetails && (_jsx("button", { onClick: onViewDetails, className: "mt-4 w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors", children: "View Details" }))] }), autoClose && (_jsx("div", { className: "h-1 bg-gray-200", children: _jsx("div", { className: "h-full bg-yellow-500 animate-progress", style: {
                            animationDuration: `${autoCloseDelay}ms`,
                        } }) }))] }) }));
};
export const MiniAlertNotification = ({ alert, currency = "EUR", onClick, }) => {
    const isAbove = alert.condition === AlertCondition.Above;
    return (_jsxs("button", { onClick: onClick, className: "w-full flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors text-left", children: [_jsx("div", { className: "shrink-0 w-2 h-2 mt-2 rounded-full bg-yellow-500" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("p", { className: "font-semibold text-gray-900", children: alert.assetSymbol }), _jsx("span", { className: "text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full font-medium", children: "Triggered" })] }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Price ", isAbove ? "above" : "below", " ", formatCurrency(alert.targetPrice, currency)] })] })] }));
};
export default AlertNotification;
