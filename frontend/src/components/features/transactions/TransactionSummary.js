import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// TransactionSummary Component
// Summary statistics for transactions
// ============================================================================
import { ShoppingCart, TrendingUp, DollarSign, AlertCircle, BarChart3, } from "lucide-react";
import { TransactionType } from "../../../types";
import { formatCurrency } from "../../../utils/formatters";
const StatCard = ({ icon: Icon, label, value, subValue, iconColor, iconBgColor, }) => {
    return (_jsx("div", { className: "bg-white rounded-lg border border-gray-200 p-5", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: label }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: value }), subValue && _jsx("p", { className: "text-sm text-gray-500 mt-1", children: subValue })] }), _jsx("div", { className: `w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`, children: _jsx(Icon, { className: `h-6 w-6 ${iconColor}` }) })] }) }));
};
// ============================================================================
// TRANSACTION SUMMARY COMPONENT
// ============================================================================
export const TransactionSummary = ({ transactions, currency = "EUR", }) => {
    // Calculate statistics
    const stats = transactions.reduce((acc, tx) => {
        switch (tx.type) {
            case TransactionType.Buy:
                acc.totalBuys += tx.totalAmount;
                acc.buyCount++;
                break;
            case TransactionType.Sell:
                acc.totalSells += tx.totalAmount;
                acc.sellCount++;
                break;
        }
        acc.allFees += tx.fees;
        return acc;
    }, {
        totalBuys: 0,
        totalSells: 0,
        totalDividends: 0,
        totalFees: 0,
        allFees: 0,
        buyCount: 0,
        sellCount: 0,
        dividendCount: 0,
        feeCount: 0,
    });
    const netCashFlow = stats.totalSells +
        stats.totalDividends -
        stats.totalBuys -
        stats.totalFees -
        stats.allFees;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(StatCard, { icon: ShoppingCart, label: "Total Purchases", value: formatCurrency(stats.totalBuys, currency), subValue: `${stats.buyCount} ${stats.buyCount === 1 ? "transaction" : "transactions"}`, iconColor: "text-blue-600", iconBgColor: "bg-blue-100" }), _jsx(StatCard, { icon: TrendingUp, label: "Total Sales", value: formatCurrency(stats.totalSells, currency), subValue: `${stats.sellCount} ${stats.sellCount === 1 ? "transaction" : "transactions"}`, iconColor: "text-green-600", iconBgColor: "bg-green-100" }), _jsx(StatCard, { icon: DollarSign, label: "Total Dividends", value: formatCurrency(stats.totalDividends, currency), subValue: `${stats.dividendCount} ${stats.dividendCount === 1 ? "payment" : "payments"}`, iconColor: "text-purple-600", iconBgColor: "bg-purple-100" }), _jsx(StatCard, { icon: AlertCircle, label: "Total Fees", value: formatCurrency(stats.allFees, currency), subValue: "All transaction fees", iconColor: "text-orange-600", iconBgColor: "bg-orange-100" })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(BarChart3, { className: "h-5 w-5 text-gray-600" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Net Cash Flow" })] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Total income minus expenses across all transactions" }), _jsxs("p", { className: `text-4xl font-bold ${netCashFlow >= 0 ? "text-green-600" : "text-red-600"}`, children: [netCashFlow >= 0 ? "+" : "", formatCurrency(netCashFlow, currency)] })] }) }), _jsx("div", { className: "mt-6 pt-6 border-t border-gray-200", children: _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Income" }), _jsxs("p", { className: "text-sm font-semibold text-green-600", children: ["+", formatCurrency(stats.totalSells + stats.totalDividends, currency)] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Expenses" }), _jsxs("p", { className: "text-sm font-semibold text-red-600", children: ["-", formatCurrency(stats.totalBuys + stats.totalFees + stats.allFees, currency)] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Total Transactions" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: transactions.length })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Avg Fee per Tx" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: transactions.length > 0
                                                ? formatCurrency(stats.allFees / transactions.length, currency)
                                                : formatCurrency(0, currency) })] })] }) })] })] }));
};
export default TransactionSummary;
