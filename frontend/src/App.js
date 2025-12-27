import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Páginas públicas
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
// Páginas privadas
import DashboardPage from "./pages/DashboardPage";
import AlertsPage from "./pages/AlertsPage";
import MarketPage from "./pages/MarketPage";
import PortfoliosPage from "./pages/PortfoliosPage";
import PortfolioDetailPage from "./pages/PortfolioDetailPage";
import TransactionsPage from "./pages/TransactionsPage";
function App() {
    return (_jsx(BrowserRouter, { basename: "/InvestmentPortfolio", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/alerts", element: _jsx(AlertsPage, {}) }), _jsx(Route, { path: "/market", element: _jsx(MarketPage, {}) }), _jsx(Route, { path: "/portfolios", element: _jsx(PortfoliosPage, {}) }), _jsx(Route, { path: "/portfolios/:id", element: _jsx(PortfolioDetailPage, {}) }), _jsx(Route, { path: "/transactions", element: _jsx(TransactionsPage, {}) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/login", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/login", replace: true }) })] }) }));
}
export default App;
