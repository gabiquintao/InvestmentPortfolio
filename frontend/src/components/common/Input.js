import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// Input Component
// Reusable input component with label, error states, and various types
// ============================================================================
import { forwardRef } from "react";
// ============================================================================
// INPUT COMPONENT
// ============================================================================
export const Input = forwardRef(({ label, error, helperText, leftIcon, rightIcon, fullWidth = true, disabled, className = "", id, type = "text", ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const baseInputStyles = "px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed";
    const errorStyles = error
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300";
    const widthStyles = fullWidth ? "w-full" : "";
    const paddingStyles = leftIcon ? "pl-10" : rightIcon ? "pr-10" : "";
    const inputClasses = [
        baseInputStyles,
        errorStyles,
        widthStyles,
        paddingStyles,
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("div", { className: fullWidth ? "w-full" : "", children: [label && (_jsx("label", { htmlFor: inputId, className: "block text-sm font-medium text-gray-700 mb-1", children: label })), _jsxs("div", { className: "relative", children: [leftIcon && (_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("span", { className: "text-gray-500", children: leftIcon }) })), _jsx("input", { ref: ref, id: inputId, type: type, className: inputClasses, disabled: disabled, "aria-invalid": !!error, "aria-describedby": error
                            ? `${inputId}-error`
                            : helperText
                                ? `${inputId}-helper`
                                : undefined, ...props }), rightIcon && (_jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: _jsx("span", { className: "text-gray-500", children: rightIcon }) }))] }), error && (_jsx("p", { id: `${inputId}-error`, className: "mt-1 text-sm text-red-600", children: error })), !error && helperText && (_jsx("p", { id: `${inputId}-helper`, className: "mt-1 text-sm text-gray-500", children: helperText }))] }));
});
Input.displayName = "Input";
export default Input;
