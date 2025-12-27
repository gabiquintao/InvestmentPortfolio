import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { ArrowLeft, Trash2 } from "lucide-react";
import assetService from "../services/asset.service";
// ============================================================================
// PORTFOLIO DETAIL PAGE COMPONENT
// ============================================================================
export const PortfolioDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const portfolioId = id ? parseInt(id) : 0;
    const { getPortfolioById } = usePortfolios(false);
    const { assets, isLoading: assetsLoading, error: assetsError, fetchAssets, createAsset, updateAsset, deleteAsset, getTopPerformers, getWorstPerformers, } = useAssets(portfolioId, false);
    const { transactions, isLoading: transactionsLoading, fetchPortfolioTransactions, } = useTransactions(portfolioId, false);
    const [portfolio, setPortfolio] = useState(null);
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [allocation, setAllocation] = useState([]);
    // Modal states
    const [assetModalState, setAssetModalState] = useState({
        isOpen: false,
        mode: "create",
    });
    const [deleteModalState, setDeleteModalState] = useState({
        isOpen: false,
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
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
                const allocationData = await assetService.getAssetAllocation(portfolioId);
                setAllocation(allocationData.map((a) => ({
                    type: a.type,
                    value: a.value,
                    percentage: a.percentage,
                    color: "",
                })));
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
            gainLossPercent: (topPerformers[0].gainLoss /
                (topPerformers[0].quantity * topPerformers[0].avgPurchasePrice)) *
                100,
        }
        : undefined;
    const worstPerformer = worstPerformers[0]
        ? {
            symbol: worstPerformers[0].symbol,
            gainLoss: worstPerformers[0].gainLoss,
            gainLossPercent: (worstPerformers[0].gainLoss /
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
    const handleEditAsset = (asset) => {
        setAssetModalState({ isOpen: true, mode: "edit", asset });
        setFormError(null);
    };
    const handleDeleteAsset = (asset) => {
        setDeleteModalState({ isOpen: true, asset });
    };
    const handleConfirmDelete = async () => {
        if (!deleteModalState.asset)
            return;
        setFormLoading(true);
        const success = await deleteAsset(portfolioId, deleteModalState.asset.assetId);
        if (success) {
            setDeleteModalState({ isOpen: false });
        }
        else {
            setFormError("Failed to delete asset");
        }
        setFormLoading(false);
    };
    const handleAssetFormSubmit = async (data) => {
        setFormLoading(true);
        setFormError(null);
        try {
            if (assetModalState.mode === "create") {
                const result = await createAsset(portfolioId, data);
                if (result) {
                    setAssetModalState({ isOpen: false, mode: "create" });
                }
                else {
                    setFormError("Failed to create asset");
                }
            }
            else if (assetModalState.mode === "edit" && assetModalState.asset) {
                const result = await updateAsset(portfolioId, assetModalState.asset.assetId, data);
                if (result) {
                    setAssetModalState({ isOpen: false, mode: "create" });
                }
                else {
                    setFormError("Failed to update asset");
                }
            }
        }
        catch {
            setFormError("An unexpected error occurred");
        }
        finally {
            setFormLoading(false);
        }
    };
    // Loading state
    if (portfolioLoading || (assetsLoading && assets.length === 0)) {
        return (_jsx(Layout, { children: _jsx(PageLoader, { text: "Loading portfolio details..." }) }));
    }
    // Error state
    if (!portfolio) {
        return (_jsx(Layout, { children: _jsx(PageError, { title: "Portfolio not found", message: "The requested portfolio could not be found", onRetry: () => navigate("/portfolios"), retryText: "Back to Portfolios" }) }));
    }
    if (assetsError) {
        return (_jsx(Layout, { children: _jsx(PageError, { title: "Failed to load assets", message: assetsError, onRetry: () => fetchAssets(portfolioId) }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("button", { onClick: () => navigate("/portfolios"), className: "inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to Portfolios"] }), _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: portfolio.name }), portfolio.description && (_jsx("p", { className: "text-gray-600 mt-1", children: portfolio.description }))] }), _jsx(PortfolioStats, { portfolio: portfolio, totalValue: totalValue, totalGainLoss: totalGainLoss, totalAssets: assets.length, bestPerformer: bestPerformer, worstPerformer: worstPerformer }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [allocation.length > 0 && (_jsx(AssetAllocationChart, { allocations: allocation, currency: portfolio.currency })), _jsxs("div", { className: "bg-white rounded-lg border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Recent Transactions" }), transactions.length > 0 ? (_jsxs("div", { className: "space-y-3", children: [transactions.slice(0, 5).map((tx) => (_jsx(TransactionCard, { transaction: tx, currency: portfolio.currency, showDetails: false }, tx.transactionId))), transactions.length > 5 && (_jsx("button", { onClick: () => navigate("/transactions"), className: "w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2", children: "View all transactions" }))] })) : (_jsx("p", { className: "text-center text-gray-500 py-8", children: "No transactions yet" }))] })] }), assets.length > 0 && (_jsx(PerformanceComparison, { assets: assets, currency: portfolio.currency })), _jsx(AssetTable, { assets: assets, currency: portfolio.currency, onEdit: handleEditAsset, onDelete: handleDeleteAsset, onAddNew: handleAddAsset, showLivePrice: true }), _jsxs(Modal, { isOpen: assetModalState.isOpen, onClose: () => !formLoading &&
                        setAssetModalState({ isOpen: false, mode: "create" }), title: assetModalState.mode === "create" ? "Add New Asset" : "Edit Asset", size: "lg", children: [formError && (_jsx("div", { className: "mb-4", children: _jsx(ErrorMessage, { message: formError, onClose: () => setFormError(null) }) })), _jsx(AssetForm, { asset: assetModalState.asset, onSubmit: handleAssetFormSubmit, onCancel: () => setAssetModalState({ isOpen: false, mode: "create" }), isLoading: formLoading })] }), _jsxs(Modal, { isOpen: deleteModalState.isOpen, onClose: () => !formLoading && setDeleteModalState({ isOpen: false }), title: "Delete Asset", size: "sm", children: [formError && (_jsx("div", { className: "mb-4", children: _jsx(ErrorMessage, { message: formError, onClose: () => setFormError(null) }) })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg", children: [_jsx(Trash2, { className: "h-5 w-5 text-red-600 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-red-900 mb-1", children: "Are you sure you want to delete this asset?" }), _jsxs("p", { className: "text-sm text-red-700", children: ["Asset:", " ", _jsx("span", { className: "font-semibold", children: deleteModalState.asset?.symbol })] }), _jsx("p", { className: "text-sm text-red-700 mt-2", children: "This action cannot be undone." })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-3", children: [_jsx(Button, { variant: "secondary", onClick: () => setDeleteModalState({ isOpen: false }), disabled: formLoading, children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: handleConfirmDelete, isLoading: formLoading, disabled: formLoading, children: "Delete Asset" })] })] })] })] }) }));
};
export default PortfolioDetailPage;
