// ============================================================================
// useAlerts Hook
// Custom hook for alert operations
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import alertService from "../services/alert.service";
import {
  type Alert,
  type CreateAlertDto,
  type UpdateAlertDto,
  AlertCondition,
} from "../types";
import { getErrorMessage } from "../services/api";

interface UseAlertsReturn {
  alerts: Alert[];
  activeAlerts: Alert[];
  isLoading: boolean;
  error: string | null;
  fetchAlerts: () => Promise<void>;
  fetchActiveAlerts: () => Promise<void>;
  getAlertById: (id: number) => Promise<Alert | null>;
  createAlert: (data: CreateAlertDto) => Promise<Alert | null>;
  updateAlert: (id: number, data: UpdateAlertDto) => Promise<Alert | null>;
  deleteAlert: (id: number) => Promise<boolean>;
  getAlertsBySymbol: (symbol: string) => Alert[];
  getAlertsByCondition: (condition: AlertCondition) => Alert[];
  getTriggeredAlerts: () => Alert[];
  getUntriggeredAlerts: () => Alert[];
  getActiveAlertsCount: () => number;
  hasTriggeredAlerts: () => boolean;
  clearError: () => void;
}

/**
 * Custom hook for alert management
 */
export const useAlerts = (autoFetch: boolean = true): UseAlertsReturn => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alertService.getUserAlerts();
      setAlerts(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchActiveAlerts = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alertService.getActiveAlerts();
      setActiveAlerts(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setActiveAlerts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAlertById = useCallback(async (id: number): Promise<Alert | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await alertService.getById(id);
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAlert = useCallback(async (data: CreateAlertDto): Promise<Alert | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const newAlert = await alertService.create(data);
      setAlerts((prev) => [...prev, newAlert]);
      if (newAlert.isActive) setActiveAlerts((prev) => [...prev, newAlert]);
      return newAlert;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAlert = useCallback(
    async (id: number, data: UpdateAlertDto): Promise<Alert | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedAlert = await alertService.update(id, data);
        setAlerts((prev) =>
          prev.map((a) => (a.alertId === id ? updatedAlert : a))
        );
        setActiveAlerts((prev) =>
          data.isActive
            ? prev.map((a) => (a.alertId === id ? updatedAlert : a))
            : prev.filter((a) => a.alertId !== id)
        );
        return updatedAlert;
      } catch (err) {
        setError(getErrorMessage(err));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteAlert = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await alertService.delete(id);
      setAlerts((prev) => prev.filter((a) => a.alertId !== id));
      setActiveAlerts((prev) => prev.filter((a) => a.alertId !== id));
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAlertsBySymbol = useCallback(
    (symbol: string) => alerts.filter((alert) => alert.assetSymbol === symbol),
    [alerts]
  );

  const getAlertsByCondition = useCallback(
    (condition: AlertCondition) => alerts.filter((alert) => alert.condition === condition),
    [alerts]
  );

  const getTriggeredAlerts = useCallback(
    () => alerts.filter((alert) => alert.triggeredAt !== null),
    [alerts]
  );

  const getUntriggeredAlerts = useCallback(
    () => alerts.filter((alert) => alert.triggeredAt === null),
    [alerts]
  );

  const getActiveAlertsCount = useCallback(() => activeAlerts.length, [activeAlerts]);

  const hasTriggeredAlerts = useCallback(
    () => alerts.some((alert) => alert.triggeredAt !== null),
    [alerts]
  );

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
