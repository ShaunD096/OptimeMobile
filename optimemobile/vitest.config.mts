import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    // Both source trees: app/ (engine + routes) and lib/ (infra +
    // services). The old app-only glob silently skipped any test file
    // added under lib/.
    include: [
      "app/**/*.test.ts",
      "app/**/*.test.tsx",
      "lib/**/*.test.ts",
      "lib/**/*.test.tsx",
    ],
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
  },
});
