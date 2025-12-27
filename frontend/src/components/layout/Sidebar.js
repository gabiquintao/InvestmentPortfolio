import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// Sidebar Component
// Left navigation sidebar with hierarchical menu (McMaster-Carr style)
// ============================================================================
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, TrendingUp, Receipt, Bell, PieChart, ChevronDown, ChevronRight, Plus, } from "lucide-react";
import { usePortfolios } from "../../hooks/usePortfolios";
// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================
export const Sidebar = () => {
    const location = useLocation();
    const { portfolios, fetchPortfolios } = usePortfolios(false);
    const [expandedMenus, setExpandedMenus] = useState(new Set(["portfolios"]));
    useEffect(() => {
        fetchPortfolios();
    }, [fetchPortfolios]);
    const toggleMenu = (label) => {
        setExpandedMenus((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(label)) {
                newSet.delete(label);
            }
            else {
                newSet.add(label);
            }
            return newSet;
        });
    };
    const isActive = (path) => {
        return location.pathname === path;
    };
    const isParentActive = (children) => {
        if (!children)
            return false;
        return children.some((child) => child.path && isActive(child.path));
    };
    // Build menu items with dynamic portfolios
    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard",
        },
        {
            label: "Portfolios",
            icon: Briefcase,
            children: [
                {
                    label: "All Portfolios",
                    icon: Briefcase,
                    path: "/portfolios",
                },
                {
                    label: "Create New",
                    icon: Plus,
                    path: "/portfolios/new",
                },
                ...portfolios.map((portfolio) => ({
                    label: portfolio.name,
                    icon: PieChart,
                    path: `/portfolios/${portfolio.portfolioId}`,
                })),
            ],
        },
        {
            label: "Transactions",
            icon: Receipt,
            path: "/transactions",
        },
        {
            label: "Alerts",
            icon: Bell,
            path: "/alerts",
        },
        {
            label: "Market",
            icon: TrendingUp,
            path: "/market",
        },
    ];
    const renderMenuItem = (item, level = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.has(item.label);
        const isItemActive = item.path
            ? isActive(item.path)
            : isParentActive(item.children);
        if (hasChildren) {
            return (_jsxs("div", { children: [_jsxs("button", { onClick: () => toggleMenu(item.label), className: `w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${isItemActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"}`, style: { paddingLeft: `${16 + level * 16}px` }, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(item.icon, { className: "h-5 w-5" }), _jsx("span", { children: item.label }), item.badge !== undefined && item.badge > 0 && (_jsx("span", { className: "flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700", children: item.badge }))] }), isExpanded ? (_jsx(ChevronDown, { className: "h-4 w-4" })) : (_jsx(ChevronRight, { className: "h-4 w-4" }))] }), isExpanded && (_jsx("div", { className: "border-l-2 border-gray-200 ml-4", children: item.children?.map((child) => renderMenuItem(child, level + 1)) }))] }, item.label));
        }
        return (_jsxs(NavLink, { to: item.path, className: ({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${isActive
                ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                : "text-gray-700 hover:bg-gray-100"}`, style: { paddingLeft: `${16 + level * 16}px` }, children: [_jsx(item.icon, { className: "h-5 w-5" }), _jsx("span", { children: item.label }), item.badge !== undefined && item.badge > 0 && (_jsx("span", { className: "flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 ml-auto", children: item.badge }))] }, item.label));
    };
    return (_jsxs("aside", { className: "w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden", children: [_jsx("div", { className: "p-4 border-b border-gray-200", children: _jsx("h2", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Navigation" }) }), _jsx("nav", { className: "flex-1 overflow-y-auto py-4", children: _jsx("div", { className: "space-y-1", children: menuItems.map((item) => renderMenuItem(item)) }) }), _jsx("div", { className: "p-4 border-t border-gray-200 bg-gray-50", children: _jsxs("div", { className: "text-xs text-gray-500", children: [_jsx("p", { className: "font-semibold mb-1", children: "Quick Stats" }), _jsx("div", { className: "space-y-1", children: _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Portfolios:" }), _jsx("span", { className: "font-medium text-gray-700", children: portfolios.length })] }) })] }) })] }));
};
export default Sidebar;
