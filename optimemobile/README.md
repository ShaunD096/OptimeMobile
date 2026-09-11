# Atlas Go — Optime Financial

Personal financial intelligence: a user connects their bank through Plaid,
and the app computes how well they manage money — Savings Achievement,
Income Velocity, Cash Retention, two debt burdens, a twelve-month Real
Cash Position — composed into a 0–100 Financial Management Score, plus a
cash forecast and a Travel / Travel-Optimizer line.

**The one rule everything else serves:** a number that is wrong but
confident is worse than no number. Money is integer cents; `null` means
unavailable and `0` means measured zero; every published score can be
recomputed bit-for-bit from its stored inputs. The engineering rules live
in [AGENTS.md](AGENTS.md).

## Architecture

```
Plaid Link (browser)
  → /api/plaid/create-link-token        auth first, session-keyed
  → /api/plaid/set-access-token         token stored SERVER-SIDE only (PlaidItem)
  → /api/plaid/ingest
        app/lib/normalizer.ts           Plaid → canonical schema v2.1
                                        (transfer pairs, refunds/reversals,
                                        versioned category mapping, dedup)
        LedgerSnapshot                  immutable input journal (audit/replay)
  → /api/v1/dashboard/financial-intelligence
        app/lib/finance/metrics/        the deterministic engine — BOTH
                                        methodology versions, every run
        lib/services/budgetService.ts   server-side budget plans (revisioned)
        MetricSnapshot                  append-only, replayable score records
  → app/dashboard                       renders; computes nothing
proxy.ts                                deny-by-default route protection
docs/openapi.financial-intelligence.yaml   the published API schema
docs/optime-worked-calculations.xlsx       the maths, generated FROM the engine
```

## Requirements

- **Node 22+**, npm
- **PostgreSQL** in production (`DATABASE_URL`); **no database install
  needed for local dev** — see `dev:local` below
- Plaid Sandbox credentials for live ingest (optional; the seeded demo
  works without them)

Every environment variable is documented in [.env.example](.env.example).
No secret may carry a `NEXT_PUBLIC_` prefix — the build fails if one does.

## Local development, zero services

```bash
npm ci
npm run dev:local        # SQLite + seeded demo data + next dev
# → http://localhost:3000 · login kobe@atlasgo.com / AtlasGo2026!
```

`dev:local` derives a SQLite schema from the Postgres source of truth,
seeds the 2,000-row golden dataset through the real ingest pipeline (plus
a budget and bills, dates shifted so "this month" has data), and starts
the dev server. SQLite refuses to run in production by design.

`dev:local` also sets `AUTO_DEMO_SEED=1`, so when ANY authenticated user
(not just kobe) has no data yet — say a freshly registered account — the
dashboard seeds the golden dataset for them on demand instead of showing
an empty state. The flag is set only in `dev:local`: plain `npm run dev`
(Postgres) and production leave it off, so a genuinely empty user there
reports an honest empty state rather than a fabricated number.

Native build steps are gated by npm 12's `allowScripts` policy. The
required packages are already approved in `package.json` under
`"allowScripts"`, so a plain `npm ci` builds `better-sqlite3` and the
Prisma engines automatically. If a fresh install ever reports install
scripts "blocked / not covered by allowScripts", approve them with
`npm install-scripts approve better-sqlite3 @prisma/engines prisma esbuild
sharp unrs-resolver` (or `npm install-scripts ls` to review) rather than
disabling the policy globally.

Troubleshooting: if a page shows a "Cannot find module" overlay after
dependency or Prisma-client changes, the dev cache went stale — delete
`.next/` and restart.

With your own Postgres instead:

```bash
# .env: DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL (see .env.example)
node scripts/generate-prisma-client.mjs
npx prisma db push       # sync the schema
npm run db:seed          # optional demo data
npm run dev
```

## Verification

```bash
npm test                             # vitest — 345 tests (money path, boundaries, replay)
npx tsc --noEmit                     # zero errors required
npm run build                        # env guard + prisma generate + next build
npm run test:visual                  # Playwright: handoff breakpoints + login baseline
npm run generate:worked-calculations # regenerate docs/optime-worked-calculations.xlsx
```

## Deploying from this README

1. Provision PostgreSQL; set `DATABASE_URL`.
2. Set `AUTH_SECRET` (`openssl rand -base64 32`), `NEXTAUTH_URL`/`AUTH_URL`
   to the public origin, and the Plaid trio (`PLAID_CLIENT_ID`,
   `PLAID_SECRET`, `PLAID_ENV`).
3. `npm ci && npm run build` — the build fails on client-exposed secrets
   and regenerates the Prisma client for Postgres.
4. Apply the schema: `npx prisma db push` (the repo currently ships no
   migration files; adopt `prisma migrate` before the first schema change
   after real user data exists).
5. `npm run start`.
6. Verify the security boundary: an unregistered URL redirects to
   `/login`; `/api/v1/dashboard/financial-intelligence` returns 401
   unauthenticated; no bank token ever appears in browser storage.

Optional integrations (each degrades honestly when unset):
`FLIGHTS_API_BASE_URL` (flight search; without it the travel page shows
modeled estimates and says so), `WEATHER_API_KEY` (paid weather fallback —
US weather works keyless via the National Weather Service).
