// ============================================================================
// AlertCard Component
// Card displaying an alert with status and actions
// ============================================================================

import { useState } from "react";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Edit,
  Trash2,
  Power,
  Check,
} from "lucide-react";
import { type Alert, AlertCondition } from "../../../types";
import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
} from "../../../utils/formatters";

// ============================================================================
// TYPES
// ============================================================================

interface AlertCardProps {
  alert: Alert;
  currency?: string;
  onEdit?: (alert: Alert) => void;
  onDelete?: (alert: Alert) => void;
  onToggle?: (alert: Alert) => void;
}

// ============================================================================
// ALERT CARD COMPONENT
// ============================================================================

export const AlertCard = ({
  alert,
  currency = "EUR",
  onEdit,
  onDelete,
  onToggle,
}: AlertCardProps) => {
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

  return (
    <div
      className={`rounded-lg border ${styles.borderColor} ${styles.bgColor} p-4 hover:shadow-md transition-all`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg ${styles.iconBgColor} flex items-center justify-center`}
          >
            <Bell className={`h-5 w-5 ${styles.iconColor}`} />
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900">
              {alert.assetSymbol}
            </h4>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <ConditionIcon className="h-3.5 w-3.5" />
              {alert.conditionName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles.statusBg} ${styles.statusColor}`}
          >
            {styles.statusText}
          </span>

          {/* Actions Menu */}
          {(onEdit || onDelete || onToggle) && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-white rounded transition-colors"
                aria-label="Alert actions"
              >
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    {onToggle && (
                      <button
                        onClick={() => {
                          onToggle(alert);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Power className="h-4 w-4" />
                        {alert.isActive ? "Deactivate" : "Activate"}
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(alert);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(alert);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Target Price */}
      <div className="mb-3 pb-3 border-b border-gray-200">
        <p className="text-xs text-gray-500 mb-1">Target Price</p>
        <p className="text-2xl font-bold text-gray-900">
          {formatCurrency(alert.targetPrice, currency)}
        </p>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          {isTriggered ? (
            <div className="flex items-center gap-1 text-yellow-700">
              <Check className="h-4 w-4" />
              <span>Triggered {formatRelativeTime(alert.triggeredAt!)}</span>
            </div>
          ) : (
            <span>Created {formatDate(alert.createdAt, "MMM dd, yyyy")}</span>
          )}
        </div>
        {!isTriggered && (
          <div className={`flex items-center gap-1 ${styles.statusColor}`}>
            <div
              className={`w-2 h-2 rounded-full ${
                alert.isActive ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-xs font-medium">
              {alert.isActive ? "Monitoring" : "Paused"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertCard;
