import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// PortfolioSelector Component
// Dropdown/select component for choosing a portfolio
// ============================================================================
import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Briefcase } from "lucide-react";
// ============================================================================
// PORTFOLIO SELECTOR COMPONENT
// ============================================================================
export const PortfolioSelector = ({ portfolios, selectedPortfolio, onSelect, placeholder = "Select a portfolio", disabled = false, className = "", }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    const handleSelect = (portfolio) => {
        onSelect(portfolio);
        setIsOpen(false);
    };
    return (_jsxs("div", { ref: dropdownRef, className: `relative ${className}`, children: [_jsxs("button", { type: "button", onClick: () => !disabled && setIsOpen(!isOpen), disabled: disabled, className: `w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-left transition-colors ${disabled
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"}`, children: [_jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [_jsx(Briefcase, { className: "h-5 w-5 text-gray-400 shrink-0" }), selectedPortfolio ? (_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium text-gray-900 truncate", children: selectedPortfolio.name }), selectedPortfolio.description && (_jsx("p", { className: "text-sm text-gray-500 truncate", children: selectedPortfolio.description }))] })) : (_jsx("span", { className: "text-gray-500", children: placeholder }))] }), _jsx(ChevronDown, { className: `h-5 w-5 text-gray-400 shrink-0 transition-transform ${isOpen ? "transform rotate-180" : ""}` })] }), isOpen && !disabled && (_jsx("div", { className: "absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto", children: portfolios.length > 0 ? (_jsx("div", { className: "py-2", children: portfolios.map((portfolio) => (_jsxs("button", { type: "button", onClick: () => handleSelect(portfolio), className: "w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [_jsx(Briefcase, { className: "h-5 w-5 text-gray-400 shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0 text-left", children: [_jsx("p", { className: "font-medium text-gray-900 truncate", children: portfolio.name }), portfolio.description && (_jsx("p", { className: "text-sm text-gray-500 truncate", children: portfolio.description })), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: portfolio.currency })] })] }), selectedPortfolio?.portfolioId === portfolio.portfolioId && (_jsx(Check, { className: "h-5 w-5 text-blue-600 shrink-0" }))] }, portfolio.portfolioId))) })) : (_jsxs("div", { className: "px-4 py-8 text-center text-gray-500", children: [_jsx(Briefcase, { className: "h-8 w-8 mx-auto mb-2 text-gray-400" }), _jsx("p", { className: "text-sm", children: "No portfolios available" })] })) }))] }));
};
export const SimplePortfolioSelect = ({ portfolios, selectedPortfolioId, onSelect, placeholder = "Select a portfolio", disabled = false, label, error, className = "", }) => {
    return (_jsxs("div", { className: className, children: [label && (_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label })), _jsxs("select", { value: selectedPortfolioId || "", onChange: (e) => onSelect(Number(e.target.value)), disabled: disabled, className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? "border-red-500" : "border-gray-300"}`, children: [_jsx("option", { value: "", disabled: true, children: placeholder }), portfolios.map((portfolio) => (_jsxs("option", { value: portfolio.portfolioId, children: [portfolio.name, " (", portfolio.currency, ")"] }, portfolio.portfolioId)))] }), error && _jsx("p", { className: "mt-1 text-sm text-red-600", children: error })] }));
};
export default PortfolioSelector;
