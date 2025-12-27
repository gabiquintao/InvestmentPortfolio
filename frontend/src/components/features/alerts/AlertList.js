import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// AlertList Component
// Grid/list display of alerts with filtering
// ============================================================================
import { useState, useMemo } from "react";
import { Plus, Bell, Filter } from "lucide-react";
import { AlertCondition } from "../../../types";
import AlertCard from "./AlertCard";
import { Button } from "../../common/Button";
import { EmptyState } from "../../common/ErrorMessage";
// ============================================================================
// ALERT LIST COMPONENT
// ============================================================================
export const AlertList = ({ alerts, currency = "EUR", onCreateNew, onEdit, onDelete, onToggle, }) => {
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterCondition, setFilterCondition] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    // Filter alerts
    const filteredAlerts = useMemo(() => {
        let filtered = alerts;
        // Filter by status
        switch (filterStatus) {
            case "active":
                filtered = filtered.filter((a) => a.isActive && !a.triggeredAt);
                break;
            case "inactive":
                filtered = filtered.filter((a) => !a.isActive);
                break;
            case "triggered":
                filtered = filtered.filter((a) => a.triggeredAt !== null);
                break;
        }
        // Filter by condition
        if (filterCondition !== "all") {
            filtered = filtered.filter((a) => a.condition === filterCondition);
        }
        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter((a) => a.assetSymbol.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return filtered;
    }, [alerts, filterStatus, filterCondition, searchQuery]);
    // Calculate statistics
    const stats = useMemo(() => {
        return {
            total: alerts.length,
            active: alerts.filter((a) => a.isActive && !a.triggeredAt).length,
            inactive: alerts.filter((a) => !a.isActive).length,
            triggered: alerts.filter((a) => a.triggeredAt !== null).length,
        };
    }, [alerts]);
    // Empty state
    if (alerts.length === 0) {
        return (_jsx(EmptyState, { title: "No alerts yet", message: "Create your first price alert to get notified when an asset reaches your target price", icon: _jsx(Bell, { className: "h-8 w-8 text-gray-400" }), action: {
                label: "Create Alert",
                onClick: onCreateNew,
            } }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Price Alerts" }), _jsxs("p", { className: "text-gray-600 mt-1", children: [filteredAlerts.length, " of ", alerts.length, " alerts"] })] }), _jsx(Button, { variant: "primary", onClick: onCreateNew, leftIcon: _jsx(Plus, { className: "h-5 w-5" }), children: "Create Alert" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("button", { onClick: () => setFilterStatus("all"), className: `p-4 rounded-lg border-2 transition-all text-left ${filterStatus === "all"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"}`, children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Alerts" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.total })] }), _jsxs("button", { onClick: () => setFilterStatus("active"), className: `p-4 rounded-lg border-2 transition-all text-left ${filterStatus === "active"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"}`, children: [_jsx("p", { className: "text-sm text-gray-600", children: "Active" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: stats.active })] }), _jsxs("button", { onClick: () => setFilterStatus("inactive"), className: `p-4 rounded-lg border-2 transition-all text-left ${filterStatus === "inactive"
                            ? "border-gray-500 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"}`, children: [_jsx("p", { className: "text-sm text-gray-600", children: "Inactive" }), _jsx("p", { className: "text-2xl font-bold text-gray-600", children: stats.inactive })] }), _jsxs("button", { onClick: () => setFilterStatus("triggered"), className: `p-4 rounded-lg border-2 transition-all text-left ${filterStatus === "triggered"
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-gray-200 hover:border-gray-300"}`, children: [_jsx("p", { className: "text-sm text-gray-600", children: "Triggered" }), _jsx("p", { className: "text-2xl font-bold text-yellow-600", children: stats.triggered })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx("div", { className: "flex-1", children: _jsx("input", { type: "text", placeholder: "Search by asset symbol...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-4 w-4 text-gray-500" }), _jsxs("select", { value: filterCondition, onChange: (e) => setFilterCondition(e.target.value === "all"
                                    ? "all"
                                    : Number(e.target.value)), className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "all", children: "All Conditions" }), _jsx("option", { value: AlertCondition.Above, children: "Above Target" }), _jsx("option", { value: AlertCondition.Below, children: "Below Target" })] })] })] }), filteredAlerts.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredAlerts.map((alert) => (_jsx(AlertCard, { alert: alert, currency: currency, onEdit: onEdit, onDelete: onDelete, onToggle: onToggle }, alert.alertId))) })) : (_jsx(EmptyState, { title: "No alerts found", message: `No alerts match your current filters`, icon: _jsx(Bell, { className: "h-8 w-8 text-gray-400" }) }))] }));
};
export default AlertList;
