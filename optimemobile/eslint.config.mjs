import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // A SEPARATE deployable service (own package.json, deliberately
    // CommonJS, runs standalone on Railway) — not part of the Next
    // app's source tree, so the app's ESM/TS ruleset does not apply.
    "tailscale-bridge/**",
  ]),
]);

export default eslintConfig;
