import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================================
// AlertCard Component
// Card displaying an alert with status and actions
// ============================================================================
import { useState } from "react";
import { Bell, TrendingUp, TrendingDown, MoreVertical, Edit, Trash2, Power, Check, } from "lucide-react";
import { AlertCondition } from "../../../types";
import { formatCurrency, formatDate, formatRelativeTime, } from "../../../utils/formatters";
// ============================================================================
// ALERT CARD COMPONENT
// ============================================================================
export const AlertCard = ({ alert, currency = "EUR", onEdit, onDelete, onToggle, }) => {
    const [showMenu, setShowMenu] = useState(false);
    const isAbove = alert.condition === AlertCondition.Above;
    const isTriggered = alert.triggeredAt !== null;
    // Get status styles
    const getStatusStyles = () => {
        if (isTriggered) {
            return {
                bgColor: "bg-yellow-50",
                borderColor: "border-yellow-200",
                iconBgColor: "bg-yellow-100",
                iconColor: "text-yellow-600",
                statusColor: "text-yellow-700",
                statusBg: "bg-yellow-100",
                statusText: "Triggered",
            };
        }
        if (alert.isActive) {
            return {
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
                iconBgColor: "bg-green-100",
                iconColor: "text-green-600",
                statusColor: "text-green-700",
                statusBg: "bg-green-100",
                statusText: "Active",
            };
        }
        return {
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200",
            iconBgColor: "bg-gray-100",
            iconColor: "text-gray-600",
            statusColor: "text-gray-700",
            statusBg: "bg-gray-100",
            statusText: "Inactive",
        };
    };
    const styles = getStatusStyles();
    const ConditionIcon = isAbove ? TrendingUp : TrendingDown;
    return (_jsxs("div", { className: `rounded-lg border ${styles.borderColor} ${styles.bgColor} p-4 hover:shadow-md transition-all`, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-lg ${styles.iconBgColor} flex items-center justify-center`, children: _jsx(Bell, { className: `h-5 w-5 ${styles.iconColor}` }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-lg text-gray-900", children: alert.assetSymbol }), _jsxs("p", { className: "text-sm text-gray-600 flex items-center gap-1", children: [_jsx(ConditionIcon, { className: "h-3.5 w-3.5" }), alert.conditionName] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `px-2.5 py-1 text-xs font-semibold rounded-full ${styles.statusBg} ${styles.statusColor}`, children: styles.statusText }), (onEdit || onDelete || onToggle) && (_jsxs("div", { className: "relative", children: [_jsx("button", { onClick: () => setShowMenu(!showMenu), className: "p-1.5 hover:bg-white rounded transition-colors", "aria-label": "Alert actions", children: _jsx(MoreVertical, { className: "h-4 w-4 text-gray-500" }) }), showMenu && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-10", onClick: () => setShowMenu(false) }), _jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20", children: [onToggle && (_jsxs("button", { onClick: () => {
                                                            onToggle(alert);
                                                            setShowMenu(false);
                                                        }, className: "w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors", children: [_jsx(Power, { className: "h-4 w-4" }), alert.isActive ? "Deactivate" : "Activate"] })), onEdit && (_jsxs("button", { onClick: () => {
                                                            onEdit(alert);
                                                            setShowMenu(false);
                                                        }, className: "w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors", children: [_jsx(Edit, { className: "h-4 w-4" }), "Edit"] })), onDelete && (_jsxs("button", { onClick: () => {
                                                            onDelete(alert);
                                                            setShowMenu(false);
                                                        }, className: "w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg", children: [_jsx(Trash2, { className: "h-4 w-4" }), "Delete"] }))] })] }))] }))] })] }), _jsxs("div", { className: "mb-3 pb-3 border-b border-gray-200", children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Target Price" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(alert.targetPrice, currency) })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("div", { className: "text-gray-600", children: isTriggered ? (_jsxs("div", { className: "flex items-center gap-1 text-yellow-700", children: [_jsx(Check, { className: "h-4 w-4" }), _jsxs("span", { children: ["Triggered ", formatRelativeTime(alert.triggeredAt)] })] })) : (_jsxs("span", { children: ["Created ", formatDate(alert.createdAt, "MMM dd, yyyy")] })) }), !isTriggered && (_jsxs("div", { className: `flex items-center gap-1 ${styles.statusColor}`, children: [_jsx("div", { className: `w-2 h-2 rounded-full ${alert.isActive ? "bg-green-500" : "bg-gray-400"}` }), _jsx("span", { className: "text-xs font-medium", children: alert.isActive ? "Monitoring" : "Paused" })] }))] })] }));
};
export default AlertCard;
