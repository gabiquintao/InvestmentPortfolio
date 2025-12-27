import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ============================================================================
// Header Component
// Top navigation bar with user info, notifications, and actions
// ============================================================================
import { useState } from "react";
import { Bell, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import { useAlerts } from "../../hooks/useAlerts";
import { useNavigate } from "react-router-dom";
// ============================================================================
// HEADER COMPONENT
// ============================================================================
export const Header = () => {
    const { user, logout } = useAuthContext();
    const { activeAlerts } = useAlerts(true);
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    const activeAlertsCount = activeAlerts.filter((a) => a.triggeredAt !== null).length;
    return (_jsx("header", { className: "bg-white border-b border-gray-200 sticky top-0 z-40", children: _jsxs("div", { className: "flex items-center justify-between px-6 py-4", children: [_jsx("div", { className: "flex items-center gap-4", children: _jsx("h1", { className: "text-xl font-bold text-gray-900", children: "Investment Portfolio" }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowNotifications(!showNotifications), className: "relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors", "aria-label": "Notifications", children: [_jsx(Bell, { className: "h-5 w-5" }), activeAlertsCount > 0 && (_jsx("span", { className: "absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white", children: activeAlertsCount }))] }), showNotifications && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-10", onClick: () => setShowNotifications(false) }), _jsxs("div", { className: "absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20", children: [_jsx("div", { className: "p-4 border-b border-gray-200", children: _jsx("h3", { className: "font-semibold text-gray-900", children: "Notifications" }) }), _jsx("div", { className: "max-h-96 overflow-y-auto", children: activeAlertsCount > 0 ? (_jsx("div", { className: "divide-y divide-gray-200", children: activeAlerts
                                                            .filter((a) => a.triggeredAt !== null)
                                                            .slice(0, 5)
                                                            .map((alert) => (_jsx("div", { className: "p-4 hover:bg-gray-50", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "shrink-0 w-2 h-2 mt-2 rounded-full bg-red-600" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("p", { className: "text-sm font-medium text-gray-900", children: ["Alert Triggered: ", alert.assetSymbol] }), _jsxs("p", { className: "text-sm text-gray-600", children: [alert.conditionName, " \u20AC", alert.targetPrice] })] })] }) }, alert.alertId))) })) : (_jsxs("div", { className: "p-8 text-center text-gray-500", children: [_jsx(Bell, { className: "h-8 w-8 mx-auto mb-2 text-gray-400" }), _jsx("p", { className: "text-sm", children: "No new notifications" })] })) }), activeAlertsCount > 0 && (_jsx("div", { className: "p-3 border-t border-gray-200", children: _jsx("button", { onClick: () => {
                                                            navigate("/alerts");
                                                            setShowNotifications(false);
                                                        }, className: "w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium", children: "View all alerts" }) }))] })] }))] }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowUserMenu(!showUserMenu), className: "flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors", children: [_jsx("div", { className: "flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full", children: _jsx(User, { className: "h-4 w-4" }) }), _jsxs("div", { className: "hidden md:block text-left", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: user?.fullName }), _jsx("p", { className: "text-xs text-gray-500", children: user?.email })] }), _jsx(ChevronDown, { className: "h-4 w-4 text-gray-500" })] }), showUserMenu && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-10", onClick: () => setShowUserMenu(false) }), _jsxs("div", { className: "absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20", children: [_jsxs("div", { className: "p-3 border-b border-gray-200", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: user?.fullName }), _jsx("p", { className: "text-xs text-gray-500", children: user?.email })] }), _jsxs("div", { className: "py-2", children: [_jsxs("button", { onClick: () => {
                                                                navigate("/profile");
                                                                setShowUserMenu(false);
                                                            }, className: "w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors", children: [_jsx(User, { className: "h-4 w-4" }), "Profile"] }), _jsxs("button", { onClick: () => {
                                                                navigate("/settings");
                                                                setShowUserMenu(false);
                                                            }, className: "w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors", children: [_jsx(Settings, { className: "h-4 w-4" }), "Settings"] })] }), _jsx("div", { className: "border-t border-gray-200 py-2", children: _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors", children: [_jsx(LogOut, { className: "h-4 w-4" }), "Logout"] }) })] })] }))] })] })] }) }));
};
export default Header;
