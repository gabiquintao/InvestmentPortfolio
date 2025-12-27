// ============================================================================
// AuthContext
// Global authentication context for managing user state across the app
// ============================================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import authService from "../services/auth.service";
import type { User, LoginRequest, RegisterRequest } from "../types";
import { getErrorMessage } from "../services/api";

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// AUTH PROVIDER COMPONENT
// ============================================================================

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        } else {
          // Token valid, try to get fresh user data
          try {
            const userData = await authService.getProfile();
            setUser(userData);
          } catch (err) {
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
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (data: RegisterRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);
      setUser(response.user);
      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return false;
    } finally {
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
  const refreshUser = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);

      // If refresh fails with 401, logout user
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as any;
        if (axiosError.response?.status === 401) {
          logout();
        }
      }
    } finally {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const value: AuthContextType = {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================================
// CUSTOM HOOK TO USE AUTH CONTEXT
// ============================================================================

/**
 * Custom hook to access authentication context
 * Must be used within AuthProvider
 */
export const useAuthContext = (): AuthContextType => {
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
