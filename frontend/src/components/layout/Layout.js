import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { LoadingSpinner } from "../common/LoadingSpinner";
// ============================================================================
// LAYOUT COMPONENT
// ============================================================================
export const Layout = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthContext();
    // Show loading state while checking authentication
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsx(LoadingSpinner, { size: "lg", text: "Loading application..." }) }));
    }
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsx(Header, {}), _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [_jsx(Sidebar, {}), _jsx("main", { className: "flex-1 overflow-y-auto", children: _jsx("div", { className: "container mx-auto p-6 max-w-7xl", children: children }) })] })] }));
};
export const PublicLayout = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Investment Portfolio" }), _jsx("p", { className: "text-gray-600", children: "Manage your investments effectively" })] }), _jsx("div", { className: "bg-white rounded-lg shadow-lg border border-gray-200 p-8", children: children }), _jsxs("div", { className: "mt-6 text-center text-sm text-gray-500", children: ["\u00A9 ", new Date().getFullYear(), " Investment Portfolio. All rights reserved."] })] }) }));
};
export const EmptyLayout = ({ children, requireAuth = false, }) => {
    const { isAuthenticated, isLoading } = useAuthContext();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsx(LoadingSpinner, { size: "lg", text: "Loading..." }) }));
    }
    if (requireAuth && !isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx("div", { className: "min-h-screen bg-gray-50", children: children });
};
export default Layout;
