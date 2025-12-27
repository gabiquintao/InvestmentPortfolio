// ============================================================================
// PortfolioDetailPage
// Detailed view of a single portfolio with assets and statistics
// ============================================================================

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePortfolios } from "../hooks/usePortfolios";
import { useAssets } from "../hooks/useAssets";
import { useTransactions } from "../hooks/useTransactions";
import { Layout } from "../components/layout/Layout";
import { PageLoader } from "../components/common/LoadingSpinner";
import { PageError, ErrorMessage } from "../components/common/ErrorMessage";
import { Modal } from "../components/common/Modal";
import { Button } from "../components/common/Button";
import PortfolioStats from "../components/features/portfolios/PortfolioStats";
import AssetTable from "../components/features/assets/AssetTable";
import AssetForm from "../components/features/assets/AssetForm";
import AssetAllocationChart from "../components/features/assets/AssetAllocationChart";
import { PerformanceComparison } from "../components/features/assets/AssetPerfomanceCard";
import TransactionCard from "../components/features/transactions/TransactionCard";
import type {
  Asset,
  CreateAssetDto,
  UpdateAssetDto,
  ModalMode,
} from "../types";
import { ArrowLeft, Trash2 } from "lucide-react";
import assetService from "../services/asset.service";

// ============================================================================
// PORTFOLIO DETAIL PAGE COMPONENT
// ============================================================================

export const PortfolioDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const portfolioId = id ? parseInt(id) : 0;

  const { getPortfolioById } = usePortfolios(false);
  const {
    assets,
    isLoading: assetsLoading,
    error: assetsError,
    fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    getTopPerformers,
    getWorstPerformers,
  } = useAssets(portfolioId, false);

  const {
    transactions,
    isLoading: transactionsLoading,
    fetchPortfolioTransactions,
  } = useTransactions(portfolioId, false);

  const [portfolio, setPortfolio] = useState<any>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [allocation, setAllocation] = useState<any[]>([]);

  // Modal states
  const [assetModalState, setAssetModalState] = useState<{
    isOpen: boolean;
    mode: ModalMode;
    asset?: Asset;
  }>({
    isOpen: false,
    mode: "create",
  });

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    asset?: Asset;
  }>({
    isOpen: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch portfolio data
  useEffect(() => {
    const loadPortfolio = async () => {
      setPortfolioLoading(true);
      const data = await getPortfolioById(portfolioId);
      setPortfolio(data);
      setPortfolioLoading(false);
    };

    if (portfolioId > 0) {
      loadPortfolio();
      fetchAssets(portfolioId);
      fetchPortfolioTransactions(portfolioId);
    }
  }, [portfolioId, getPortfolioById, fetchAssets, fetchPortfolioTransactions]);

  // Calculate allocation when assets change
  useEffect(() => {
    const loadAllocation = async () => {
      if (portfolioId > 0) {
        const allocationData = await assetService.getAssetAllocation(
          portfolioId
        );
        setAllocation(
          allocationData.map((a) => ({
            type: a.type,
            value: a.value,
            percentage: a.percentage,
            color: "",
          }))
        );
      }
    };
    loadAllocation();
  }, [portfolioId, assets]);

  // Calculate stats
  const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalGainLoss = assets.reduce((sum, a) => sum + a.gainLoss, 0);
  const topPerformers = getTopPerformers(5);
  const worstPerformers = getWorstPerformers(5);

  const bestPerformer = topPerformers[0]
    ? {
        symbol: topPerformers[0].symbol,
        gainLoss: topPerformers[0].gainLoss,
        gainLossPercent:
          (topPerformers[0].gainLoss /
            (topPerformers[0].quantity * topPerformers[0].avgPurchasePrice)) *
          100,
      }
    : undefined;

  const worstPerformer = worstPerformers[0]
    ? {
        symbol: worstPerformers[0].symbol,
        gainLoss: worstPerformers[0].gainLoss,
        gainLossPercent:
          (worstPerformers[0].gainLoss /
            (worstPerformers[0].quantity *
              worstPerformers[0].avgPurchasePrice)) *
          100,
      }
    : undefined;

  // Handlers
  const handleAddAsset = () => {
    setAssetModalState({ isOpen: true, mode: "create" });
    setFormError(null);
  };

  const handleEditAsset = (asset: Asset) => {
    setAssetModalState({ isOpen: true, mode: "edit", asset });
    setFormError(null);
  };

  const handleDeleteAsset = (asset: Asset) => {
    setDeleteModalState({ isOpen: true, asset });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.asset) return;

    setFormLoading(true);
    const success = await deleteAsset(
      portfolioId,
      deleteModalState.asset.assetId
    );

    if (success) {
      setDeleteModalState({ isOpen: false });
    } else {
      setFormError("Failed to delete asset");
    }

    setFormLoading(false);
  };

  const handleAssetFormSubmit = async (
    data: CreateAssetDto | UpdateAssetDto
  ) => {
    setFormLoading(true);
    setFormError(null);

    try {
      if (assetModalState.mode === "create") {
        const result = await createAsset(portfolioId, data as CreateAssetDto);
        if (result) {
          setAssetModalState({ isOpen: false, mode: "create" });
        } else {
          setFormError("Failed to create asset");
        }
      } else if (assetModalState.mode === "edit" && assetModalState.asset) {
        const result = await updateAsset(
          portfolioId,
          assetModalState.asset.assetId,
          data as UpdateAssetDto
        );
        if (result) {
          setAssetModalState({ isOpen: false, mode: "create" });
        } else {
          setFormError("Failed to update asset");
        }
      }
    } catch {
      setFormError("An unexpected error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  // Loading state
  if (portfolioLoading || (assetsLoading && assets.length === 0)) {
    return (
      <Layout>
        <PageLoader text="Loading portfolio details..." />
      </Layout>
    );
  }

  // Error state
  if (!portfolio) {
    return (
      <Layout>
        <PageError
          title="Portfolio not found"
          message="The requested portfolio could not be found"
          onRetry={() => navigate("/portfolios")}
          retryText="Back to Portfolios"
        />
      </Layout>
    );
  }

  if (assetsError) {
    return (
      <Layout>
        <PageError
          title="Failed to load assets"
          message={assetsError}
          onRetry={() => fetchAssets(portfolioId)}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate("/portfolios")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolios
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{portfolio.name}</h1>
          {portfolio.description && (
            <p className="text-gray-600 mt-1">{portfolio.description}</p>
          )}
        </div>

        {/* Portfolio Stats */}
        <PortfolioStats
          portfolio={portfolio}
          totalValue={totalValue}
          totalGainLoss={totalGainLoss}
          totalAssets={assets.length}
          bestPerformer={bestPerformer}
          worstPerformer={worstPerformer}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset Allocation */}
          {allocation.length > 0 && (
            <AssetAllocationChart
              allocations={allocation}
              currency={portfolio.currency}
            />
          )}

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Transactions
            </h3>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <TransactionCard
                    key={tx.transactionId}
                    transaction={tx}
                    currency={portfolio.currency}
                    showDetails={false}
                  />
                ))}
                {transactions.length > 5 && (
                  <button
                    onClick={() => navigate("/transactions")}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
                  >
                    View all transactions
                  </button>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No transactions yet
              </p>
            )}
          </div>
        </div>

        {/* Performance Comparison */}
        {assets.length > 0 && (
          <PerformanceComparison
            assets={assets}
            currency={portfolio.currency}
          />
        )}

        {/* Assets Table */}
        <AssetTable
          assets={assets}
          currency={portfolio.currency}
          onEdit={handleEditAsset}
          onDelete={handleDeleteAsset}
          onAddNew={handleAddAsset}
          showLivePrice={true}
        />

        {/* Asset Modal */}
        <Modal
          isOpen={assetModalState.isOpen}
          onClose={() =>
            !formLoading &&
            setAssetModalState({ isOpen: false, mode: "create" })
          }
          title={
            assetModalState.mode === "create" ? "Add New Asset" : "Edit Asset"
          }
          size="lg"
        >
          {formError && (
            <div className="mb-4">
              <ErrorMessage
                message={formError}
                onClose={() => setFormError(null)}
              />
            </div>
          )}
          <AssetForm
            asset={assetModalState.asset}
            onSubmit={handleAssetFormSubmit}
            onCancel={() =>
              setAssetModalState({ isOpen: false, mode: "create" })
            }
            isLoading={formLoading}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalState.isOpen}
          onClose={() => !formLoading && setDeleteModalState({ isOpen: false })}
          title="Delete Asset"
          size="sm"
        >
          {formError && (
            <div className="mb-4">
              <ErrorMessage
                message={formError}
                onClose={() => setFormError(null)}
              />
            </div>
          )}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Trash2 className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 mb-1">
                  Are you sure you want to delete this asset?
                </p>
                <p className="text-sm text-red-700">
                  Asset:{" "}
                  <span className="font-semibold">
                    {deleteModalState.asset?.symbol}
                  </span>
                </p>
                <p className="text-sm text-red-700 mt-2">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setDeleteModalState({ isOpen: false })}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                isLoading={formLoading}
                disabled={formLoading}
              >
                Delete Asset
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default PortfolioDetailPage;
