import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// AlertsWidget Component
// Widget showing active alerts summary (for dashboard/sidebar)
// ============================================================================
import { Bell, TrendingUp, TrendingDown, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AlertCondition } from "../../../types";
import { formatCurrency } from "../../../utils/formatters";
import { AlertStatusDot } from "./AlertBadge";
// ============================================================================
// ALERTS WIDGET COMPONENT
// ============================================================================
export const AlertsWidget = ({ alerts, currency = "EUR", onCreateNew, maxItems = 5, }) => {
    // Filter active and triggered alerts
    const activeAlerts = alerts.filter((a) => a.isActive && !a.triggeredAt);
    const triggeredAlerts = alerts.filter((a) => a.triggeredAt !== null);
    // Show most relevant alerts (triggered first, then active)
    const displayAlerts = [
        ...triggeredAlerts,
        ...activeAlerts.slice(0, maxItems - triggeredAlerts.length),
    ].slice(0, maxItems);
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Bell, { className: "h-5 w-5 text-gray-600" }), _jsx("h3", { className: "font-semibold text-gray-900", children: "Price Alerts" }), triggeredAlerts.length > 0 && (_jsx("span", { className: "px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full", children: triggeredAlerts.length }))] }), _jsxs(Link, { to: "/alerts", className: "text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1", children: ["View all", _jsx(ArrowRight, { className: "h-4 w-4" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [_jsxs("div", { className: "p-3 bg-green-50 rounded-lg border border-green-200", children: [_jsx("p", { className: "text-xs text-green-700 mb-1", children: "Active" }), _jsx("p", { className: "text-xl font-bold text-green-700", children: activeAlerts.length })] }), _jsxs("div", { className: "p-3 bg-yellow-50 rounded-lg border border-yellow-200", children: [_jsx("p", { className: "text-xs text-yellow-700 mb-1", children: "Triggered" }), _jsx("p", { className: "text-xl font-bold text-yellow-700", children: triggeredAlerts.length })] })] }), displayAlerts.length > 0 ? (_jsx("div", { className: "space-y-2", children: displayAlerts.map((alert) => {
                    const isAbove = alert.condition === AlertCondition.Above;
                    const ConditionIcon = isAbove ? TrendingUp : TrendingDown;
                    return (_jsxs(Link, { to: `/alerts`, className: "flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [_jsx(ConditionIcon, { className: `h-4 w-4 shrink-0 ${isAbove ? "text-green-600" : "text-red-600"}` }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-semibold text-gray-900 text-sm truncate", children: alert.assetSymbol }), _jsx("p", { className: "text-xs text-gray-600", children: formatCurrency(alert.targetPrice, currency) })] })] }), _jsx(AlertStatusDot, { alert: alert })] }, alert.alertId));
                }) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(Bell, { className: "h-8 w-8 mx-auto mb-2 text-gray-400" }), _jsx("p", { className: "text-sm text-gray-500 mb-3", children: "No active alerts" }), onCreateNew && (_jsxs("button", { onClick: onCreateNew, className: "inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium", children: [_jsx(Plus, { className: "h-4 w-4" }), "Create Alert"] }))] })), displayAlerts.length > 0 && onCreateNew && (_jsxs("button", { onClick: onCreateNew, className: "w-full mt-4 py-2 px-4 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-medium rounded-lg transition-colors flex items-center justify-center gap-2", children: [_jsx(Plus, { className: "h-4 w-4" }), "Create New Alert"] }))] }));
};
export const CompactAlertsWidget = ({ activeCount, triggeredCount, }) => {
    return (_jsxs(Link, { to: "/alerts", className: "flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Bell, { className: "h-5 w-5 text-gray-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Alerts" }), _jsxs("p", { className: "text-xs text-gray-600", children: [activeCount, " active"] })] })] }), triggeredCount > 0 && (_jsx("span", { className: "flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full", children: triggeredCount }))] }));
};
export default AlertsWidget;
