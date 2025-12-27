// ============================================================================
// AlertNotification Component
// Notification toast when an alert is triggered
// ============================================================================

import { useEffect } from "react";
import { Bell, X, TrendingUp, TrendingDown } from "lucide-react";
import { type Alert, AlertCondition } from "../../../types";
import { formatCurrency } from "../../../utils/formatters";

// ============================================================================
// TYPES
// ============================================================================

interface AlertNotificationProps {
  alert: Alert;
  currentPrice?: number;
  currency?: string;
  onClose: () => void;
  onViewDetails?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

// ============================================================================
// ALERT NOTIFICATION COMPONENT
// ============================================================================

export const AlertNotification = ({
  alert,
  currentPrice,
  currency = "EUR",
  onClose,
  onViewDetails,
  autoClose = true,
  autoCloseDelay = 10000,
}: AlertNotificationProps) => {
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

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-slide-in">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-yellow-400 overflow-hidden">
        {/* Header */}
        <div className="bg-yellow-50 px-4 py-3 border-b border-yellow-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Bell className="h-4 w-4 text-yellow-600 animate-pulse" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Price Alert Triggered!
                </p>
                <p className="text-xs text-gray-600">{alert.assetSymbol}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <ConditionIcon
              className={`h-5 w-5 ${
                isAbove ? "text-green-600" : "text-red-600"
              }`}
            />
            <p className="text-sm text-gray-700">
              Price went{" "}
              <span className="font-semibold">
                {alert.conditionName.toLowerCase()}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Target Price:</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(alert.targetPrice, currency)}
              </span>
            </div>
            {currentPrice && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Price:</span>
                <span
                  className={`font-bold text-lg ${
                    isAbove ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(currentPrice, currency)}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="mt-4 w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
            >
              View Details
            </button>
          )}
        </div>

        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-yellow-500 animate-progress"
              style={{
                animationDuration: `${autoCloseDelay}ms`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MINI ALERT NOTIFICATION (for dropdown in header)
// ============================================================================

interface MiniAlertNotificationProps {
  alert: Alert;
  currency?: string;
  onClick?: () => void;
}

export const MiniAlertNotification = ({
  alert,
  currency = "EUR",
  onClick,
}: MiniAlertNotificationProps) => {
  const isAbove = alert.condition === AlertCondition.Above;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="shrink-0 w-2 h-2 mt-2 rounded-full bg-yellow-500" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-gray-900">{alert.assetSymbol}</p>
          <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full font-medium">
            Triggered
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Price {isAbove ? "above" : "below"}{" "}
          {formatCurrency(alert.targetPrice, currency)}
        </p>
      </div>
    </button>
  );
};

export default AlertNotification;
