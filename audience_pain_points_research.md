# Sohovi Audience Pain-Point Research — Teams & Industries

> **Why this file exists:** `video_tutorials.md` has 196 scripts (37 priority + 159 archive) and the blog has 207 posts, and between them almost every team and industry below already has *something* written. But most of that existing content pitches the same five words — completeness, accuracy, validity, uniqueness, consistency — dressed up in a different logo. This file is the layer underneath: for each of the 6 teams and 8 industries we're targeting, what specific thing is actually broken in their day, in their words, that a generic "data quality" video doesn't speak to — and exactly which Sohovi feature is the answer, so the next round of videos produces an aha moment instead of a definition.
>
> **How this was built:** (1) read the product source (`lib/dq-engine/`, `lib/plans/limits.ts`, `components/landing/UseCasesSection.tsx`) so every claim below is a real, shipped feature — nothing invented; (2) read all 207 blog posts relevant to these 14 segments and logged what's already covered, so new work fills real gaps instead of duplicating; (3) ran fresh web research (industry blogs, G2/Capterra-style reviews, vendor write-ups, and forum search where indexed) per segment to find sharper, more specific complaints than what's already published; (4) **second pass:** verified nothing was lost when two research batches stalled and had to be retried in smaller pieces (all 14 segments confirmed complete), then layered in a distribution/funnel framework and a data-volume-based prioritization per direct request — see below.
>
> **Numbers guardrail:** every stat below is cited to where it came from — mostly vendor blogs and industry write-ups, not independently verified academic sources. Treat them exactly like `video_tutorials.md` already instructs (line 148): use them *directionally* in a script ("nearly half of new CRM records," not "45.3%, per LeanData 2024"), never as an exact cited figure on screen.

---

## Distribution, Funnel Stage & Data-Volume Framework

**The core problem this solves:** most people in the 14 segments below don't wake up thinking "I have a data quality problem." They experience a symptom — a wrong invoice, a suspended listing, a paycheck error, a dashboard that disagrees with another dashboard — and don't know (a) that it has a name, or (b) that a tool exists to fix it. A video that opens with "data quality" language loses them before it starts. So every segment below now gets a three-stage content arc, reusing taxonomy that **already exists in this codebase** rather than inventing new labels:

- **Stage 1 — Informational** *(matches the existing blog `searchIntent: "informational"` tag, used on 181 of 207 posts)*: names the symptom in the viewer's own language, zero product mention. This is the "wait, that's literally my problem" moment. Format: **YouTube Shorts / Instagram Reels** (the existing platform combo used on 24+ scripts) or a short blog post.
- **Stage 2 — Commercial** *(matches the existing `searchIntent: "commercial"` tag)*: reveals there's a specific way to catch/fix this, demos it live. This is the "aha-moment tutorial" already written for each segment below. Format: **YouTube / Blog / Instagram** long-form (the dominant combo, used on 93 scripts).
- **Stage 3 — BOFU** *(matches the existing `searchIntent: "bofu"` tag, used on 21 posts — but currently only as generic tool-comparison content: `sohovi-vs-excel-data-quality.md`, `great-expectations-alternatives-simpler.md`, etc.)*: the buyer is actively comparing options. **This is a gap across all 14 segments** — zero segment-specific BOFU posts exist yet (no "best data quality tool for banks," no "data quality tool for SaaS teams compared"). Tier-1 segments below should get first claim on a dedicated one.

**The data-volume "be loud" logic:** the user's framing is that Sohovi's value scales with how much data a business is drowning in — so the segments generating the most continuous, high-stakes, multi-system data should get the most content across the most channels, not an equal slice each. Segments were tiered on row-count scale, data velocity (continuous vs. periodic), number of source systems needing reconciliation, and stakes-per-error:

| Tier | Segments | Why |
|---|---|---|
| **Tier 1 — Loudest** | Finance & Banking, SaaS & Tech, E-commerce (industry), Logistics & Supply Chain, Analytics & BI Teams, Healthcare | Continuous, high-volume, multi-system data with high stakes per error (regulatory, financial, or safety exposure) |
| **Tier 2 — Strong push** | Marketing & Revenue Ops, E-commerce & Product (internal), Marketing Agencies, Finance & Compliance, Consulting (firms) | Meaningful volume, often bursty (campaign/close/engagement cadence) rather than continuous |
| **Tier 3 — Focused push** | HR & People Operations, Freelancers & Consultants (solo), Non-profit | Bounded by headcount/donor-list/single-client scale — real pain, smaller absolute footprint |

Channel allocation by tier (applied per segment below):
- **Tier 1:** 2–3 Shorts/Reels (Stage 1, one per fresh pain point) **+** 1 long-form YouTube/Blog/Instagram (Stage 2) **+** a dedicated Stage-3 BOFU blog post.
- **Tier 2:** 1 Shorts/Reel (Stage 1) **+** 1 long-form (Stage 2) **+** reuse/refresh an existing blog post for Stage 3 rather than commissioning new.
- **Tier 3:** Blog post only, folding Stage 1+2 into one piece, unless the hook is unusually strong (Non-profit's is — see below) **+** consider folding into a multi-segment cheat-sheet video (the existing VIDEO 159 "by industry" pattern) instead of a dedicated one.

---

## Part 1 — Teams

### 1. Marketing & Revenue Ops — *Tier 2*

**Already covered:** email decay rates, segmentation drift, attribution join failures, sender-reputation mechanics, a pre-campaign checklist. (`data-quality-marketing-teams.md`, `poor-data-quality-marketing-campaigns.md`, `sender-reputation-tanks-bad-list-data.md`, +2 more)

**Stage 1 hook (no product mention):** "Why do Google and Meta keep matching fewer of the customers I upload — even though I didn't change the list?"

**Fresh pain points:**
- **Duplicate contacts stack up before a campaign even sends**, because nothing dedupes on import — typo'd domains and reformatted names double-count the same person. → *Sohovi fit:* Uniqueness rules + auto-profiling on Free/Pro catch this pre-import; sandbox (Business) tests the rule before it runs for real. *(LeanData: 45%+ of new Salesforce records are duplicates)*
- **Lead scores quietly stop meaning anything** — the model is fine, but the fields feeding it (title, company size, activity recency) are stale or blank. → *Sohovi fit:* Completeness/Accuracy rules scoped to just the scoring fields; the DQ score's column breakdown shows which field is dragging the model down.
- **Customer Match / Custom Audience upload rates keep sliding and nobody can say why** — mixed formats (phone-only rows, inconsistent casing) mean fewer rows match at the ad platform. → *Sohovi fit:* Validity + Consistency rules are a pre-flight check the ad platforms themselves don't offer. *(Meta ad attribution down 40–60% since iOS 14.5, per industry write-ups; Google explicitly ties Customer Match rate to complete, correctly formatted keys)*
- **SMS programs sit on dead numbers and undocumented consent** — lists built up over years never get re-verified, and TCPA violations are $500–$1,500 each. → *Sohovi fit:* pattern/Validity rules for phone formatting + a Completeness rule requiring a consent-timestamp column.

**Aha-moment tutorial (Stage 2):** *"Will This List Survive Customer Match?"* — upload a sample audience export, profiling flags malformed phones/emails/casing in red *before* the file ever reaches Google/Meta's upload screen, apply the rule set, export the list that will actually match.

**Stage 3 / BOFU:** no segment-specific comparison post exists — a "best way to validate a Customer Match list before upload" buyer's-guide angle is unclaimed.

**Channel plan:** 1 Shorts/Reel (Stage-1 hook above) + 1 long-form (the Customer Match tutorial) + refresh an existing marketing post to add a BOFU CTA rather than a new post.

---

### 2. Analytics & BI Teams — *Tier 1*

**Already covered:** 6 types of BI errors (dupes, null-skew, broken segmentation), why-two-reports-diverge diagnostics, pre-warehouse-load validation categories. (`data-quality-affects-analytics-business-intelligence.md`, `why-your-reports-are-wrong-data-quality.md`, `validate-data-quality-before-data-warehouse.md`)

**Stage 1 hook (no product mention):** "Why do Tableau and Power BI show two different numbers for what's supposed to be the same metric?"

**Fresh pain points:**
- **Looker, Tableau, and Power BI each tell a different story off the same warehouse** — different refresh cadence, filters, and date logic make one KPI diverge by tool. → *Sohovi fit:* the DQ score's column-level breakdown + score transparency panel shows *which* rows/columns differ — replacing "whose number is right" with evidence. *(Acceldata: 67% of orgs don't fully trust the data behind their own decisions)*
- **Self-serve BI breeds shadow metrics** — every team gets a dashboard seat but no shared definition layer, so "active user" gets reinvented per report. → *Sohovi fit:* reusable Workflows (Pro+) lock one validated rule set that every new extract has to pass first.
- **A green dbt test suite still ships wrong numbers** — teams test the columns that never fail, while the business logic that actually breaks goes unchecked. → *Sohovi fit:* AI rule suggestions surface the rule nobody thought to write — outliers, pattern breaks, cross-field logic — instead of more of the same column-not-null tests. *(dbt's own survey: 57% of data teams call data quality their top problem)*
- **A schema or feed changes and nobody notices for days**, until a dashboard "just looks off." → *Sohovi fit:* schema-change and score-drop alerts (Pro+) catch drift before a stakeholder does.

**Aha-moment tutorial (Stage 2):** *"Same CSV, Two Dashboards, One Liar"* — upload the extract two teams used to build conflicting dashboards; profiling flags the null-skewed column driving the gap; click the failing rows, download them, settle the argument on camera.

**Stage 3 / BOFU:** unclaimed — "dbt tests vs. Sohovi profiling: what each one actually catches" would sit naturally next to the existing `great-expectations-alternatives-simpler.md` post.

**Channel plan (Tier 1 — loudest):** 2–3 Shorts/Reels (dashboard-disagreement, dbt-blind-spot, silent-schema-change hooks) + 1 long-form (the Two Dashboards tutorial) + 1 new BOFU post.

---

### 3. E-commerce & Product (internal team) — *Tier 2*

**Already covered:** general catalog completeness stats, WooCommerce/Shopify/Etsy/Amazon platform-specific issues, vendor file validation, Black Friday prep. (9 posts — this angle is well-covered from the *external seller* side; the gap is the *internal cross-functional* side.)

**Stage 1 hook (no product mention):** "How did we launch a product page with a missing price and nobody caught it?"

**Fresh pain points:**
- **A launch passes through five teams and nothing gates the handoff** — specs (engineering) → copy (marketing) → compliance (legal) → pricing (sales) move via email/spreadsheet with no checkpoint, so incomplete records reach the storefront. → *Sohovi fit:* Completeness/Validity rules scoped to a category (e.g. `category == electronics`) catch missing attributes pre-launch — no PIM migration required.
- **The same SKU has different data in five systems and nobody owns the truth** — ERP, supplier feeds, and spreadsheets all feed the catalog raw and unreconciled. → *Sohovi fit:* cross-column/cross-field validation (Business) checks a record's attributes agree with each other before it's called launch-ready.
- **Catalog errors surface in the returns queue, not QA** — validation happens after the customer complains, not before publish. → *Sohovi fit:* the sandbox (Business) tests rules on a sample upload and catches the gap before the real one goes live.
- **Merchandising and engineering argue from different spot-checks**, with no shared quality signal either side trusts. → *Sohovi fit:* one DQ score (0–100) with a column drill-down both teams look at instead of competing samples.

**Aha-moment tutorial (Stage 2):** *"The Launch Nobody Signed Off On"* — import a merchandising-to-catalog-ops sheet with three planted errors (missing size, malformed price, duplicate SKU), type an AI-builder prompt in plain English ("flag products missing a required attribute for their category"), watch the sandbox catch all three before any row reaches the storefront.

**Stage 3 / BOFU:** none dedicated to internal PIM/catalog-ops buyers — the 9 existing posts are all seller-facing, not internal-team-facing.

**Channel plan:** 1 Shorts/Reel + 1 long-form (Launch Nobody Signed Off On) + reuse an existing catalog post for the BOFU angle.

---

### 4. HR & People Operations — *Tier 3*

**Already covered:** multi-system fragmentation (HRIS/payroll/benefits), recruitment-specific dedup, a freelance-recruiter cleanup routine. (`data-quality-hr-employee-records.md`, `data-quality-issues-recruitment.md`, `freelance-recruiters-clean-candidate-spreadsheets.md`)

**Stage 1 hook (no product mention):** "Why was a new hire's first paycheck wrong?"

**Fresh pain points:**
- **The same employee shows up as three different people across systems** — HRIS, payroll, and benefits are populated separately with no shared ID, so names/emails/dates drift apart. → *Sohovi fit:* Uniqueness rules + the free reconciliation tool compare an HRIS export against a payroll export and show exactly which records don't match.
- **A new hire's first paycheck is wrong** because the manual HR-to-payroll handoff misassigns pay group or misses a tax form. → *Sohovi fit:* Completeness/Accuracy rules scoped to "new hires this pay cycle," sandbox-tested (Business) before the payroll run fires.
- **EEO-1 filings double-count or miscategorize employees** across establishments, risking OFCCP scrutiny. → *Sohovi fit:* the AI builder turns "flag employee IDs appearing under more than one establishment" into a running rule from plain English.
- **Terminated employees stay "active" in downstream feeds** because nothing cross-checks termination date against every system holding a copy. → *Sohovi fit:* a reusable Workflow (Pro+) re-runs the same check every pay cycle automatically.

**Aha-moment tutorial (Stage 2):** *"The Payroll Handoff Test: Catch the Errors Before Paychecks Go Out"* — run the free reconciliation tool on this cycle's HRIS export against the payroll register live, surface 2–3 people with a mismatched pay group or missing tax form, before the payroll deadline instead of after an employee complains.

**Stage 3 / BOFU:** low priority given Tier 3 — fold into a general "free HR data tools" comparison if one gets made for a higher tier segment.

**Channel plan (Tier 3 — focused):** one blog post combining Stage 1 + 2 (the payroll-handoff story as narrative); skip a dedicated Short unless bundled into a multi-segment reconciliation-tool reel.

---

### 5. Finance & Compliance — *Tier 2*

**Already covered:** transaction/KYC/reference-data errors, regulatory reporting context, 9 specific QuickBooks import-error fixes. (`data-quality-financial-services.md`, `quickbooks-import-errors-data-fixes.md`)

**Stage 1 hook (no product mention):** "Why did we almost pay the same vendor invoice twice?"

**Fresh pain points:**
- **Duplicate vendor payments slip through** because the same vendor exists under two different IDs in the vendor master file, so invoice-matching controls don't catch the repeat. → *Sohovi fit:* Uniqueness/Consistency rules + AI rule suggestions flag near-duplicate vendor names or repeated invoice number+amount+date combos.
- **Month-end close reconciliation drifts** — several people update the same working spreadsheet at different times, so "the number" is never quite in sync. → *Sohovi fit:* the free reconciliation tool instantly shows what changed between two versions of the trial balance or AP ledger.
- **Expense audit prep turns into email ping-pong** chasing filers for missing vendor/date/amount or wrong GL coding. → *Sohovi fit:* Completeness/Validity rules sandboxed (Business) against this month's expense export, then the remediation flow (Business) exports a corrected file instead of manual back-and-forth.
- **Auditors want proof a control existed, not just a fixed number.** → *Sohovi fit:* PDF report export (Pro+) + the score transparency panel double as literal documentation of a data-quality control.

**Aha-moment tutorial (Stage 2):** *"The Month-End Diff: Catch the Duplicate Vendor Payment Before the Auditors Do"* — run the free reconciliation tool on this month's AP export against last month's, then use the AI builder to write "flag invoices with the same vendor and amount within 5 days" in plain English, catching a real duplicate-payment pattern live before exporting an audit-ready report.

**Stage 3 / BOFU:** unclaimed — pairs naturally with a future Finance & Banking BOFU post (below) rather than needing its own.

**Channel plan:** 1 Shorts/Reel + 1 long-form (Month-End Diff) + share the Finance & Banking BOFU post once built.

---

### 6. Freelancers & Consultants (solo operators) — *Tier 3*

**Already covered:** this is the single most-saturated segment in the whole content library — 9 dedicated posts plus an existing video (PV92/VIDEO 92) already cover onboarding, scoping, pricing ($250–$8,000+), delivery, and multi-client ops in depth. New content here needs a genuinely different angle, not a tenth "how to audit a client's data" post.

**Stage 1 hook (no product mention):** "Why is this client's spreadsheet way messier than what they described on the discovery call?"

**Fresh pain points:**
- **"The data is way worse than what I quoted for" mid-project panic** — freelancers scope from the client's description, not an inspection, so the real mess surfaces after the clock starts. → *Sohovi fit:* profiling + DQ score in session one (Free/Pro) turns "trust me it's bad" into a shareable number *before* locking a fixed fee — the report becomes your change-order evidence.
- **Indemnification clauses don't hold up because there's no proof the freelancer took the agreed security steps.** → *Sohovi fit:* the free PII/secrets scanner and de-identify tool generate an actual record of what was checked — the "written security measures" indemnification clauses require.
- **"I cleaned their data" isn't a case study** — the work is invisible and hard to quantify for a portfolio. → *Sohovi fit:* the DQ score's before/after (e.g. 58 → 93) plus PDF export (Pro+) is a ready-made, quantified case-study asset.
- **Billing guesswork** — hourly punishes efficiency, fixed-fee punishes surprises, with no objective pre-read on how bad a file actually is. → *Sohovi fit:* profile the file pre-proposal and price the *audit* itself as a distinct paid first deliverable, using the score as the pricing input.

**Aha-moment tutorial (Stage 2):** *"The 10-Minute Scope-Creep Save"* — mid-project, upload the client's file, the profiler returns a DQ score of 38 and 4,200+ breaking records, screenshot the score-transparency panel straight into a change-order email — messiness becomes a number the client signs off on in the same call.

**Stage 3 / BOFU:** already covered — the existing 9-post library includes pricing/positioning content; no new BOFU piece needed here.

**Channel plan (Tier 3 — lowest priority for new production):** existing coverage is deep enough that this segment can wait; if produced, one Short on the scope-creep-save hook is enough.

---

## Part 2 — Industries

### 7. Logistics & Supply Chain — *Tier 1*

**Already covered:** address accuracy across the e-commerce→OMS→WMS→carrier handoff, phantom-inventory/duplicate-shipment demo (PV34/VIDEO149). One post, address-centric — everything below is genuinely new territory.

**Stage 1 hook (no product mention):** "Why doesn't our warehouse count match what the system says we're supposed to have?"

**Fresh pain points:**
- **Warehouse/3PL inventory counts don't match the system of record** — unit-of-measure mismatches (kg vs. pieces) between ERP and 3PL, plus manual end-of-shift counts, drive most bin-level discrepancies. → *Sohovi fit:* the free reconciliation tool matches SKU quantities across WMS vs. ERP exports; outlier detection flags UOM-driven variance before it's booked as shrinkage.
- **Freight/carrier EDI breaks silently and gets billed wrong** — accessorial charges (detention, liftgate, fuel surcharge) are the highest-error category, with industry error rates around 5–8% (some estimates to 20%). Sohovi has no native EDI connector, so this is an export-to-CSV workflow. → *Sohovi fit:* Validity rules (allowed reason/accessorial codes) + reconciliation against the TMS shipment export.
- **Customs paperwork fails from data degrading across hand-offs** — HS codes and consignee details get re-keyed manually at every transfer, and each re-key adds an error customs flags immediately. → *Sohovi fit:* Completeness/Validity rules on the pre-filing export catch missing HS codes and format errors days before a border hold.
- **Forecasts run on stockout-distorted, inconsistently-coded sales history.** *(Forecastio: up to 39% of sales leaders blame poor data quality for bad demand forecasts)* → *Sohovi fit:* profiling flags inconsistent SKU formats and demand outliers in sales-history exports before they feed a forecasting model.

**Aha-moment tutorial (Stage 2):** *"Why Your Freight Bill Never Matches the TMS: A 5-Minute Accessorial Audit"* — upload a TMS shipment export next to the carrier's invoice CSV, the reconciliation tool surfaces charges with no matching detention/liftgate flag plus a unit-of-measure mismatch, all without the file leaving the browser.

**Stage 3 / BOFU:** unclaimed — "best way to reconcile 3PL/WMS inventory without an EDI platform" is a real, high-intent buyer question nobody's answering yet.

**Channel plan (Tier 1 — loudest):** 2–3 Shorts/Reels (warehouse-count-mismatch, freight-bill, customs-hold hooks) + 1 long-form (Freight Bill Audit) + 1 new BOFU post.

---

### 8. Marketing Agencies — *Tier 2*

**Already covered:** cross-client contamination risk, lead-gen agency validation pipelines, PR-agency media-contact decay, influencer-database decay, multi-client ops frameworks. (5 posts)

**Stage 1 hook (no product mention):** "Why did the client spot the error in our report before we did?"

**Fresh pain points:**
- **Every new client handover is a spreadsheet in a different shape** — three phone formats, inconsistent name columns, no stable ID. → *Sohovi fit:* auto-profiling + Consistency rules flag/normalize formats before campaign #1, then save it as a Workflow (Pro+) so client #2 isn't from scratch.
- **A wrong number in the client report ends trust fast** — manual pulls from five ad platforms produce miscopied figures the client spots before the agency does. → *Sohovi fit:* run the DQ score + trend charts against the reporting pull before send, catching an anomalous jump that's actually a data error, not a performance story.
- **Winning the RFP means proving rigor before a contract or NDA even exists** — agencies default to generic capability decks with no client data to demonstrate on. → *Sohovi fit:* because raw data never leaves the browser, an agency can screen-share a live DQ audit of a *prospect's own list* on the pitch call with zero data-sharing agreement.
- **Affiliate/lead-gen leads look real but aren't**, and reconciliation happens weeks too late. → *Sohovi fit:* the free reconciliation tool matches the network's payout report against CRM records; Uniqueness/outlier rules flag duplicate or templated submissions before payout.

**Aha-moment tutorial (Stage 2):** *"The Pitch-Call Data Audit"* — on a discovery call, drag in a sample of the prospect's own exported list live, show the DQ score and one broken-record example in under two minutes, close with "this ran entirely in this browser tab, nothing left your machine."

**Stage 3 / BOFU:** unclaimed — "how agencies should pitch data quality as a differentiator in an RFP" sits at the intersection of sales-enablement and BOFU.

**Channel plan:** 1 Shorts/Reel (the client-report-error hook) + 1 long-form (Pitch-Call Audit) + refresh an existing agency post with a BOFU CTA.

---

### 9. SaaS & Tech — *Tier 1*

**Already covered:** user identity fragmentation, event-tracking gaps, subscription/billing errors, CRM-product misalignment. One broad post — thin coverage, real room underneath.

**Stage 1 hook (no product mention):** "Why doesn't this customer's invoice match what they actually used?"

**Fresh pain points:**
- **Usage-based invoices don't match actual usage** — metering pipelines silently drop or duplicate events under load, so the bill is wrong before pricing logic even runs. → *Sohovi fit:* the free reconciliation tool compares a usage-events export against the invoice line-items export and pinpoints exactly which accounts/events don't tie out, plus Uniqueness rules for duplicate event IDs.
- **PQL data is too messy to hand to sales-assist** — product-usage and CRM exports come from different systems with nothing reconciling them. → *Sohovi fit:* the AI builder turns "flag PQL rows missing usage_score or with a duplicate account_id" into a running rule before routing to sales.
- **Connected tools drift silently out of sync** — two-way syncs can't agree whose timestamp is authoritative, so CRM/product/billing records diverge until support tickets pile up. → *Sohovi fit:* run the same two exports through reconciliation on a schedule; trend charts (Pro+) show drift building before customers complain.
- **Multi-tenant records get mislabeled across customers** — a null or duplicate `tenant_id` can leak or corrupt another tenant's rows. → *Sohovi fit:* Consistency/Validity rules scoped to `tenant_id` flag orphaned or duplicate identifiers within an export.

**Aha-moment tutorial (Stage 2):** *"The Invoice Nobody Can Explain: Reconciling Usage Events vs. Billing in 60 Seconds"* — drag a raw usage-events CSV next to the Stripe/Chargebee invoice export into the reconciliation tool; clicking a mismatch shows (and lets you download) billed events with no matching usage record, plus duplicate event IDs double-charging one customer.

**Stage 3 / BOFU:** unclaimed and high-value — "best data quality tool for a SaaS company without a data-engineering team" would sit next to `soda-alternatives-no-data-engineers.md` and `monte-carlo-alternatives-small-teams.md`.

**Channel plan (Tier 1 — loudest, #1 overall priority — see final ranking):** 2–3 Shorts/Reels (invoice-mismatch, PQL-mess, silent-sync-drift, multi-tenant-leak hooks) + 1 long-form (Invoice Nobody Can Explain) + 1 new BOFU post.

---

### 10. Consulting (firms, not solo freelancers) — *Tier 2*

**Already covered:** effectively nothing — every existing freelancer/consultant post is written from the solo-operator point of view. This is genuinely open territory, and that zero-content gap outweighs its Tier-2 volume ranking (see final priority below).

**Stage 1 hook (no product mention):** "Why does deliverable quality change depending on which consultant on the team actually touches the account?"

**Fresh pain points:**
- **Clients notice when the team that sold the project isn't the team that delivers it** — a partner scopes the deal, a junior associate does the work, and quality visibly drops. → *Sohovi fit:* the DQ score is a firm-wide bar independent of who's checking — junior staff hit the same threshold a partner would.
- **Handoffs between consultants on the same account lose context** — a client's data quirks live in one person's head/inbox, so the next consultant re-discovers problems the client already paid to surface. → *Sohovi fit:* saved Workflows + historical trend charts (Pro+) act as persistent account memory the incoming consultant opens instead of a blank spreadsheet.
- **No consistent, defensible quality bar across consultants on one engagement** — "clean enough" is subjective per analyst. → *Sohovi fit:* reusable rule Workflows across the 5 DQ dimensions (Business) become the firm's documented standard, applied identically regardless of seniority.
- **More consultants touching one file multiplies confidentiality exposure** — standard practice copies the file across laptops so each person can QA it, exactly what NDAs try to prevent. → *Sohovi fit:* the browser-only architecture lets every consultant validate the same file without ever centralizing a copy.

**Aha-moment tutorial (Stage 2):** *"One Score, Every Consultant"* — a partner and a first-year associate each run the identical rule Workflow against the same messy client file on camera; both land the exact same DQ score and breaking-records list — deliverable quality no longer depends on who on the team touched the file.

**Stage 3 / BOFU:** unclaimed — "how consulting firms should standardize a data-quality bar across client engagements" is genuinely open.

**Channel plan:** 1 Shorts/Reel (partner-vs-associate hook) + 1 long-form (One Score, Every Consultant) + 1 new BOFU post — elevated above its Tier-2 default because there is *zero* existing content to fall back on.

---

### 11. Non-profit — *Tier 3*

**Already covered:** duplicate donors, stale/incomplete contacts, NCOA process, grant/program data gaps, ROI-of-clean-mail-list math. (2 posts, donor/fundraising-focused — no video yet.)

**Stage 1 hook (no product mention):** "Why doesn't our donor count ever quite match between the spreadsheet and the database?"

**Fresh pain points:**
- **Duplicate donor records skew lifetime-giving totals and cause double thank-you letters** — a relationship-damaging error, not an abstract one. → *Sohovi fit:* Uniqueness rules + AI rule suggestions catch fuzzy duplicate donors (nickname/spelling variants) during profiling.
- **Donor data is scattered across Salesforce NPSP, spreadsheets, donation platforms, event tools, and email**, with giving history in one place and engagement history in another. → *Sohovi fit:* the free reconciliation tool cross-checks giving totals between two system exports; Google Sheets/Airtable connectors (Business) for teams already living there.
- **Grant reports go out with stale figures** because multiple staff update the same tracking spreadsheet with no single source of truth, while funders expect reported time allocation to match the approved budget. → *Sohovi fit:* trend charts + score-drop alerts (Pro+) catch drift before the report ships; Workflows reapply the same rule set every reporting cycle automatically.
- **There's no dedicated data person** — a solo ops staffer or volunteer inherits the donor database, and turnover erases institutional knowledge. → *Sohovi fit:* a genuinely free tier removes both the cost and the technical-skill barrier — this is the one segment where Free is the pitch, not a funnel step.

**Aha-moment tutorial (Stage 2):** *"The Board Report That Almost Had the Wrong Number"* — upload this quarter's donor/grant-allocation spreadsheet as it's actually been passed between the ED, bookkeeper, and program lead; an AI-built rule checks "time allocation matches the approved grant budget" alongside a donor-duplicate check; the DQ score flags the stale rows before the funder sees them — no database platform purchase required.

**Stage 3 / BOFU:** low commercial intent by design (Free-tier segment) — skip a dedicated comparison post.

**Channel plan (Tier 3, but exception):** this is the one Tier-3 segment worth a dedicated Short despite lower data volume — the mission-driven "almost sent the wrong number to a funder" hook is unusually shareable and costs little to produce. 1 Shorts/Reel + 1 blog/long-form combined piece; no BOFU post needed.

---

### 12. Finance & Banking — *Tier 1*

**Already covered:** KYC status gaps, balance-outlier checks, customer dedup (PV32/VIDEO148). Solid but narrow — everything below goes past KYC-status-and-balances into the regulatory-severity end.

**Stage 1 hook (no product mention):** "Why do the vast majority of our fraud/AML alerts turn out to be nothing?"

**Fresh pain points:**
- **Sanctions screening drowns in false positives — and it's a data problem, not a model problem.** Legacy messaging formats carry name/address data as unstructured free text, so matching engines compare structured watchlist entries against messy strings. → *Sohovi fit:* pattern/outlier detection during profiling flags inconsistent name/address formatting before it reaches the screening engine.
- **Up to ~95% of AML transaction-monitoring alerts are noise** — false-positive rates track the underlying data quality (missing DOBs, inconsistent name spelling) far more than model sophistication. → *Sohovi fit:* the DQ score gives a quantifiable read on how clean the data feeding the monitoring system actually is, root-causing alert fatigue upstream instead of retuning the model.
- **The same customer gets reviewed multiple times by different analysts** — KYC platform, core banking, and transaction monitoring sit in silos with no master record linking them. → *Sohovi fit:* Uniqueness rules + the reconciliation tool compare a KYC export against a core-banking export to find the same person under different IDs.
- **Migrating to a new core-banking or transaction-monitoring platform is a data-validation minefield**, needing parallel-run comparisons so nothing drops during cutover. → *Sohovi fit:* sandbox-test (Business) the same rule set against old-platform and new-platform exports side by side before go-live.

**Aha-moment tutorial (Stage 2):** *"Why 95% of Your AML Alerts Are Noise (And It's a Data Problem, Not a Model Problem)"* — upload a sample transaction-monitoring feed, profiling exposes inconsistent name formats and free-text address blobs, AI rule suggestions flag them, and the DQ score visibly jumps after remediation — proving the input data, not the model, was killing precision.

**Stage 3 / BOFU:** unclaimed and high-value given regulated buyers actively compare vendors — "data quality tool for banks vs. enterprise platforms (Informatica/Collibra) at SMB-bank scale" is a strong angle next to `informatica-data-quality-alternatives-smb.md`.

**Channel plan (Tier 1 — loudest):** 2–3 Shorts/Reels (AML-noise, duplicate-customer-review, migration-minefield hooks) + 1 long-form (95% AML Alerts) + 1 new BOFU post.

---

### 13. Healthcare — *Tier 1*

**Already covered:** duplicate patient intake, cross-field DOB/admission checks, de-identify (k-anonymity/HIPAA Safe Harbor) (PV33/VIDEO158). Strong single-system coverage — the gap is *between* systems.

**Stage 1 hook (no product mention):** "Why do two clinics in the same referral network think this is two different patients?"

**Fresh pain points:**
- **30–80% of medical bills contain a data-entry error** — transposed insurance IDs/DOBs, missing diagnosis/procedure codes — an industry estimated at ~$20B/year in denial-related losses. → *Sohovi fit:* Validity/Completeness rules check claims exports for correct code format and required fields, sandbox-tested (Business) before submission.
- **Patient panels don't line up across affiliated practices' EHR exports** — a genuine interoperability problem, distinct from single-system intake dedup: two systems in the same referral network disagree on who the same patient even is. → *Sohovi fit:* the reconciliation tool compares patient-panel exports from two different EHRs, entirely client-side.
- **HIPAA Safe Harbor de-identification destroys analytical utility** — stripping dates to year-only and generalizing geography makes seasonal/regional analysis impossible, and studies still found 28–34% of "de-identified" records re-identifiable. → *Sohovi fit:* the de-identify tool's tunable k-anonymity approach is a more defensible middle ground than Safe Harbor's blunt field-stripping.
- **Copy-paste bloat makes structured fields unreliable** — one study found over half of EHR note text is duplicated content burying the real signal. → *Sohovi fit:* outlier/pattern detection flags fields with suspicious repetition during profiling.

**Aha-moment tutorial (Stage 2):** *"The Interoperability Gap: Reconciling Patient Panels Across Two EHRs Without PHI Ever Leaving the Browser"* — two clinics in the same referral network export patient panels from different EHRs; the reconciliation tool catches the mismatched/duplicate patients between them client-side, then the de-identify tool runs k-anonymity — explicitly contrasted against blunt Safe Harbor stripping — to produce a shareable report.

**Stage 3 / BOFU:** unclaimed — "HIPAA-safe data quality tool comparison for multi-site practices" is a strong angle given the zero-data-transfer story is a genuine differentiator here.

**Channel plan (Tier 1 — loudest):** 2–3 Shorts/Reels (interoperability-gap, billing-error, Safe-Harbor-vs-k-anonymity hooks) + 1 long-form (Interoperability Gap) + 1 new BOFU post.

---

### 14. E-commerce (industry — external sellers) — *Tier 1*

**Already covered:** the most saturated industry vertical in the library — general catalog stats, WooCommerce, Shopify SEO/ad-quality impact, Etsy search mechanics, Amazon A9 factors, bad shipping addresses, multi-vendor file validation, duplicate accounts, Black Friday prep. (9 posts) The gap is specifically *multi-channel* and *post-purchase* data, not single-platform catalog hygiene.

**Stage 1 hook (no product mention):** "Why did Amazon suspend a listing we didn't even know had a problem?"

**Fresh pain points:**
- **The same SKU drifts out of sync the moment a second channel is added** — Amazon, Shopify, and Walmart each use different identifiers with no shared mapping layer, so stock counts slowly diverge. → *Sohovi fit:* the free reconciliation tool compares exported listing files across channels to catch drift before an oversell — useful precisely because Sohovi has no native marketplace connector and works from the export files sellers already pull.
- **Overselling during peak triggers marketplace penalties** — a one-hour sync delay is enough to sell the same unit twice, and marketplaces punish the resulting cancellations with visibility loss or suspension. → *Sohovi fit:* outlier/pattern detection on inventory exports flags suspicious stock deltas before the next sync push.
- **Walmart/Amazon silently suppress listings over malformed attributes** — one missing required field or wrong UPC/GTIN suppresses a listing with no notification. → *Sohovi fit:* Validity/Completeness rules with per-category scope conditions catch malformed attributes in the feed file before upload.
- **DTC subscription LTV is overstated 20–40% from dirty billing data** — stale orders data and billing unreconciled to the bank compound, with involuntary churn cited at 30–40% of total churn. → *Sohovi fit:* Accuracy/Consistency rules reconcile subscription/order exports against bank data before it feeds an LTV model.

**Aha-moment tutorial (Stage 2):** *"Catch the SKU Before Amazon Suspends You"* — upload this week's Amazon, Shopify, and Walmart inventory exports side by side; the reconciliation tool highlights SKUs whose counts drifted apart and a row with a malformed GTIN about to get suppressed — the beat is a "day-before" score proving the oversell was catchable 24 hours early.

**Stage 3 / BOFU:** unclaimed for the multi-channel angle specifically — pair with a "Sohovi vs. manually checking each marketplace seller dashboard" post.

**Channel plan (Tier 1 — loudest):** 2–3 Shorts/Reels (SKU-suspension, oversell-penalty, subscription-LTV hooks) + 1 long-form (Catch the SKU) + 1 new BOFU post.

---

## Cross-Cutting Synthesis

### The free-tool funnel is the real structural insight

Several of the sharpest aha moments above (HR's payroll handoff, Finance's month-end diff, Healthcare's cross-EHR reconciliation, SaaS's invoice reconciliation, Logistics' freight audit, Marketing Agencies' payout reconciliation, Non-profit's donor cross-check, E-commerce's channel-drift check) lean on the **free, no-login reconciliation tool** (`app/tools/compare`) or the **free PII/de-identify tools** — not the paid rules engine. That maps directly onto the Stage 1 → Stage 2 handoff above: the free tool *is* the Stage-1-to-Stage-2 bridge — someone lands on a Short with zero signup friction, gets the "aha," and Stage 2 is "now make this automatic every cycle" (Workflows on Pro, sandbox/connectors on Business). That two-part structure is a stronger funnel than a single video that opens with a sign-up wall.

### Plan-tier fit by segment

Match the tier you *feature* in each tutorial to what that segment would actually pay for — showing Business-only features to a price-sensitive non-profit undercuts the video; showing only Free features to a bank undersells what they'd happily buy.

| Segment | Lead with | Why |
|---|---|---|
| Non-profit | **Free** | No dedicated data person, no budget — Free tier *is* the pitch |
| Freelancers & Consultants (solo) | **Free → Pro** | Price-sensitive solo buyers; PDF export (Pro) sells the case-study angle |
| Marketing & Revenue Ops | **Free → Pro** | Workflows/alerts (Pro) matter once campaigns are recurring |
| Marketing Agencies | **Pro → Business** | Workflows per client (Pro), sandbox/connectors (Business) once managing many clients |
| HR & People Operations | **Free tool → Pro** | Reconciliation hooks them; PII detection (Pro) is the compliance-driven upsell |
| E-commerce (industry) | **Pro → Business** | Workflows for recurring catalog checks, cross-column/connectors at multi-channel scale |
| Analytics & BI Teams | **Pro → Business** | AI suggestions/alerts (Pro) first, catalog-level scoring (Business) once they're juggling many pipeline datasets |
| Finance & Compliance | **Free tool → Business** | Reconciliation hooks them; sandbox before touching real ledgers is the real sell |
| E-commerce & Product (internal) | **Business** | Cross-column validation, sandbox, and catalog scoring are core to the actual aha moments found |
| SaaS & Tech | **Business** | Connectors + cross-column validation for integration/tenant/billing sync |
| Consulting (firms) | **Business** | Connectors, sandbox, remediation, Workflows as a firm-wide standard |
| Logistics & Supply Chain | **Business** | Connectors for WMS/TMS/EDI-adjacent exports at real volume |
| Finance & Banking | **Business** | Sandbox is close to mandatory before touching regulated data; connectors, remediation |
| Healthcare | **Business** | Cross-column validation for clinical logic, connectors, de-identify already free-tier |

### Final production priority — content gap × data volume

The original priority list ranked purely by content gap. Per the "be loud where the data is abundant" instruction, this combines that gap analysis with the data-volume tiering above. Volume pulls a segment up; an unusually large content gap can pull it up further even from a lower tier (Consulting is the one exception, flagged below):

1. **SaaS & Tech** *(Tier 1)* — highest data volume (continuous event/usage streams) *and* the thinnest existing coverage (one broad post, no video). No contest for #1.
2. **Analytics & BI Teams** *(Tier 1)* — sits downstream of every other team's data, so its volume exposure is arguably the largest in the whole list; existing coverage is generic and the only video is a 60-second archive throwaway.
3. **Consulting (firms)** *(Tier 2, elevated)* — the only segment with *zero* existing content of any kind; "One Score, Every Consultant" is a sharp, entirely unclaimed differentiator, which outweighs its one-tier-lower volume ranking.
4. **Finance & Banking** *(Tier 1)* — video exists but stops at KYC/balances; "95% of AML alerts are noise" is the single strongest hook in this document for the highest-stakes, highest-volume regulated buyer.
5. **Logistics & Supply Chain** *(Tier 1)* — one address-centric post/video; continuous EDI/WMS volume with real stakes (customs holds, freight billing).
6. **Healthcare** *(Tier 1)* — solid single-system coverage already, but the between-systems interoperability angle is fresh and healthcare data volume/stakes are both extreme.
7. **E-commerce (industry)** *(Tier 1)* — most saturated industry vertical in the library, but "catch the SKU before Amazon suspends you" is a strong enough loss-aversion hook, at high enough volume, to justify pushing past the saturation.
8. **Non-profit** *(Tier 3, exception)* — lower data volume, but zero video content and an unusually shareable, low-cost-to-produce hook earn it a spot ahead of several Tier-2 segments.
9. **Marketing Agencies** *(Tier 2)* — moderate gap, aggregate multi-client volume.
10. **E-commerce & Product (internal)** *(Tier 2)* — moderate gap, same underlying volume driver as #7 but the internal cross-functional angle is less claimed.
11. **Finance & Compliance** *(Tier 2)* — some existing coverage (PV157); still a real gap on the reconciliation/audit-evidence angle.
12. **Marketing & Revenue Ops** *(Tier 2)* — heavily saturated already; the Customer Match angle is fresh but not urgent.
13. **HR & People Operations** *(Tier 3)* — bounded volume, existing coverage adequate; produce opportunistically.
14. **Freelancers & Consultants (solo)** *(Tier 3)* — lowest volume *and* the most saturated segment in the entire library (9 posts + an existing video). Lowest priority for new production.

### Production guardrails to carry into scripts

1. **Privacy wording:** "your raw file and rows never leave your browser — only your score and rule results are saved" — never a blanket "nothing is ever saved." *(from `video_tutorials.md` line 148)*
2. **No unsourced hard numbers on screen:** every stat in this document is cited to a vendor blog or industry write-up, not an audited source — use them directionally in narration, not as an exact on-screen citation. *(from `video_tutorials.md` line 148)*
3. **State the plan tier honestly** when a demoed feature requires it (sandbox, remediation, cross-column validation, catalog scoring, and connectors are Business-only; AI suggestions, Workflows, alerts, PDF export, and PII detection are Pro+). Don't demo a Business feature and let a Free-tier viewer think they can follow along.
4. **Reuse the existing taxonomy, don't invent new labels:** `searchIntent: informational/commercial/bofu` for funnel stage, and the existing `Platform:` combos (YouTube/Blog/Instagram; YouTube Shorts/Instagram Reels; Learn in-app) for channel — no TikTok/LinkedIn/podcast values exist anywhere in current production, so don't introduce one without a separate decision to do so.
5. **Every Stage-1 Short/Reel must be watchable and useful with zero mention of Sohovi.** If the hook doesn't work as a stand-alone "huh, that's my exact problem" moment without the product, it's not a Stage-1 script — it's a Stage-2 script mislabeled.
