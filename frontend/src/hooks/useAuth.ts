// ============================================================================
// useAuth Hook
// Custom hook for authentication operations
// ============================================================================

import { useState, useCallback } from "react";
import authService from "../services/auth.service";
import type {
  LoginRequest,
  RegisterRequest,
  User,
  AuthResponse,
} from "../types";
import { getErrorMessage } from "../services/api";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  getProfile: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for authentication
 * Manages login, register, logout, and user state
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login user
   */
  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response: AuthResponse = await authService.login(credentials);
        setUser(response.user);
        return true;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Register new user
   */
  const register = useCallback(
    async (data: RegisterRequest): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response: AuthResponse = await authService.register(data);
        setUser(response.user);
        return true;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  /**
   * Get user profile
   */
  const getProfile = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    error,
    login,
    register,
    logout,
    getProfile,
    clearError,
  };
};
