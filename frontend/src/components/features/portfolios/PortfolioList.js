import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// PortfolioList Component
// Grid/list display of portfolios with filtering and sorting
// ============================================================================
import { useState, useMemo } from "react";
import { Plus, Grid, List, Search } from "lucide-react";
import PortfolioCard from "./PortfolioCard";
import { Button } from "../../common/Button";
import { Input } from "../../common/Input";
import { EmptyState } from "../../common/ErrorMessage";
// ============================================================================
// PORTFOLIO LIST COMPONENT
// ============================================================================
export const PortfolioList = ({ portfolios, summaries = [], onCreateNew, onEdit, onDelete, isLoading = false, }) => {
    const [viewMode, setViewMode] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    // Get summary for a portfolio
    const getSummary = (portfolioId) => {
        return summaries.find((s) => s.portfolioId === portfolioId);
    };
    // Filter and sort portfolios
    const filteredAndSortedPortfolios = useMemo(() => {
        let filtered = portfolios;
        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter((portfolio) => portfolio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                portfolio.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()));
        }
        // Sort portfolios
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "value": {
                    const summaryA = getSummary(a.portfolioId);
                    const summaryB = getSummary(b.portfolioId);
                    return (summaryB?.totalValue || 0) - (summaryA?.totalValue || 0);
                }
                case "gainLoss": {
                    const summaryA = getSummary(a.portfolioId);
                    const summaryB = getSummary(b.portfolioId);
                    return ((summaryB?.totalGainLoss || 0) - (summaryA?.totalGainLoss || 0));
                }
                case "date":
                    return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                default:
                    return 0;
            }
        });
    }, [portfolios, summaries, searchQuery, sortBy]);
    // Empty state
    if (portfolios.length === 0 && !isLoading) {
        return (_jsx(EmptyState, { title: "No portfolios yet", message: "Create your first portfolio to start tracking your investments", icon: _jsx(Plus, { className: "h-8 w-8 text-gray-400" }), action: {
                label: "Create Portfolio",
                onClick: onCreateNew,
            } }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "My Portfolios" }), _jsxs("p", { className: "text-gray-600 mt-1", children: [portfolios.length, " ", portfolios.length === 1 ? "portfolio" : "portfolios"] })] }), _jsx(Button, { variant: "primary", onClick: onCreateNew, leftIcon: _jsx(Plus, { className: "h-5 w-5" }), children: "Create Portfolio" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx("div", { className: "flex-1", children: _jsx(Input, { type: "text", placeholder: "Search portfolios...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), leftIcon: _jsx(Search, { className: "h-5 w-5" }) }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { htmlFor: "sortBy", className: "text-sm font-medium text-gray-700 whitespace-nowrap", children: "Sort by:" }), _jsxs("select", { id: "sortBy", value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "name", children: "Name" }), _jsx("option", { value: "value", children: "Total Value" }), _jsx("option", { value: "gainLoss", children: "Gain/Loss" }), _jsx("option", { value: "date", children: "Date Created" })] })] }), _jsxs("div", { className: "flex items-center gap-1 bg-gray-100 rounded-lg p-1", children: [_jsx("button", { onClick: () => setViewMode("grid"), className: `p-2 rounded transition-colors ${viewMode === "grid"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"}`, "aria-label": "Grid view", children: _jsx(Grid, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => setViewMode("list"), className: `p-2 rounded transition-colors ${viewMode === "list"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"}`, "aria-label": "List view", children: _jsx(List, { className: "h-5 w-5" }) })] })] }), filteredAndSortedPortfolios.length > 0 ? (_jsx("div", { className: viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4", children: filteredAndSortedPortfolios.map((portfolio) => {
                    const summary = getSummary(portfolio.portfolioId);
                    return (_jsx(PortfolioCard, { portfolio: portfolio, totalValue: summary?.totalValue || 0, totalGainLoss: summary?.totalGainLoss || 0, totalAssets: summary?.totalAssets || 0, onEdit: onEdit, onDelete: onDelete }, portfolio.portfolioId));
                }) })) : (_jsx(EmptyState, { title: "No portfolios found", message: `No portfolios match "${searchQuery}"`, icon: _jsx(Search, { className: "h-8 w-8 text-gray-400" }) }))] }));
};
export default PortfolioList;
