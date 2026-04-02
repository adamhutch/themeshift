import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { themeShift } from "@themeshift/vite-plugin-themeshift";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    react(),
    themeShift({
      extends: ["@themeshift/ui"],
      cssVarPrefix: "themeshift",
    }),
  ],
});
