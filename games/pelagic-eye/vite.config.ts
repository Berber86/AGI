import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
  build: {
    assetsDir: "assets",
    assetsInlineLimit: 1_000_000,
    chunkSizeWarningLimit: 1_000,
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
