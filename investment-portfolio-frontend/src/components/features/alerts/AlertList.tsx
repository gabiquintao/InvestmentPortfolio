// ============================================================================
// AlertList Component
// Grid/list display of alerts with filtering
// ============================================================================

import { useState, useMemo } from "react";
import { Plus, Bell, Filter } from "lucide-react";
import { type Alert, AlertCondition } from "../../../types";
import AlertCard from "./AlertCard";
import { Button } from "../../common/Button";
import { EmptyState } from "../../common/ErrorMessage";

// ============================================================================
// TYPES
// ============================================================================

interface AlertListProps {
  alerts: Alert[];
  currency?: string;
  onCreateNew: () => void;
  onEdit: (alert: Alert) => void;
  onDelete: (alert: Alert) => void;
  onToggle: (alert: Alert) => void;
}

type FilterStatus = "all" | "active" | "inactive" | "triggered";

// ============================================================================
// ALERT LIST COMPONENT
// ============================================================================

export const AlertList = ({
  alerts,
  currency = "EUR",
  onCreateNew,
  onEdit,
  onDelete,
  onToggle,
}: AlertListProps) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterCondition, setFilterCondition] = useState<
    AlertCondition | "all"
  >("all");
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
      filtered = filtered.filter((a) =>
        a.assetSymbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
    return (
      <EmptyState
        title="No alerts yet"
        message="Create your first price alert to get notified when an asset reaches your target price"
        icon={<Bell className="h-8 w-8 text-gray-400" />}
        action={{
          label: "Create Alert",
          onClick: onCreateNew,
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Price Alerts</h2>
          <p className="text-gray-600 mt-1">
            {filteredAlerts.length} of {alerts.length} alerts
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onCreateNew}
          leftIcon={<Plus className="h-5 w-5" />}
        >
          Create Alert
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setFilterStatus("all")}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            filterStatus === "all"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-sm text-gray-600">Total Alerts</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </button>

        <button
          onClick={() => setFilterStatus("active")}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            filterStatus === "active"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </button>

        <button
          onClick={() => setFilterStatus("inactive")}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            filterStatus === "inactive"
              ? "border-gray-500 bg-gray-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
        </button>

        <button
          onClick={() => setFilterStatus("triggered")}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            filterStatus === "triggered"
              ? "border-yellow-500 bg-yellow-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-sm text-gray-600">Triggered</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.triggered}
          </p>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by asset symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Condition Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filterCondition}
            onChange={(e) =>
              setFilterCondition(
                e.target.value === "all"
                  ? "all"
                  : (Number(e.target.value) as AlertCondition)
              )
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Conditions</option>
            <option value={AlertCondition.Above}>Above Target</option>
            <option value={AlertCondition.Below}>Below Target</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      {filteredAlerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.alertId}
              alert={alert}
              currency={currency}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No alerts found"
          message={`No alerts match your current filters`}
          icon={<Bell className="h-8 w-8 text-gray-400" />}
        />
      )}
    </div>
  );
};

export default AlertList;
