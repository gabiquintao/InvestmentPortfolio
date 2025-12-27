import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================================
// TransactionCard Component
// Card view of a single transaction with details
// ============================================================================
import { ShoppingCart, TrendingUp, DollarSign, AlertCircle, Calendar, FileText } from 'lucide-react';
import { TransactionType } from '../../../types';
import { formatCurrency, formatDate, formatDateTime } from '../../../utils/formatters';
// ============================================================================
// TRANSACTION CARD COMPONENT
// ============================================================================
export const TransactionCard = ({ transaction, currency = 'EUR', showDetails = true, }) => {
    // Get type styles
    const getTypeStyles = () => {
        switch (transaction.type) {
            case TransactionType.Buy:
                return {
                    icon: ShoppingCart,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    iconBgColor: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    amountColor: 'text-red-600',
                    prefix: '-',
                };
            case TransactionType.Sell:
                return {
                    icon: TrendingUp,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    iconBgColor: 'bg-green-100',
                    iconColor: 'text-green-600',
                    amountColor: 'text-green-600',
                    prefix: '+',
                };
            default:
                return {
                    icon: AlertCircle,
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    iconBgColor: 'bg-gray-100',
                    iconColor: 'text-gray-600',
                    amountColor: 'text-gray-900',
                    prefix: '',
                };
        }
    };
    const styles = getTypeStyles();
    const TypeIcon = styles.icon;
    return (_jsxs("div", { className: `rounded-lg border ${styles.borderColor} ${styles.bgColor} p-4 hover:shadow-md transition-shadow`, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-lg ${styles.iconBgColor} flex items-center justify-center`, children: _jsx(TypeIcon, { className: `h-5 w-5 ${styles.iconColor}` }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-bold text-gray-900", children: transaction.assetSymbol }), _jsx("span", { className: `text-xs font-semibold px-2 py-0.5 rounded-full ${styles.iconBgColor} ${styles.iconColor}`, children: transaction.typeName })] }), _jsxs("p", { className: "text-sm text-gray-600 flex items-center gap-1 mt-1", children: [_jsx(Calendar, { className: "h-3.5 w-3.5" }), formatDateTime(transaction.transactionDate)] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: `text-2xl font-bold ${styles.amountColor}`, children: [styles.prefix, formatCurrency(transaction.totalAmount, currency)] }), transaction.fees > 0 && (_jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["+", formatCurrency(transaction.fees, currency), " fees"] }))] })] }), showDetails && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-2 gap-3 py-3 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Quantity" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: transaction.quantity.toLocaleString() })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Price per Unit" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: formatCurrency(transaction.pricePerUnit, currency) })] })] }), transaction.notes && (_jsx("div", { className: "pt-3 border-t border-gray-200", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(FileText, { className: "h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-sm text-gray-600", children: transaction.notes })] }) }))] }))] }));
};
export default TransactionCard;
