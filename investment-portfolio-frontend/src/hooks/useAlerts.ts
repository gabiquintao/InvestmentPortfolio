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
  toggleAlert: (id: number) => Promise<Alert | null>;
  activateAlert: (id: number) => Promise<Alert | null>;
  deactivateAlert: (id: number) => Promise<Alert | null>;
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

  /**
   * Fetch all alerts for the authenticated user
   */
  const fetchAlerts = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await alertService.getUserAlerts();
      setAlerts(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch only active alerts
   */
  const fetchActiveAlerts = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await alertService.getActiveAlerts();
      setActiveAlerts(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setActiveAlerts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get a specific alert by ID
   */
  const getAlertById = useCallback(
    async (id: number): Promise<Alert | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const alert = await alertService.getById(id);
        return alert;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Create a new alert
   */
  const createAlert = useCallback(
    async (data: CreateAlertDto): Promise<Alert | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const newAlert = await alertService.create(data);
        setAlerts((prev) => [...prev, newAlert]);
        if (newAlert.isActive) {
          setActiveAlerts((prev) => [...prev, newAlert]);
        }
        return newAlert;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Update an existing alert
   */
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
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Delete an alert
   */
  const deleteAlert = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await alertService.delete(id);
      setAlerts((prev) => prev.filter((a) => a.alertId !== id));
      setActiveAlerts((prev) => prev.filter((a) => a.alertId !== id));
      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Toggle alert active status
   */
  const toggleAlert = useCallback(async (id: number): Promise<Alert | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedAlert = await alertService.toggleActive(id);
      setAlerts((prev) =>
        prev.map((a) => (a.alertId === id ? updatedAlert : a))
      );

      if (updatedAlert.isActive) {
        setActiveAlerts((prev) => [...prev, updatedAlert]);
      } else {
        setActiveAlerts((prev) => prev.filter((a) => a.alertId !== id));
      }

      return updatedAlert;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Activate an alert
   */
  const activateAlert = useCallback(
    async (id: number): Promise<Alert | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedAlert = await alertService.activate(id);
        setAlerts((prev) =>
          prev.map((a) => (a.alertId === id ? updatedAlert : a))
        );
        setActiveAlerts((prev) => [...prev, updatedAlert]);
        return updatedAlert;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Deactivate an alert
   */
  const deactivateAlert = useCallback(
    async (id: number): Promise<Alert | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedAlert = await alertService.deactivate(id);
        setAlerts((prev) =>
          prev.map((a) => (a.alertId === id ? updatedAlert : a))
        );
        setActiveAlerts((prev) => prev.filter((a) => a.alertId !== id));
        return updatedAlert;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Get alerts for a specific symbol
   */
  const getAlertsBySymbol = useCallback(
    (symbol: string): Alert[] => {
      return alerts.filter((alert) => alert.assetSymbol === symbol);
    },
    [alerts]
  );

  /**
   * Get alerts by condition
   */
  const getAlertsByCondition = useCallback(
    (condition: AlertCondition): Alert[] => {
      return alerts.filter((alert) => alert.condition === condition);
    },
    [alerts]
  );

  /**
   * Get triggered alerts
   */
  const getTriggeredAlerts = useCallback((): Alert[] => {
    return alerts.filter((alert) => alert.triggeredAt !== null);
  }, [alerts]);

  /**
   * Get untriggered alerts
   */
  const getUntriggeredAlerts = useCallback((): Alert[] => {
    return alerts.filter((alert) => alert.triggeredAt === null);
  }, [alerts]);

  /**
   * Get count of active alerts
   */
  const getActiveAlertsCount = useCallback((): number => {
    return activeAlerts.length;
  }, [activeAlerts]);

  /**
   * Check if there are any triggered alerts
   */
  const hasTriggeredAlerts = useCallback((): boolean => {
    return alerts.some((alert) => alert.triggeredAt !== null);
  }, [alerts]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount if enabled
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
    toggleAlert,
    activateAlert,
    deactivateAlert,
    getAlertsBySymbol,
    getAlertsByCondition,
    getTriggeredAlerts,
    getUntriggeredAlerts,
    getActiveAlertsCount,
    hasTriggeredAlerts,
    clearError,
  };
};
