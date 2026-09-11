<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Atlas Go / Optime Financial — Engineering Guide

Personal financial intelligence: Plaid ingest → canonical normalizer →
deterministic metric engine → Financial Management Score + cash forecasts,
plus a Travel / Travel-Optimizer line. Next.js 16 App Router, React 19,
Prisma 7 (PostgreSQL), NextAuth v5 (credentials), Vitest.

```
app/lib/normalizer.ts           Plaid → canonical schema v2 (transfer pairs,
                                dedup, versioned category mapping)
app/lib/finance/metrics/        THE metric engine: Savings Achievement,
                                Income Velocity, Cash Retention, debt burdens,
                                Real Cash Position, FMS (both methodology
                                versions), spending timing. Pure + replayable.
app/lib/finance/cashForecast.ts Daily-horizon forecast (gross in/out, partition)
lib/services/metricSnapshotService.ts  Persistence + REPLAY of every score
lib/periods.ts                  Half-open periods in the user's IANA timezone
app/api/v1/dashboard/financial-intelligence  The versioned dashboard API
docs/openapi.financial-intelligence.yaml     Its published schema
docs/intelligence-architecture.md            Rules-vs-models decision record
proxy.ts                        DENY-BY-DEFAULT route protection
```

## Money rules (binding)

- Money is integer minor units + currency. The engine works in cents;
  the client only formats.
- **`null` means unavailable; `0` means a real measured zero.** Never
  substitute one for the other, anywhere, for any reason.
- Track gross inflow and gross outflow separately; derive net from them —
  never split a net with `Math.max`.
- Never divide by a zero/missing denominator: return an explicit status
  (`missing_budget`, `not_applicable`).
- Missing score components make the FMS **unavailable with the missing
  components named** — never zero-filled, weights never silently
  renormalized.
- Every published number carries period, `dataThrough`, `computedAt`,
  methodology version, approval status, confidence and flags; every score
  must replay identically from its stored `LedgerSnapshot` + compute inputs
  (`replayMetricSnapshot` proves it).
- Methodology versions (`fms_v1_3c_documented`, `fms_v2_5c_prototype`) and
  curve versions are append-only: changing a definition means a NEW version,
  never an edit that re-scores history.
- Refunds and reversals are first-class (refund_reversal_rules_v1 in the
  normalizer): refunds NET against their original category and are never
  income; reversal pairs net to zero. Budgets live SERVER-SIDE
  (`Budget` model, append-only revisions; /api/v1/budgets*) — the period
  target is the sum of covered months, ratio-of-totals.
- No fixture/synthetic financial values in production components. A missing
  value renders an explicit unavailable state.

## Security rules

- Authenticate **before** any provider call; 401 first.
- The browser never holds a bank token (server-side `PlaidItem` only).
- `proxy.ts` is deny-by-default; add public routes deliberately to
  `PUBLIC_ROUTES`, never by omission.
- No secret in a `NEXT_PUBLIC_*`/`VITE_*` variable — the build guard
  (`scripts/check-client-env.mjs`) fails the build if one appears.

## Commands

```bash
npm ci && node scripts/generate-prisma-client.mjs
npm run dev              # needs a Postgres DATABASE_URL
npm run dev:local        # ZERO-SERVICE dev: SQLite + seeded golden data
                         #   login kobe@atlasgo.com / AtlasGo2026!
npm test                 # vitest (app/** and lib/**)
npx tsc --noEmit         # zero errors required
npm run build            # env guard + prisma generate + next build
npm run test:visual      # Playwright: handoff breakpoints + login baseline
npm run generate:worked-calculations   # the maths workbook, from the engine
```

### Local SQLite dev (zero-service)

`npm run dev:local` runs the app with no external services: it derives the
SQLite schema, `db push`es `prisma/dev.db`, generates the SQLite Prisma
client, seeds the 2,000-row golden dataset through the real ingest
pipeline, then starts `next dev` — `kobe@atlasgo.com` / `AtlasGo2026!`.
Use `npm run dev` (Postgres) when a `DATABASE_URL` is set. Dev artifacts
(`prisma/dev.db`, `prisma/schema.sqlite.prisma`) are gitignored; delete
`prisma/dev.db` if a schema change needs a destructive push.

`dev:local` sets `AUTO_DEMO_SEED=1`. The dashboard routes
(`/api/dashboard`, `/api/dashboard/summary`,
`/api/v1/dashboard/financial-intelligence`) call
`lib/demoSeed.ensureDemoDataForUser(userId)` when they find no data; with
the flag on (dev/local only) and a user who is genuinely empty (no ledger
and no accounts), they seed the golden dataset for that user on demand,
then re-read. It is idempotent — it never re-seeds over an existing
ledger — and namespaces demo rows per user. It also refuses (returns
false) when the session's `userId` has no `User` row: a stateless JWT
can survive a `dev.db` reset and carry an id whose account is gone, and
seeding for that id hits the `FinancialAccount.userId → User.id` foreign
key (P2003 → 500). Such a session gets the honest empty state, never a
crash. Plain `npm run dev` (Postgres) and production leave the flag off:
a truly empty user there reports an honest empty state, never a
fabricated number.

### Install scripts / `allowScripts`

Native deps (`better-sqlite3`, `@prisma/engines`, `prisma`, `esbuild`,
`sharp`, `unrs-resolver`) declare install scripts that npm 12 refuses to
run by default. They are approved in `package.json` under `"allowScripts"`,
so `npm ci` builds them automatically. If you see "install scripts
blocked", approve via `npm install-scripts approve better-sqlite3
@prisma/engines prisma esbuild sharp unrs-resolver`; never disable the
policy globally.

Every bug fix lands with the regression test that would have caught it, in
the same commit (SQLite's rule). The golden dataset fixture
(`app/lib/__tests__/goldenDataset.test.ts`) must stay green — it pins the
normalizer's behavior over 2,000 realistic rows.
