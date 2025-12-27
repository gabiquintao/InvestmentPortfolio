import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// TransactionFilters Component
// Advanced filters for transaction filtering by date, type, and asset
// ============================================================================
import { useState } from 'react';
import { Filter, X, Calendar } from 'lucide-react';
import { TransactionType } from '../../../types';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { formatDateForInput } from '../../../utils/formatters';
// ============================================================================
// TRANSACTION FILTERS COMPONENT
// ============================================================================
export const TransactionFilters = ({ filters, onFiltersChange, assetSymbols = [], }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    // Handle filter change
    const handleChange = (field, value) => {
        onFiltersChange({
            ...filters,
            [field]: value,
        });
    };
    // Reset filters
    const handleReset = () => {
        onFiltersChange({
            type: 'all',
            assetSymbol: '',
            dateFrom: '',
            dateTo: '',
        });
    };
    // Check if any filters are active
    const hasActiveFilters = filters.type !== 'all' ||
        filters.assetSymbol !== '' ||
        filters.dateFrom !== '' ||
        filters.dateTo !== '';
    return (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-5 w-5 text-gray-500" }), _jsx("h3", { className: "font-semibold text-gray-900", children: "Filters" }), hasActiveFilters && (_jsx("span", { className: "px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full", children: "Active" }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [hasActiveFilters && (_jsx(Button, { variant: "ghost", size: "sm", onClick: handleReset, leftIcon: _jsx(X, { className: "h-4 w-4" }), children: "Clear" })), _jsx("button", { onClick: () => setIsExpanded(!isExpanded), className: "text-sm text-blue-600 hover:text-blue-700 font-medium", children: isExpanded ? 'Show less' : 'Show more' })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [_jsx("button", { onClick: () => handleChange('type', 'all'), className: `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filters.type === 'all'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`, children: "All" }), _jsx("button", { onClick: () => handleChange('type', TransactionType.Buy), className: `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filters.type === TransactionType.Buy
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`, children: "Buy" }), _jsx("button", { onClick: () => handleChange('type', TransactionType.Sell), className: `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${filters.type === TransactionType.Sell
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`, children: "Sell" })] }), isExpanded && (_jsxs("div", { className: "space-y-4 pt-4 border-t border-gray-200", children: [assetSymbols.length > 0 && (_jsxs("div", { children: [_jsx("label", { htmlFor: "assetSymbol", className: "block text-sm font-medium text-gray-700 mb-1", children: "Asset Symbol" }), _jsxs("select", { id: "assetSymbol", value: filters.assetSymbol, onChange: (e) => handleChange('assetSymbol', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "", children: "All Assets" }), assetSymbols.map(symbol => (_jsx("option", { value: symbol, children: symbol }, symbol)))] })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(Input, { type: "date", label: "From Date", value: filters.dateFrom, onChange: (e) => handleChange('dateFrom', e.target.value), max: filters.dateTo || formatDateForInput(new Date()), leftIcon: _jsx(Calendar, { className: "h-5 w-5" }) }), _jsx(Input, { type: "date", label: "To Date", value: filters.dateTo, onChange: (e) => handleChange('dateTo', e.target.value), min: filters.dateFrom, max: formatDateForInput(new Date()), leftIcon: _jsx(Calendar, { className: "h-5 w-5" }) })] })] }))] }));
};
export default TransactionFilters;
