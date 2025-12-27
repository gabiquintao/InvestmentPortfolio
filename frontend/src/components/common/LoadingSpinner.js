import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// STYLE MAPPINGS
// ============================================================================
const sizeStyles = {
    xs: "h-4 w-4 border-2",
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
    xl: "h-16 w-16 border-4",
};
const variantStyles = {
    primary: "border-blue-600",
    secondary: "border-gray-600",
    white: "border-white",
};
// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================
export const LoadingSpinner = ({ size = "md", variant = "primary", fullScreen = false, text, className = "", ...props }) => {
    const spinnerClasses = [
        "inline-block animate-spin rounded-full border-solid border-t-transparent",
        sizeStyles[size],
        variantStyles[variant],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    const spinner = (_jsxs("div", { className: "flex flex-col items-center justify-center gap-3", ...props, children: [_jsx("div", { className: spinnerClasses, role: "status", "aria-label": "Loading", children: _jsx("span", { className: "sr-only", children: "Loading..." }) }), text && _jsx("p", { className: "text-sm text-gray-600 font-medium", children: text })] }));
    if (fullScreen) {
        return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90", children: spinner }));
    }
    return spinner;
};
export const InlineSpinner = ({ size = "sm", variant = "primary", }) => {
    const spinnerClasses = [
        "inline-block animate-spin rounded-full border-solid border-t-transparent",
        sizeStyles[size],
        variantStyles[variant],
    ].join(" ");
    return (_jsx("div", { className: spinnerClasses, role: "status", "aria-label": "Loading", children: _jsx("span", { className: "sr-only", children: "Loading..." }) }));
};
export const PageLoader = ({ text = "Loading...", overlay = false, }) => {
    const content = (_jsxs("div", { className: "flex flex-col items-center justify-center gap-4 p-8", children: [_jsx("div", { className: "inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent" }), _jsx("p", { className: "text-base text-gray-700 font-medium", children: text })] }));
    if (overlay) {
        return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30", children: _jsx("div", { className: "bg-white rounded-lg shadow-xl p-8", children: content }) }));
    }
    return (_jsx("div", { className: "flex items-center justify-center min-h-100", children: content }));
};
export const TableLoader = ({ rows = 5, columns = 4 }) => {
    return (_jsx("div", { className: "space-y-3 animate-pulse", children: Array.from({ length: rows }).map((_, rowIndex) => (_jsx("div", { className: "flex gap-4", children: Array.from({ length: columns }).map((_, colIndex) => (_jsx("div", { className: "h-8 bg-gray-200 rounded flex-1" }, colIndex))) }, rowIndex))) }));
};
// ============================================================================
// CARD LOADER (skeleton for cards)
// ============================================================================
export const CardLoader = () => {
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse", children: [_jsx("div", { className: "h-6 bg-gray-200 rounded w-3/4 mb-4" }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-full" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-5/6" }), _jsx("div", { className: "h-4 bg-gray-200 rounded w-4/6" })] })] }));
};
export default LoadingSpinner;
