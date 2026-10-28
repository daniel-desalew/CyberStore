import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // REST API
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      // WebSocket chat — proxied through Vite dev server
      "/ws": {
        target: "ws://localhost:5001",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
