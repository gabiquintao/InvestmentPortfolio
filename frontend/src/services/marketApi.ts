// ============================================================================
// Axios instance for MarketData API (running on port 5088)
// ============================================================================
import axios from "axios";

const MARKET_API_BASE_URL =
  import.meta.env.VITE_MARKET_API_BASE_URL || "http://localhost:5088/api/market";

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
