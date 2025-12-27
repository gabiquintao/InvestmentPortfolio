// ============================================================================
// AlertsPage
// Page for managing price alerts
// ============================================================================

import { useState, useEffect } from "react";
import { useAlerts } from "../hooks/useAlerts";
import { Layout } from "../components/layout/Layout";
import { PageLoader } from "../components/common/LoadingSpinner";
import { PageError, ErrorMessage } from "../components/common/ErrorMessage";
import { Modal } from "../components/common/Modal";
import { Button } from "../components/common/Button";
import AlertList from "../components/features/alerts/AlertList";
import AlertForm from "../components/features/alerts/AlertForm";
import type {
  Alert,
  CreateAlertDto,
  UpdateAlertDto,
  ModalMode,
} from "../types";
import { Trash2 } from "lucide-react";

// ============================================================================
// ALERTS PAGE COMPONENT
// ============================================================================

export const AlertsPage = () => {
  const {
    alerts,
    isLoading,
    error,
    fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlert,
    clearError,
  } = useAlerts(false);

  // Modal states
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: ModalMode;
    alert?: Alert;
  }>({
    isOpen: false,
    mode: "create",
  });

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    alert?: Alert;
  }>({
    isOpen: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch alerts on mount
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Handle create new
  const handleCreateNew = () => {
    setModalState({
      isOpen: true,
      mode: "create",
    });
    setFormError(null);
  };

  // Handle edit
  const handleEdit = (alert: Alert) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      alert,
    });
    setFormError(null);
  };

  // Handle delete
  const handleDelete = (alert: Alert) => {
    setDeleteModalState({
      isOpen: true,
      alert,
    });
  };

  // Handle toggle
  const handleToggle = async (alert: Alert) => {
    setFormLoading(true);
    const result = await toggleAlert(alert.alertId);
    setFormLoading(false);

    if (!result) {
      setFormError("Failed to toggle alert status");
    }
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteModalState.alert) return;

    setFormLoading(true);
    setFormError(null);

    const success = await deleteAlert(deleteModalState.alert.alertId);

    if (success) {
      setDeleteModalState({ isOpen: false });
    } else {
      setFormError("Failed to delete alert");
    }

    setFormLoading(false);
  };

  // Handle form submit
  const handleFormSubmit = async (data: CreateAlertDto | UpdateAlertDto) => {
    setFormLoading(true);
    setFormError(null);

    try {
      if (modalState.mode === "create") {
        const result = await createAlert(data as CreateAlertDto);
        if (result) {
          setModalState({ isOpen: false, mode: "create" });
        } else {
          setFormError("Failed to create alert");
        }
      } else if (modalState.mode === "edit" && modalState.alert) {
        const result = await updateAlert(
          modalState.alert.alertId,
          data as UpdateAlertDto
        );
        if (result) {
          setModalState({ isOpen: false, mode: "create" });
        } else {
          setFormError("Failed to update alert");
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
  if (isLoading && alerts.length === 0) {
    return (
      <Layout>
        <PageLoader text="Loading your alerts..." />
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <PageError
          title="Failed to load alerts"
          message={error}
          onRetry={() => {
            fetchAlerts();
            clearError();
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Alert List */}
        <AlertList
          alerts={alerts}
          currency="EUR"
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />

        {/* Create/Edit Modal */}
        <Modal
          isOpen={modalState.isOpen}
          onClose={handleModalClose}
          title={
            modalState.mode === "create" ? "Create Price Alert" : "Edit Alert"
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
          <AlertForm
            alert={modalState.alert}
            onSubmit={handleFormSubmit}
            onCancel={handleModalClose}
            isLoading={formLoading}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalState.isOpen}
          onClose={() => !formLoading && setDeleteModalState({ isOpen: false })}
          title="Delete Alert"
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
              <Trash2 className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 mb-1">
                  Are you sure you want to delete this alert?
                </p>
                <p className="text-sm text-red-700">
                  Alert:{" "}
                  <span className="font-semibold">
                    {deleteModalState.alert?.assetSymbol}
                  </span>{" "}
                  - Target:{" "}
                  <span className="font-semibold">
                    €{deleteModalState.alert?.targetPrice.toFixed(2)}
                  </span>
                </p>
                <p className="text-sm text-red-700 mt-2">
                  You will no longer receive notifications for this price alert.
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
                Delete Alert
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default AlertsPage;
