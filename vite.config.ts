import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Railway / local: "/" · GitHub Pages: set VITE_BASE_PATH=/one-imca/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/",
});
