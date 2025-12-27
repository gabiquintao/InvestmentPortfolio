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
import type {
  Portfolio,
  CreatePortfolioDto,
  UpdatePortfolioDto,
  ModalMode,
} from "../types";
import { Trash2 } from "lucide-react";

// ============================================================================
// PORTFOLIOS PAGE COMPONENT
// ============================================================================

export const PortfoliosPage = () => {
  const {
    portfolios,
    summaries,
    isLoading,
    error,
    fetchPortfolios,
    fetchSummaries,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    clearError,
  } = usePortfolios(false);

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: ModalMode;
    portfolio?: Portfolio;
  }>({
    isOpen: false,
    mode: "create",
  });

  // Delete confirmation modal
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    portfolio?: Portfolio;
  }>({
    isOpen: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
  const handleEdit = (portfolio: Portfolio) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      portfolio,
    });
    setFormError(null);
  };

  // Handle delete
  const handleDelete = (portfolio: Portfolio) => {
    setDeleteModalState({
      isOpen: true,
      portfolio,
    });
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteModalState.portfolio) return;

    setFormLoading(true);
    setFormError(null);

    const success = await deletePortfolio(
      deleteModalState.portfolio.portfolioId
    );

    if (success) {
      setDeleteModalState({ isOpen: false });
      await fetchSummaries(); // Refresh summaries after delete
    } else {
      setFormError("Failed to delete portfolio");
    }

    setFormLoading(false);
  };

  // Handle form submit
  const handleFormSubmit = async (
    data: CreatePortfolioDto | UpdatePortfolioDto
  ) => {
    setFormLoading(true);
    setFormError(null);

    try {
      if (modalState.mode === "create") {
        const result = await createPortfolio(data as CreatePortfolioDto);
        if (result) {
          setModalState({ isOpen: false, mode: "create" });
          await fetchSummaries(); // Refresh summaries after create
        } else {
          setFormError("Failed to create portfolio");
        }
      } else if (modalState.mode === "edit" && modalState.portfolio) {
        const result = await updatePortfolio(
          modalState.portfolio.portfolioId,
          data as UpdatePortfolioDto
        );
        if (result) {
          setModalState({ isOpen: false, mode: "create" });
          await fetchSummaries(); // Refresh summaries after update
        } else {
          setFormError("Failed to update portfolio");
        }
      }
    } catch (err) {
      setFormError("An unexpected error occurred");
    } finally {
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
    return (
      <Layout>
        <PageLoader text="Loading your portfolios..." />
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <PageError
          title="Failed to load portfolios"
          message={error}
          onRetry={() => {
            fetchPortfolios();
            fetchSummaries();
            clearError();
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Portfolio List */}
        <PortfolioList
          portfolios={portfolios}
          summaries={summaries}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        {/* Create/Edit Modal */}
        <Modal
          isOpen={modalState.isOpen}
          onClose={handleModalClose}
          title={
            modalState.mode === "create"
              ? "Create New Portfolio"
              : "Edit Portfolio"
          }
          size="md"
        >
          {formError && (
            <div className="mb-4">
              <ErrorMessage
                message={formError}
                onClose={() => setFormError(null)}
              />
            </div>
          )}
          <PortfolioForm
            portfolio={modalState.portfolio}
            onSubmit={handleFormSubmit}
            onCancel={handleModalClose}
            isLoading={formLoading}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalState.isOpen}
          onClose={() => !formLoading && setDeleteModalState({ isOpen: false })}
          title="Delete Portfolio"
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
                  Are you sure you want to delete this portfolio?
                </p>
                <p className="text-sm text-red-700">
                  Portfolio:{" "}
                  <span className="font-semibold">
                    {deleteModalState.portfolio?.name}
                  </span>
                </p>
                <p className="text-sm text-red-700 mt-2">
                  This action cannot be undone. All assets and transactions in
                  this portfolio will be permanently deleted.
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
                Delete Portfolio
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default PortfoliosPage;
