import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertCircle, XCircle, AlertTriangle, X } from "lucide-react";
// ============================================================================
// STYLE MAPPINGS
// ============================================================================
const variantStyles = {
    error: {
        container: "bg-red-50 border-red-200 text-red-800",
        icon: "text-red-600",
        iconComponent: _jsx(XCircle, { className: "h-5 w-5" }),
    },
    warning: {
        container: "bg-yellow-50 border-yellow-200 text-yellow-800",
        icon: "text-yellow-600",
        iconComponent: _jsx(AlertTriangle, { className: "h-5 w-5" }),
    },
    info: {
        container: "bg-blue-50 border-blue-200 text-blue-800",
        icon: "text-blue-600",
        iconComponent: _jsx(AlertCircle, { className: "h-5 w-5" }),
    },
};
// ============================================================================
// ERROR MESSAGE COMPONENT
// ============================================================================
export const ErrorMessage = ({ message, variant = "error", onClose, showIcon = true, fullWidth = true, title, className = "", ...props }) => {
    if (!message)
        return null;
    const styles = variantStyles[variant];
    const containerClasses = [
        "flex items-start gap-3 p-4 rounded-lg border",
        styles.container,
        fullWidth ? "w-full" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { className: containerClasses, role: "alert", ...props, children: [showIcon && (_jsx("div", { className: `shrink-0 ${styles.icon}`, children: styles.iconComponent })), _jsxs("div", { className: "flex-1 min-w-0", children: [title && _jsx("h4", { className: "font-semibold mb-1", children: title }), _jsx("p", { className: "text-sm", children: message })] }), onClose && (_jsx("button", { type: "button", onClick: onClose, className: "shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity p-1 rounded hover:bg-black hover:bg-opacity-5", "aria-label": "Close", children: _jsx(X, { className: "h-4 w-4" }) }))] }));
};
export const InlineError = ({ message }) => {
    if (!message)
        return null;
    return (_jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(XCircle, { className: "h-4 w-4 text-red-600 shrink-0" }), _jsx("p", { className: "text-sm text-red-600", children: message })] }));
};
export const PageError = ({ title = "Something went wrong", message, onRetry, retryText = "Try again", }) => {
    return (_jsx("div", { className: "flex items-center justify-center min-h-100 p-8", children: _jsxs("div", { className: "text-center max-w-md", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4", children: _jsx(XCircle, { className: "h-8 w-8 text-red-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: title }), _jsx("p", { className: "text-gray-600 mb-6", children: message }), onRetry && (_jsx("button", { onClick: onRetry, className: "inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors", children: retryText }))] }) }));
};
export const EmptyState = ({ title = "No data found", message, icon, action, }) => {
    return (_jsx("div", { className: "flex items-center justify-center min-h-75 p-8", children: _jsxs("div", { className: "text-center max-w-md", children: [icon && (_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4", children: icon })), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: title }), _jsx("p", { className: "text-gray-600 mb-6", children: message }), action && (_jsx("button", { onClick: action.onClick, className: "inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors", children: action.label }))] }) }));
};
export const Toast = ({ message, variant = "info", onClose }) => {
    const styles = variantStyles[variant];
    return (_jsxs("div", { className: `fixed bottom-4 right-4 z-50 max-w-sm flex items-start gap-3 p-4 rounded-lg border shadow-lg ${styles.container}`, role: "alert", children: [_jsx("div", { className: `shrink-0 ${styles.icon}`, children: styles.iconComponent }), _jsx("p", { className: "flex-1 text-sm font-medium", children: message }), _jsx("button", { type: "button", onClick: onClose, className: "shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity", "aria-label": "Close", children: _jsx(X, { className: "h-4 w-4" }) })] }));
};
export default ErrorMessage;
