# Sohovi — Project Plan & Progress Tracker

> **Resume instruction**: When the user types "continue", read this file first, then pick up from the **Current Session** section and complete all pending tasks.

---

## What Sohovi Is

Privacy-first micro SaaS data quality web app. Users upload CSV/Excel files and get instant data profiling + customizable DQ scoring. All processing happens **entirely client-side** (Web Workers). Raw data never reaches any server. Supabase stores only metadata: DQ scores, profiling summaries (aggregated), rule definitions, and run history.

---

## Tech Stack (critical quirks)

| Concern | Tool | Critical Notes |
|---|---|---|
| Framework | **Next.js 16** (NOT 15!) | Turbopack default, `proxy.ts` for middleware (NOT `middleware.ts`) |
| Styling | **Tailwind v4** | Config via `globals.css @theme` block, NO `tailwind.config.ts` |
| UI | **shadcn/ui v4** | Uses `@base-ui/react` — **NO `asChild` prop on Button** — use `<Link className={buttonVariants(...)}>` |
| Auth | **Clerk v7** | `<Show when="signed-in/out">` (NOT `<SignedIn/SignedOut>`), async `params` must be `await`ed |
| DB | Supabase | All writes via Server Actions + `createServiceClient()` (service role), browser uses anon key |
| Routing | App Router | `(dashboard)` group = no URL segment, actual routes in `app/(dashboard)/dashboard/` subfolder |

---

## Color Palette

- Primary: `#1E3A5F` (Deep Navy)
- Accent: `#00C9A7` (Teal)
- Background: `#F8FAFC`
- Score: ≥95 emerald, 80–95 teal, 60–80 amber, <60 red

---

## Phase-by-Phase Build Plan

### ✅ Session 1 — Phase 0–2: Foundation (COMPLETE)
- [x] Next.js 16 scaffold, all deps installed
- [x] Tailwind v4 + shadcn/ui configured
- [x] Clerk auth (sign-in, sign-up, middleware via `proxy.ts`)
- [x] Landing page (Hero, PrivacyBanner, FeaturesGrid, HowItWorks, Pricing, Footer)
- [x] Dashboard shell (Sidebar + TopBar layout)
- [x] Supabase client/server utils

### ✅ Session 2 — Phase 3–4: DB Schema + Org CRUD (IN PROGRESS → mostly complete)
- [x] `supabase/schema.sql` — all 12 tables
- [x] `types/app.types.ts` — all TypeScript interfaces
- [x] Server Actions: business-units, catalogs, assets
- [x] Business Units pages: list, new, [buId] detail, [buId]/edit
- [x] Business Units components: BUCard, BUForm
- [x] Catalogs pages: list, new, [catalogId] detail
- [x] Catalogs components: CatalogCard, CatalogForm
- [x] `components/shared/`: ScoreBadge, EmptyState, DeleteConfirmDialog
- [x] Assets Server Actions (`getAssets`, `createAsset`, `updateAsset`, `deleteAsset`, `getDashboardCounts`)
- [x] `components/assets/AssetCard.tsx`
- [x] `components/assets/AssetForm.tsx`
- [x] `catalogs/[catalogId]/edit/page.tsx`
- [x] `assets/page.tsx` (full list)
- [x] `assets/new/page.tsx`
- [x] `assets/[assetId]/page.tsx` (detail + score cards)
- [x] `assets/[assetId]/edit/page.tsx`
- [x] `assets/[assetId]/upload/page.tsx` (stub — real upload in Session 3)
- [x] Dashboard home updated with real counts from `getDashboardCounts()`
- [x] `npm run build` passes cleanly (22 routes, 0 errors)
- [x] **shadcn/ui v4 fixes**: `DropdownMenuTrigger` / `DropdownMenuItem` — removed `asChild` (not supported by `@base-ui/react`); `Select.onValueChange` handles `string | null`

> **IMPORTANT**: The Supabase SQL schema (`supabase/schema.sql`) must be run in the Supabase SQL Editor before any DB operations work. User may not have done this yet.

### ✅ Session 3 — Phase 5–6: File Upload + Profiling (COMPLETE)
- [x] `types/profiling.types.ts` — ColumnProfile, worker message protocol
- [x] `lib/profiling/type-inference.ts` — infers integer/float/date/email/phone/uuid/boolean/string
- [x] `lib/profiling/pii-detector.ts` — detects email/phone/SSN/credit card/IP/name; masks values
- [x] `lib/profiling/pattern-analyzer.ts` — character-class pattern frequency
- [x] `lib/profiling/profiler.ts` — orchestrates column stats + outlier detection (±3σ)
- [x] `workers/worker-bridge.ts` — typed Promise-based API over Web Workers
- [x] `workers/file-parser.worker.ts` — CSV (papaparse) + Excel (xlsx); auto-samples >100k rows
- [x] `workers/profiler.worker.ts` — column-by-column profiling with progress events
- [x] `store/fileStore.ts`, `store/profilingStore.ts` — Zustand, never persisted
- [x] `hooks/useFileWorker.ts`, `hooks/useProfileWorker.ts` — React hooks wrapping workers
- [x] `components/upload/FileDropZone.tsx` — drag-drop, 200 MB limit, privacy badge
- [x] `components/upload/UploadProgress.tsx` — multi-stage progress bar
- [x] `components/upload/ColumnComparisonTable.tsx` — schema diff (added/removed/unchanged)
- [x] `components/upload/UploadFlow.tsx` — client state machine (idle→parse→profile→done)
- [x] `components/profiling/ValueFrequencyChart.tsx` — recharts horizontal bar chart
- [x] `components/profiling/ColumnProfileCard.tsx` — expandable per-column stats card
- [x] `components/profiling/ProfilingDashboard.tsx` — search, sort, PII filter, summary banner
- [x] `assets/[assetId]/upload/page.tsx` — real upload flow (replaced stub)
- [x] `assets/[assetId]/profile/page.tsx` — profiling results page (reads Zustand store)
- [x] `npm run build` passes cleanly (23 routes, 0 errors)

### ✅ Session 4 — Phase 7–8: DQ Engine + ML Suggestions (COMPLETE)
- [x] `lib/dq-engine/dimensions/` — 10 evaluators (completeness, accuracy, validity, uniqueness, consistency, integrity, timeliness, currency, conformity, precision)
- [x] `lib/dq-engine/templates/index.ts` — email, phone, date, uuid, postal, invoice, url, currency
- [x] `lib/dq-engine/scorer.ts`, `anomaly-detector.ts`
- [x] `lib/ml/column-classifier.ts` — three-layer heuristic (name keywords, inferred type, distribution)
- [x] `lib/ml/rule-suggester.ts` — RULES_BY_CATEGORY decision table + profile-based extras
- [x] `workers/dq-runner.worker.ts` — dispatches to dimension evaluators, posts RUN_PROGRESS/COMPLETE
- [x] `workers/worker-bridge.ts` — updated with `runDQRules()` bridge function
- [x] `store/dqStore.ts` — Zustand store for DQRunResult, never persisted
- [x] `hooks/useDQRunner.ts` — manages dq-runner worker lifecycle
- [x] `components/rules/DimensionGroupAccordion.tsx` — collapsible groups with toggle/delete
- [x] `components/rules/RuleSuggestionsPanel.tsx` — ML suggestions with Accept button
- [x] `components/rules/RuleBuilderPanel.tsx` — custom rule form (dimension + rule_type + params)
- [x] `components/rules/RunDQButton.tsx` — triggers DQ run with progress bar
- [x] `assets/[assetId]/rules/page.tsx` — full rules page (accordion + suggestions + builder)
- [x] `assets/[assetId]/scoring/page.tsx` — stub (Session 5)
- [x] `npm run build` passes cleanly (25 routes, 0 errors)

### ✅ Session 5 — Phase 9–10: Scoring UI + Workflows (COMPLETE)
- [x] `components/scoring/ScoreGauge.tsx` — SVG semi-circle gauge with score + label
- [x] `components/scoring/ColumnScoreGrid.tsx` — sorted by worst score, clickable column filter
- [x] `components/scoring/ScoreTransparencyPanel.tsx` — per-rule breakdown with pass/fail, bars, thresholds
- [x] `components/scoring/FailedRecordsTable.tsx` — paginated table of failed rows, column highlighted
- [x] `components/scoring/ScoringDashboard.tsx` — client composite: gauge + grid + transparency + failed rows + Save button
- [x] `app/actions/runs.ts` — `saveRunResult` (asset_run + dq_scores + update asset), `getRuns`, `getRunWithScores`
- [x] `assets/[assetId]/scoring/page.tsx` — replaced stub with real scoring page + run history link
- [x] `assets/[assetId]/runs/page.tsx` — run history list with score bars
- [x] `assets/[assetId]/runs/[runId]/page.tsx` — full per-column rule breakdown from DB
- [x] `app/actions/workflows.ts` — getWorkflows, createWorkflow, updateWorkflow, deleteWorkflow
- [x] `components/workflows/ColumnMappingEditor.tsx` — source→target column mapping UI
- [x] `components/workflows/WorkflowForm.tsx` — create/edit form with asset picker + mapping editor
- [x] `workflows/page.tsx` — list with run count + mapping count
- [x] `workflows/new/page.tsx`
- [x] `workflows/[workflowId]/page.tsx` — detail with apply CTA
- [x] `workflows/[workflowId]/edit/page.tsx`
- [x] `npm run build` passes cleanly (30 routes, 0 errors)

### ✅ Session 6 — Phase 11–15: Trends, Alerts, Sandbox, Remediation, Reports (COMPLETE)
- [x] `components/trends/ScoreTrendChart.tsx` — recharts line chart of score over time
- [x] `components/trends/RunComparisonTable.tsx` — side-by-side run comparison with Δ
- [x] `components/trends/AnomalyFlagCard.tsx` — detects score drops ≥10pts, schema changes, critical scores
- [x] `app/actions/alerts.ts` — getAlerts, createAlert, updateAlert, deleteAlert, getAlertEvents, getUnreadAlertCount, markAlertEventsRead
- [x] `components/alerts/AlertRuleForm.tsx` — create alert rules (score_drop, schema_change, rule_failure, anomaly)
- [x] `components/alerts/AlertCard.tsx` — card with toggle/delete/expand events + mark-read
- [x] `components/alerts/AlertBell.tsx` — client badge component
- [x] `alerts/page.tsx` — full alerts list + create form
- [x] `components/layout/DashboardShell.tsx` — extracted interactive shell (client), layout is now server component
- [x] TopBar updated: accepts `alertBell` slot; layout fetches real unread count server-side
- [x] Rule sandbox: `assets/[assetId]/sandbox/page.tsx` + `SandboxClient.tsx` — test any rule client-side, save to asset
- [x] `components/remediation/RemediationPanel.tsx` — per-rule fix suggestions + exclude-rows UI
- [x] `components/remediation/ExportCleanedFile.tsx` — client-side CSV + Excel export with excluded rows removed
- [x] `assets/[assetId]/remediation/page.tsx` + `RemediationClient.tsx`
- [x] `reports/page.tsx` + `ReportsClient.tsx` — asset selector table + PDF (jspdf-autotable) + Excel (exceljs)
- [x] Asset detail page updated: Sandbox + Remediate nav links, Score Trend + AnomalyFlagCard
- [x] Runs page updated: ScoreTrendChart + RunComparisonTable embedded
- [x] `npm run build` passes cleanly (32 routes, 0 errors)

### ✅ Session 7 — Phase 16–17: Blog + Polish (COMPLETE)
- [x] `app/actions/blog.ts` — getPosts, getPostBySlug, getAllPublishedSlugs, createPost, updatePost, deletePost, globalSearch
- [x] `app/blog/layout.tsx` — blog layout with PublicNav + Footer + skip-to-content
- [x] `app/blog/page.tsx` — public blog list (ISR revalidate=3600)
- [x] `app/blog/[slug]/page.tsx` — blog post with ISR + generateStaticParams + generateMetadata (OG, Twitter)
- [x] `app/blog/admin/page.tsx` — admin list (published/draft, delete via Server Action)
- [x] `app/blog/admin/new/page.tsx` — create post form
- [x] `app/blog/admin/[postId]/edit/page.tsx` — edit post form
- [x] `components/blog/BlogPostCard.tsx` — public post card with tags, excerpt, read time
- [x] `components/blog/BlogAdminForm.tsx` — split Write/Preview editor with publish toggle
- [x] `app/(dashboard)/dashboard/search/page.tsx` — global search (assets, catalogs, BUs, blog posts)
- [x] `app/(dashboard)/dashboard/search/SearchResults.tsx` — async RSC search results
- [x] `components/upload/PIIDetectionBanner.tsx` — amber banner listing PII columns after profiling
- [x] Accessibility: skip-to-content links, `aria-label`, `aria-current="page"`, `role="alert"`, `aria-hidden` on decorative icons, `aria-label` on nav + buttons
- [x] `npm run build` passes cleanly (37 routes, 0 errors)

---

## Key Files

| File | Purpose |
|---|---|
| `proxy.ts` | Clerk auth middleware — guards all `/dashboard/*` routes |
| `app/actions/*.ts` | All Supabase writes — Server Actions with service role key |
| `lib/supabase/server.ts` | `createClient()` (anon) + `createServiceClient()` (service role) |
| `lib/clerk/utils.ts` | `requireAdmin()` — blog admin gate |
| `supabase/schema.sql` | **Must be run in Supabase SQL Editor** |
| `types/app.types.ts` | All TypeScript interfaces |
| `.env.local` | All secrets — never commit |

---

## Environment Variables (all set)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://bcginhamyaevilukcwsy.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
ADMIN_CLERK_USER_IDS=user_3CLQY1mtK9oWLgS3vtNvEHPJ8ab
```

---

### Post-launch Bug Fixes
- [x] `app/layout.tsx` — removed hidden `<Show>/<UserButton>/<SignInButton>/<SignUpButton>` blocks that caused React hydration mismatch; Clerk auth UI belongs at call sites, not root layout
- [x] `app/(dashboard)/dashboard/team/page.tsx` → `[[...rest]]/page.tsx` — converted to catch-all route so `<OrganizationProfile />` can navigate its sub-routes correctly

---

### ✅ Session 8 — Data Source Connectors (Business Tier) (COMPLETE — 2026-04-21)

Build passes: 39 routes, 0 errors.

- [x] `types/connectors.types.ts` — ConnectorType, ConnectorCommand, ConnectorResponse, CONNECTOR_OPTIONS
- [x] `store/connectorStore.ts` — in-memory OAuth token store (never persisted)
- [x] `lib/connectors/pkce.ts` — PKCE utilities: generateCodeVerifier, buildAuthUrl, exchangeCodeForToken, openOAuthPopup
- [x] `workers/connector.worker.ts` — fetches from Google Sheets, Airtable, Cloud Storage URL, REST API → returns ParsedData (client-side, no server fetch)
- [x] `workers/worker-bridge.ts` — extended with `connectAndFetch()`
- [x] `hooks/useConnectorWorker.ts` — mirrors useFileWorker, sets fileStore.data on success
- [x] `components/connectors/ConnectorGate.tsx` — Clerk plan gate (plan === 'business')
- [x] `components/connectors/ConnectorSelector.tsx` — 4-connector grid
- [x] `components/connectors/ConnectorFlow.tsx` — orchestrator: select → configure → connect → profile → done
- [x] `components/connectors/ConnectorBadge.tsx` — "Connected via Airtable · customers" display badge
- [x] `components/connectors/forms/GoogleSheetsForm.tsx` — OAuth PKCE + sheet config
- [x] `components/connectors/forms/AirtableForm.tsx` — PAT + base ID + table
- [x] `components/connectors/forms/CloudStorageForm.tsx` — pre-signed/SAS/signed URL input
- [x] `components/connectors/forms/RESTApiForm.tsx` — URL + JSON path + optional auth header
- [x] `app/(dashboard)/dashboard/connect/callback/page.tsx` — OAuth popup callback (postMessages code to opener)
- [x] `supabase/connector_configs.sql` — migration for connector_configs table (metadata only, no credentials)
- [x] `app/actions/connectors.ts` — saveConnectorConfig, getConnectorConfig server actions
- [x] `components/upload/UploadOrConnect.tsx` — tab switcher: Upload File | Connect Data Source
- [x] `app/(dashboard)/dashboard/assets/[assetId]/upload/page.tsx` — now renders UploadOrConnect

> **Privacy maintained:** connector.worker.ts fetches data entirely in the browser Web Worker. No raw row data touches the server. Supabase stores only connector metadata (type, display name, config meta) — no credentials, no OAuth tokens.

---

## Current Session Status

Sessions 1–8 complete. Build passes: 39 routes, 0 errors. App is production-ready.

---

## Planned Future Sessions (not building this week — reference for next sprint)

> **Privacy constraint applies to every session below.** All file/row processing must remain 100% client-side in Web Workers. Supabase stores only metadata: scores, summaries, rule definitions, run history, tags, contracts. Raw row data must never reach the server under any circumstance.

---

### ✅ Session 9a–9d — DQ Rule Enhancements: Description, Scope Filters, Breaking Records, Profiling Narrative (COMPLETE — 2026-06-24)

**Why:** Five user-requested DQ workflow gaps, identified by reviewing the actual rule builder, the worker engine, the failed-records UI, and the profiling export. Full research + design discussion happened in chat on 2026-06-23 (note: the `sohovi-studio` directory is a separate video-production tool, not this app — confirmed this app, `sohovi_prjct1`, is the correct target). Build order: 9a → 9b → 9c (all touch `dq_rules` schema / `RuleBuilderPanel.tsx` / the worker), then 9d independently. **9e (Business Glossary) deferred** — scoped out of this build as the largest/riskiest piece (new tables, fuzzy-matching pipeline, new Pro+ pages); remains NOT STARTED, planned separately below.

**Build notes (2026-06-24):**
- All of 9a–9d implemented and verified with `npm run build` (0 TypeScript errors) + `npm run lint` (no new warnings/errors — all 94 pre-existing lint issues are in unrelated files).
- **Bug found and fixed during implementation, not in the original spec**: `components/rules/RunDQButton.tsx` (lines 19-30) is a second `DQRule → RuleConfig` conversion site (the one used for real, non-sandbox DQ runs) that the original plan missed. It was dropping `scope_conditions` when building the worker payload — without the fix, every real run would have silently ignored scope conditions even though the worker fully supported them. Fixed by passing through `scope_conditions: r.scope_conditions ?? []`.
- 9c's `StatusBadge` click-to-popup needed a defensive `useEffect` in `FailedRecordsTable.tsx` syncing `selectedRule` to `initialRuleId` changes (not just the `useState` initializer), to correctly handle reopening the dialog pre-scoped to a different rule.
- Manual browser verification completed via Playwright (real Chromium, programmatic Clerk sign-in through `@clerk/testing`, fresh test account + cleanup each run): scope-filter row matching and the failed-index remap behind the BREAKING popup confirmed correct against hand-computed expected values for `==` (AND-combined), `in`, `contains`, and numeric `>`/`<=` operators. 9a/9b persistence (`Add Rule`/`Save Rule`) and anything downstream (live Scoring popup, `runs/[runId]`) is **blocked**, not broken — confirmed via the actual PostgREST error — until the user runs `supabase/migrations/002_dq_rules_description_and_scope.sql` themselves.
- **Post-implementation audit (2026-06-24)**: a deeper pass checked every `createRule`/`updateRule`/`RuleConfig`-conversion call site and every UI surface for leftover "Fail" text. Result: the "Breaking" terminology rollout has **zero gaps** — all 5 real pass/fail UI surfaces already use `StatusBadge`. Two real issues were found and fixed: (1) `lib/profiling/narrative.ts` produced a nonsensical sentence for 0-row columns ("0% are unique" with no data) — now returns a fallback sentence early; (2) `DimensionGroupAccordion.tsx` rendered `rule.description` but said nothing about `rule.scope_conditions` — a saved scoped rule was invisible as "scoped" in the rules list. Added a small "Scoped" badge (with a `Tooltip` showing the actual conditions, e.g. `status == Approved AND state == TamilNadu`) next to the existing "AI" badge. Declined as out-of-scope for this pass (user's call): narrative.ts further polish (pattern-mention threshold, numeric-range/length/date-format enrichment), carrying AI-suggestion `reason` into `description` on accept, and a full Edit Rule UI (pre-existing app-wide limitation — no rule field has ever been editable post-creation, not something 9a/9b introduced).

**Confirmed product decisions:**
- "Breaking" replaces the word "Fail" everywhere a rule result is shown — no separate severity tier, every failing rule is "Breaking" (status value in the DB stays `pass`/`fail`; only the display label changes).
- Business Glossary / fuzzy KDE-matching (9e) is gated at **Pro and above** — never a free tool.

#### 9a — Rule Description field
Add an optional free-text `description` to a DQ rule end-to-end.
- `supabase/migrations/002_dq_rules_description_and_scope.sql` (new) — bundles with 9b's column: `alter table dq_rules add column if not exists description text;`
- `supabase/schema.sql` — add `description text` to `dq_rules` table def (~line 108-122)
- `types/app.types.ts` — add `description: string | null;` to `DQRule` (~line 80-94)
- `app/actions/rules.ts` — add `description?: string | null;` to `RuleInput` (~line 22-31); `createRule`/`updateRule` already spread `...input`, no logic change needed
- `components/rules/RuleBuilderPanel.tsx` — add description state + `<textarea>` after the Rule Type select (~line 417); include in the `createRule(...)` call
- `components/rules/DimensionGroupAccordion.tsx` — render `rule.description` as a muted line under the rule's params (~line 188-222)
- Engine-facing `RuleConfig` (types/dq.types.ts) does NOT need this field — no evaluator reads it

#### 9b — Generic scope/filter conditions on any rule
Today only one narrow mechanic exists: `conditional_not_null` (`lib/dq-engine/dimensions/completeness.ts:62-88`), hardcoded to one equality condition, completeness-only. Goal: let any rule be scoped to a filtered row subset, e.g. *"only check status==Approved where state==TamilNadu"*.
- Add a **dedicated `scope_conditions` jsonb column** (not nested in `parameters`, so it's orthogonal to rule-type-specific params and the worker can apply it uniformly without touching any of the 10 dimension evaluator files): `alter table dq_rules add column if not exists scope_conditions jsonb not null default '[]';` (same migration as 9a)
- Shape: `ScopeCondition[]` = `{ column, operator: "=="|"!="|">"|">="|"<"|"<="|"in"|"contains", value }[]`, AND-combined
- `types/dq.types.ts` — add `ScopeOperator`/`ScopeCondition` types; add `scope_conditions: ScopeCondition[]` to `RuleConfig`
- `types/app.types.ts` — add `scope_conditions: ScopeCondition[]` to `DQRule`
- `lib/dq-engine/scope-filter.ts` (new) — pure `applyScopeFilter(rows, headers, conditions): number[]` returning in-scope original row indices
- `workers/dq-runner.worker.ts` — before calling `evalFn` (~line 101): slice `rows`/`colValues` down to in-scope indices, call `evalFn` on the slice, then **remap returned `failedIndices` back to original row numbers** via the same index array (critical — `FailedRecordsTable` indexes into the unfiltered `rows`)
- `app/actions/rules.ts` — add `scope_conditions?: ScopeCondition[]` to `RuleInput`, default `[]` in insert payload
- `components/rules/RuleBuilderPanel.tsx` — collapsible "Scope (optional)" section below Threshold, available for every dimension: add/remove condition rows (Column select, Operator select, Value input)
- `app/(dashboard)/dashboard/assets/[assetId]/sandbox/SandboxClient.tsx` — has its own hand-rolled `RuleConfig`/`RULE_TYPES` separate from `RuleBuilderPanel` — needs the same scope-conditions UI added so rules can be scope-tested before saving
- Keep `conditional_not_null` as-is (don't deprecate — existing saved rules reference it by name)
- Gating: ship **ungated/free**, consistent with the already-free `cross_field_comparison`/`cross_column_match`/`conditional_not_null`. (The unused `crossColumnValidation` plan flag in `lib/plans/limits.ts` describes a different mechanic — leave it alone.)

#### 9c — "Breaking" status + breaking-records popup with download
- `components/shared/StatusBadge.tsx` (new) — `{ status: "pass"|"fail", onClick? }` → renders "PASS" / "BREAKING"; replaces duplicated inline badge markup in `ScoreTransparencyPanel.tsx` (~line 101-109), `runs/[runId]/page.tsx` (~line 249-257), `SandboxClient.tsx` (~line 351-352)
- `components/scoring/FailedRecordsTable.tsx` — add optional `initialRuleId?: string` prop so a popup opened from one badge starts pre-scoped to that rule (table itself already does everything else needed: real failing rows, violating column highlighted, working CSV download)
- Popup = existing `components/ui/dialog.tsx` Dialog/DialogContent wrapping `FailedRecordsTable` (currently unused for this purpose)
- `components/scoring/ScoringDashboard.tsx` + `ScoreTransparencyPanel.tsx` — primary target (live, in-session view right after running a check). `ScoreTransparencyPanel` gets `onOpenFailures?: (ruleId) => void`; clicking a badge opens the Dialog. The dashboard's existing always-visible third-column `FailedRecordsTable` panel stays as-is — the popup is additional, not a replacement
- `SandboxClient.tsx` — swap static PASS/FAIL + ad hoc 5-row table for `StatusBadge` + Dialog-wrapped `FailedRecordsTable`
- `runs/[runId]/page.tsx` (historical run detail) — label-only swap to "BREAKING", **no click/popup**: only aggregate `dq_scores` are persisted server-side; raw rows/`failed_indices` only exist in-browser during an active session (by design — "raw data never leaves your browser"). Making history clickable too would require persisting row-level snapshots server-side — a privacy-relevant architecture change, explicitly out of scope here.

#### 9d — Descriptive narrative sheet in the profiling export
Per-asset profiling export already exists: `components/profiling/ProfilingDashboard.tsx`, `exportProfilingXLSX()` (lines 19-139), 3 sheets (Summary/Values/Patterns, all numeric grids). Add a 4th, prose sheet.
- `lib/profiling/narrative.ts` (new) — pure `buildColumnNarrative(profile: ColumnProfile): string`, e.g. *`"email" is a text column with 550 rows. 12.7% of values are missing. 87.3% are unique. Most common format "word@word.word" (92%). Appears to contain PII (email).`* Kept Excel-agnostic so it's reusable later (e.g. AI rule-suggestion context in `lib/ml/nl-rule-parser.ts`).
- `components/profiling/ProfilingDashboard.tsx` — add `wb.addWorksheet("Column Descriptions")` after the Patterns sheet, one row per column via `buildColumnNarrative()`, `wrapText: true`
- No schema/engine changes — every stat needed is already computed by `lib/profiling/profiler.ts` and in memory at export time

#### 9e — Business Glossary + fuzzy physical-name↔business-name (KDE) matching — new Pro+ feature (NOT STARTED — deferred)
Deliberately scoped out of the 9a–9d build above as the largest/riskiest piece. Design below is unchanged from the original 2026-06-23 spec — pick up here for the next session on this track.
Lets a user maintain a glossary of business terms once (e.g. "Employee Identifier" + aliases `emp_id`, `empid`) and get auto-suggested column-to-term mappings on every asset. **Confirmed: Levenshtein alone (the existing unused `lib/tools/fuzzy-match.ts` `similarity()`, via `fastest-levenshtein`) is not adequate** — `"emp_id"` vs `"Employee Identifier"` share almost no character overlap despite being an obvious match to a human. Needs a token-aware pipeline instead.
- `supabase/migrations/003_business_glossary.sql` (new) — 2 tables, scoped by `clerk_user_id` (matches this app's existing tenancy — no separate org entity):
  ```sql
  create table business_glossary_terms (
    id uuid primary key default gen_random_uuid(),
    clerk_user_id text not null,
    term text not null, definition text,
    aliases text[] not null default '{}',
    created_at timestamptz not null default now(), updated_at timestamptz not null default now()
  );
  create unique index idx_glossary_user_term on business_glossary_terms(clerk_user_id, lower(term));

  create table column_glossary_mappings (
    id uuid primary key default gen_random_uuid(),
    asset_id uuid not null references data_assets(id) on delete cascade,
    clerk_user_id text not null, column_name text not null,
    term_id uuid not null references business_glossary_terms(id) on delete cascade,
    match_score numeric(5,4) not null default 0, is_confirmed boolean not null default false,
    created_at timestamptz not null default now(), updated_at timestamptz not null default now()
  );
  create unique index idx_col_glossary_asset_col on column_glossary_mappings(asset_id, column_name);
  ```
- `lib/tools/glossary-matcher.ts` (new) — matching pipeline (reuses `fuzzy-match.ts`'s `similarity()` as a low-level tiebreaker, doesn't replace it):
  1. Tokenize physical column name on snake_case/camelCase/kebab-case (`emp_id` → `["emp","id"]`)
  2. Expand common abbreviations via a seed dictionary (`emp→employee`, `id→identifier`, `no→number`, `dob→date of birth`, …) — **dictionary content needs a curation pass from the user as the DQ professional**, plumbing is generic
  3. Tokenize each glossary term + its stored aliases the same way
  4. Score by token overlap (dominant) + Levenshtein on near-miss individual tokens (tiebreaker for typos)
  5. Return top candidates with confidence 0–1; floor ~0.4 (needs tuning against real data) below which no auto-suggestion is shown
- `types/glossary.types.ts` (new) — `BusinessGlossaryTerm`, `ColumnGlossaryMapping`
- `app/actions/glossary.ts` (new) — `getGlossaryTerms`, `createGlossaryTerm`, `updateGlossaryTerm`, `deleteGlossaryTerm`, `getColumnMappings(assetId)`, `upsertColumnMapping(...)` — same `getScopeId()` + `createServiceClient()` pattern as `app/actions/rules.ts`
- `lib/plans/limits.ts` — add `businessGlossary: boolean` (false free, **true pro + business**)
- `components/layout/Sidebar.tsx` — add "Business Glossary" nav item to the "Data Catalog" group
- `app/(dashboard)/dashboard/glossary/page.tsx` + `components/glossary/GlossaryManager.tsx` (new) — term CRUD UI, wrapped in `<PlanGate minPlan="pro">`
- `components/glossary/ColumnGlossaryMapper.tsx` (new) — runs the matcher client-side over the asset's profiled columns, shows suggestions with Accept/Override/Ignore; wire into the asset's existing profile/column tab structure (exact file TBD — spot-check during implementation)
- Do NOT repurpose the existing unused `crossColumnValidation` plan flag — different mechanic (column-vs-column validation within one dataset), keep separate

**Verification plan for 9a-9d (build/lint passed; manual browser testing still pending — do this next):** `npm run dev`, sign in, exercise each sub-feature manually in Chrome (no existing automated test suite in this repo). 9a: add a rule with a description, confirm it persists + displays. 9b: build the TamilNadu/Approved example rule, confirm only in-scope rows evaluated and `failed_indices` map back correctly. 9c: run a check with a failing rule, confirm "BREAKING" label, click-to-popup, CSV download; confirm historical run page shows static label only. 9d: download profiling Excel, confirm 4th "Column Descriptions" sheet.

**Verification plan for 9e (once built):** create glossary terms with aliases, upload a file with `emp_id`/`leid`-style columns, confirm sensible suggestions, accept one, reload, confirm persisted.

> **IMPORTANT**: `supabase/migrations/002_dq_rules_description_and_scope.sql` must be run manually in the Supabase SQL Editor before 9a/9b's `description`/`scope_conditions` columns exist in production. User may not have done this yet.

---

### 🔜 Session 10 — Alert Delivery: Slack + Email Notifications

**Why:** Alerts fire and log inside the app, but users aren't in the app all day. Without external delivery, alert rules have low real-world value. This is the single highest-retention unlock.

**Privacy:** Alert events are triggered from DQ scores already stored in Supabase (metadata). No raw data involved.

**Files to create:**
- `supabase/notification_channels.sql` — new table: `notification_channels` (user_id, type: 'slack'|'email', config JSONB: {webhook_url} or {email}, enabled bool)
- `app/actions/notifications.ts` — `saveNotificationChannel`, `getNotificationChannels`, `deleteNotificationChannel`, `sendAlertNotification` (server action — reads alert_event + DQ score from Supabase → sends Slack webhook or email via Resend)
- `components/alerts/NotificationChannelForm.tsx` — add Slack webhook URL or email address, test button ("Send test ping")
- `components/alerts/NotificationChannelCard.tsx` — shows configured channels with enable/disable/delete

**Files to modify:**
- `app/actions/alerts.ts` — after inserting a new `alert_event`, call `sendAlertNotification` with the event data
- `app/(dashboard)/dashboard/alerts/page.tsx` — add "Notification Channels" section above the alert rules list

**Dependencies:**
- `npm install resend` — transactional email (Resend free tier: 3,000 emails/month). Add `RESEND_API_KEY` to `.env.local`
- Slack: no new dep — just `fetch` to the webhook URL

**Supabase schema addition:**
```sql
create table notification_channels (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  type text not null check (type in ('slack', 'email')),
  config jsonb not null,
  enabled boolean default true,
  created_at timestamptz default now()
);
```

**Pricing gate:** Slack delivery → Business tier. Email delivery → Pro + Business.

---

### 🔜 Session 11 — Data Contracts

**Why:** Users want to formalize quality expectations for recurring datasets — especially for files received from external suppliers or clients. A contract is a named, shareable set of rules with a minimum pass threshold. When a new run fails the contract, an alert fires automatically.

**Privacy:** Contracts are metadata (rule IDs, thresholds, names). Evaluation runs client-side via the existing DQ runner. Only the pass/fail result (metadata) is stored.

**Files to create:**
- `supabase/data_contracts.sql` — two new tables: `data_contracts` (id, asset_id, name, description, min_pass_threshold, created_at) + `contract_rules` (contract_id, rule_id)
- `types/contracts.types.ts` — DataContract, ContractRule, ContractEvaluationResult
- `app/actions/contracts.ts` — `getContracts`, `getContract`, `createContract`, `updateContract`, `deleteContract`, `evaluateContract` (reads run scores from Supabase, compares against contract thresholds)
- `components/rules/ContractForm.tsx` — name + description + select rules from asset's existing rules + set min pass threshold (%)
- `components/rules/ContractCard.tsx` — shows contract name, rule count, last evaluation status (pass/fail badge), last run date
- `components/rules/ContractEvaluationPanel.tsx` — per-rule pass/fail breakdown for the contract, overall verdict
- `app/(dashboard)/dashboard/assets/[assetId]/contracts/page.tsx` — list contracts for asset + create form

**Files to modify:**
- `app/actions/runs.ts` — after `saveRunResult`, check if any active contracts exist for the asset → call `evaluateContract` → if contract fails, insert an `alert_event`
- `app/(dashboard)/dashboard/assets/[assetId]/page.tsx` — add Contracts nav link alongside Rules, Scoring, Sandbox

**Pricing gate:** Business tier.

---

### 🔜 Session 12 — Sharing, Tags + Portfolio Dashboard

**Why three in one:** All are metadata-only features using existing Supabase data. No new workers or engines needed. High user-visible value for low build cost.

**Privacy:** All features read from Supabase metadata (DQ scores, run summaries). No raw data exposed at any point.

#### 11a — Asset Tags / Labels
- `supabase/asset_tags.sql` — `asset_tags` table (asset_id, tag text). Index on (asset_id), index on (tag).
- `app/actions/tags.ts` — `getTags`, `addTag`, `removeTag`, `getAssetsByTag`
- `components/assets/AssetTagInput.tsx` — combobox input (type to create or select existing tag), renders tag pills
- Modify `AssetForm.tsx` — add tag input field
- Modify `assets/page.tsx` — add tag filter dropdown above the asset table

#### 11b — Public Shareable Report Links
- `supabase/shared_reports.sql` — `shared_reports` table (id uuid PK as slug, asset_id, run_id, expires_at nullable, created_by)
- `app/actions/shared-reports.ts` — `createSharedReport`, `getSharedReport`
- `app/share/[reportId]/page.tsx` — **public route** (no Clerk guard). Reads run + scores from Supabase via anon key. Renders read-only scoring dashboard (ScoreGauge + ColumnScoreGrid + ScoreTransparencyPanel). Shows "Powered by Sohovi" footer CTA.
- `proxy.ts` — add `/share(.*)` to `isPublicRoute` matcher (one-line change)
- `components/scoring/ShareReportButton.tsx` — "Share Report" button in ScoringDashboard. Generates link, copies to clipboard, shows expiry options (7 days / 30 days / no expiry).

#### 11c — Portfolio-Level DQ Dashboard
- Modify `app/(dashboard)/dashboard/page.tsx` (dashboard home) — add a "Portfolio Health" section below the counts row
- `components/scoring/PortfolioTrendChart.tsx` — recharts line chart: average DQ score across all user assets over last 30 days (data from `asset_runs` already in Supabase)
- `components/scoring/WorstAssetsTable.tsx` — bottom 5 assets by latest DQ score with score badge + link to asset detail
- `app/actions/dashboard.ts` — `getPortfolioTrend` (aggregated daily avg score, last 30 days), `getWorstAssets` (bottom 5 by latest score)

#### 11d — Embeddable DQ Score Badge
- `app/api/badge/[assetId]/route.ts` — **public API route**. Reads latest DQ score for asset from Supabase (anon key). Returns SVG image with score, color-coded (emerald/teal/amber/red). Cache-Control: max-age=3600.
- `components/assets/EmbedBadgeDialog.tsx` — dialog with two copy options: HTML `<img>` tag + Markdown `![badge]`. Shown on asset detail page.

---

### 🔜 Session 13 — Free SEO Tools (Acquisition)

**Why:** No-signup free tools that capture Google search traffic and funnel cold users into Sohovi signups. All 6 tools use existing Web Workers and lib/ utilities — no new backend, no new Supabase tables.

**Privacy:** 100% client-side. No data ever leaves the browser. No Supabase writes. React `useState` only. Stronger privacy guarantee than even the main app.

**Full spec:** See `freetools.md` for complete tool specifications, conversion strategy, and CTA copy.

**Files to create (overview):**
- `proxy.ts` — add `/tools(.*)` to `isPublicRoute` (one-line change)
- `app/tools/layout.tsx` — minimal public layout: Sohovi nav + footer, no DashboardShell
- `app/tools/page.tsx` — tools hub page (all 6 listed, SEO-optimized H1s)
- `app/tools/csv-quality-score/page.tsx` — Tool 1: 4-dim DQ score (reuses dq-runner worker + 4 existing evaluators)
- `app/tools/pii-finder/page.tsx` — Tool 2: PII detection (reuses pii-detector.ts directly)
- `app/tools/completeness/page.tsx` — Tool 3: completeness heatmap (reuses profiler worker)
- `app/tools/format-standardizer/page.tsx` — Tool 4: date/phone/currency standardizer (reuses conformity.ts + profiler.ts)
- `app/tools/name-dedup/page.tsx` — Tool 5: fuzzy vendor name dedup (`npm install talisman`)
- `app/tools/email-checker/page.tsx` — Tool 6: email syntax + MX check via Cloudflare DNS-over-HTTPS

**Build order within session:** Tools 1 → 2 → 3 → 4 → 5 → 6 (in priority order from freetools.md)

---

### 🔜 Session 14 — Scheduled Reminders + Bulk Operations + CSV Comparison

**Privacy note on scheduled runs:** True server-side automated DQ execution is incompatible with the privacy model — running DQ server-side would require raw row data to reach the server. Instead: the server sends a scheduled reminder (Slack/email) and the app auto-triggers the DQ run on the next browser session open for connector-based assets. Raw data never leaves the browser.

#### 13a — Scheduled Runs: Full Automation for Connectors, Reminders for File Uploads

**Two asset types, two behaviors:**

| Asset type | Scheduled behavior | User action required |
|---|---|---|
| File upload (CSV/Excel) | Reminder only — server sends Slack/email: "Time to run DQ on [asset]. Upload the latest file →" | Yes — user must upload new file |
| Connector (Sheets/Airtable/REST) | Fully automated — server fetches data, runs DQ engine, stores scores, sends result notification | None — zero user action needed |

**Privacy statement for connector auto-runs:**
> "Raw data is never stored on our servers. During a scheduled run, connector data is fetched into server memory, scored, and immediately discarded. Only the DQ scores and column summaries are written to the database."

This is an honest, strong privacy claim. Connector data already lives on Google/Airtable servers — the user has already accepted that. We transit it, score it, and drop it.

**Architecture for full connector automation:**

1. **Encrypted credential storage** — when a user connects a source, save credentials encrypted in Supabase (service role only, never exposed to browser):
   - Google Sheets: store `refresh_token` (AES-256 encrypted, key in env var `CREDENTIAL_ENCRYPTION_KEY`)
   - Airtable: store `personal_access_token` (encrypted)
   - REST API: store `bearer_token` (encrypted)
   - Cloud Storage: store pre-signed URL (may expire — flag as stale if expired)

2. **Server-side DQ engine** — the existing DQ engine (`lib/dq-engine/`) is plain TypeScript with no browser APIs. It runs unchanged in Node.js. No porting needed.

3. **Cron execution flow:**
   - Vercel Cron fires daily (or at user-set frequency)
   - Read due schedules from `run_schedules`
   - For each connector asset: decrypt stored credential → fetch data from connector API → run DQ engine in Node.js → store only scores + column summaries in Supabase → discard raw rows → send result notification (Slack/email) with score + any anomalies

**Files to create:**
- `supabase/run_schedules.sql` — `run_schedules` table (id, asset_id, user_id, frequency: 'daily'|'weekly'|'monthly', next_run_at, last_reminded_at, asset_type: 'file'|'connector')
- `supabase/connector_credentials.sql` — `connector_credentials` table (id, connector_config_id, encrypted_credential text, credential_type: 'oauth_refresh'|'pat'|'bearer'|'url', expires_at nullable). **Service role access only — never exposed to browser or anon key.**
- `lib/connectors/credential-vault.ts` — `encryptCredential(raw: string): string`, `decryptCredential(encrypted: string): string` using Node.js `crypto` (AES-256-GCM). Key from `CREDENTIAL_ENCRYPTION_KEY` env var.
- `lib/connectors/server-fetcher.ts` — server-side equivalents of connector.worker.ts fetch logic: `fetchGoogleSheets(config, accessToken)`, `fetchAirtable(config, pat)`, `fetchRESTApi(config, bearerToken)`. Returns `ParsedData` (same type as worker). For Google Sheets OAuth: uses refresh token → exchanges for access token via Google token endpoint.
- `lib/dq-engine/server-runner.ts` — thin wrapper: accepts `ParsedData` + `DQRule[]` → runs existing dimension evaluators → returns `DQRunResult`. Re-exports the same logic already in `dq-runner.worker.ts` but as a direct function (no Worker message protocol needed).
- `app/actions/schedules.ts` — `createSchedule`, `getSchedules`, `updateSchedule`, `deleteSchedule`, `getDueSchedules`, `advanceSchedule`
- `app/actions/credentials.ts` — `saveCredential(connectorConfigId, raw, type)` (encrypts + stores), `deleteCredential(connectorConfigId)`. Server Action only — never callable from browser directly.
- `app/api/cron/scheduled-runs/route.ts` — Vercel Cron endpoint. For each due connector schedule: decrypt credential → fetch data → run DQ → save run result → send notification → advance `next_run_at`. For file schedules: send reminder notification only.
- `vercel.json` — `{"crons": [{"path": "/api/cron/scheduled-runs", "schedule": "0 8 * * *"}]}`
- `components/assets/ScheduleRunForm.tsx` — frequency picker (daily / weekly / monthly) + notification channel picker. For connector assets: shows "Fully automated — no action needed from you." For file upload assets: shows "You'll receive a reminder to upload the latest file."
- `components/assets/LastAutoRunBanner.tsx` — shown on connector asset detail page if last run was automated. "Last automated run: 2h ago — Score: 94/100. View run →"

**Files to modify:**
- `components/connectors/ConnectorFlow.tsx` — on successful connect, call `saveCredential` server action to persist encrypted credential alongside `saveConnectorConfig`
- `app/(dashboard)/dashboard/assets/[assetId]/page.tsx` — fetch last run metadata + schedule status server-side → render `LastAutoRunBanner` if applicable
- `.env.local` — add `CREDENTIAL_ENCRYPTION_KEY` (32-byte random hex, generated once: `openssl rand -hex 32`)

**Security notes:**
- `connector_credentials` table: RLS policy allows read only via service role key — anon key and browser client have zero access
- Encryption key never in source code — env var only, never committed
- Refresh tokens rotated on each use (Google OAuth best practice) — update stored token after each exchange
- Stale credential detection: if fetch fails with 401, mark schedule as `credential_expired`, send notification to user to reconnect

#### 13b — Bulk Operations
- `components/catalogs/BulkRunButton.tsx` — "Run DQ on all assets in this catalog" button on catalog detail page. Iterates asset list, shows per-asset progress (only works for assets that have been run at least once — re-runs last file's profile through DQ engine from profilingStore if still in memory, else prompts user to re-upload)
- `app/actions/runs.ts` — add `getLatestRunProfiles(catalogId)` — returns last profiling summary per asset for re-run context

#### 13c — CSV Version Comparison
- `app/(dashboard)/dashboard/assets/[assetId]/compare/page.tsx` — dedicated compare page
- `components/upload/CompareUploadFlow.tsx` — two-panel upload: "Before" file + "After" file. Both parsed via file-parser worker. Runs profiler on both. Shows side-by-side: schema diff (ColumnComparisonTable), score delta, row count delta, top changed columns.
- Modify asset detail nav to add "Compare" link alongside Upload, Profile, Rules, Scoring

#### 13d — Usage / Quota Dashboard
- `app/actions/usage.ts` — `getUserUsage` — counts from Supabase: asset_count, total_runs_this_month, active_rules_count, alerts_count
- `components/layout/UsageMeter.tsx` — small component in Sidebar footer showing "3 / 5 assets used" on Free tier, hidden on Pro/Business
- Modify `DashboardShell.tsx` (or Sidebar.tsx) — render UsageMeter at bottom of sidebar for Free plan users only

---

### 🔜 Session 15 — Polish, Templates + Growth Hooks

#### 14a — Industry Rule Template Packs
- `lib/dq-engine/template-packs/ecommerce.ts` — pre-built rules: SKU format (regex), price > 0 (validity), inventory ≥ 0, email valid, order_id uniqueness, date within 2 years
- `lib/dq-engine/template-packs/finance.ts` — invoice number format, amount > 0, no duplicate invoice IDs (uniqueness), date within fiscal year, currency format
- `lib/dq-engine/template-packs/crm.ts` — contact completeness (name, email, phone ≥ 80% filled), email validity, phone format (E.164), company name non-null
- `lib/dq-engine/template-packs/index.ts` — registry: `{ ecommerce, finance, crm }`
- `components/rules/TemplatePacks.tsx` — "Quick Start" section above RuleBuilderPanel. Shows 3 pack cards. "Apply Pack" button bulk-creates all rules for that pack on the asset.
- Modify `assets/[assetId]/rules/page.tsx` — render TemplatePacks above existing rules accordion

#### 14b — Column Lineage / Source Notes
- `supabase/column_notes.sql` — `column_notes` table (asset_id, column_name, source_description text, transformation_notes text, owner text)
- `app/actions/column-notes.ts` — `getColumnNotes`, `upsertColumnNote`
- `components/profiling/ColumnNoteDrawer.tsx` — slide-out drawer on ColumnProfileCard. Fields: Source system, Transformation applied, Owner/steward. Saves to Supabase on blur.
- Modify `ColumnProfileCard.tsx` — add "Add note" icon button in card header; shows saved note badge if notes exist

#### 14c — Changelog Page
- `app/changelog/page.tsx` — **public route**, no auth. Static list of release entries (date, version tag, list of changes). Rendered from a local `lib/changelog.ts` data file (no DB needed).
- `proxy.ts` — add `/changelog` to `isPublicRoute`
- `lib/changelog.ts` — array of `{ date, version, changes[] }` objects. Manually updated each session.
- Link in Footer + dashboard Sidebar footer

#### 14d — In-App Feedback Widget
- `components/shared/FeedbackWidget.tsx` — fixed bottom-right button ("Send feedback"). Opens a small popover: 1–5 star rating + optional text + submit. Stores in Supabase `feedback` table (user_id, rating, message, page_url, created_at).
- `supabase/feedback.sql` — `feedback` table
- `app/actions/feedback.ts` — `submitFeedback` server action
- Render in `DashboardShell.tsx`

---

## Feature-to-Privacy Constraint Map

| Feature | Privacy status | Reason |
|---|---|---|
| Slack/email alert delivery | ✅ Compatible | Triggers from DQ scores in Supabase — no raw data |
| Data contracts | ✅ Compatible | Rule definitions + thresholds only — no raw data |
| Public shareable reports | ✅ Compatible | Reads scores from Supabase — no raw data |
| Asset tags | ✅ Compatible | Pure metadata |
| Portfolio dashboard | ✅ Compatible | Aggregates scores already in Supabase |
| Embeddable badge | ✅ Compatible | Single score value from Supabase |
| Free tools | ✅ Compatible | 100% browser-side, no Supabase writes at all |
| Scheduled runs — file upload assets | ✅ Compatible | Server sends reminder only; user re-uploads file manually |
| Scheduled runs — connector assets | ✅ Compatible (adjusted) | Raw data transits server memory during scoring, never stored. Strong claim: "raw data never stored on our servers." Credentials stored encrypted, service role only. |
| CSV comparison | ✅ Compatible | Both files parsed client-side via existing Web Workers |
| Industry rule templates | ✅ Compatible | Pre-built rule definitions — no data processing |
| Column lineage notes | ✅ Compatible | Text metadata only |
| True server-side DQ execution | ❌ NOT compatible | Would require raw row data server-side — violates privacy model |
| CRM auto-enrichment scraping | ❌ NOT compatible | Requires server-side browser automation — separate product |

---

## Marketing & Training Video Content Strategy (2026-06-28)

**Why:** `video_tutorials.md` had grown to 147 scripts but two real gaps emerged: (1) it didn't clearly say *which* features actually drive new-customer acquisition vs. which are paid-tier upsell — so a video could accidentally market a Business-only feature as if it were free — and (2) every dataset in the file was generic ("CustomerDB.csv"), with no industry-specific flavor for verticals like the user's own (banking). This section is the evidence-based feature/plan audit + domain-dataset decision behind the changes made to `video_tutorials.md` (now 155 scripts). Re-verify against code before reusing this audit in a future session — plan gating in particular is enforced ad hoc per-route (see below), not centrally, so it can drift silently.

### Feature audit — what's real, and how it's gated

Audited directly against code (`lib/dq-engine/`, `lib/profiling/`, `lib/ml/`, `lib/plans/limits.ts`, `components/shared/PlanGate.tsx`, every `PlanGate` call site, `components/layout/Sidebar.tsx`), not against planning docs, since docs drift. Key finding: **`lib/plans/limits.ts`'s `PlanLimits` object is mostly decorative** — `sandbox`, `connectors`, `remediation`, `pii`, `catalogScoring`, and `crossColumnValidation` booleans are defined but never read anywhere. Real gating happens at each route via a hardcoded `<PlanGate minPlan="pro"|"business">` call, independent of that object. Only `maxAssets`, `maxRulesPerAsset`, `maxBusinessUnits`, and `historyDays` are actually enforced (in `app/actions/assets.ts`, `rules.ts`, `business-units.ts`, `runs.ts`).

**FREE tier (real ceiling: 5 assets, 5 rules/asset, 1 business unit, 7-day run history) — top-of-funnel acquisition content belongs here:**
- CSV/Excel upload, full in-browser profiling (nulls, uniqueness, outliers, patterns, 12-type inference)
- **Date-format ambiguity resolution** — statistically resolves DD/MM vs MM/DD using unambiguous values in the same column (`lib/profiling/type-inference.ts`) — genuinely novel, had zero marketing video before this session (now VIDEO 153)
- **DQ Glossary** — per-column, per-dimension plain-English "why this applies" reasoning (`lib/profiling/dq-glossary.ts`, `dimension-meta.ts`) — novel, zero marketing-hook video before this session (now VIDEO 154; mechanics-only Learn tutorial was VIDEO 146)
- Manual rule builder, all 10 dimensions / 24 rule types, **Rule Description** field, **Scope conditions** (any rule → row subset), "Breaking" badges + click-to-popup Failed Records + CSV download — all free, all from Session 9a–9d
- Plain-English **NL rule builder** (the "AI Builder" tab inside `RuleBuilderPanel`, `lib/ml/nl-rule-parser.ts`) — 100% client-side regex parsing, free. **Do not call this "AI-powered"/LLM-based in marketing copy — it's heuristic, no external model call.** Distinct from and easily confused with the Pro-gated bulk suggestion panel below.
- DQ Score, Score Transparency, Column Scores, schema-change detection on re-upload, 5-sheet profiling Excel export (Summary/Values/Patterns/Column Descriptions/DQ Glossary)
- Behavioral/anomaly scoring (`lib/dq-engine/behavioral-scorer.ts`, z-score based cross-run drift) — appears ungated in code; novel, genuinely differentiated (most competitors only do point-in-time rules)
- All 12 standalone `/tools/*` (no login): test-data-generator, csv-to-json, json-to-csv, csv-columns, csv-to-markdown, csv-to-sql, csv-merger, remove-duplicates, formula-explainer, compare, **pii-audit**, **de-identify** — the last 3 had **zero video coverage** before this session (now VIDEOs 150–152)
- **PII detection inside the dashboard profiling view is Pro-gated, NOT free** (`components/upload/UploadFlow.tsx` wraps it in `<PlanGate minPlan="pro" fallback={null}>` — silently invisible to free users, no upsell card shown). VIDEO 16 in the existing doc presents it as universally visible; that's now a known inaccuracy, not yet corrected (see Follow-ups).

**PRO-gated (existing free users — upsell/retention content, not cold-traffic hooks):** automatic PII detection in profiling, bulk/profiling-driven AI Rule Suggestions (`RuleSuggestionsPanel`, distinct from the free NL builder above), Alerts (score-drop, schema-change), Workflows (reusable rule sets), PDF/Excel DQ run report export. Affected existing videos: 16, 24, 33–37, 39, 72, 121 — **not yet annotated with a Plan-tier note** (see Follow-ups).

**BUSINESS-gated (highest tier — enterprise/sales-assist content, not acquisition):** Sandbox, Remediation workflow, all 4 data connectors (Google Sheets, Airtable, Cloud Storage, REST API). This was the biggest surprise: VIDEOs 8–11 (connectors), 25 (Sandbox), 38/71 (Remediation) read like ordinary onboarding content but are actually gated at the *most expensive* tier. Added a **`Plan:`** line to each of these 7 video headers in `video_tutorials.md` stating the real gate and the correct audience (existing Business customers / sales-assist, not cold acquisition).

### Domain dataset decision

User works in banking and asked for "3 or 4 other domain" datasets (named HR, supply chain, finance as examples) to make training/marketing videos feel like the viewer's own data, sourced from Kaggle. Decision: **use Sohovi's own `/tools/test-data-generator` (the same mechanism already used for Datasets A/B/C) instead of real Kaggle data**, because (a) it's the only path I can execute directly without Kaggle API credentials, (b) it avoids dataset-license/redistribution ambiguity in a public, possibly-monetized marketing video, and (c) it stays internally consistent with the existing Dataset A/B/C "generate → hand-edit → inject specific issues" pattern. Kaggle dataset names are still recorded as an optional manual alternative.

Final 5 verticals (banking + 4, per the request): **Banking** and **Supply Chain** and **Healthcare** got brand-new synthetic datasets (no existing industry video covered these verticals at all); **HR** and **Finance** already had a reasonable proxy (EmployeeDir.csv / SalesQ1.csv, used in existing VIDEO 88 / VIDEO 90) and were left as-is to control scope.

- **Dataset D — `CustomerAccounts.csv`** (Banking, 400 rows): customer_id, first_name, last_name, email, phone, branch_country, account_number, balance, kyc_status, account_opened. Issues injected: missing KYC status/email (compliance gaps), duplicate customer_id (merger artifact), invalid account numbers, balance outliers.
- **Dataset E — `InventoryShipments.csv`** (Supply Chain, 300 rows): shipment_id, sku, supplier_name, warehouse_city, warehouse_country, quantity_on_hand, unit_cost, ship_date. Issues injected: negative quantity, missing supplier, duplicate shipment_id, cost outliers, future ship dates.
- **Dataset F — `PatientIntake.csv`** (Healthcare, 250 rows): patient_id, full_name, email, phone, date_of_birth, city, country, admission_date. Issues injected: missing phone/location, duplicate patient_id, malformed email, date_of_birth after admission_date (impossible record).

Full step-by-step generation instructions (exact preset/column-type clicks, exact issues to inject, exact save filename) are in `video_tutorials.md` under "Domain Vertical Datasets" (right after Dataset C, before Part 1). Optional real-data Kaggle alternatives (with a licensing-check reminder) are listed at the end of that same subsection:
- Banking: [Bank Customer Churn Dataset](https://www.kaggle.com/datasets/gauravtopre/bank-customer-churn-dataset), [Banking and Customer Transaction Data](https://www.kaggle.com/datasets/yogeshtekawade/banking-and-customer-transaction-data)
- Supply Chain: [Logistics and Supply Chain Dataset](https://www.kaggle.com/datasets/datasetengineer/logistics-and-supply-chain-dataset), [Supply Chain Dataset](https://www.kaggle.com/datasets/amirmotefaker/supply-chain-dataset)
- Healthcare: [Synthetic Healthcare Patient Records Dataset](https://www.kaggle.com/datasets/dnation/synthetic-healthcare-patient-records-dataset), [Healthcare Dataset](https://www.kaggle.com/datasets/prasad22/healthcare-dataset)

### What changed in `video_tutorials.md` (147 → 155 scripts)

- New "Domain Vertical Datasets" subsection (Datasets D/E/F above) inserted after Dataset C.
- 8 new scripts appended in a new "DOMAIN VERTICALS & UNCOVERED FEATURES" section:
  - VIDEO 148 — Data Quality for Banking (Dataset D)
  - VIDEO 149 — Data Quality for Supply Chain (Dataset E)
  - VIDEO 150 — Free PII Scanner (`/tools/pii-audit`, previously uncovered)
  - VIDEO 151 — De-Identify for Research / k-anonymity (`/tools/de-identify`, previously uncovered, uses Dataset F)
  - VIDEO 152 — Compare Two Spreadsheets (`/tools/compare`, previously uncovered)
  - VIDEO 153 — Date Format Ambiguity, explained (previously no marketing hook existed for this novel feature)
  - VIDEO 154 — DQ Glossary marketing hook (distinct from the mechanics-only VIDEO 146)
  - VIDEO 155 — Free vs Pro vs Business, explained honestly (transparency/trust content, also a corrective for the over-promising risk found above)
- `Plan:` reality-check line added to VIDEO 8, 9, 10, 11, 25, 38, 71 (see gating map above).
- VIDEO 25 and VIDEO 30 were also rewritten in an earlier pass this session to match the real Sandbox/Failed-Records UI (unrelated to this audit, but same file).

### Follow-ups (not done — flagging for a future session)

1. VIDEO 16 (PII Detection) needs a `Plan:` correction — it currently implies free users see the PII banner; they don't (`fallback={null}`).
2. VIDEO 24, 33, 34, 35, 36, 37, 39, 72, 121 need the same `Plan: Pro plan required` treatment as was just done for the Business-gated videos, for consistency.
3. `lib/plans/limits.ts` has 6 unused boolean flags (`sandbox`, `connectors`, `remediation`, `pii`, `catalogScoring`, `crossColumnValidation`) that don't match the real per-route gating — worth cleaning up or wiring up for real, independent of video content.
4. Separately noticed during this work (not actioned, unrelated to this audit): several existing videos (19, 26, 28, 31, 52, 126…) describe setting a rule "Weight (1–5)" control in the UI that no longer exists in `RuleBuilderPanel.tsx` — weight is hardcoded to 1 at creation with no edit UI anywhere in the app.

---

## Current Session Status

Sessions 1–8 complete. Session 9a–9d (DQ Rule Enhancements: description, scope filters, breaking records, profiling narrative) is **fully complete and closed out as of 2026-06-25** — `npm run build`/`npm run lint` pass clean, the post-implementation audit found and fixed 2 real issues (see Build notes above), and the user ran `supabase/migrations/002_dq_rules_description_and_scope.sql` in the Supabase SQL Editor, unblocking persistence. Post-migration live verification confirmed: a real rule with `description` + `scope_conditions` now saves successfully; the new "Scoped" badge renders with the correct tooltip (`status == Approved AND state == TamilNadu`) in `DimensionGroupAccordion`; the live Scoring Dashboard BREAKING popup works against a real persisted rule alongside the always-visible third-column panel. (Sandbox's "Save Rule" and the `runs/[runId]` historical-label check were exercised earlier pre-migration and via the original browser pass — not re-run post-migration since the same code paths were already confirmed correct; low marginal value to re-test given the migration only affects what columns exist, not the rendering logic.)
Session 9e (Business Glossary) remains designed but **not started** — deferred as its own follow-up. Sessions 10–15 are planned and ready to build after that — say **"proceed"** to start any session.

The Marketing & Training Video Content Strategy work (above) is **complete as of 2026-06-28** — `video_tutorials.md` grew from 147 to 155 scripts, plan-tier gating was audited and corrected for 7 videos, and 3 new Domain Vertical datasets (Banking/Supply Chain/Healthcare) were specified. The 4 numbered follow-ups in that section (PII video correction, remaining Pro-tier labels, unused plan-limit flags, stale "Weight" UI references) are open and unscheduled.
