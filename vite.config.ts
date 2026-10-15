import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    allowedHosts: [
      ".ngrok-free.app",
      "unconsociated-paradisaical-olimpia.ngrok-free.dev",
    ], // Vite bloqueia hosts desconhecidos
    proxy: {
      "/api": {
        target: "http://localhost:8284",
        changeOrigin: true,
        cookieDomainRewrite: "", // remove Domain=localhost do Set-Cookie
      },
    },
  },
});
