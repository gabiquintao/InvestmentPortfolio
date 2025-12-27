import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// TransactionTable Component
// Table view of transactions with filtering and sorting
// ============================================================================
import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus, Filter } from "lucide-react";
import { TransactionType } from "../../../types";
import TransactionRow from "./TransactionRow";
import { Button } from "../../common/Button";
import { EmptyState } from "../../common/ErrorMessage";
// ============================================================================
// TRANSACTION TABLE COMPONENT
// ============================================================================
export const TransactionTable = ({ transactions, currency = "EUR", onAddNew, showPortfolioColumn = false, }) => {
    const [sortField, setSortField] = useState("date");
    const [sortDirection, setSortDirection] = useState("desc");
    const [filterType, setFilterType] = useState("all");
    // Handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection((prev) => prev === "asc" ? "desc" : prev === "desc" ? null : "asc");
            if (sortDirection === "desc") {
                setSortField("date");
                setSortDirection("desc");
            }
        }
        else {
            setSortField(field);
            setSortDirection("asc");
        }
    };
    // Get sort icon
    const getSortIcon = (field) => {
        if (sortField !== field) {
            return _jsx(ArrowUpDown, { className: "h-4 w-4 text-gray-400" });
        }
        if (sortDirection === "asc") {
            return _jsx(ArrowUp, { className: "h-4 w-4 text-blue-600" });
        }
        if (sortDirection === "desc") {
            return _jsx(ArrowDown, { className: "h-4 w-4 text-blue-600" });
        }
        return _jsx(ArrowUpDown, { className: "h-4 w-4 text-gray-400" });
    };
    // Filter and sort transactions
    const filteredAndSortedTransactions = useMemo(() => {
        let filtered = transactions;
        // Filter by type
        if (filterType !== "all") {
            filtered = filtered.filter((tx) => tx.type === filterType);
        }
        // Sort
        if (sortDirection) {
            filtered = [...filtered].sort((a, b) => {
                let aValue = 0;
                let bValue = 0;
                switch (sortField) {
                    case "date":
                        aValue = new Date(a.transactionDate).getTime();
                        bValue = new Date(b.transactionDate).getTime();
                        break;
                    case "symbol":
                        aValue = a.assetSymbol;
                        bValue = b.assetSymbol;
                        break;
                    case "type":
                        aValue = a.typeName;
                        bValue = b.typeName;
                        break;
                    case "quantity":
                        aValue = a.quantity;
                        bValue = b.quantity;
                        break;
                    case "pricePerUnit":
                        aValue = a.pricePerUnit;
                        bValue = b.pricePerUnit;
                        break;
                    case "totalAmount":
                        aValue = a.totalAmount;
                        bValue = b.totalAmount;
                        break;
                }
                if (typeof aValue === "string" && typeof bValue === "string") {
                    return sortDirection === "asc"
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
                return sortDirection === "asc"
                    ? aValue - bValue
                    : bValue - aValue;
            });
        }
        return filtered;
    }, [transactions, sortField, sortDirection, filterType]);
    // Calculate totals
    const totals = useMemo(() => {
        const filtered = filteredAndSortedTransactions;
        return {
            totalAmount: filtered.reduce((sum, tx) => tx.type === TransactionType.Buy ? sum + tx.totalAmount : sum, 0),
            totalSold: filtered.reduce((sum, tx) => tx.type === TransactionType.Sell ? sum + tx.totalAmount : sum, 0),
            totalFees: filtered.reduce((sum, tx) => sum + tx.fees, 0),
        };
    }, [filteredAndSortedTransactions]);
    // Empty state
    if (transactions.length === 0) {
        return (_jsx(EmptyState, { title: "No transactions yet", message: "Record your first transaction to start tracking your portfolio activity", icon: _jsx(Plus, { className: "h-8 w-8 text-gray-400" }), action: onAddNew
                ? {
                    label: "Add Transaction",
                    onClick: onAddNew,
                }
                : undefined }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Transaction History" }), _jsxs("p", { className: "text-sm text-gray-600", children: [filteredAndSortedTransactions.length, " of ", transactions.length, " ", "transactions"] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-4 w-4 text-gray-500" }), _jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value === "all"
                                            ? "all"
                                            : Number(e.target.value)), className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm", children: [_jsx("option", { value: "all", children: "All Types" }), _jsx("option", { value: TransactionType.Buy, children: "Buy" }), _jsx("option", { value: TransactionType.Sell, children: "Sell" })] })] }), onAddNew && (_jsx(Button, { variant: "primary", onClick: onAddNew, leftIcon: _jsx(Plus, { className: "h-5 w-5" }), children: "Add Transaction" }))] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-4", children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Total Purchases" }), _jsxs("p", { className: "text-xl font-bold text-gray-900", children: [currency, " ", totals.totalAmount.toFixed(2)] })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-4", children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Total Sales" }), _jsxs("p", { className: "text-xl font-bold text-gray-900", children: [currency, " ", totals.totalSold.toFixed(2)] })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-4", children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Total Fees" }), _jsxs("p", { className: "text-xl font-bold text-gray-900", children: [currency, " ", totals.totalFees.toFixed(2)] })] })] }), _jsx("div", { className: "bg-white rounded-lg border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left", children: _jsxs("button", { onClick: () => handleSort("date"), className: "flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors", children: ["Date", getSortIcon("date")] }) }), _jsx("th", { className: "px-4 py-3 text-left", children: _jsxs("button", { onClick: () => handleSort("symbol"), className: "flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors", children: ["Asset", getSortIcon("symbol")] }) }), _jsx("th", { className: "px-4 py-3 text-left", children: _jsxs("button", { onClick: () => handleSort("type"), className: "flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors", children: ["Type", getSortIcon("type")] }) }), _jsx("th", { className: "px-4 py-3 text-right", children: _jsxs("button", { onClick: () => handleSort("quantity"), className: "flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors", children: ["Quantity", getSortIcon("quantity")] }) }), _jsx("th", { className: "px-4 py-3 text-right", children: _jsxs("button", { onClick: () => handleSort("pricePerUnit"), className: "flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors", children: ["Price/Unit", getSortIcon("pricePerUnit")] }) }), _jsx("th", { className: "px-4 py-3 text-right", children: _jsxs("button", { onClick: () => handleSort("totalAmount"), className: "flex items-center justify-end gap-2 w-full text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-blue-600 transition-colors", children: ["Total", getSortIcon("totalAmount")] }) }), _jsx("th", { className: "px-4 py-3 text-right", children: _jsx("span", { className: "text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Fees" }) })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: filteredAndSortedTransactions.map((transaction) => (_jsx(TransactionRow, { transaction: transaction, currency: currency }, transaction.transactionId))) })] }) }) })] }));
};
export default TransactionTable;
