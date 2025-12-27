import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================================
// AuthContext
// Global authentication context for managing user state across the app
// ============================================================================
import { createContext, useContext, useState, useEffect, } from "react";
import authService from "../services/auth.service";
import { getErrorMessage } from "../services/api";
// ============================================================================
// CONTEXT CREATION
// ============================================================================
const AuthContext = createContext(undefined);
// ============================================================================
// AUTH PROVIDER COMPONENT
// ============================================================================
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(authService.getUser());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    /**
     * Check if user is authenticated and token is valid on mount
     */
    useEffect(() => {
        const initializeAuth = async () => {
            const token = authService.getToken();
            if (token) {
                // Check if token is expired
                if (authService.isTokenExpired()) {
                    // Token expired, clear everything
                    authService.logout();
                    setUser(null);
                }
                else {
                    // Token valid, try to get fresh user data
                    try {
                        const userData = await authService.getProfile();
                        setUser(userData);
                    }
                    catch (err) {
                        // If profile fetch fails, clear auth
                        console.error("Failed to fetch user profile:", err);
                        authService.logout();
                        setUser(null);
                    }
                }
            }
            setIsInitialized(true);
        };
        initializeAuth();
    }, []);
    /**
     * Login user
     */
    const login = async (credentials) => {
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
    };
    /**
     * Register new user
     */
    const register = async (data) => {
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
    };
    /**
     * Logout user
     */
    const logout = () => {
        authService.logout();
        setUser(null);
        setError(null);
    };
    /**
     * Refresh user profile data
     */
    const refreshUser = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await authService.getProfile();
            setUser(userData);
        }
        catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            // If refresh fails with 401, logout user
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err;
                if (axiosError.response?.status === 401) {
                    logout();
                }
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    /**
     * Clear error message
     */
    const clearError = () => {
        setError(null);
    };
    // Don't render children until auth is initialized
    if (!isInitialized) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Loading..." })] }) }));
    }
    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        refreshUser,
        clearError,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
// ============================================================================
// CUSTOM HOOK TO USE AUTH CONTEXT
// ============================================================================
/**
 * Custom hook to access authentication context
 * Must be used within AuthProvider
 */
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};
// ============================================================================
// EXPORT DEFAULT
// ============================================================================
export default AuthContext;
