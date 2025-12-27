// ============================================================================
// API Configuration & Axios Instance
// Centralized HTTP client with interceptors for auth and error handling
// ============================================================================
import axios, { AxiosError, } from "axios";
// Base API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});
// ============================================================================
// REQUEST INTERCEPTOR - Add JWT token to all requests
// ============================================================================
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// ============================================================================
// RESPONSE INTERCEPTOR - Handle errors globally
// ============================================================================
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // Handle different error scenarios
    if (error.response) {
        const { status, data } = error.response;
        switch (status) {
            case 401:
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
                break;
            case 403:
                // Forbidden - user doesn't have permission
                console.error("Access forbidden:", data?.message ||
                    "You do not have permission to access this resource");
                break;
            case 404:
                // Not found
                console.error("Resource not found:", data?.message || "The requested resource was not found");
                break;
            case 400:
                // Bad request - validation errors
                console.error("Bad request:", data?.message || "Invalid request");
                if (data?.errors && data.errors.length > 0) {
                    console.error("Validation errors:", data.errors);
                }
                break;
            case 502:
                // Bad Gateway - WCF service unavailable
                console.error("Service unavailable:", data?.message || "The service is temporarily unavailable");
                break;
            case 500:
                // Internal server error
                console.error("Server error:", data?.message || "An internal server error occurred");
                break;
            default:
                console.error("HTTP error:", status, data?.message || error.message);
        }
    }
    else if (error.request) {
        // Request was made but no response received
        console.error("Network error: No response received from server");
    }
    else {
        // Something else happened
        console.error("Request error:", error.message);
    }
    return Promise.reject(error);
});
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Extract error message from axios error
 */
export const getErrorMessage = (error) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error;
        if (axiosError.response?.data?.message) {
            return axiosError.response.data.message;
        }
        if (axiosError.response?.data?.errors &&
            axiosError.response.data.errors.length > 0) {
            return axiosError.response.data.errors.join(", ");
        }
        return axiosError.message || "An unexpected error occurred";
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "An unexpected error occurred";
};
/**
 * Check if error is an authentication error
 */
export const isAuthError = (error) => {
    if (axios.isAxiosError(error)) {
        return error.response?.status === 401;
    }
    return false;
};
/**
 * Check if error is a forbidden error
 */
export const isForbiddenError = (error) => {
    if (axios.isAxiosError(error)) {
        return error.response?.status === 403;
    }
    return false;
};
/**
 * Check if error is a not found error
 */
export const isNotFoundError = (error) => {
    if (axios.isAxiosError(error)) {
        return error.response?.status === 404;
    }
    return false;
};
/**
 * Check if error is a validation error
 */
export const isValidationError = (error) => {
    if (axios.isAxiosError(error)) {
        return error.response?.status === 400;
    }
    return false;
};
export default api;
