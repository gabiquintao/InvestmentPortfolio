import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// MarketPage
// Page for viewing market data and trending assets
// ============================================================================
import { useState, useEffect } from "react";
import { useMarketData } from "../hooks/useMarketData";
import { Layout } from "../components/layout/Layout";
import { PageLoader } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import AssetSearchBar from "../components/features/assets/AssetSearchBar";
import { TrendingUp, TrendingDown, Search, Activity } from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";
// ============================================================================
// MARKET PAGE COMPONENT
// ============================================================================
export const MarketPage = () => {
    const { prices, searchResults, trendingAssets, isLoading, error, getPrice, getTrending, clearError, } = useMarketData();
    const [selectedSymbol, setSelectedSymbol] = useState("");
    const [searchError, setSearchError] = useState(null);
    // Fetch trending on mount
    useEffect(() => {
        if (trendingAssets.length === 0) {
            getTrending();
        }
    }, [getTrending, trendingAssets.length]);
    // Handle symbol selection
    const handleSymbolSelect = async (symbol) => {
        setSelectedSymbol(symbol);
        setSearchError(null);
        const priceData = await getPrice(symbol);
        if (!priceData) {
            setSearchError(`Could not fetch price data for ${symbol}`);
        }
    };
    const selectedPrice = selectedSymbol ? prices.get(selectedSymbol) : null;
    return (_jsx(Layout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Market Data" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Search for assets and view trending market data" })] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Search, { className: "h-5 w-5 text-gray-600" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Search Assets" })] }), _jsx(AssetSearchBar, { onSelect: handleSymbolSelect, placeholder: "Search for stocks, cryptocurrencies..." }), searchError && (_jsx("div", { className: "mt-4", children: _jsx(ErrorMessage, { message: searchError, onClose: () => setSearchError(null) }) })), selectedPrice && (_jsx("div", { className: "mt-6 p-6 bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: selectedSymbol }), _jsx("p", { className: "text-4xl font-bold text-gray-900 mb-2", children: formatCurrency(selectedPrice.currentPrice, "USD") }), _jsxs("div", { className: "flex items-center gap-2", children: [selectedPrice.changePercent24h >= 0 ? (_jsx(TrendingUp, { className: "h-5 w-5 text-green-600" })) : (_jsx(TrendingDown, { className: "h-5 w-5 text-red-600" })), _jsxs("p", { className: `text-lg font-semibold ${selectedPrice.changePercent24h >= 0
                                                            ? "text-green-600"
                                                            : "text-red-600"}`, children: [formatPercentage(selectedPrice.changePercent24h), " (24h)"] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "24h Volume" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: formatCurrency(selectedPrice.volume24h, "USD") }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: ["Source: ", selectedPrice.source] })] })] }) }))] }), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Activity, { className: "h-5 w-5 text-gray-600" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Trending Assets" })] }), isLoading && trendingAssets.length === 0 ? (_jsx(PageLoader, { text: "Loading trending assets..." })) : error ? (_jsx(ErrorMessage, { message: error, onClose: clearError })) : trendingAssets.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: trendingAssets.map((asset, index) => (_jsxs("button", { onClick: () => handleSymbolSelect(asset.symbol), className: "p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-bold text-gray-900", children: asset.symbol }), _jsx("p", { className: "text-sm text-gray-600 truncate", children: asset.name })] }), _jsxs("span", { className: "text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded", children: ["#", index + 1] })] }), _jsxs("div", { className: "flex items-baseline justify-between", children: [_jsxs("p", { className: "text-lg font-bold text-gray-900", children: ["$", asset.currentPrice.toFixed(2)] }), _jsxs("div", { className: "flex items-center gap-1", children: [asset.changePercent24h >= 0 ? (_jsx(TrendingUp, { className: "h-4 w-4 text-green-600" })) : (_jsx(TrendingDown, { className: "h-4 w-4 text-red-600" })), _jsx("span", { className: `text-sm font-semibold ${asset.changePercent24h >= 0
                                                            ? "text-green-600"
                                                            : "text-red-600"}`, children: formatPercentage(asset.changePercent24h) })] })] })] }, `${asset.symbol}-${index}`))) })) : (_jsx("p", { className: "text-center text-gray-500 py-8", children: "No trending assets available" }))] })] }) }));
};
export default MarketPage;
