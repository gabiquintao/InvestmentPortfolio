// ============================================================================
// PortfolioSelector Component
// Dropdown/select component for choosing a portfolio
// ============================================================================

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Briefcase } from "lucide-react";
import type { Portfolio } from "../../../types";

// ============================================================================
// TYPES
// ============================================================================

interface PortfolioSelectorProps {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  onSelect: (portfolio: Portfolio) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// ============================================================================
// PORTFOLIO SELECTOR COMPONENT
// ============================================================================

export const PortfolioSelector = ({
  portfolios,
  selectedPortfolio,
  onSelect,
  placeholder = "Select a portfolio",
  disabled = false,
  className = "",
}: PortfolioSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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

  const handleSelect = (portfolio: Portfolio) => {
    onSelect(portfolio);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Selector Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-left transition-colors ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Briefcase className="h-5 w-5 text-gray-400 shrink-0" />
          {selectedPortfolio ? (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {selectedPortfolio.name}
              </p>
              {selectedPortfolio.description && (
                <p className="text-sm text-gray-500 truncate">
                  {selectedPortfolio.description}
                </p>
              )}
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {portfolios.length > 0 ? (
            <div className="py-2">
              {portfolios.map((portfolio) => (
                <button
                  key={portfolio.portfolioId}
                  type="button"
                  onClick={() => handleSelect(portfolio)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Briefcase className="h-5 w-5 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-gray-900 truncate">
                        {portfolio.name}
                      </p>
                      {portfolio.description && (
                        <p className="text-sm text-gray-500 truncate">
                          {portfolio.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {portfolio.currency}
                      </p>
                    </div>
                  </div>
                  {selectedPortfolio?.portfolioId === portfolio.portfolioId && (
                    <Check className="h-5 w-5 text-blue-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No portfolios available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SIMPLE PORTFOLIO SELECT (native select element)
// ============================================================================

interface SimplePortfolioSelectProps {
  portfolios: Portfolio[];
  selectedPortfolioId: number | null;
  onSelect: (portfolioId: number) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  className?: string;
}

export const SimplePortfolioSelect = ({
  portfolios,
  selectedPortfolioId,
  onSelect,
  placeholder = "Select a portfolio",
  disabled = false,
  label,
  error,
  className = "",
}: SimplePortfolioSelectProps) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={selectedPortfolioId || ""}
        onChange={(e) => onSelect(Number(e.target.value))}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {portfolios.map((portfolio) => (
          <option key={portfolio.portfolioId} value={portfolio.portfolioId}>
            {portfolio.name} ({portfolio.currency})
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PortfolioSelector;
