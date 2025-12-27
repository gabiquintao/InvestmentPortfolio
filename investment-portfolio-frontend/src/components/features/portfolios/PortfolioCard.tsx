// ============================================================================
// PortfolioCard Component
// Visual card displaying portfolio summary information
// ============================================================================

import { Link } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Portfolio } from "../../../types";
import {
  formatCurrency,
  formatDate,
  formatPercentage,
} from "../../../utils/formatters";

// ============================================================================
// TYPES
// ============================================================================

interface PortfolioCardProps {
  portfolio: Portfolio;
  totalValue?: number;
  totalGainLoss?: number;
  totalAssets?: number;
  onEdit?: (portfolio: Portfolio) => void;
  onDelete?: (portfolio: Portfolio) => void;
}

// ============================================================================
// PORTFOLIO CARD COMPONENT
// ============================================================================

export const PortfolioCard = ({
  portfolio,
  totalValue = 0,
  totalGainLoss = 0,
  totalAssets = 0,
  onEdit,
  onDelete,
}: PortfolioCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const gainLossPercent =
    totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;
  const isPositive = totalGainLoss >= 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <Link
            to={`/portfolios/${portfolio.portfolioId}`}
            className="flex items-center gap-3 flex-1 min-w-0 group"
          >
            <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {portfolio.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {portfolio.description || "No description"}
              </p>
            </div>
          </Link>

          {/* Actions Menu */}
          {(onEdit || onDelete) && (
            <div className="relative shrink-0 ml-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Portfolio actions"
              >
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(portfolio);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(portfolio);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Body - Stats */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Total Value */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Value</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(totalValue, portfolio.currency)}
            </p>
          </div>

          {/* Gain/Loss */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Gain/Loss</p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <p
                className={`text-lg font-bold ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(Math.abs(totalGainLoss), portfolio.currency)}
              </p>
            </div>
            <p
              className={`text-xs ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatPercentage(gainLossPercent)}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <span className="font-medium text-gray-900">{totalAssets}</span>{" "}
            assets
          </div>
          <div className="text-gray-500">
            Created {formatDate(portfolio.createdAt, "MMM dd, yyyy")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
