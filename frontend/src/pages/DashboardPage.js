import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// DashboardPage
// Main dashboard showing portfolio overview, alerts, and quick stats
// ============================================================================
import { useEffect } from "react";
import { usePortfolios } from "../hooks/usePortfolios";
import { useAlerts } from "../hooks/useAlerts";
import { useTransactions } from "../hooks/useTransactions";
import { Layout } from "../components/layout/Layout";
import { LoadingSpinner, PageLoader, } from "../components/common/LoadingSpinner";
import { ErrorMessage, PageError } from "../components/common/ErrorMessage";
import PortfolioSummaryCard from "../components/features/portfolios/PortfolioSummaryCard";
import AlertsWidget from "../components/features/alerts/AlertsWidget";
import { TrendingUp, Briefcase, Bell, DollarSign, Activity, } from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";
const StatCard = ({ icon: Icon, label, value, change, changePositive, iconColor, iconBgColor, }) => {
    return (_jsx("div", { className: "bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: label }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mb-1", children: value }), change && (_jsxs("p", { className: `text-sm font-medium ${changePositive ? "text-green-600" : "text-red-600"}`, children: [changePositive ? "+" : "", change] }))] }), _jsx("div", { className: `w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center shrink-0`, children: _jsx(Icon, { className: `h-6 w-6 ${iconColor}` }) })] }) }));
};
// ============================================================================
// DASHBOARD PAGE COMPONENT
// ============================================================================
export const DashboardPage = () => {
    const { portfolios, summaries, isLoading: portfoliosLoading, error: portfoliosError, fetchPortfolios, fetchSummaries, } = usePortfolios(false);
    const { alerts, activeAlerts, isLoading: alertsLoading, fetchAlerts, fetchActiveAlerts, } = useAlerts(false);
    const { transactions, isLoading: transactionsLoading, fetchUserTransactions, } = useTransactions(undefined, false);
    // Fetch all data on mount
    useEffect(() => {
        fetchPortfolios();
        fetchSummaries();
        fetchAlerts();
        fetchActiveAlerts();
        fetchUserTransactions();
    }, [
        fetchPortfolios,
        fetchSummaries,
        fetchAlerts,
        fetchActiveAlerts,
        fetchUserTransactions,
    ]);
    // Calculate dashboard statistics
    const stats = {
        totalValue: summaries.reduce((sum, s) => sum + s.totalValue, 0),
        totalGainLoss: summaries.reduce((sum, s) => sum + s.totalGainLoss, 0),
        totalAssets: summaries.reduce((sum, s) => sum + s.totalAssets, 0),
        totalPortfolios: portfolios.length,
        activeAlerts: activeAlerts.length,
        recentTransactions: transactions.length,
    };
    const gainLossPercent = stats.totalValue > 0
        ? (stats.totalGainLoss / (stats.totalValue - stats.totalGainLoss)) * 100
        : 0;
    // Loading state
    if (portfoliosLoading && summaries.length === 0) {
        return (_jsx(Layout, { children: _jsx(PageLoader, { text: "Loading your dashboard..." }) }));
    }
    // Error state
    if (portfoliosError) {
        return (_jsx(Layout, { children: _jsx(PageError, { title: "Failed to load dashboard", message: portfoliosError, onRetry: () => {
                    fetchPortfolios();
                    fetchSummaries();
                } }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Dashboard" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Welcome back! Here's an overview of your investment portfolio." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx(StatCard, { icon: DollarSign, label: "Total Portfolio Value", value: formatCurrency(stats.totalValue), iconColor: "text-blue-600", iconBgColor: "bg-blue-100" }), _jsx(StatCard, { icon: TrendingUp, label: "Total Gain/Loss", value: formatCurrency(Math.abs(stats.totalGainLoss)), change: formatPercentage(gainLossPercent), changePositive: stats.totalGainLoss >= 0, iconColor: stats.totalGainLoss >= 0 ? "text-green-600" : "text-red-600", iconBgColor: stats.totalGainLoss >= 0 ? "bg-green-100" : "bg-red-100" }), _jsx(StatCard, { icon: Briefcase, label: "Active Portfolios", value: stats.totalPortfolios.toString(), iconColor: "text-purple-600", iconBgColor: "bg-purple-100" }), _jsx(StatCard, { icon: Bell, label: "Active Alerts", value: stats.activeAlerts.toString(), iconColor: "text-orange-600", iconBgColor: "bg-orange-100" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Your Portfolios" }), portfoliosLoading && _jsx(LoadingSpinner, { size: "sm" })] }), summaries.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 gap-6", children: summaries.map((summary) => (_jsx(PortfolioSummaryCard, { summary: summary, currency: "EUR" }, summary.portfolioId))) })) : (_jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-12 text-center", children: [_jsx(Briefcase, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No portfolios yet" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Create your first portfolio to start tracking your investments" }), _jsx("a", { href: "/portfolios", className: "inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors", children: "Create Portfolio" })] }))] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Activity, { className: "h-5 w-5 text-gray-600" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Recent Activity" })] }), _jsxs("div", { className: "space-y-3", children: [transactions.slice(0, 5).map((tx) => (_jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-100 last:border-0", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: tx.assetSymbol }), _jsx("p", { className: "text-sm text-gray-600", children: tx.typeName })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: `font-semibold ${tx.type === 1 ? "text-red-600" : "text-green-600"}`, children: [tx.type === 1 ? "-" : "+", formatCurrency(tx.totalAmount)] }), _jsx("p", { className: "text-xs text-gray-500", children: new Date(tx.transactionDate).toLocaleDateString() })] })] }, tx.transactionId))), transactions.length === 0 && (_jsx("p", { className: "text-center text-gray-500 py-8", children: "No recent transactions" }))] }), transactions.length > 5 && (_jsx("a", { href: "/transactions", className: "block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium", children: "View all transactions" }))] })] }), _jsx("div", { className: "lg:col-span-1", children: _jsx(AlertsWidget, { alerts: alerts, currency: "EUR", maxItems: 5 }) })] })] }) }));
};
export default DashboardPage;
