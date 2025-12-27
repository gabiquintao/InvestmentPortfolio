// ============================================================================
// Sidebar Component
// Left navigation sidebar with hierarchical menu (McMaster-Carr style)
// ============================================================================

import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  Receipt,
  Bell,
  PieChart,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react";
import { usePortfolios } from "../../hooks/usePortfolios";

// ============================================================================
// TYPES
// ============================================================================

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: MenuItem[];
  badge?: number;
}

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

export const Sidebar = () => {
  const location = useLocation();
  const { portfolios, fetchPortfolios } = usePortfolios(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(
    new Set(["portfolios"])
  );

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some((child) => child.path && isActive(child.path));
  };

  // Build menu items with dynamic portfolios
  const menuItems: MenuItem[] = [
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

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.has(item.label);
    const isItemActive = item.path
      ? isActive(item.path)
      : isParentActive(item.children);

    if (hasChildren) {
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
              isItemActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            style={{ paddingLeft: `${16 + level * 16}px` }}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                  {item.badge}
                </span>
              )}
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {isExpanded && (
            <div className="border-l-2 border-gray-200 ml-4">
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.label}
        to={item.path!}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
            isActive
              ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
        style={{ paddingLeft: `${16 + level * 16}px` }}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.label}</span>
        {item.badge !== undefined && item.badge > 0 && (
          <span className="flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 ml-auto">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Navigation
        </h2>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <p className="font-semibold mb-1">Quick Stats</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Portfolios:</span>
              <span className="font-medium text-gray-700">
                {portfolios.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
