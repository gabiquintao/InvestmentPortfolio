import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { Trash2 } from "lucide-react";
// ============================================================================
// ALERTS PAGE COMPONENT
// ============================================================================
export const AlertsPage = () => {
    const { alerts, isLoading, error, fetchAlerts, createAlert, updateAlert, deleteAlert, clearError, } = useAlerts(false);
    // Modal states
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: "create",
    });
    const [deleteModalState, setDeleteModalState] = useState({
        isOpen: false,
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
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
    const handleEdit = (alert) => {
        setModalState({
            isOpen: true,
            mode: "edit",
            alert,
        });
        setFormError(null);
    };
    // Handle delete
    const handleDelete = (alert) => {
        setDeleteModalState({
            isOpen: true,
            alert,
        });
    };
    // Handle toggle
    const handleToggle = async (alert) => {
        setFormLoading(true);
        setFormLoading(false);
    };
    // Confirm delete
    const handleConfirmDelete = async () => {
        if (!deleteModalState.alert)
            return;
        setFormLoading(true);
        setFormError(null);
        const success = await deleteAlert(deleteModalState.alert.alertId);
        if (success) {
            setDeleteModalState({ isOpen: false });
        }
        else {
            setFormError("Failed to delete alert");
        }
        setFormLoading(false);
    };
    // Handle form submit
    const handleFormSubmit = async (data) => {
        setFormLoading(true);
        setFormError(null);
        try {
            if (modalState.mode === "create") {
                const result = await createAlert(data);
                if (result) {
                    setModalState({ isOpen: false, mode: "create" });
                }
                else {
                    setFormError("Failed to create alert");
                }
            }
            else if (modalState.mode === "edit" && modalState.alert) {
                const result = await updateAlert(modalState.alert.alertId, data);
                if (result) {
                    setModalState({ isOpen: false, mode: "create" });
                }
                else {
                    setFormError("Failed to update alert");
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
    if (isLoading && alerts.length === 0) {
        return (_jsx(Layout, { children: _jsx(PageLoader, { text: "Loading your alerts..." }) }));
    }
    // Error state
    if (error) {
        return (_jsx(Layout, { children: _jsx(PageError, { title: "Failed to load alerts", message: error, onRetry: () => {
                    fetchAlerts();
                    clearError();
                } }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "space-y-6", children: [_jsx(AlertList, { alerts: alerts, currency: "EUR", onCreateNew: handleCreateNew, onEdit: handleEdit, onDelete: handleDelete, onToggle: handleToggle }), _jsxs(Modal, { isOpen: modalState.isOpen, onClose: handleModalClose, title: modalState.mode === "create" ? "Create Price Alert" : "Edit Alert", size: "md", children: [formError && (_jsx("div", { className: "mb-4", children: _jsx(ErrorMessage, { message: formError, onClose: () => setFormError(null) }) })), _jsx(AlertForm, { alert: modalState.alert, onSubmit: handleFormSubmit, onCancel: handleModalClose, isLoading: formLoading })] }), _jsxs(Modal, { isOpen: deleteModalState.isOpen, onClose: () => !formLoading && setDeleteModalState({ isOpen: false }), title: "Delete Alert", size: "sm", children: [formError && (_jsx("div", { className: "mb-4", children: _jsx(ErrorMessage, { message: formError, onClose: () => setFormError(null) }) })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg", children: [_jsx(Trash2, { className: "h-5 w-5 text-red-600 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-red-900 mb-1", children: "Are you sure you want to delete this alert?" }), _jsxs("p", { className: "text-sm text-red-700", children: ["Alert:", " ", _jsx("span", { className: "font-semibold", children: deleteModalState.alert?.assetSymbol }), " ", "- Target:", " ", _jsxs("span", { className: "font-semibold", children: ["\u20AC", deleteModalState.alert?.targetPrice.toFixed(2)] })] }), _jsx("p", { className: "text-sm text-red-700 mt-2", children: "You will no longer receive notifications for this price alert." })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-3", children: [_jsx(Button, { variant: "secondary", onClick: () => setDeleteModalState({ isOpen: false }), disabled: formLoading, children: "Cancel" }), _jsx(Button, { variant: "danger", onClick: handleConfirmDelete, isLoading: formLoading, disabled: formLoading, children: "Delete Alert" })] })] })] })] }) }));
};
export default AlertsPage;
