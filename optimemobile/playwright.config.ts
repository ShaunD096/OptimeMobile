import { defineConfig, devices } from "@playwright/test";

/**
 * Visual/structural regression for the dashboard (handoff §3).
 *
 * Prerequisite: `npm run dev:local` has run at least once (creates and
 * seeds prisma/dev.db). The suite starts its own dev server against
 * that database — or reuses one already running on :3000.
 *
 * WHY structural assertions + an archived screenshot per breakpoint,
 * with pixel comparison only where content is deterministic (the
 * login page): the seed re-dates the golden dataset daily so "this
 * month" always contains data — which means the NUMBERS legitimately
 * move every day, and a pixel baseline of the dashboard would fail
 * every midnight by design. What a regression actually breaks —
 * wrapping, clipping, stacking order, gauge geometry, overflow — is
 * asserted directly at every handoff breakpoint instead, and a
 * full-page screenshot is attached to every run for eyes.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 240_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    // The app honors prefers-reduced-motion; this kills entrance
    // animations so structure is measured at rest.
    contextOptions: { reducedMotion: "reduce" },
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "node scripts/dev-local.mjs --no-seed",
    url: "http://localhost:3000/login",
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      DATABASE_URL: "file:./prisma/dev.db",
    },
  },
});
