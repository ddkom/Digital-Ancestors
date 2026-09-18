import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const webRoot = path.dirname(fileURLToPath(import.meta.url));
const personasDir = path.resolve(webRoot, "personas");

export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/Digital-Ancestors/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@personas": personasDir,
    },
  },
  server: {
    fs: {
      allow: [webRoot, personasDir],
    },
  },
});
