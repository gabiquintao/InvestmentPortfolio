import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// TransactionRow Component
// Single table row for displaying a transaction
// ============================================================================
import { ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import { TransactionType } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';
// ============================================================================
// TRANSACTION ROW COMPONENT
// ============================================================================
export const TransactionRow = ({ transaction, currency = 'EUR', }) => {
    // Get type icon and color
    const getTypeStyles = () => {
        switch (transaction.type) {
            case TransactionType.Buy:
                return {
                    icon: ShoppingCart,
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    borderColor: 'border-blue-200',
                };
            case TransactionType.Sell:
                return {
                    icon: TrendingUp,
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    borderColor: 'border-green-200',
                };
            default:
                return {
                    icon: AlertCircle,
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-800',
                    borderColor: 'border-gray-200',
                };
        }
    };
    const typeStyles = getTypeStyles();
    const TypeIcon = typeStyles.icon;
    return (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-4 py-4", children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm font-medium text-gray-900", children: formatDate(transaction.transactionDate, 'dd MMM yyyy') }), _jsx("span", { className: "text-xs text-gray-500", children: formatDate(transaction.transactionDate, 'HH:mm') })] }) }), _jsx("td", { className: "px-4 py-4", children: _jsx("span", { className: "font-semibold text-gray-900", children: transaction.assetSymbol }) }), _jsx("td", { className: "px-4 py-4", children: _jsxs("div", { className: `inline-flex items-center gap-2 px-3 py-1 rounded-full border ${typeStyles.bgColor} ${typeStyles.textColor} ${typeStyles.borderColor}`, children: [_jsx(TypeIcon, { className: "h-3.5 w-3.5" }), _jsx("span", { className: "text-xs font-semibold", children: transaction.typeName })] }) }), _jsx("td", { className: "px-4 py-4 text-right", children: _jsx("span", { className: "text-sm text-gray-900 font-medium", children: transaction.quantity.toLocaleString() }) }), _jsx("td", { className: "px-4 py-4 text-right", children: _jsx("span", { className: "text-sm text-gray-900", children: formatCurrency(transaction.pricePerUnit, currency) }) }), _jsx("td", { className: "px-4 py-4 text-right", children: _jsxs("span", { className: `text-sm font-semibold ${transaction.type === TransactionType.Buy ? 'text-red-600' :
                        transaction.type === TransactionType.Sell ? 'text-green-600' :
                            'text-gray-900'}`, children: [transaction.type === TransactionType.Buy && '-', transaction.type === TransactionType.Sell && '+', formatCurrency(transaction.totalAmount, currency)] }) }), _jsx("td", { className: "px-4 py-4 text-right", children: _jsx("span", { className: "text-sm text-gray-600", children: transaction.fees > 0 ? formatCurrency(transaction.fees, currency) : '-' }) })] }));
};
export default TransactionRow;
