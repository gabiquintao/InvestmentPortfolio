// ============================================================================
// Authentication Service
// Handles user authentication, registration, and profile management
// ============================================================================
import api from "./api";
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
    async login(credentials) {
        const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
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
    async register(data) {
        const response = await api.post(AUTH_ENDPOINTS.REGISTER, data);
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
    async getProfile() {
        const response = await api.get(AUTH_ENDPOINTS.PROFILE);
        // Update user in localStorage
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
    }
    /**
     * Validate current token
     */
    async validateToken(token) {
        const response = await api.post(AUTH_ENDPOINTS.VALIDATE, JSON.stringify(token), {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    }
    /**
     * Logout user - clear local storage
     */
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
    /**
     * Get stored token from localStorage
     */
    getToken() {
        return localStorage.getItem("token");
    }
    /**
     * Get stored user from localStorage
     */
    getUser() {
        const userStr = localStorage.getItem("user");
        if (!userStr)
            return null;
        try {
            return JSON.parse(userStr);
        }
        catch {
            return null;
        }
    }
    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        const token = this.getToken();
        return !!token;
    }
    /**
     * Check if token is expired (basic check based on expiresAt)
     */
    isTokenExpired() {
        const token = this.getToken();
        if (!token)
            return true;
        try {
            // Decode JWT token (basic implementation)
            const payload = JSON.parse(atob(token.split(".")[1]));
            const expirationTime = payload.exp * 1000; // Convert to milliseconds
            return Date.now() >= expirationTime;
        }
        catch {
            return true;
        }
    }
}
// Export singleton instance
export default new AuthService();
