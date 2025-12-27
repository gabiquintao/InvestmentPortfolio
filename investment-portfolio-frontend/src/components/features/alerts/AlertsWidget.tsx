// ============================================================================
// AlertsWidget Component
// Widget showing active alerts summary (for dashboard/sidebar)
// ============================================================================

import { Bell, TrendingUp, TrendingDown, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { type Alert, AlertCondition } from "../../../types";
import { formatCurrency } from "../../../utils/formatters";
import { AlertStatusDot } from "./AlertBadge";

// ============================================================================
// TYPES
// ============================================================================

interface AlertsWidgetProps {
  alerts: Alert[];
  currency?: string;
  onCreateNew?: () => void;
  maxItems?: number;
}

// ============================================================================
// ALERTS WIDGET COMPONENT
// ============================================================================

export const AlertsWidget = ({
  alerts,
  currency = "EUR",
  onCreateNew,
  maxItems = 5,
}: AlertsWidgetProps) => {
  // Filter active and triggered alerts
  const activeAlerts = alerts.filter((a) => a.isActive && !a.triggeredAt);
  const triggeredAlerts = alerts.filter((a) => a.triggeredAt !== null);

  // Show most relevant alerts (triggered first, then active)
  const displayAlerts = [
    ...triggeredAlerts,
    ...activeAlerts.slice(0, maxItems - triggeredAlerts.length),
  ].slice(0, maxItems);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Price Alerts</h3>
          {triggeredAlerts.length > 0 && (
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
              {triggeredAlerts.length}
            </span>
          )}
        </div>
        <Link
          to="/alerts"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-700 mb-1">Active</p>
          <p className="text-xl font-bold text-green-700">
            {activeAlerts.length}
          </p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-700 mb-1">Triggered</p>
          <p className="text-xl font-bold text-yellow-700">
            {triggeredAlerts.length}
          </p>
        </div>
      </div>

      {/* Alerts List */}
      {displayAlerts.length > 0 ? (
        <div className="space-y-2">
          {displayAlerts.map((alert) => {
            const isAbove = alert.condition === AlertCondition.Above;
            const ConditionIcon = isAbove ? TrendingUp : TrendingDown;

            return (
              <Link
                key={alert.alertId}
                to={`/alerts`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <ConditionIcon
                    className={`h-4 w-4 shrink-0 ${
                      isAbove ? "text-green-600" : "text-red-600"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {alert.assetSymbol}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatCurrency(alert.targetPrice, currency)}
                    </p>
                  </div>
                </div>
                <AlertStatusDot alert={alert} />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 mb-3">No active alerts</p>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="h-4 w-4" />
              Create Alert
            </button>
          )}
        </div>
      )}

      {/* Create New Button */}
      {displayAlerts.length > 0 && onCreateNew && (
        <button
          onClick={onCreateNew}
          className="w-full mt-4 py-2 px-4 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Alert
        </button>
      )}
    </div>
  );
};

// ============================================================================
// COMPACT ALERTS WIDGET (for sidebar)
// ============================================================================

interface CompactAlertsWidgetProps {
  activeCount: number;
  triggeredCount: number;
}

export const CompactAlertsWidget = ({
  activeCount,
  triggeredCount,
}: CompactAlertsWidgetProps) => {
  return (
    <Link
      to="/alerts"
      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5 text-gray-600" />
        <div>
          <p className="text-sm font-medium text-gray-900">Alerts</p>
          <p className="text-xs text-gray-600">{activeCount} active</p>
        </div>
      </div>
      {triggeredCount > 0 && (
        <span className="flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
          {triggeredCount}
        </span>
      )}
    </Link>
  );
};

export default AlertsWidget;
