// ============================================================================
// AssetSearchBar Component
// Search bar with autocomplete for finding asset symbols
// ============================================================================

import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp, Loader2 } from "lucide-react";
import { useMarketData } from "../../../hooks/useMarketData";
import type { AssetSearchResult } from "../../../types";

// ============================================================================
// TYPES
// ============================================================================

interface AssetSearchBarProps {
  onSelect: (symbol: string) => void;
  disabled?: boolean;
  error?: string;
  initialValue?: string;
  placeholder?: string;
}

// ============================================================================
// ASSET SEARCH BAR COMPONENT
// ============================================================================

export const AssetSearchBar = ({
  onSelect,
  disabled = false,
  error,
  initialValue = "",
  placeholder = "Search for stocks, crypto (e.g., AAPL, BTC-USD)...",
}: AssetSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    searchResults,
    isLoading,
    searchSymbols,
    trendingAssets,
    getTrending,
  } = useMarketData();

  // Debounce search
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timer = setTimeout(() => {
        searchSymbols(searchQuery);
        setShowResults(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
  const handleSelect = (
    result: AssetSearchResult | { symbol: string; name: string }
  ) => {
    setSearchQuery(result.symbol);
    onSelect(result.symbol);
    setShowResults(false);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const results = searchQuery.length >= 2 ? searchResults : trendingAssets;

    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex]);
        } else if (searchQuery.length > 0) {
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div ref={dropdownRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>

      {/* Dropdown Results */}
      {showResults && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {searchQuery.length >= 2 ? (
            // Search Results
            searchResults.length > 0 ? (
              <div className="py-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Search Results
                </p>
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.symbol}-${index}`}
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                      index === selectedIndex ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-gray-900">
                        {result.symbol}
                      </span>
                      <span className="text-sm text-gray-600">
                        {result.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                        {result.type}
                      </span>
                      {result.exchange && (
                        <span className="text-xs text-gray-500 mt-1">
                          {result.exchange}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
                {/* Custom Symbol Option */}
                <button
                  onClick={() => {
                    onSelect(searchQuery.toUpperCase());
                    setShowResults(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 border-t border-gray-200 hover:bg-gray-50 transition-colors text-left"
                >
                  <Search className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Use "{searchQuery.toUpperCase()}"
                    </p>
                    <p className="text-xs text-gray-500">Enter custom symbol</p>
                  </div>
                </button>
              </div>
            ) : !isLoading ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No results found for "{searchQuery}"</p>
                <button
                  onClick={() => {
                    onSelect(searchQuery.toUpperCase());
                    setShowResults(false);
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Use "{searchQuery.toUpperCase()}" anyway
                </button>
              </div>
            ) : null
          ) : (
            // Trending Assets (shown when no search query)
            trendingAssets.length > 0 && (
              <div className="py-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending Assets
                </p>
                {trendingAssets.slice(0, 5).map((asset, index) => (
                  <button
                    key={`${asset.symbol}-${index}`}
                    onClick={() => handleSelect(asset)}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                      index === selectedIndex ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-gray-900">
                        {asset.symbol}
                      </span>
                      <span className="text-sm text-gray-600">
                        {asset.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${asset.currentPrice.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs ${
                          asset.changePercent24h >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {asset.changePercent24h >= 0 ? "+" : ""}
                        {asset.changePercent24h.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AssetSearchBar;
