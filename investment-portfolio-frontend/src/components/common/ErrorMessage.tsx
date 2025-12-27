// ============================================================================
// ErrorMessage Component
// Reusable error message component with multiple variants
// ============================================================================

import type { HTMLAttributes, ReactNode } from "react";
import { AlertCircle, XCircle, AlertTriangle, X } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

type ErrorVariant = "error" | "warning" | "info";

interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  message: string | null;
  variant?: ErrorVariant;
  onClose?: () => void;
  showIcon?: boolean;
  fullWidth?: boolean;
  title?: string;
}

// ============================================================================
// STYLE MAPPINGS
// ============================================================================

const variantStyles: Record<
  ErrorVariant,
  {
    container: string;
    icon: string;
    iconComponent: ReactNode;
  }
> = {
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: "text-red-600",
    iconComponent: <XCircle className="h-5 w-5" />,
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: "text-yellow-600",
    iconComponent: <AlertTriangle className="h-5 w-5" />,
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "text-blue-600",
    iconComponent: <AlertCircle className="h-5 w-5" />,
  },
};

// ============================================================================
// ERROR MESSAGE COMPONENT
// ============================================================================

export const ErrorMessage = ({
  message,
  variant = "error",
  onClose,
  showIcon = true,
  fullWidth = true,
  title,
  className = "",
  ...props
}: ErrorMessageProps) => {
  if (!message) return null;

  const styles = variantStyles[variant];

  const containerClasses = [
    "flex items-start gap-3 p-4 rounded-lg border",
    styles.container,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses} role="alert" {...props}>
      {showIcon && (
        <div className={`shrink-0 ${styles.icon}`}>{styles.iconComponent}</div>
      )}

      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <p className="text-sm">{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity p-1 rounded hover:bg-black hover:bg-opacity-5"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

// ============================================================================
// INLINE ERROR (for forms)
// ============================================================================

interface InlineErrorProps {
  message?: string | null;
}

export const InlineError = ({ message }: InlineErrorProps) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 mt-1">
      <XCircle className="h-4 w-4 text-red-600 shrink-0" />
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
};

// ============================================================================
// PAGE ERROR (full page error state)
// ============================================================================

interface PageErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const PageError = ({
  title = "Something went wrong",
  message,
  onRetry,
  retryText = "Try again",
}: PageErrorProps) => {
  return (
    <div className="flex items-center justify-center min-h-100 p-8">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        <p className="text-gray-600 mb-6">{message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// EMPTY STATE (when no data)
// ============================================================================

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({
  title = "No data found",
  message,
  icon,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-75 p-8">
      <div className="text-center max-w-md">
        {icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            {icon}
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        <p className="text-gray-600 mb-6">{message}</p>

        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// TOAST NOTIFICATION (for temporary messages)
// ============================================================================

interface ToastProps {
  message: string;
  variant?: ErrorVariant;
  duration?: number;
  onClose: () => void;
}

export const Toast = ({ message, variant = "info", onClose }: ToastProps) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-sm flex items-start gap-3 p-4 rounded-lg border shadow-lg ${styles.container}`}
      role="alert"
    >
      <div className={`shrink-0 ${styles.icon}`}>{styles.iconComponent}</div>

      <p className="flex-1 text-sm font-medium">{message}</p>

      <button
        type="button"
        onClick={onClose}
        className="shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ErrorMessage;
