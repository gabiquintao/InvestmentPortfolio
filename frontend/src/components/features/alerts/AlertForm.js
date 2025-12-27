import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================================
// AlertForm Component
// Form for creating and editing alerts
// ============================================================================
import { useState, useEffect } from "react";
import { AlertCondition, } from "../../../types";
import { Input } from "../../common/Input";
import { Button } from "../../common/Button";
import AssetSearchBar from "../assets/AssetSearchBar";
import { getSymbolError, getPriceError, hasErrors, } from "../../../utils/validators";
// ============================================================================
// ALERT FORM COMPONENT
// ============================================================================
export const AlertForm = ({ alert, onSubmit, onCancel, isLoading = false, }) => {
    const isEditMode = !!alert;
    const [formData, setFormData] = useState({
        assetSymbol: alert?.assetSymbol || "",
        condition: alert?.condition || AlertCondition.Above,
        targetPrice: alert?.targetPrice || 0,
        isActive: alert?.isActive ?? true,
    });
    const [formErrors, setFormErrors] = useState({});
    // Update form when alert changes (edit mode)
    useEffect(() => {
        if (alert) {
            setFormData({
                assetSymbol: alert.assetSymbol,
                condition: alert.condition,
                targetPrice: alert.targetPrice,
                isActive: alert.isActive,
            });
        }
    }, [alert]);
    // Handle input change
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox"
                ? e.target.checked
                : name === "condition"
                    ? Number(value)
                    : name === "targetPrice"
                        ? Number(value)
                        : value,
        }));
        // Clear field error on change
        if (formErrors[name]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    // Handle symbol selection from search bar
    const handleSymbolSelect = (symbol) => {
        setFormData((prev) => ({ ...prev, assetSymbol: symbol }));
        if (formErrors.assetSymbol) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.assetSymbol;
                return newErrors;
            });
        }
    };
    // Validate form
    const validateForm = () => {
        const errors = {};
        // Symbol
        const symbolError = getSymbolError(formData.assetSymbol);
        if (symbolError)
            errors.assetSymbol = symbolError;
        // Target Price
        const priceError = getPriceError(formData.targetPrice, "Target price");
        if (priceError)
            errors.targetPrice = priceError;
        setFormErrors(errors);
        return !hasErrors(errors);
    };
    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        if (isEditMode) {
            // Edit mode: only send targetPrice and isActive
            await onSubmit({
                targetPrice: formData.targetPrice,
                isActive: formData.isActive,
            });
        }
        else {
            // Create mode: send all fields
            await onSubmit({
                assetSymbol: formData.assetSymbol,
                condition: formData.condition,
                targetPrice: formData.targetPrice,
            });
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [!isEditMode ? (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Asset Symbol" }), _jsx(AssetSearchBar, { onSelect: handleSymbolSelect, disabled: isLoading, error: formErrors.assetSymbol, initialValue: formData.assetSymbol }), formErrors.assetSymbol && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: formErrors.assetSymbol })), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Search for the asset you want to monitor" })] })) : (_jsx(Input, { type: "text", name: "assetSymbol", label: "Asset Symbol", value: formData.assetSymbol, disabled: true, helperText: "Asset symbol cannot be changed after creation" })), !isEditMode && (_jsxs("div", { children: [_jsx("label", { htmlFor: "condition", className: "block text-sm font-medium text-gray-700 mb-1", children: "Alert Condition" }), _jsxs("select", { id: "condition", name: "condition", value: formData.condition, onChange: handleChange, disabled: isLoading, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed", children: [_jsx("option", { value: AlertCondition.Above, children: "Price Above Target" }), _jsx("option", { value: AlertCondition.Below, children: "Price Below Target" })] }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "You'll be notified when the price crosses this threshold" })] })), _jsx(Input, { type: "number", name: "targetPrice", label: "Target Price", placeholder: "0.00", value: formData.targetPrice || "", onChange: handleChange, error: formErrors.targetPrice, disabled: isLoading, step: "0.01", min: "0", required: true, helperText: isEditMode && alert
                    ? `Currently set to trigger when price is ${alert.conditionName.toLowerCase()}`
                    : undefined }), isEditMode && (_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "isActive", className: "font-medium text-gray-900", children: "Alert Status" }), _jsx("p", { className: "text-sm text-gray-600", children: formData.isActive
                                    ? "Currently monitoring price"
                                    : "Alert is paused" })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", id: "isActive", name: "isActive", checked: formData.isActive, onChange: handleChange, disabled: isLoading, className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })] })] })), _jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-lg", children: _jsx("p", { className: "text-sm text-blue-800", children: isEditMode ? (_jsx(_Fragment, { children: "You'll receive a notification when this alert is triggered." })) : (_jsxs(_Fragment, { children: ["You'll receive a notification when", " ", formData.assetSymbol || "this asset", " price goes", " ", formData.condition === AlertCondition.Above ? "above" : "below", " ", "\u20AC", formData.targetPrice.toFixed(2), "."] })) }) }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-gray-200", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: onCancel, disabled: isLoading, children: "Cancel" }), _jsx(Button, { type: "submit", variant: "primary", isLoading: isLoading, disabled: isLoading, children: isEditMode ? "Update Alert" : "Create Alert" })] })] }));
};
export default AlertForm;
