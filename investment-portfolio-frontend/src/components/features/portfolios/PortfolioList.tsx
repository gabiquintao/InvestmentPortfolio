// ============================================================================
// PortfolioList Component
// Grid/list display of portfolios with filtering and sorting
// ============================================================================

import { useState, useMemo } from "react";
import { Plus, Grid, List, Search } from "lucide-react";
import type { Portfolio, PortfolioSummary } from "../../../types";
import PortfolioCard from "./PortfolioCard";
import { Button } from "../../common/Button";
import { Input } from "../../common/Input";
import { EmptyState } from "../../common/ErrorMessage";

// ============================================================================
// TYPES
// ============================================================================

interface PortfolioListProps {
  portfolios: Portfolio[];
  summaries?: PortfolioSummary[];
  onCreateNew: () => void;
  onEdit: (portfolio: Portfolio) => void;
  onDelete: (portfolio: Portfolio) => void;
  isLoading?: boolean;
}

type ViewMode = "grid" | "list";
type SortBy = "name" | "value" | "gainLoss" | "date";

// ============================================================================
// PORTFOLIO LIST COMPONENT
// ============================================================================

export const PortfolioList = ({
  portfolios,
  summaries = [],
  onCreateNew,
  onEdit,
  onDelete,
  isLoading = false,
}: PortfolioListProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");

  // Get summary for a portfolio
  const getSummary = (portfolioId: number) => {
    return summaries.find((s) => s.portfolioId === portfolioId);
  };

  // Filter and sort portfolios
  const filteredAndSortedPortfolios = useMemo(() => {
    let filtered = portfolios;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (portfolio) =>
          portfolio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          portfolio.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Sort portfolios
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);

        case "value": {
          const summaryA = getSummary(a.portfolioId);
          const summaryB = getSummary(b.portfolioId);
          return (summaryB?.totalValue || 0) - (summaryA?.totalValue || 0);
        }

        case "gainLoss": {
          const summaryA = getSummary(a.portfolioId);
          const summaryB = getSummary(b.portfolioId);
          return (
            (summaryB?.totalGainLoss || 0) - (summaryA?.totalGainLoss || 0)
          );
        }

        case "date":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        default:
          return 0;
      }
    });
  }, [portfolios, summaries, searchQuery, sortBy]);

  // Empty state
  if (portfolios.length === 0 && !isLoading) {
    return (
      <EmptyState
        title="No portfolios yet"
        message="Create your first portfolio to start tracking your investments"
        icon={<Plus className="h-8 w-8 text-gray-400" />}
        action={{
          label: "Create Portfolio",
          onClick: onCreateNew,
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Portfolios</h2>
          <p className="text-gray-600 mt-1">
            {portfolios.length}{" "}
            {portfolios.length === 1 ? "portfolio" : "portfolios"}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onCreateNew}
          leftIcon={<Plus className="h-5 w-5" />}
        >
          Create Portfolio
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search portfolios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-5 w-5" />}
          />
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="sortBy"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            Sort by:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Name</option>
            <option value="value">Total Value</option>
            <option value="gainLoss">Gain/Loss</option>
            <option value="date">Date Created</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-colors ${
              viewMode === "grid"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="Grid view"
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-colors ${
              viewMode === "list"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Portfolios Grid/List */}
      {filteredAndSortedPortfolios.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredAndSortedPortfolios.map((portfolio) => {
            const summary = getSummary(portfolio.portfolioId);
            return (
              <PortfolioCard
                key={portfolio.portfolioId}
                portfolio={portfolio}
                totalValue={summary?.totalValue || 0}
                totalGainLoss={summary?.totalGainLoss || 0}
                totalAssets={summary?.totalAssets || 0}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No portfolios found"
          message={`No portfolios match "${searchQuery}"`}
          icon={<Search className="h-8 w-8 text-gray-400" />}
        />
      )}
    </div>
  );
};

export default PortfolioList;
