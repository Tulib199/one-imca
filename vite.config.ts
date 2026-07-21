import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project site: https://<user>.github.io/one-imca/
export default defineConfig({
  plugins: [react()],
  base: "/one-imca/",
});
