// ============================================================================
// AlertBadge Component
// Small badge showing alert status
// ============================================================================

import { Check, Power, Bell } from "lucide-react";
import type { Alert } from "../../../types";

// ============================================================================
// TYPES
// ============================================================================

interface AlertBadgeProps {
  alert: Alert;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

// ============================================================================
// ALERT BADGE COMPONENT
// ============================================================================

export const AlertBadge = ({
  alert,
  size = "md",
  showIcon = true,
}: AlertBadgeProps) => {
  const isTriggered = alert.triggeredAt !== null;

  // Get status and styles
  const getStyles = () => {
    if (isTriggered) {
      return {
        icon: Check,
        text: "Triggered",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-200",
      };
    }
    if (alert.isActive) {
      return {
        icon: Bell,
        text: "Active",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-200",
      };
    }
    return {
      icon: Power,
      text: "Inactive",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      borderColor: "border-gray-200",
    };
  };

  const styles = getStyles();
  const Icon = styles.icon;

  // Size classes
  const sizeClasses = {
    sm: {
      container: "px-2 py-0.5 text-xs",
      icon: "h-3 w-3",
    },
    md: {
      container: "px-2.5 py-1 text-xs",
      icon: "h-3.5 w-3.5",
    },
    lg: {
      container: "px-3 py-1.5 text-sm",
      icon: "h-4 w-4",
    },
  };

  const classes = sizeClasses[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${classes.container} ${styles.bgColor} ${styles.textColor} ${styles.borderColor} border rounded-full font-semibold`}
    >
      {showIcon && <Icon className={classes.icon} />}
      {styles.text}
    </span>
  );
};

// ============================================================================
// ALERT STATUS DOT (Minimal indicator)
// ============================================================================

interface AlertStatusDotProps {
  alert: Alert;
  showLabel?: boolean;
}

export const AlertStatusDot = ({
  alert,
  showLabel = false,
}: AlertStatusDotProps) => {
  const isTriggered = alert.triggeredAt !== null;

  const getStyles = () => {
    if (isTriggered) {
      return {
        color: "bg-yellow-500",
        label: "Triggered",
        textColor: "text-yellow-700",
      };
    }
    if (alert.isActive) {
      return {
        color: "bg-green-500",
        label: "Active",
        textColor: "text-green-700",
      };
    }
    return {
      color: "bg-gray-400",
      label: "Inactive",
      textColor: "text-gray-600",
    };
  };

  const styles = getStyles();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${styles.color}`} />
      {showLabel && (
        <span className={`text-xs font-medium ${styles.textColor}`}>
          {styles.label}
        </span>
      )}
    </div>
  );
};

export default AlertBadge;
