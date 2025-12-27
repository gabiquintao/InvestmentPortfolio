// ============================================================================
// useAuth Hook
// Custom hook for authentication operations
// ============================================================================
import { useState, useCallback } from "react";
import authService from "../services/auth.service";
import { getErrorMessage } from "../services/api";
/**
 * Custom hook for authentication
 * Manages login, register, logout, and user state
 */
export const useAuth = () => {
    const [user, setUser] = useState(authService.getUser());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    /**
     * Login user
     */
    const login = useCallback(async (credentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            return true;
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            return false;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    /**
     * Register new user
     */
    const register = useCallback(async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.register(data);
            setUser(response.user);
            return true;
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            return false;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
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
    const getProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await authService.getProfile();
            setUser(userData);
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
        }
        finally {
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
