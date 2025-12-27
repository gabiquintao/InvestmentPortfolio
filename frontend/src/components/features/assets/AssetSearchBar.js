import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// AssetSearchBar Component
// Search bar with autocomplete for finding asset symbols
// ============================================================================
import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp, Loader2 } from "lucide-react";
import { useMarketData } from "../../../hooks/useMarketData";
// ============================================================================
// ASSET SEARCH BAR COMPONENT
// ============================================================================
export const AssetSearchBar = ({ onSelect, disabled = false, error, initialValue = "", placeholder = "Search for stocks, crypto (e.g., AAPL, BTC-USD)...", }) => {
    const [searchQuery, setSearchQuery] = useState(initialValue);
    const [showResults, setShowResults] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const { searchResults, isLoading, searchSymbols, trendingAssets, getTrending, } = useMarketData();
    // Debounce search
    useEffect(() => {
        if (searchQuery.length >= 2) {
            const timer = setTimeout(() => {
                searchSymbols(searchQuery);
                setShowResults(true);
            }, 300);
            return () => clearTimeout(timer);
        }
        else {
            setShowResults(false);
        }
    }, [searchQuery, searchSymbols]);
    // Load trending assets on mount
    useEffect(() => {
        if (trendingAssets.length === 0) {
            getTrending();
        }
    }, [getTrending, trendingAssets.length]);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        if (showResults) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showResults]);
    // Handle result selection
    const handleSelect = (result) => {
        setSearchQuery(result.symbol);
        onSelect(result.symbol);
        setShowResults(false);
        setSelectedIndex(-1);
    };
    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        const results = searchQuery.length >= 2 ? searchResults : trendingAssets;
        if (!showResults || results.length === 0)
            return;
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => prev < results.length - 1 ? prev + 1 : prev);
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSelect(results[selectedIndex]);
                }
                else if (searchQuery.length > 0) {
                    // Allow custom symbol entry
                    onSelect(searchQuery.toUpperCase());
                    setShowResults(false);
                }
                break;
            case "Escape":
                setShowResults(false);
                setSelectedIndex(-1);
                break;
        }
    };
    // Handle input change
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSelectedIndex(-1);
    };
    // Handle input focus
    const handleFocus = () => {
        if (searchQuery.length === 0 && trendingAssets.length > 0) {
            setShowResults(true);
        }
    };
    return (_jsxs("div", { ref: dropdownRef, className: "relative", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: isLoading ? (_jsx(Loader2, { className: "h-5 w-5 text-gray-400 animate-spin" })) : (_jsx(Search, { className: "h-5 w-5 text-gray-400" })) }), _jsx("input", { ref: inputRef, type: "text", value: searchQuery, onChange: handleInputChange, onKeyDown: handleKeyDown, onFocus: handleFocus, disabled: disabled, placeholder: placeholder, className: `w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? "border-red-500" : "border-gray-300"}` })] }), showResults && !disabled && (_jsx("div", { className: "absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto", children: searchQuery.length >= 2 ? (
                // Search Results
                searchResults.length > 0 ? (_jsxs("div", { className: "py-2", children: [_jsx("p", { className: "px-4 py-2 text-xs font-semibold text-gray-500 uppercase", children: "Search Results" }), searchResults.map((result, index) => (_jsxs("button", { onClick: () => handleSelect(result), className: `w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${index === selectedIndex ? "bg-blue-50" : ""}`, children: [_jsxs("div", { className: "flex flex-col items-start", children: [_jsx("span", { className: "font-semibold text-gray-900", children: result.symbol }), _jsx("span", { className: "text-sm text-gray-600", children: result.name })] }), _jsxs("div", { className: "flex flex-col items-end", children: [_jsx("span", { className: "text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-800 rounded", children: result.type }), result.exchange && (_jsx("span", { className: "text-xs text-gray-500 mt-1", children: result.exchange }))] })] }, `${result.symbol}-${index}`))), _jsxs("button", { onClick: () => {
                                onSelect(searchQuery.toUpperCase());
                                setShowResults(false);
                            }, className: "w-full flex items-center gap-3 px-4 py-3 border-t border-gray-200 hover:bg-gray-50 transition-colors text-left", children: [_jsx(Search, { className: "h-5 w-5 text-gray-400" }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-gray-900", children: ["Use \"", searchQuery.toUpperCase(), "\""] }), _jsx("p", { className: "text-xs text-gray-500", children: "Enter custom symbol" })] })] })] })) : !isLoading ? (_jsxs("div", { className: "px-4 py-8 text-center text-gray-500", children: [_jsx(Search, { className: "h-8 w-8 mx-auto mb-2 text-gray-400" }), _jsxs("p", { className: "text-sm", children: ["No results found for \"", searchQuery, "\""] }), _jsxs("button", { onClick: () => {
                                onSelect(searchQuery.toUpperCase());
                                setShowResults(false);
                            }, className: "mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium", children: ["Use \"", searchQuery.toUpperCase(), "\" anyway"] })] })) : null) : (
                // Trending Assets (shown when no search query)
                trendingAssets.length > 0 && (_jsxs("div", { className: "py-2", children: [_jsxs("p", { className: "px-4 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2", children: [_jsx(TrendingUp, { className: "h-4 w-4" }), "Trending Assets"] }), trendingAssets.slice(0, 5).map((asset, index) => (_jsxs("button", { onClick: () => handleSelect(asset), className: `w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${index === selectedIndex ? "bg-blue-50" : ""}`, children: [_jsxs("div", { className: "flex flex-col items-start", children: [_jsx("span", { className: "font-semibold text-gray-900", children: asset.symbol }), _jsx("span", { className: "text-sm text-gray-600", children: asset.name })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm font-medium text-gray-900", children: ["$", asset.currentPrice.toFixed(2)] }), _jsxs("p", { className: `text-xs ${asset.changePercent24h >= 0
                                                ? "text-green-600"
                                                : "text-red-600"}`, children: [asset.changePercent24h >= 0 ? "+" : "", asset.changePercent24h.toFixed(2), "%"] })] })] }, `${asset.symbol}-${index}`)))] }))) }))] }));
};
export default AssetSearchBar;
