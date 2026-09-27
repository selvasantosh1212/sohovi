# Other Uses of Sohovi — Capability Audit & Validated Build Plan

> **What this file is:** an audit of what a data team can do with Sohovi *beyond* DQ scoring, validated against the codebase, plus the build plan for the gaps it exposed.
>
> **Audit date:** 2026-09-22. Every claim was checked by grepping `app/`, `lib/`, `components/`, `types/`, `supabase/` for the implementing symbol — not inferred from `projectplan.md` or from memory.
>
> **Related:** build sessions and history live in `projectplan.md`. Sessions W1–W6 below are planned here and intentionally not renumbered into that file (see *Plan-file corrections*).

---

## Part 1 — The 13 capability options a data team already has

Sohovi is sold as a data quality tool. In practice the codebase already supports thirteen distinct data-management jobs. Each entry below names the job, the code that delivers it, and the tool category it displaces.

### 1. Data profiling & discovery

`lib/profiling/profiler.ts` — usable without writing a single rule: inferred type, null/unique counts, min/max/avg/std, length stats, top and bottom values, full value-frequency, pattern summary, IQR/z-score outliers with bounds, duplicate value groups, and date-format detection that flags `day_first` vs `month_first` ambiguity. HyperLogLog + t-digest + reservoir sampling keep it stable on high-cardinality columns. `lib/profiling/narrative.ts` writes the plain-English column summary.

**Displaces:** the ad-hoc `df.describe()` / pandas-profiling notebook run on every new file.

### 2. Lightweight data catalog + ownership register

The Business Unit → Catalog → Asset hierarchy (`types/app.types.ts`) stores `owner_name`, `owner_email`, `purpose`, `business_meaning`, `source_system`, `upstream_file_name` and the persisted `column_schema`. `app/actions/search.ts` searches all three levels.

**Displaces:** the "who owns this file and what is it for" spreadsheet. Every asset carries its DQ score, so the catalog doubles as a health register — Collibra-lite for teams that will never buy Collibra.

### 3. Data observability / monitoring

The strongest non-DQ story. Run history is a time series; `schema_changed` + `schema_diff` detect added/removed/renamed columns between uploads; `lib/dq-engine/behavioral-scorer.ts` compares the current run against up to 10 previous runs for distribution shift and unexpected new values; `lib/dq-engine/anomaly-detector.ts` raises flags; alerts fire on `score_drop`, `schema_change`, `rule_failure`, `anomaly`.

**Displaces:** entry-level Monte Carlo / Metaplane / Elementary. **Caveat:** upload-triggered, not scheduled.

### 4. Reconciliation, migration testing and UAT

`lib/tools/keyed-diff.ts` performs a keyed two-file join into only-in-A / only-in-B / changed / unchanged with per-cell highlighting and CSV export. `lib/tools/fuzzy-match.ts` adds Levenshtein similarity for near-misses. The rule engine adds `cross_column_match`, `cross_field_comparison`, `referential_integrity` and `no_orphan_values`.

**Displaces:** source-vs-target ETL testing, legacy→new migration sign-off, month-end close reconciliation — usually throwaway SQL.

### 5. Privacy, PII and safe data sharing

Genuinely a second product line, not a feature. Profiling auto-detects email, phone, SSN, credit card, IP and person name, and masks sample values before anything is stored. The PII Audit tool returns a redacted copy. `lib/tools/anonymize.ts` classifies columns as direct / quasi / sensitive / safe and applies suppress, mask, pseudonymize, date/zip/numeric generalization and top/bottom-coding, with `lib/tools/k-anonymity.ts` measuring the resulting *k*.

**Displaces:** a privacy review before sending data to a vendor, offshore team or researcher. The browser-only architecture is the whole selling point — you can audit a file you are not allowed to upload anywhere.

### 6. Standards management via reusable rule sets

`app/actions/workflows.ts` promotes an asset's rules into a shared library, applies them to other assets through the column-mapping editor, and records each use in `workflow_applications`. The sandbox tests a rule against real data before committing it; ML suggestions and `lib/ml/nl-rule-parser.ts` let a non-engineer author rules.

**Enables:** one "Customer Master standard" or "Vendor Invoice File standard" defined once, enforced across every business unit.

### 7. Vendor / partner file acceptance gate (data contracts, human-in-the-loop)

Nothing new to build — compose what exists: workflow + schema-change detection + a score threshold + an alert. Every monthly partner file runs through the same standard; accept or bounce it with a PDF report as evidence.

### 8. Data standardization and cleansing

`components/remediation/RemediationPanel.tsx` maps each failing rule type to a concrete fix, applies case standardization and trim/normalize inline, allows row exclusion, then exports a cleaned CSV/XLSX. Dedupe adds normalization preview for whitespace, email case and E.164 phone.

**Displaces:** the manual Excel clean-up pass before a CRM import or a mailing.

### 9. Freshness / SLA monitoring

The `timeliness` and `currency` dimensions (`freshness_check`, `not_future_date`, `not_stale`, `recent_update`) turn "is this data current?" into a scored, alertable rule instead of a Slack question.

### 10. Precision & regulatory reporting checks

The `precision` dimension (`decimal_places`, `rounding_check`) and `conformity` (`format_check`, `datatype_enforcement`) cover finance and regulatory submissions where a value being *right* isn't enough — it has to be shaped right.

### 11. Data engineering utilities

The 12 free tools are a real toolbelt: CSV→SQL INSERT generation for staging loads, CSV↔JSON for API work, CSV→Markdown for docs and PRs, column picker, merger, and a test data generator (16 column types, up to 100k rows) for fixtures with zero real PII.

### 12. Spreadsheet-native ops monitoring

Connectors (`types/connectors.types.ts`) reach Google Sheets, Airtable, signed S3/Azure/GCS URLs and any REST endpoint, with credentials held in memory only. For teams whose real system of record *is* a Google Sheet, that's live monitoring rather than a snapshot.

### 13. Data literacy and onboarding

40+ in-app Learn guides (`lib/learn/guides.ts`), the DQ glossary (`lib/profiling/dq-glossary.ts`), and the score transparency panel showing rule-by-rule contribution. A new analyst can learn the team's DQ vocabulary inside the tool.

### Tier reality check

Profiling, cataloging and basic rules land on Free; workflows, alerts, PII and PDF export need Pro; sandbox, remediation, cross-column validation, catalog scoring and connectors are Business (`lib/plans/limits.ts`) — with the important exceptions documented in Part 2.

### Honest gaps — do not promise these in copy

No column-level lineage graph. No scheduling or orchestration (every run is a human uploading or re-fetching). No warehouse-native pushdown — data must come to the browser, which also caps volume. No MDM survivorship or golden records. No data-access-request workflow. No streaming.

### Positioning conclusion

Sohovi is closer to a **data operations workbench** — profiling, a light catalog, observability, reconciliation, privacy prep, cleansing — than to a DQ scanner, with DQ scoring as the spine that connects them. Sessions W3 and W4 below are what make that claim true rather than aspirational.

---

## Part 2 — Validation results

### Already built (do NOT re-plan)

| Capability | Evidence |
|---|---|
| Data profiling engine | `lib/profiling/profiler.ts` — types, nulls, uniques, min/max/avg/std, lengths, top/bottom values, value frequency, patterns, IQR + z-score outliers, duplicate groups, date-format ambiguity detection; HyperLogLog + t-digest + reservoir sketches |
| Plain-English profile narrative | `lib/profiling/narrative.ts` |
| Catalog + ownership register | BU → Catalog → Asset with `owner_name`, `owner_email`, `purpose`, `business_meaning`, `source_system`, `column_schema` (`types/app.types.ts`) |
| Global search across hierarchy | `app/actions/search.ts` |
| 10 DQ dimensions, 28 rule types | `lib/dq-engine/dimensions/*.ts` |
| Schema-change detection | `AssetRun.schema_changed` + `schema_diff` |
| Behavioral / distribution-shift scoring | `lib/dq-engine/behavioral-scorer.ts` (compares up to 10 prior runs) |
| Anomaly flags | `lib/dq-engine/anomaly-detector.ts` |
| Alert rules + evaluation | `app/actions/alerts.ts`; `evaluateAlerts` **is** called from `app/actions/runs.ts` |
| Trend charts + run comparison | `components/trends/ScoreTrendChart.tsx`, `RunComparisonTable.tsx` |
| Remediation + cleaned-file export | `components/remediation/` (per-rule fix map, case/trim fixes, row exclusion, CSV/XLSX export) |
| Reusable rule workflows | `app/actions/workflows.ts` (promote, apply with column mapping, application history) |
| Rule sandbox | `app/(dashboard)/dashboard/assets/[assetId]/sandbox/` |
| ML rule suggestions + NL rule parser | `lib/ml/column-classifier.ts`, `rule-suggester.ts`, `nl-rule-parser.ts` |
| Connectors | Google Sheets, Airtable, cloud-storage signed URL, REST API (`types/connectors.types.ts`) |
| Freshness / precision rules | `timeliness.ts`, `currency.ts`, `precision.ts`, `conformity.ts` |
| In-app learning | 40+ guides in `lib/learn/guides.ts`, `lib/profiling/dq-glossary.ts` |
| 12 free tools | `app/tools/*` |

### Gap status after the W0–W6 build (verified 2026-09-22, post-build)

Every row re-checked against the code, not against this document's own earlier claims. Two of the original entries were wrong when written; both are corrected below.

| # | Item | Status |
|---|---|---|
| V1 | Catalog-level DQ scoring | **CLOSED (scope corrected).** The original entry was wrong: the rollup average *was* already computed and rendered — inline in three places (`dashboard/page.tsx`, `catalogs/page.tsx`, `business-units/page.tsx`). Those copies are now one function (`lib/scoring/rollup.ts`). What was genuinely missing — a per-dimension, per-asset breakdown on the catalog and BU **detail** pages — is built and gated (`app/actions/rollups.ts`). **Deliberate decision:** the headline badge on list pages stays free rather than regress existing users; the Team tier buys the breakdown. Pricing copy now says "Catalog & business-unit score breakdowns" to match. |
| V2 | Cross-column validations | **CLOSED.** Gated in the rule builder *and* enforced in `createRule` **and** `updateRule` — the second was missed on the first pass and found in review: `updateRule` takes `Partial<RuleInput>`, so a free caller could create an ungated rule and switch its `rule_type` afterwards. |
| V3 | "Lineage & context metadata" | **CLOSED, and renamed.** `column_notes` (008) stores where a column comes from, what happens to it and who to ask. It is **not** a lineage graph, so the pricing line and the lock-card label are now "Column source & transformation notes". The old wording is gone from both. |
| V4 | Plan config is dead code | **CLOSED.** `Feature` is derived from the boolean keys of `PlanLimits`, so the config is the only source of truth and a typo cannot compile. Zero `minPlan=` call sites remain. `requireFeature()` added — and applied to `workflows.ts` and `alerts.ts`, which had **no** server-side gating at all and were found only in review. |
| V5 | Fuzzy duplicate matching | **CLOSED.** `lib/tools/fuzzy-keys.ts`, wired into reconciliation with a threshold slider. The dedupe tool's upsell, which promised survivorship and golden records, now promises only what ships. |
| V6 | Reconciliation inside the product | **CLOSED.** Asset-level Reconcile tab; `reconciliations` (010) stores bucket counts only. |
| V7 | De-identification inside the product | **CLOSED.** Privacy Studio + catalog PII register; `privacy_audits` (011) stores metadata only. |
| V8 | Alert delivery | **CLOSED.** `notification_channels` (009), email + Slack. See the privacy note below — the first implementation leaked cell values and was fixed. |
| V9 | Data contracts | **MOSTLY CLOSED.** `data_contracts` + `contract_evaluations` (012), evaluated from `saveRunResult`. **Two planned pieces not built:** no `alert_event` is raised on contract failure (so W2 delivery does not carry verdicts), and `ContractVerdictPDF` does not exist. Also: a contract cannot name individual rules — `dq_scores` carries no reference back to `dq_rules`, so the per-rule subset was removed rather than left silently passing. Adding a `rule_id` to `dq_scores` is the prerequisite. |
| V10 | Tags / share links / portfolio / badge | **PARTIAL.** Portfolio view built (W6). `asset_tags`, `shared_reports` and `api/badge` still missing. |
| V11 | Scheduling | **STILL OPEN**, deliberately. Unchanged — and the false "scheduled reconciliation" / "on every sync" copy in `/tools/compare`, `/tools/pii-audit` and `/tools/de-identify` has been removed, since it promised exactly this. |
| V12 | Template packs / column notes / changelog / feedback | **PARTIAL.** Only column notes shipped. |
| V13 | Phone/E.164 normalization in remediation | **STILL OPEN.** `components/remediation/` was not touched. |

### Drift found in review that the original audit missed

The build was reviewed by two independent agents before merge. Both found real problems; the audit above had not caught any of them.

- **A privacy claim was false.** The first alert-delivery implementation sent the anomaly message straight from `behavioral-scorer.ts`, and those messages quote actual cell values (`New dominant value "X" appeared in col`). The UI and the email footer both said "never your rows or column values." Fixed: delivery now builds a separate value-free message naming only the column and the metric. **Any privacy claim in UI copy must be traced to the code path before it ships.**
- **`sendAlertNotification` was an exported server action** — i.e. a public endpoint — that wrote to `alert_events`, a table with no tenancy column. Moved to `lib/notifications/deliver.ts`, which is not a `"use server"` module.
- **`upsert()` ignores `.eq()` filters.** `column_notes` keyed on `(asset_id, column_name)` could overwrite another workspace's row. `assertAssetInScope()` now validates every client-supplied `asset_id`.
- **Pricing lines sold but never gated:** "Full 10-dimension scoring", "Historical trend charts" and "Ownership & stewardship fields" are available to every plan. Removed from the Pro/Team lists rather than left as false claims.

### Plan-file corrections found during validation

- **`projectplan.md` Session 13 (Free SEO Tools) is stale — should be marked COMPLETE / SUPERSEDED.** 12 tools shipped in Sessions 9–10 (`/tools/*`), not the 6 specified there, and with different names. The spec no longer describes reality.
- **`projectplan.md` Session 10's dependency line is stale.** It says `npm install resend`; Resend and `lib/email/notify.ts` already exist (added for `/labs`). Reuse, don't install.
- **Session numbering collides.** `projectplan.md` plans "Sessions 10–15" while build history records a *different* Session 10 (free tools), 11 (labs) and 12 (KickoffBox). The sessions below are therefore named **W1–W6** to avoid making it worse.

---

## Part 3 — Build plan (W0–W6 BUILT 2026-09-22)

### ✅ W0 — Foundations — BUILT (added during the build; not in the original plan)

W1–W6 all leaned on things that did not exist. Skipping this would have meant writing the same drift three more times.

- `lib/plans/features.ts` — pure, client-safe: `Feature` derived from the boolean keys of `PlanLimits`, `can`, `minPlanFor`, `normalizePlan`, `GATED_RULE_TYPES`.
- `lib/plans/entitlements.ts` — server-only: `getPlanForScope`, `hasFeature`, `requireFeature`, `FeatureLockedError`. **The split matters:** `limits.ts` originally imported `@clerk/nextjs/server`, which reached the client bundle through `PlanGate` and broke the build.
- `getPlanForScope()` resolves an **organization** plan first, falling back to the member's. Data is scoped by `orgId ?? userId` while plans were resolved per seat, so a free member of a paid org was locked out of the org's own data. Billing still writes user metadata only, so the fallback is the live path and behaviour is unchanged.
- `lib/scoring/rollup.ts` — the rollup average, previously copy-pasted in four places.
- `components/assets/AssetTabs.tsx` — the asset sub-nav, extracted before three more tabs landed on it.
- `lib/supabase/ownership.ts` — `assertAssetInScope()`, added in review.

**Rule for everything after this:** a `PlanGate` is decoration. Server actions are public endpoints; the gate that counts is `requireFeature()` inside the action.

---

### ✅ W1 — Truth-up the paid tier — BUILT

**Why:** Three features are being sold on the Team tier that do not exist or are not gated (V1, V2, V3). This is a billing-integrity problem, not a roadmap item. Everything else waits behind it.

**Privacy:** All rollups read existing Supabase metadata (`asset_runs.overall_dq_score`). No raw data.

**Files to modify:**
- `app/actions/catalogs.ts` — populate `latest_dq_score` per catalog: average of member assets' `latest_dq_score`, alongside the already-joined `asset_count`. Weight by row count only if trivially available, else simple mean and say so in the UI label.
- `app/actions/business-units.ts` — same rollup one level up.
- `app/(dashboard)/dashboard/catalogs/[catalogId]/page.tsx` + `business-units/[buId]/page.tsx` — render `ScoreBadge` + a per-asset breakdown table.
- `components/catalogs/CatalogCard.tsx`, `components/business-units/BUCard.tsx` — show the rollup score.
- `components/rules/RuleBuilderPanel.tsx` + `assets/[assetId]/sandbox/SandboxClient.tsx` — wrap the two cross-column rule types in `PlanGate minPlan="business"` (closes V2).
- `lib/plans/limits.ts` + `components/shared/PlanGate.tsx` — **make `PlanGate` accept a `PlanLimits` key instead of a raw `minPlan`**, so the config becomes the single source of truth (fixes V4 and prevents this class of drift). Keep `minPlan` as a deprecated fallback during migration.
- `components/landing/PricingSection.tsx` — either keep "Lineage & context metadata" and ship W1b below, or remove the line. **Do not leave it as-is.**

**W1b (same session, small):** column-level context notes — delivers the "lineage & context" promise honestly.
- `supabase/migrations/008_column_notes.sql` — `column_notes` (asset_id, column_name, source_description, transformation_notes, owner)
- `app/actions/column-notes.ts` — `getColumnNotes`, `upsertColumnNote`
- `components/profiling/ColumnNoteDrawer.tsx` — drawer from `ColumnProfileCard`; note badge when present
- This is `projectplan.md` Session 15's item 14b, pulled forward because pricing already sells it.

**Pricing gate:** Catalog/BU rollup + cross-column + column notes → Business (Team).

---

### ✅ W2 — Alert delivery: Slack + email — BUILT

**Why:** V8. Alerts already evaluate correctly on every run; users just never hear about them. Cheapest large win available.

**Revision to `projectplan.md` Session 10:** Resend + `lib/email/notify.ts` already exist. No new dependency. Slack is a plain `fetch` to a webhook.

**Files to create:**
- `supabase/migrations/009_notification_channels.sql` — `notification_channels` (user_id, type `slack`|`email`, config jsonb, enabled bool)
- `app/actions/notifications.ts` — `saveNotificationChannel`, `getNotificationChannels`, `deleteNotificationChannel`, `sendAlertNotification`, plus a "Send test ping"
- `components/alerts/NotificationChannelForm.tsx`, `NotificationChannelCard.tsx`

**Files to modify:**
- `app/actions/alerts.ts` — after inserting an `alert_event`, call `sendAlertNotification`
- `lib/email/notify.ts` — add an alert-email template alongside the existing labs templates
- `app/(dashboard)/dashboard/alerts/page.tsx` — "Notification Channels" section above the rules list

**Privacy:** Sends score / threshold / asset name only — never rows, never column values.
**Pricing gate:** email → Pro; Slack → Business.

---

### ✅ W3 — Reconciliation as a first-class asset feature — BUILT

**Why:** V6 + V5. The engine is built and proven in `/tools/compare`, but reconciliation is the most common data-team job Sohovi is *already capable of* and does not sell: source-vs-target ETL testing, legacy→new migration sign-off, month-end close. It also makes the fuzzy upsell honest.

**Files to create:**
- `app/(dashboard)/dashboard/assets/[assetId]/reconcile/page.tsx` — two-panel upload (A = source/before, B = target/after); both parsed by the existing `file-parser` worker
- `components/reconcile/ReconcileFlow.tsx` — key-column picker, then the four buckets from `keyed-diff.ts` (only-in-A / only-in-B / changed / unchanged) with per-cell highlighting and CSV export
- `components/reconcile/FuzzyMatchPanel.tsx` — wire `lib/tools/fuzzy-match.ts` for near-miss keys with a similarity threshold slider (**closes V5**)
- `supabase/migrations/010_reconciliations.sql` — store **counts only** (bucket sizes, key column, file names, run_at). Never rows.

**Files to modify:**
- Asset detail nav — add "Reconcile" beside Upload / Profile / Rules / Scoring
- `app/tools/remove-duplicates/RemoveDuplicatesClient.tsx:564` — point the fuzzy upsell at the real feature

**Supersedes:** `projectplan.md` Session 14 item 13c (CSV Version Comparison) — same machinery, broader use case. Mark 13c as folded into W3.
**Privacy:** Both files parsed client-side; only bucket counts persisted.
**Pricing gate:** Business.

---

### ✅ W4 — Privacy Studio in-product — BUILT

**Why:** V7. `anonymize.ts` (suppress / mask / pseudonymize / generalize date-zip-numeric / top-bottom code) and `k-anonymity.ts` are production-quality and locked outside the paywall. Combined with the browser-only architecture this is a second product line — "audit and de-identify a file you are not allowed to upload anywhere" — not a feature.

**Files to create:**
- `app/(dashboard)/dashboard/assets/[assetId]/privacy/page.tsx` — column classification (direct / quasi / sensitive / safe) from `classifyColumn`, suggested action per column, k-anonymity readout against a target k, export of the de-identified file
- `components/privacy/PrivacyStudioPanel.tsx` — reuses `DeIdentifyClient` logic, asset-aware
- `components/privacy/PIIRegisterTable.tsx` — catalog-level PII register: every asset × every PII-flagged column, from profiling summaries already in Supabase
- `app/actions/pii-register.ts` — `getPIIRegister(catalogId)`

**Files to modify:**
- `app/(dashboard)/dashboard/catalogs/[catalogId]/page.tsx` — PII register section
- `components/upload/PIIDetectionBanner.tsx` — link into Privacy Studio

**Privacy:** De-identification runs client-side; persist only which columns were flagged and the achieved k.
**Pricing gate:** Business.

---

### ✅ W5 — Data contracts + vendor file acceptance gate — BUILT (2 gaps, see V9)

**Why:** V9. Sharpened from `projectplan.md` Session 11: the valuable framing is not "a contract object" but **accept/reject a partner's file**, with a PDF as the evidence trail. Composes W1's gating, existing schema-change detection, existing workflows and W2's delivery.

**Files to create:**
- `supabase/migrations/011_data_contracts.sql` — `data_contracts` (asset_id, name, description, min_pass_threshold, require_no_schema_change bool) + `contract_rules` (contract_id, rule_id)
- `types/contracts.types.ts`, `app/actions/contracts.ts` (`evaluateContract` reads run scores from Supabase)
- `components/rules/ContractForm.tsx`, `ContractCard.tsx`, `ContractEvaluationPanel.tsx`
- `app/(dashboard)/dashboard/assets/[assetId]/contracts/page.tsx`
- `components/reports/ContractVerdictPDF.tsx` — one-page accept/reject with per-rule breakdown (reuses the existing `jsPDF` path in `ReportsClient.tsx`)

**Files to modify:**
- `app/actions/runs.ts` — after `saveRunResult`, evaluate active contracts → on failure insert an `alert_event` (which W2 then delivers)
- Asset detail nav — add "Contracts"

**Pricing gate:** Business.

---

### ✅ W6 — Portfolio health + freshness SLA view — BUILT

**Why:** The rollups from W1 make a portfolio view nearly free, and the `currency` / `timeliness` dimensions already compute staleness that nothing surfaces at the top level.

**Files to create:**
- `app/actions/dashboard.ts` — `getPortfolioTrend` (daily avg score, 30 days), `getWorstAssets` (bottom 5), `getStaleAssets` (assets whose last run exceeds an SLA window)
- `components/scoring/PortfolioTrendChart.tsx`, `WorstAssetsTable.tsx`, `StaleAssetsTable.tsx`

**Files to modify:** `app/(dashboard)/dashboard/page.tsx` — "Portfolio Health" section

**Absorbs:** `projectplan.md` Session 12 item 11c.
**Pricing gate:** Pro (trend), Business (multi-BU portfolio).

---

## Part 4 — Explicitly deferred

Validated as missing, deliberately not scheduled.

| Item | Why deferred |
|---|---|
| Scheduling / cron / credential vault (`projectplan.md` Session 14, 13a) | Biggest architectural decision on the roadmap — server-side connector runs mean raw rows transit our server, which reframes the core privacy promise. Needs a founder decision before any code. Do not start it as a side quest. |
| Tags, public share links, embed badge (Session 12, 11a/11b/11d) | Growth features, no dependency on W1–W6. Cheap whenever wanted. |
| Bulk operations, usage meter (Session 14, 13b/13d) | Nice-to-have; the usage meter matters more once Free-tier volume justifies it. |
| Industry rule template packs (Session 15, 14a) | Strong marketing asset, but W1's billing-integrity fixes outrank it. |
| Changelog page, feedback widget (Session 15, 14c/14d) | Low effort, low urgency. |
| MDM golden records / survivorship, column-level lineage graph, warehouse pushdown, streaming | Out of scope for the browser-only model. Do not promise these in copy. |

---

## Part 5 — What is next

W0–W6 are built, reviewed and on `feat/data-ops-workbench`. Before anything new:

1. **Run migrations 008–012** in the Supabase SQL editor. None of W1b–W5 works against the live database until this happens.
2. **Add `rule_id` to `dq_scores`** — the missing join key. It blocks per-rule data contracts (V9) and would let alert events point at the rule that fired.
3. **Finish W5:** raise an `alert_event` on contract failure so verdicts flow through W2 delivery, and build `ContractVerdictPDF` for the evidence trail.
4. **V13** — wire `phone-format.ts` into `RemediationPanel`. Small, and the engine already exists.
5. **Then** the deferred list in Part 4, unchanged. Scheduling still needs a founder decision before any code.
