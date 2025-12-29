import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  server: {
    port: 3000,
    proxy: {
      // API Principal
      "/api": {
        target: "https://localhost:7039",
        changeOrigin: true,
        secure: false,
      },
      // MarketData via Proxy (evita CORS)
      "/market": {
        target: "http://localhost:5088",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/market/, "/api/market"),
      },
    },
  },
});
