import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// PortfoliosPage
// Page for managing portfolios with CRUD operations
// ============================================================================
import { useState, useEffect } from "react";
import { usePortfolios } from "../hooks/usePortfolios";
import { Layout } from "../components/layout/Layout";
import { PageLoader } from "../components/common/LoadingSpinner";
import { PageError, ErrorMessage } from "../components/common/ErrorMessage";
import { Modal } from "../components/common/Modal";
import { Button } from "../components/common/Button";
import PortfolioList from "../components/features/portfolios/PortfolioList";
import PortfolioForm from "../components/features/portfolios/PortfolioForm";
import { Trash2 } from "lucide-react";
// ============================================================================
// PORTFOLIOS PAGE COMPONENT
// ============================================================================
export const PortfoliosPage = () => {
    const { portfolios, summaries, isLoading, error, fetchPortfolios, fetchSummaries, createPortfolio, updatePortfolio, deletePortfolio, clearError, } = usePortfolios(false);
    // Modal state
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: "create",
    });
    // Delete confirmation modal
    const [deleteModalState, setDeleteModalState] = useState({
        isOpen: false,
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    // Fetch data on mount
    useEffect(() => {
        fetchPortfolios();
        fetchSummaries();
    }, [fetchPortfolios, fetchSummaries]);
    // Handle create new
    const handleCreateNew = () => {
        setModalState({
            isOpen: true,
            mode: "create",
        });
        setFormError(null);
    };
    // Handle edit
    const handleEdit = (portfolio) => {
        setModalState({
            isOpen: true,
            mode: "edit",
            portfolio,
        });
        setFormError(null);
    };
    // Handle delete
    const handleDelete = (portfolio) => {
        setDeleteModalState({
            isOpen: true,
            portfolio,
        });
    };
    // Confirm delete
    const handleConfirmDelete = async () => {
        if (!deleteModalState.portfolio)
            return;
        setFormLoading(true);
        setFormError(null);
        const success = await deletePortfolio(deleteModalState.portfolio.portfolioId);
        if (success) {
            setDeleteModalState({ isOpen: false });
            await fetchSummaries(); // Refresh summaries after delete
        }
        else {
            setFormError("Failed to delete portfolio");
        }
        setFormLoading(false);
    };
    // Handle form submit
    const handleFormSubmit = async (data) => {
        setFormLoading(true);
        setFormError(null);
        try {
            if (modalState.mode === "create") {
                const result = await createPortfolio(data);
                if (result) {
                    setModalState({ isOpen: false, mode: "create" });
                    await fetchSummaries(); // Refresh summaries after create
                }
                else {
                    setFormError("Failed to create portfolio");
                }
            }
            else if (modalState.mode === "edit" && modalState.portfolio) {
                const result = await updatePortfolio(modalState.portfolio.portfolioId, data);
                if (result) {
                    setModalState({ isOpen: false, mode: "create" });
                    await fetchSummaries(); // Refresh summaries after update
                }
                else {
                    setFormError("Failed to update portfolio");
                }
            }
        }
        catch (err) {
            setFormError("An unexpected error occurred");
        }
        finally {
            setFormLoading(false);
        }
    };
    // Handle modal close
    const handleModalClose = () => {
        if (!formLoading) {
            setModalState({ isOpen: false, mode: "create" });
            setFormError(null);
        }
    };
    // Loading state
    if (isLoading && portfolios.length === 0) {
        return (_jsx(Layout, { children: _jsx(PageLoader, { text: "Loading your portfolios..." }) }));
    }
    // Error state
    if (error) {
        return (_jsx(Layout, { children: _jsx(PageError, { title: "Failed to load portfolios", message: error, onRetry: () => {
                    fetchPortfolios();
                    fetchSummaries();
                    clearError();
                } }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "space-y-6", children: [_jsx(PortfolioList, { portfolios: portfolios, summaries: summaries, onCreateNew: handleCreateNew, onEdit: handleEdit, onDelete: handleDelete, isLoading: isLoading }), _jsxs(Modal, { isOpen: modalState.isOpen, onClose: handleModalClose, title: modalState.mode === "create"
                        ? "Create New Portfolio"
                        : "Edit Portfolio", size: "md", children: [formError && (_jsx("div", { className: "mb-4", children: _jsx(ErrorMessage, { message: formError, onClose: () => setFormError(null) }) })), _jsx(PortfolioForm, { portfolio: modalState.portfolio, onSubmit: handleFormSubmit, onCancel: handleModalClose, isLoading: formLoading })] }), _jsxs(Modal, { isOpen: deleteModalState.isOpen, onClose: () => !formLoading && setDeleteModalState({ isOpen: false }), title: "Delete Portfolio", size: "sm", children: [formError && (_jsx("div", { className: "mb-4", children: _jsx(ErrorMessage, { message: formError, onClose: () => setFormError(null) }) })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg", children: [_jsx(Trash2, { className: "h-5 w-5 text-red-600 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-red-900 mb-1", children: "Are you sure you want to delete this portfolio?" }), _jsxs("p", { className: "text-sm text-red-700", children: ["Portfolio:", " ", _jsx("span", { className: "font-semibold", children: deleteModalState.portfolio?.name })] }), _jsx("p", { className: "text-sm text-red-700 mt-2", children: "This action cannot be undone. All assets and transactions in this portfolio will be permanently deleted." })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-3", children: [_jsx(Button, { variant: "secondary", onClick: () => setDeleteModalState({ isOpen: false }), disabled: formLoading, children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: handleConfirmDelete, isLoading: formLoading, disabled: formLoading, children: "Delete Portfolio" })] })] })] })] }) }));
};
export default PortfoliosPage;
