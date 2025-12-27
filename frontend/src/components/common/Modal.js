import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// Modal Component
// Reusable modal/dialog component with backdrop and animations
// ============================================================================
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
// ============================================================================
// STYLE MAPPINGS
// ============================================================================
const sizeStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
};
// ============================================================================
// MODAL COMPONENT
// ============================================================================
export const Modal = ({ isOpen, onClose, title, children, footer, size = "md", showCloseButton = true, closeOnBackdropClick = true, closeOnEscape = true, }) => {
    const modalRef = useRef(null);
    // Handle escape key press
    useEffect(() => {
        if (!closeOnEscape)
            return;
        const handleEscape = (event) => {
            if (event.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose, closeOnEscape]);
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);
    // Handle backdrop click
    const handleBackdropClick = (event) => {
        if (closeOnBackdropClick && event.target === event.currentTarget) {
            onClose();
        }
    };
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 overflow-y-auto", "aria-labelledby": "modal-title", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 transition-opacity", onClick: handleBackdropClick }), _jsx("div", { className: "flex min-h-full items-center justify-center p-4", children: _jsxs("div", { ref: modalRef, className: `relative w-full ${sizeStyles[size]} bg-white rounded-lg shadow-xl transform transition-all`, children: [(title || showCloseButton) && (_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [title && (_jsx("h3", { id: "modal-title", className: "text-lg font-semibold text-gray-900", children: title })), showCloseButton && (_jsx("button", { type: "button", onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100", "aria-label": "Close modal", children: _jsx(X, { className: "h-5 w-5" }) }))] })), _jsx("div", { className: "p-6 max-h-[calc(100vh-200px)] overflow-y-auto", children: children }), footer && (_jsx("div", { className: "flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg", children: footer }))] }) })] }));
};
export default Modal;
