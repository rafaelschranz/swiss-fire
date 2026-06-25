import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Resolve the "@/..." path alias (tsconfig paths) for tests, so UI-layer
// modules (e.g. lib/estimates, lib/share) that use it can be imported.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
