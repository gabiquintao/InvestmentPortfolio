// ============================================================================
// useAlerts Hook
// Custom hook for alert operations
// ============================================================================
import { useState, useEffect, useCallback } from "react";
import alertService from "../services/alert.service";
import { AlertCondition, } from "../types";
import { getErrorMessage } from "../services/api";
/**
 * Custom hook for alert management
 */
export const useAlerts = (autoFetch = true) => {
    const [alerts, setAlerts] = useState([]);
    const [activeAlerts, setActiveAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchAlerts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await alertService.getUserAlerts();
            setAlerts(data);
        }
        catch (err) {
            setError(getErrorMessage(err));
            setAlerts([]);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const fetchActiveAlerts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await alertService.getActiveAlerts();
            setActiveAlerts(data);
        }
        catch (err) {
            setError(getErrorMessage(err));
            setActiveAlerts([]);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const getAlertById = useCallback(async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            return await alertService.getById(id);
        }
        catch (err) {
            setError(getErrorMessage(err));
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const createAlert = useCallback(async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const newAlert = await alertService.create(data);
            setAlerts((prev) => [...prev, newAlert]);
            if (newAlert.isActive)
                setActiveAlerts((prev) => [...prev, newAlert]);
            return newAlert;
        }
        catch (err) {
            setError(getErrorMessage(err));
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const updateAlert = useCallback(async (id, data) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedAlert = await alertService.update(id, data);
            setAlerts((prev) => prev.map((a) => (a.alertId === id ? updatedAlert : a)));
            setActiveAlerts((prev) => data.isActive
                ? prev.map((a) => (a.alertId === id ? updatedAlert : a))
                : prev.filter((a) => a.alertId !== id));
            return updatedAlert;
        }
        catch (err) {
            setError(getErrorMessage(err));
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const deleteAlert = useCallback(async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            await alertService.delete(id);
            setAlerts((prev) => prev.filter((a) => a.alertId !== id));
            setActiveAlerts((prev) => prev.filter((a) => a.alertId !== id));
            return true;
        }
        catch (err) {
            setError(getErrorMessage(err));
            return false;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const getAlertsBySymbol = useCallback((symbol) => alerts.filter((alert) => alert.assetSymbol === symbol), [alerts]);
    const getAlertsByCondition = useCallback((condition) => alerts.filter((alert) => alert.condition === condition), [alerts]);
    const getTriggeredAlerts = useCallback(() => alerts.filter((alert) => alert.triggeredAt !== null), [alerts]);
    const getUntriggeredAlerts = useCallback(() => alerts.filter((alert) => alert.triggeredAt === null), [alerts]);
    const getActiveAlertsCount = useCallback(() => activeAlerts.length, [activeAlerts]);
    const hasTriggeredAlerts = useCallback(() => alerts.some((alert) => alert.triggeredAt !== null), [alerts]);
    const clearError = useCallback(() => setError(null), []);
    useEffect(() => {
        if (autoFetch) {
            fetchAlerts();
            fetchActiveAlerts();
        }
    }, [autoFetch, fetchAlerts, fetchActiveAlerts]);
    return {
        alerts,
        activeAlerts,
        isLoading,
        error,
        fetchAlerts,
        fetchActiveAlerts,
        getAlertById,
        createAlert,
        updateAlert,
        deleteAlert,
        getAlertsBySymbol,
        getAlertsByCondition,
        getTriggeredAlerts,
        getUntriggeredAlerts,
        getActiveAlertsCount,
        hasTriggeredAlerts,
        clearError,
    };
};
