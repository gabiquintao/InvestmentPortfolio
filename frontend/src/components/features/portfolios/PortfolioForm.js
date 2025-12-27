import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// PortfolioForm Component
// Form for creating and editing portfolios with validation
// ============================================================================
import { useState, useEffect } from "react";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import { validatePortfolioForm, hasErrors } from "../../../utils/validators";
// Common currencies
const CURRENCIES = [
    { code: "EUR", name: "Euro (€)", symbol: "€" },
    { code: "USD", name: "US Dollar ($)", symbol: "$" },
    { code: "GBP", name: "British Pound (£)", symbol: "£" },
    { code: "JPY", name: "Japanese Yen (¥)", symbol: "¥" },
    { code: "CHF", name: "Swiss Franc (CHF)", symbol: "CHF" },
];
// ============================================================================
// PORTFOLIO FORM COMPONENT
// ============================================================================
export const PortfolioForm = ({ portfolio, onSubmit, onCancel, isLoading = false, }) => {
    const isEditMode = !!portfolio;
    const [formData, setFormData] = useState({
        name: portfolio?.name || "",
        description: portfolio?.description || "",
        currency: portfolio?.currency || "EUR",
    });
    const [formErrors, setFormErrors] = useState({});
    // Update form when portfolio changes (edit mode)
    useEffect(() => {
        if (portfolio) {
            setFormData({
                name: portfolio.name,
                description: portfolio.description,
                currency: portfolio.currency,
            });
        }
    }, [portfolio]);
    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (formErrors[name]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate form
        const errors = validatePortfolioForm(formData);
        if (hasErrors(errors)) {
            setFormErrors(errors);
            return;
        }
        // Submit form
        await onSubmit(formData);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(Input, { type: "text", name: "name", label: "Portfolio Name", placeholder: "e.g., Tech Stocks, Crypto Portfolio", value: formData.name, onChange: handleChange, error: formErrors.name, disabled: isLoading, helperText: "Choose a descriptive name for your portfolio", required: true }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { id: "description", name: "description", rows: 3, value: formData.description, onChange: handleChange, disabled: isLoading, placeholder: "Add a description for this portfolio (optional)", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none" }), formErrors.description && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.description })), _jsxs("p", { className: "mt-1 text-sm text-gray-500", children: [formData.description.length, "/500 characters"] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "currency", className: "block text-sm font-medium text-gray-700 mb-1", children: "Base Currency" }), _jsx("select", { id: "currency", name: "currency", value: formData.currency, onChange: handleChange, disabled: isLoading, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed", children: CURRENCIES.map((curr) => (_jsx("option", { value: curr.code, children: curr.name }, curr.code))) }), formErrors.currency && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.currency })), _jsxs("p", { className: "mt-1 text-sm text-gray-500", children: ["All values will be displayed in ", formData.currency] })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-gray-200", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: onCancel, disabled: isLoading, children: "Cancel" }), _jsx(Button, { type: "submit", variant: "primary", isLoading: isLoading, disabled: isLoading, children: isEditMode ? "Update Portfolio" : "Create Portfolio" })] })] }));
};
export default PortfolioForm;
