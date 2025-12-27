import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const AssetForm = ({ asset, onSubmit, onCancel, isLoading = false, }) => {
    const [formData, setFormData] = useState({
        symbol: asset?.symbol || "",
        assetType: asset?.assetType || 1,
        quantity: asset?.quantity || 0,
        avgPurchasePrice: asset?.avgPurchasePrice || 0,
        purchaseDate: asset?.purchaseDate
            ? new Date(asset.purchaseDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
    });
    const [errors, setErrors] = useState({});
    // Update form when asset prop changes
    useEffect(() => {
        if (asset) {
            setFormData({
                symbol: asset.symbol,
                assetType: asset.assetType,
                quantity: asset.quantity,
                avgPurchasePrice: asset.avgPurchasePrice,
                purchaseDate: new Date(asset.purchaseDate).toISOString().split("T")[0],
            });
        }
    }, [asset]);
    const validateForm = () => {
        const newErrors = {};
        if (!formData.symbol.trim()) {
            newErrors.symbol = "Symbol is required";
        }
        if (formData.quantity <= 0) {
            newErrors.quantity = "Quantity must be greater than 0";
        }
        if (formData.avgPurchasePrice <= 0) {
            newErrors.avgPurchasePrice = "Price must be greater than 0";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }
        const submitData = {
            ...formData,
            quantity: Number(formData.quantity),
            avgPurchasePrice: Number(formData.avgPurchasePrice),
        };
        onSubmit(submitData);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !isLoading) {
            e.preventDefault();
            handleSubmit();
        }
    };
    return (_jsxs("div", { className: "space-y-4", onKeyPress: handleKeyPress, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "symbol", className: "block text-sm font-medium text-gray-700 mb-1", children: "Symbol *" }), _jsx("input", { type: "text", id: "symbol", name: "symbol", value: formData.symbol, onChange: handleChange, disabled: !!asset || isLoading, placeholder: "e.g., AAPL, BTC", className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.symbol ? "border-red-500" : "border-gray-300"} ${asset || isLoading ? "bg-gray-100 cursor-not-allowed" : ""}` }), errors.symbol && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.symbol })), asset && (_jsx("p", { className: "text-gray-500 text-xs mt-1", children: "Symbol cannot be changed" }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "assetType", className: "block text-sm font-medium text-gray-700 mb-1", children: "Asset Type *" }), _jsxs("select", { id: "assetType", name: "assetType", value: formData.assetType, onChange: handleChange, disabled: isLoading, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100", children: [_jsx("option", { value: 1, children: "Stock" }), _jsx("option", { value: 2, children: "Cryptocurrency" }), _jsx("option", { value: 3, children: "Bond" }), _jsx("option", { value: 4, children: "ETF" }), _jsx("option", { value: 5, children: "Mutual Fund" }), _jsx("option", { value: 6, children: "Commodity" }), _jsx("option", { value: 7, children: "Real Estate" }), _jsx("option", { value: 8, children: "Cash" }), _jsx("option", { value: 9, children: "Other" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "quantity", className: "block text-sm font-medium text-gray-700 mb-1", children: "Quantity *" }), _jsx("input", { type: "number", id: "quantity", name: "quantity", value: formData.quantity, onChange: handleChange, disabled: isLoading, step: "0.00000001", min: "0", placeholder: "0.00", className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${errors.quantity ? "border-red-500" : "border-gray-300"}` }), errors.quantity && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.quantity }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "avgPurchasePrice", className: "block text-sm font-medium text-gray-700 mb-1", children: "Average Purchase Price *" }), _jsx("input", { type: "number", id: "avgPurchasePrice", name: "avgPurchasePrice", value: formData.avgPurchasePrice, onChange: handleChange, disabled: isLoading, step: "0.01", min: "0", placeholder: "0.00", className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${errors.avgPurchasePrice ? "border-red-500" : "border-gray-300"}` }), errors.avgPurchasePrice && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.avgPurchasePrice }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "purchaseDate", className: "block text-sm font-medium text-gray-700 mb-1", children: "Purchase Date *" }), _jsx("input", { type: "date", id: "purchaseDate", name: "purchaseDate", value: formData.purchaseDate, onChange: handleChange, disabled: isLoading, max: new Date().toISOString().split("T")[0], className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t", children: [_jsx("button", { type: "button", onClick: onCancel, disabled: isLoading, className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Cancel" }), _jsx("button", { type: "button", onClick: handleSubmit, disabled: isLoading, className: "px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: isLoading ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), asset ? "Updating..." : "Creating..."] })) : asset ? ("Update Asset") : ("Create Asset") })] })] }));
};
export default AssetForm;
