import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================================
// STYLE MAPPINGS
// ============================================================================
const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border-transparent",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 border-transparent",
    danger: "bg-red-600 hover:bg-red-700 text-white border-transparent",
    success: "bg-green-600 hover:bg-green-700 text-white border-transparent",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 border-transparent",
    outline: "bg-transparent hover:bg-gray-50 text-blue-600 border-blue-600",
};
const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
};
const disabledStyles = "opacity-50 cursor-not-allowed";
// ============================================================================
// BUTTON COMPONENT
// ============================================================================
export const Button = ({ variant = "primary", size = "md", isLoading = false, fullWidth = false, leftIcon, rightIcon, children, disabled, className = "", type = "button", ...props }) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
    const widthStyles = fullWidth ? "w-full" : "";
    const buttonClasses = [
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        widthStyles,
        (disabled || isLoading) && disabledStyles,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsx("button", { type: type, className: buttonClasses, disabled: disabled || isLoading, ...props, children: isLoading ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), _jsx("span", { children: "Loading..." })] })) : (_jsxs(_Fragment, { children: [leftIcon && _jsx("span", { className: "mr-2", children: leftIcon }), children, rightIcon && _jsx("span", { className: "ml-2", children: rightIcon })] })) }));
};
export default Button;
