// ============================================================================
// Axios instance for MarketData API (via Vite proxy)
// ============================================================================
import axios from "axios";

const MARKET_API_BASE_URL =
  import.meta.env.VITE_MARKET_API_BASE_URL || "/market";

const marketApi = axios.create({
  baseURL: MARKET_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: interceptors for auth, logging, errors (if needed)
marketApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Market API error:", error);
    return Promise.reject(error);
  }
);

export default marketApi;
