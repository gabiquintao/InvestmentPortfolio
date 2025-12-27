// ============================================================================
// Authentication Service
// Handles user authentication, registration, and profile management
// ============================================================================

import api from "./api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "../types";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  PROFILE: "/auth/profile",
  VALIDATE: "/auth/validate",
};

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    );

    // Store token and user in localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );

    // Store token and user in localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await api.get<User>(AUTH_ENDPOINTS.PROFILE);

    // Update user in localStorage
    localStorage.setItem("user", JSON.stringify(response.data));

    return response.data;
  }

  /**
   * Validate current token
   */
  async validateToken(
    token: string
  ): Promise<{ valid: boolean; userId: number }> {
    const response = await api.post<{ valid: boolean; userId: number }>(
      AUTH_ENDPOINTS.VALIDATE,
      JSON.stringify(token),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }

  /**
   * Logout user - clear local storage
   */
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /**
   * Get stored token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Get stored user from localStorage
   */
  getUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Check if token is expired (basic check based on expiresAt)
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decode JWT token (basic implementation)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds

      return Date.now() >= expirationTime;
    } catch {
      return true;
    }
  }
}

// Export singleton instance
export default new AuthService();
