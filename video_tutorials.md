# Sohovi Video Scripts — Complete Production Guide

> **How to use this file:** Every script is ready to record. Follow the `[SCREEN]` cues for what to show on screen, and read the `NARRATION` lines aloud. Timestamps are guides — don't stress exact timing.
>
> **Structure:** This file has two parts. **The PRIORITY VIDEO SET (74 videos, PV1–PV74)** is the bread-and-butter list — build these first. PV1–PV37 is the original one-month-scoped plan covering the home page/YouTube hero, the full Learn section curriculum, and a deduplicated set of marketing videos, one job-to-be-done per video, no two telling the same story. **Round 2 (PV38–PV69) is research-driven**, sourced from `audience_pain_points_research.md`: PV38–PV51 are the 14 team/industry "Stage 2" deep-dive tutorials (product shown, one per segment), and PV52–PV69 are 18 "Stage 1" Shorts/Reels — zero product shown, pure symptom-recognition hooks in the viewer's own words — that feed into them. **Round 3 (PV70–PV74) is the Data Profiling Spotlight** — 5 videos treating Sohovi's free profiling feature as the sole hero, one per industry (Finance, HR, Healthcare, Supply Chain, Ecommerce), filling the gap where every other video treats profiling as a stepping stone rather than the main event. **The ARCHIVE (159 videos, VIDEO 1–159)** below it is the original brainstorm, kept in full as a reference bank for future ideas — it has real overlap and some videos that repeat each other, which is exactly why the Priority set exists as the actual production target.

---

## Test Data Setup Guide

Before recording any demo video, generate these three datasets from **sohovi.com/tools/test-data-generator**. Save them to your desktop for quick access during recording.

> **Tool constraints — read before generating anything below.** The live generator has a few hard limits that change *how* you hit the targets below (the target numbers/values themselves are still correct — only the mechanics differ):
> - **Row count is a fixed dropdown, not free entry**: only `10 / 50 / 100 / 500 / 1,000 / 5,000 / 10,000 / 50,000 / 100,000` are selectable. Whenever a dataset below calls for a count that isn't on that list, select the next size up, click Generate, then delete the extra rows in Excel/Sheets to trim down to the exact target *before* doing that dataset's "introduce issues" edits (those edits assume the final trimmed count).
> - **One button does both steps.** There's no separate "Generate" button and "Download CSV" button — a single button labeled **"Generate & download {N} rows (CSV)"** creates the data and downloads the file in one click.
> - The add-column button is labeled **"Add column"** (lowercase c).
> - Type names below are shorthand for the real dropdown labels, which carry extra range hints — e.g. "UUID" = "UUID (random)", "Integer" = "Integer (1–10000)", "Float" = "Float (0.00–100.00)", "Date" = "Date (2020–2025)". These are fixed, non-configurable ranges.
> - **There's no custom pick-list/enum column type.** Wherever a dataset below says a column is a "pick list" with specific values, add the column as any placeholder type (e.g. **Status**), then in Excel/Sheets replace the whole column with a formula like `=CHOOSE(RANDBETWEEN(1,3),"value1","value2","value3")` (adjust the range and values to match), fill down, then **Paste Special → Values** to lock it in — do this before the row-specific "introduce issues" edits that target particular values in that column.
> - **Currency-like columns read more realistically as Money amount, not Float.** Float is capped at 0.00–100.00, which is too small for things like sales amounts or account balances before any outlier edits land. Where a dataset below uses Float for a dollar-value column, use **Money amount ($10–$15,000)** instead.

---

### Dataset A — CustomerDB.csv (500 rows, intentionally messy)

**Step 1 — Generate the base file:**
- Go to `/tools/test-data-generator`
- Click the **"Customer list"** quick preset (auto-fills: id, first_name, last_name, email, phone, country)
- Set row count to **500**
- Click **Generate & download 500 rows (CSV)**

**Step 2 — Introduce quality issues (open in Excel or Google Sheets):**
- **Missing emails:** Delete the email value in rows 10, 17, 24, 31, 38, 45 … (every 7th row) — about 70 rows total. Leave the cell blank.
- **Duplicate rows:** Copy rows 2–51 (50 rows). Paste them at the very bottom of the sheet (rows 501–550). Now you have 550 rows with 50 exact duplicates.
- **Invalid phones:** In 20 rows, replace the phone value with `N/A` or `00000000000`.
- **Save as:** `CustomerDB.csv`

**What this simulates:** A real CRM export from a company that merged two databases and never cleaned up. Perfect for profiling, completeness, uniqueness, and validity rule demos.

---

### Dataset B — SalesQ1.csv (200 rows)

**Step 1 — Generate:**
- Click the **"Sales records"** quick preset (order_id, customer_name, email, amount, date, status)
- Change `status` column type to **Country** — then rename the column header to `region` after download (simulates a sales region field)
- Change `amount` column type to **Money amount** (Float's 0.00–100.00 range is too small for a sales amount)
- Set row count to **500** — 200 isn't a dropdown option; 500 is the next size up
- Click **Generate & download 500 rows (CSV)**
- In Excel/Sheets, delete rows so only 200 data rows remain, before introducing the issues below

**Step 2 — Introduce issues:**
- **Negative amounts:** In 10 rows (e.g., rows 5, 22, 47, 63, 89, 101, 130, 155, 177, 198), change the `amount` value to a negative number like `-250.00`
- **Blank customer names:** Delete `customer_name` in 15 rows
- **Save as:** `SalesQ1.csv`

**What this simulates:** A quarterly sales export with data entry errors — negative revenue and missing customer attribution. Good for accuracy rule demos.

---

### Dataset C — EmployeeDir.csv (100 rows, clean)

**Step 1 — Generate:**
- Click the **"Employee directory"** quick preset (employee_id, name, email, company, city, country)
- Set row count to **100**
- Click **Generate & download 100 rows (CSV)**

**Step 2 — No changes.** Keep this data perfectly clean.

**What this simulates:** A well-maintained HR system. Used to demonstrate what a high DQ score (95+) looks like, and for workflow/schema change demos.

---

### Domain Vertical Datasets (Banking, Supply Chain, Healthcare)

> **Why these exist:** Datasets A/B/C above are generic ("CustomerDB", "SalesQ1") so they work for any Learn tutorial. The three datasets below exist specifically for **industry vertical marketing videos** — viewers self-select faster when the on-screen data looks like *their* data. All three are built the same way as A/B/C: generated free from **sohovi.com/tools/test-data-generator**, then hand-edited for realism and to inject specific DQ issues. They are **not** sourced from Kaggle or any third-party dataset — this avoids licensing/redistribution ambiguity in a public marketing video and keeps every dataset fully reproducible by anyone re-recording these scripts. (If you'd rather use a real public dataset for extra authenticity, see "Optional: real-data alternatives" at the end of this section — but check that dataset's license before using it on camera.)
>
> HR and Finance verticals reuse **Dataset C (EmployeeDir.csv)** and **Dataset B (SalesQ1.csv)** respectively — they already fit those industries well enough that a fourth/fifth dataset isn't needed.

---

#### Dataset D — CustomerAccounts.csv (Banking, 400 rows, messy)

**Step 1 — Generate the base file:**
- Go to `/tools/test-data-generator`
- Click the **"Customer list"** preset (id, first_name, last_name, email, phone, country)
- Click **Add column** four times and configure: `account_number` (type: UUID), `balance` (type: Money amount — more realistic than Float's 0.00–100.00 cap for an account balance), `kyc_status` (type: Boolean), `account_opened` (type: Date)
- Set row count to **500** — 400 isn't a dropdown option; 500 is the next size up
- Click **Generate & download 500 rows (CSV)**

**Step 2 — Relabel for banking (Excel/Sheets):**
- Delete rows so only 400 data rows remain
- Rename `id` → `customer_id`, `country` → `branch_country`
- `kyc_status` came through as `true`/`false` — find/replace: `true` → `Verified`, `false` → `Pending`

**Step 3 — Introduce quality issues:**
- **Missing emails:** Blank the email in ~8% of rows (32 rows) — a real KYC gap.
- **Duplicate customers:** Copy 30 rows to the bottom with the same `customer_id` (simulates a core-banking merge).
- **Invalid account numbers:** Replace `account_number` with `TEST-0000` or leave blank in 15 rows.
- **Balance outliers:** Set 5 rows to an absurd value like `999999999.99` (decimal entry error) and blank 10 rows.
- **Missing KYC status:** Blank `kyc_status` in ~10% of rows — a compliance gap, perfect for a Completeness rule with a real business consequence.
- **Save as:** `CustomerAccounts.csv`

**What this simulates:** A retail bank's core-banking customer export after a merger — exactly the kind of file a banking DQ analyst actually has to deal with. Strong fit for Completeness (KYC status, email), Accuracy (balance), Uniqueness (customer_id), Scope conditions (e.g. `branch_country == US AND kyc_status == Verified`), and the **PII Audit** / **De-Identify** free tools (this file is loaded with exactly the PII those tools are built to catch).

---

#### Dataset E — InventoryShipments.csv (Supply Chain, 300 rows, messy)

**Step 1 — Generate the base file:**
- Go to `/tools/test-data-generator`
- Don't use a preset — build custom columns: `shipment_id` (UUID), `sku` (UUID), `supplier_name` (Company name), `warehouse_city` (City), `warehouse_country` (Country), `quantity_on_hand` (Integer), `unit_cost` (Money amount — more realistic than Float's 0.00–100.00 cap for a unit cost), `ship_date` (Date)
- Set row count to **500** — 300 isn't a dropdown option; 500 is the next size up
- Click **Generate & download 500 rows (CSV)**
- In Excel/Sheets, delete rows so only 300 data rows remain, before introducing the issues below

**Step 2 — Introduce quality issues:**
- **Missing supplier:** Blank `supplier_name` in ~10% of rows (broken vendor feed).
- **Negative quantity:** Set `quantity_on_hand` negative in 15 rows (warehouse system entry errors).
- **Duplicate shipments:** Copy 20 rows to the bottom with the same `shipment_id` (a retry bug double-recorded the shipment).
- **Cost outliers:** Set `unit_cost` to `0.00` in 8 rows and `99999.00` in 4 rows.
- **Future ship dates:** Edit 6 rows' `ship_date` to a year in the future (a warehouse scanner clock bug).
- **Save as:** `InventoryShipments.csv`

**What this simulates:** A logistics company's warehouse management export, merged across regional warehouses. Strong fit for Accuracy (quantity > 0, cost > 0), Timeliness (no future ship dates), Uniqueness (shipment_id), and Scope conditions (e.g. `warehouse_country == US`).

---

#### Dataset F — PatientIntake.csv (Healthcare, 250 rows, messy)

**Step 1 — Generate the base file:**
- Go to `/tools/test-data-generator`
- Custom columns: `patient_id` (Auto-increment ID), `full_name` (Full name), `email`, `phone`, `date_of_birth` (Date of birth), `city`, `country`, `admission_date` (Date)
- Set row count to **500** — 250 isn't a dropdown option; 500 is the next size up
- Click **Generate & download 500 rows (CSV)**
- In Excel/Sheets, delete rows so only 250 data rows remain, before introducing the issues below

**Step 2 — Introduce quality issues:**
- **Missing phone:** Blank in ~12% of rows.
- **Duplicate intake records:** Copy 15 rows to the bottom with the same `patient_id`.
- **Malformed emails:** Corrupt 10 rows' emails (`@@`, missing domain).
- **Impossible dates:** In 8 rows, set `date_of_birth` *after* `admission_date` — a logically impossible record, ideal for a cross-field Accuracy/Consistency rule.
- **Missing location:** Blank `city` and `country` in ~8% of rows.
- **Save as:** `PatientIntake.csv`

**What this simulates:** A hospital intake / EHR export. Strong fit for Completeness, Uniqueness (patient_id), the `date_of_birth` vs `admission_date` cross-field check, and — especially — the **De-Identify** free tool (k-anonymity, HIPAA Safe Harbor framing) and **PII Audit**. Used in the Healthcare industry deep dive, Video 158.

---

**Optional: real-data alternatives.** If you'd rather record against a real public dataset instead of synthetic data, these Kaggle datasets match each vertical reasonably well — but verify the license (most are fine for non-commercial demos; check before using in a monetized/public marketing video) and that you're comfortable with real (if anonymized) personal data appearing on screen:
- Banking: [Bank Customer Churn Dataset](https://www.kaggle.com/datasets/gauravtopre/bank-customer-churn-dataset), [Banking and Customer Transaction Data](https://www.kaggle.com/datasets/yogeshtekawade/banking-and-customer-transaction-data)
- Supply Chain: [Logistics and Supply Chain Dataset](https://www.kaggle.com/datasets/datasetengineer/logistics-and-supply-chain-dataset), [Supply Chain Dataset](https://www.kaggle.com/datasets/amirmotefaker/supply-chain-dataset)
- Healthcare: [Synthetic Healthcare Patient Records Dataset](https://www.kaggle.com/datasets/dnation/synthetic-healthcare-patient-records-dataset), [Healthcare Dataset](https://www.kaggle.com/datasets/prasad22/healthcare-dataset) (both already synthetic, so licensing is simpler)

---

### Round 2 Datasets (G–M) — built from `audience_pain_points_research.md`

> **Why these exist:** the Round 2 videos (PV38–PV51) cover all 14 segments identified in `audience_pain_points_research.md`, ordered by that doc's data-volume × content-gap ranking. PV38–PV45 (SaaS, Analytics/BI, Consulting, Banking/AML, Logistics/freight, Healthcare, Non-profit, multi-channel E-commerce) are the top-8. PV46–PV51 (Marketing Agencies, E-commerce & Product internal, Finance & Compliance, Marketing & Revenue Ops, HR, Freelancers & Consultants) complete the remaining 6. Datasets G–P are new, generated the same way as A–F: `/tools/test-data-generator`, custom columns, then hand-edited for the specific quality issue — except Marketing Agencies, Marketing & Revenue Ops, and Freelancers & Consultants, which reuse **Dataset A (CustomerDB.csv)** since it already fits (a generic messy contact/customer list).
>
> **Row counts below:** none of G–P's target counts are on the generator's fixed dropdown (10/50/100/500/1,000/5,000/10,000/50,000/100,000) — see the Tool constraints note above Dataset A. Generate the next dropdown size up for each file, then delete rows in Excel/Sheets to trim to the exact count stated, before doing that dataset's "introduce issues" edits.
>
> **Cross-file matching keys:** several datasets below need an ID/SKU to *repeat* within a file or *match* across two independently-generated files (e.g. the same `account_id` on multiple `UsageEvents` rows and in `BillingInvoices`, `shipment_id` shared between `TMSShipments` and `CarrierInvoice`, `sku` shared across 3 marketplace files, `employee_id` overlapping with Dataset C). The generator can't do this — every ID-like type (Auto-increment ID, UUID, SKU, Reference number) produces a unique value per row and restarts independently in every file. Build these by hand in Excel/Sheets after generating: pick (or build) a small pool of the ID values you want repeated/shared, then use a formula like `=INDEX(pool_range, RANDBETWEEN(1, COUNTA(pool_range)))` to assign one per row where a repeat is needed, and copy-paste the exact matching values into the corresponding rows of the second file wherever the spec calls for a shared/overlapping key. This is flagged inline below wherever it applies.

**Dataset G — UsageEvents.csv + BillingInvoices.csv (SaaS, ~2×300 rows)**
- `UsageEvents.csv`: custom columns `event_id` (UUID), `account_id` (Auto-increment ID — see Cross-file matching keys above; needs multiple rows per account), `event_type` (pick list: api_call/seat_added/export_run — see Tool constraints above), `timestamp` (Date), `quantity` (Integer). Generate 500 rows, trim to 300.
- `BillingInvoices.csv`: custom columns `invoice_id` (UUID), `account_id` (Auto-increment ID as a placeholder — then hand-copy the exact `account_id` values used in UsageEvents, one per account, per Cross-file matching keys above), `billing_period` (Date), `billed_quantity` (Integer), `amount` (Money amount — more realistic than Float's 0.00–100.00 cap for a billed dollar amount). Generate 100 rows, trim to 60 (one per account per period).
- **Introduce issues:** duplicate 15 `event_id`s in UsageEvents (a retry bug double-counting usage); for 8 accounts, set `billed_quantity` in BillingInvoices noticeably lower than the true summed quantity (metering under-count); for 3 accounts, set `billed_quantity` higher (over-bill).
- **Simulates:** a metering pipeline that silently drops/duplicates events, so the invoice and actual usage disagree. Built for **PV38**.

**Dataset H — MetricsExtract.csv (Analytics/BI, 400 rows)**
- Custom columns: `order_id` (Auto-increment ID), `region` (Country), `channel` (pick list: paid/organic/email — see Tool constraints above), `revenue` (Money amount — more realistic than Float's 0.00–100.00 cap), `active_flag` (Boolean). Generate 500 rows, trim to 400.
- **Introduce issues:** in ~15% of rows, respell `region` inconsistently (`"US"` / `"United States"` / `"us"` for the same country) so a group-by-region total splits into three buckets instead of one; blank `active_flag` in ~10% of rows (an aggregation silently excludes them instead of counting them as inactive).
- **Simulates:** the same extract producing a different number in two dashboards depending on whether the query groups on the raw string or a cleaned one. Built for **PV39**.

**Dataset I — TMSShipments.csv + CarrierInvoice.csv (Logistics, ~2×250 rows)**
- `TMSShipments.csv`: custom columns `shipment_id` (UUID), `carrier` (Company name), `ship_date` (Date), `weight_lbs` (Integer), `accessorial_type` (pick list: none/detention/liftgate/fuel_surcharge — see Tool constraints above). Generate 500 rows, trim to 250.
- `CarrierInvoice.csv`: custom columns `invoice_line_id` (UUID), `shipment_id` (UUID as a placeholder — then, per Cross-file matching keys above, use all 250 `shipment_id` values from TMSShipments as the pool and assign one to each of these 280 rows via the `INDEX`/`RANDBETWEEN` formula, so most TMS shipments show up here and ~30 end up billed on more than one line — 10 of those repeats become the double-billed rows called out below), `charge_type` (pick list: base/detention/liftgate/fuel_surcharge — see Tool constraints above), `amount` (Money amount — more realistic than Float's 0.00–100.00 cap). Generate 500 rows, trim to 280 (some shipments billed more than once).
- **Introduce issues:** for 20 invoice lines, set `charge_type` to `detention` or `liftgate` where the matching `TMSShipments` row has `accessorial_type = none` (an unmatched accessorial charge); duplicate 10 `shipment_id`s in the invoice file (double-billed).
- **Simulates:** a freight invoice with accessorial charges the TMS never recorded — the highest-error category in carrier billing. Built for **PV42**.

**Dataset J — TransactionMonitoring.csv (Banking/AML, 350 rows)**
- Custom columns: `transaction_id` (UUID), `customer_name` (Full name), `date_of_birth` (Date of birth — not plain Date; plain Date's 2020–2025 range would make every customer a toddler), `amount` (Money amount — more realistic than Float's 0.00–100.00 cap), `flag_reason` (pick list: none/watchlist_match/high_amount — see Tool constraints above). Generate 500 rows, trim to 350. (No `address` column — the generator has no street-address/free-text type, and PV41's script below never shows or references address on screen, so it's dropped rather than faked.)
- **Introduce issues:** for ~25% of rows, reformat `customer_name` inconsistently (`"Smith, John"` vs `"John Smith"` vs `"J. SMITH"`) to simulate transliteration/format drift; blank `date_of_birth` in ~15% of rows; set `flag_reason = watchlist_match` on ~40 rows regardless of whether the name is a clean or malformed variant (so the demo can show malformed-name rows over-indexing in the flagged set).
- **Simulates:** why name formatting inconsistency — not model weakness — drives most sanctions/AML false positives. Built for **PV41**.

**Dataset K — PatientPanelClinicA.csv + PatientPanelClinicB.csv (Healthcare, ~2×150 rows)**
- Both: custom columns `patient_id` (Auto-increment ID), `full_name` (Full name), `date_of_birth` (Date of birth — not plain Date; plain Date's 2020–2025 range would make every patient a toddler), `last_visit_date` (Date). Generate 500 rows in each file, trim each to 150. ClinicB should share ~40 of the same underlying people as ClinicA — after trimming both files, hand-copy 40 people's `full_name` + `date_of_birth` from ClinicA into 40 rows of ClinicB before applying the reformatting below (the generator can't create overlapping identities across two independently-generated files).
- **Introduce issues:** for the ~40 shared patients, give ClinicB a different `patient_id` (already true by default, since each file's Auto-increment ID restarts at 1 independently) and mildly reformat 15 of their names (nickname or middle-initial variants) and reformat 10 `date_of_birth` values (MM/DD/YYYY vs DD-MM-YYYY).
- **Simulates:** two systems in the same referral network disagreeing on who the same patient is — an interoperability gap distinct from single-system intake dedup (Dataset F). Built for **PV43**.

**Dataset L — DonorGrantTracker.csv (Non-profit, 200 rows)**
- Custom columns: `donor_id` (Auto-increment ID), `donor_name` (Full name), `gift_amount` (Money amount — more realistic than Float's 0.00–100.00 cap for a gift amount), `gift_date` (Date), `grant_program` (pick list: A/B/C — see Tool constraints above), `time_allocation_pct` (Float — not Integer; Float's 0.00–100.00 range is a natural fit for a percentage field, staff time billed to each program). Generate 500 rows, trim to 200.
- **Introduce issues:** duplicate 12 donors under a nickname/spelling variant of the same name; for 10 rows, set `time_allocation_pct` so a program's total exceeds the approved budget (simulate a stale tracking spreadsheet).
- **Simulates:** duplicate donor records skewing giving totals, and grant time-allocation drifting from the approved budget before a funder report ships. Built for **PV44**.

**Dataset M — AmazonListings.csv + ShopifyListings.csv + WalmartListings.csv (E-commerce, ~3×120 rows)**
- All three: custom columns `sku` (SKU as a placeholder — the generator can't share IDs across files, so after generating and trimming all three, hand-copy 15 exact `sku` values from AmazonListings into 15 corresponding rows of ShopifyListings and WalmartListings, per Cross-file matching keys above), `product_name` (Product name), `quantity_available` (Integer), `gtin` (UUID, standing in for a GTIN/UPC). Generate 500 rows in each file, trim each to 120.
- **Introduce issues:** for ~15 shared SKUs, set a different `quantity_available` across the three files (channel sync drift); blank or truncate `gtin` on 8 rows in the Walmart/Amazon files (the malformed-attribute suppression trigger).
- **Simulates:** the same SKU drifting out of sync the moment a second/third sales channel is added, and a malformed GTIN that silently gets a listing suppressed. Built for **PV45**.

**Dataset N — ProductCatalogHandoff.csv (E-commerce & Product internal, 150 rows)**
- Custom columns: `product_id` (Auto-increment ID), `category` (pick list: electronics/apparel/home — see Tool constraints above), `product_name` (Product name), `price` (Float), `size` (pick list: S/M/L/XL — see Tool constraints above), `sku` (UUID). Generate 500 rows, trim to 150.
- **Introduce issues:** blank `size` on 10 apparel rows (a required field for that category only — good scope-condition demo); malformed `price` (`0.00` or negative) on 6 rows; duplicate `sku` on 4 rows.
- **Simulates:** a merchandising-to-catalog-ops handoff sheet with three planted, category-scoped errors. Built for **PV47**.

**Dataset O — APExportMonth1.csv + APExportMonth2.csv (Finance & Compliance, ~2×180 rows)**
- Both: custom columns `invoice_id` (UUID), `vendor_name` (Company name), `vendor_id` (Auto-increment ID), `invoice_date` (Date), `amount` (Money amount — more realistic than Float's 0.00–100.00 cap). Generate 500 rows in each file, trim each to 180.
- **Introduce issues:** in Month2, insert 8 rows that are near-duplicates of Month1 rows — same `vendor_name` and `amount` within a few days of each other, but a different `vendor_id` (simulating the same vendor entered twice in the vendor master).
- **Simulates:** a duplicate vendor payment that's only visible by comparing two AP exports side by side, not by looking at either one alone. Built for **PV48**.

**Dataset P — PayrollRegister.csv (HR, paired with Dataset C's `EmployeeDir.csv`, ~20 new-hire rows)**
- Custom columns: `employee_id` (Auto-increment ID as a placeholder — then hand-copy 20 real `employee_id` values from EmployeeDir.csv into this column, per Cross-file matching keys above; don't rely on the two files' auto-increment sequences coincidentally overlapping), `pay_group` (pick list: weekly/biweekly/monthly — see Tool constraints above), `tax_form_on_file` (Boolean). Generate 50 rows, trim to ~20.
- **Introduce issues:** for 6 new-hire rows, set `pay_group` to a value that doesn't match what HR intended for that employee; set `tax_form_on_file = false` for 4 of them.
- **Simulates:** the manual HR-to-payroll handoff for this cycle's new hires. Built for **PV50**.

---

# PRIORITY VIDEO SET — 74 Videos (Build These First)

> **What this set is:** 1 hero video (also the main YouTube overview), 14 Learn-section tutorials covering the full product workflow with no gaps, 22 marketing videos where each one sells exactly one job-to-be-done, in a distinct industry, with a real mechanic shown on screen, and — new in Round 2 — 14 research-driven team/industry "Stage 2" deep dives (PV38–PV51, product shown) plus 18 "Stage 1" Shorts/Reels (PV52–PV69, no product shown) that feed into them, one set for every segment in `audience_pain_points_research.md`, ordered by that doc's data-volume × content-gap priority ranking. **Round 3 (PV70–PV74)** is the Data Profiling Spotlight — 5 videos, one per industry, where Data Profiling itself (free on every plan) is the whole story, filling the gap left by every other video treating profiling as a stepping stone toward a full rules-and-monitoring flow rather than the hero. No two videos in this set tell the same story. Four accuracy fixes apply across all 74: (1) **privacy wording** — say "your raw file and rows never leave your browser — only your score and rule results are saved, so history, alerts, and trend charts work across sessions," never a blanket "nothing is ever saved," which contradicts features shown elsewhere; (2) **no unsourced hard numbers** — competitor pricing and industry cost stats (and every stat in PV38–PV69, all sourced in `audience_pain_points_research.md`) are given directionally, not as exact cited figures, since they can't be independently verified at record time; (3) **state the plan tier honestly** — Sandbox, remediation, cross-column validation, catalog scoring, and connectors are Business-only; AI suggestions, Workflows, alerts, and PDF export are Pro+; don't demo a gated feature and let a Free-tier viewer think they can follow along; (4) **Stage-1 Shorts (PV52–PV69) show no Sohovi product at all** — if a script can't stand alone as "that's my exact problem" without the app on screen, it belongs in Stage 2, not Stage 1.

---

## SECTION 1 — HERO / MAIN DEMO

---

### PV1 — Sohovi Platform Demo

**Platform:** Landing Page Hero Video + Main YouTube Overview
**Duration:** ~3 minutes 30 seconds – 3 minutes 45 seconds
**Datasets:** A (CustomerDB.csv, opener) · B (SalesQ1.csv, Finance) · P (PayrollRegister.csv, HR) · F (PatientIntake.csv, Healthcare) · E (InventoryShipments.csv, Supply Chain)
**Style:** Confident, full product-tour pacing — not a 15-second teaser. Steady, unhurried narration; each feature gets enough screen time to actually read the UI. Background music: upbeat but low in the mix under narration. Let the four rule payoffs and the monitoring roll-up breathe a couple extra seconds each in the edit — the timestamps below are a floor, not a ceiling.

---

**[SCREEN 0–4s]: No product yet — four fast cuts: a finance report with one row circled red; a text card 'Patient #4021 / Patient #8890 — same person?'; an HR file with a blank 'Tax Form on File' cell; a warehouse dashboard reading '-40 units shipped'.]**
NARRATION: "A wrong number in a finance report. A patient counted twice. A tax form nobody filed. Negative forty units, apparently shipped. Different teams. Same root cause."

**[SCREEN 4–10s]: Cut to the Sohovi upload zone. Drag CustomerDB.csv on. Cut to a browser dev-tools Network tab overlay: '0 requests sent'.]**
NARRATION: "Meet Sohovi — a data quality tool that lives entirely in your browser. Drop in a file, and your raw rows never touch a server — yours or ours. Don't take our word for it — pop open your own network tab and check."

**[SCREEN 10–28s]: Four quick text-card cuts, ~4–5s each: 'Won't wreck your budget' over the pricing page; 'Zero setup' over the upload zone; 'Fast results' over the profiling dashboard loading; 'Keeps watching' over a trend chart thumbnail.]**
NARRATION: "Four reasons teams stick with Sohovi. One — it won't wreck your budget: a real free tier, and paid plans priced for an actual team, not a sales call. Two — basically zero setup: drag a file in, no engineer, no config file. Three — fast: profiling wraps up in seconds, not a data team's whole sprint. And four — it doesn't clock out after one check. It's built to keep watching your data after today, which is exactly where most tools quit."

**[SCREEN 28–36s]: CustomerDB.csv profiling dashboard loads in under 2 seconds. Column cards appear for all 6 columns, type badge and null% visible on each.]**
NARRATION: "Here's how it kicks off. Upload any CSV or Excel file, and every column gets profiled automatically — before you've clicked a thing. This is Data Profiling, and it's free on every plan, including Free. Here's what it actually catches."

**[SCREEN 36–46s]: Cut to SalesQ1.csv. Outliers tab on the 'amount' column: 10 values highlighted red, all negative. Note: 'Flagged using IQR — the interquartile range.']**
NARRATION: "If you're in finance: watch the 'amount' column turn red — ten negative sales, flagged using IQR, not a plain average, so a few bad numbers can't hide inside a total that still looks fine."

**[SCREEN 46–56s]: Cut to PayrollRegister.csv. Column card for 'tax_form_on_file': '4 of 20 — false or missing'. 'pay_group' value distribution shows several rows that don't match the group actually approved for them.]**
NARRATION: "If you're in HR: this cycle's new-hire handoff sheet. Four missing tax forms, a handful of pay groups that don't match what actually got approved — caught before payroll runs, not after someone's first paycheck comes back wrong."

**[SCREEN 56–68s]: Cut to PatientIntake.csv. Yellow banner: 'PII Detected — 5 columns may contain personally identifiable information.' Click 'patient_id' — Duplicate Values panel: '15 duplicate rows'.]**
NARRATION: "If you're in healthcare: personal data flagged automatically — five columns here — before this file gets shared or exported anywhere. Plus fifteen duplicate intake records for patients already in the system."

**[SCREEN 68–82s]: Cut to InventoryShipments.csv. Scope Filter panel opens on the Profiling page. Add condition: warehouse_country == US. Click 'Apply & Re-Profile'. Outliers tab now scoped to that subset: negative quantities and a handful of future-dated shipments.]**
NARRATION: "And if one region's feed just behaves differently than the rest, don't lump the whole file together. Scope it — filter down to one warehouse, re-profile just that slice — so what you're looking at is actually specific to it, not smoothed over by the rest of the file."

**[SCREEN 82–90s]: Same scoped InventoryShipments.csv view. Expand a flagged column's 'DQ Glossary' section: a colored 'timeliness' pill, a plain-English definition, then a bold rationale sentence specific to this column.]**
NARRATION: "And if you're sitting there thinking 'okay, but what do you even call this' — Sohovi's got you covered. Every flagged column comes with a plain-English explanation of which quality dimension it falls under, and why, based on exactly what it found in your file."

**[SCREEN 90–96s]: Text card: 'Flag → rule. One click.']**
NARRATION: "Right now, those are just flags. Here's how each one turns into a rule that stops it from happening again."

**[SCREEN 96–109s]: Cut back to SalesQ1.csv. Add rule: Dimension Accuracy, Rule Type Positive Check, Column amount, Threshold 100%. Click 'Add Rule'. Run DQ Check. Red 'BREAKING' badge — click it: the 10 negative-amount rows.]**
NARRATION: "Accuracy asks a simple question: is this value even realistic? A negative sale usually isn't a real transaction — it's a double-keyed entry, or a refund gone sideways. Set the rule once, and it can't quietly wreck a revenue total again."

**[SCREEN 109–122s]: Cut to PayrollRegister.csv. Add rule: Dimension Completeness, Rule Type Not Null, Column tax_form_on_file, Threshold 100%. Run. BREAKING badge — the 4 failed rows.]**
NARRATION: "Completeness asks whether a required field actually got filled in. On a tax form, that's not a formatting nitpick — it's the gap between a clean payroll run and a compliance headache nobody spots until the audit."

**[SCREEN 122–135s]: Cut to PatientIntake.csv. Add rule: Dimension Uniqueness, Rule Type Unique Column, Column patient_id, Threshold 100%. Run. BREAKING badge — 15 rows, grouped by repeated patient_id.]**
NARRATION: "Uniqueness asks whether an ID actually points to one thing. On a patient record, a duplicate isn't just a count that's off — it's the same person getting billed, or reviewed, twice."

**[SCREEN 135–148s]: Cut to InventoryShipments.csv — still the scoped US-warehouse view from earlier. Add rule: Dimension Timeliness, Rule Type Not Future Date, Column ship_date. Run. BREAKING badge — the future-dated rows.]**
NARRATION: "Timeliness asks whether a date actually makes sense — still scoped to just this warehouse from a minute ago. A shipment that supposedly left next year isn't a typo to shrug off — it's phantom inventory sitting on somebody's report."

**[SCREEN 148–150s]: Text card: 'Four teams. Four rules. Ten dimensions to pick from.']**
NARRATION: "Four teams, four different problems, four different dimensions — out of ten Sohovi covers. That's not a coincidence."

**[SCREEN 150–163s]: Quick cuts: 'Save as Workflow' clicked on each rule set in turn. Workflows list fills in: 'Finance — Revenue File', 'HR — New Hire Handoff', 'Healthcare — Patient Intake', 'Supply Chain — Warehouse Feed'.]**
NARRATION: "Build a rule set like that once, and save it as a Workflow. Next month's file — same shape, same team — gets the exact same checks in one click. Nobody's rebuilding it from memory, and nobody's quietly skipping a rule they forgot even existed."

**[SCREEN 163–178s]: Business Units list, each with its own score badge. Click into one — Catalogs list, each catalog with its own score. Click into a catalog — Assets list, each asset with its own score.]**
NARRATION: "And none of this is a one-and-done check. Every score rolls up — the file, the catalog it lives in, the business unit above that. Keep an eye on quality at whatever level you're actually on the hook for."

**[SCREEN 178–190s]: One asset's Score Trend chart: line climbing across 8 runs, one point circled red — 'Anomaly — dropped 14 points vs. previous run.' Cut to the Alerts tab: a Score Drop alert and a Schema Change alert, both 'Active'.]**
NARRATION: "Drill into any one of them for the full trend — every run you've ever done, plotted on one line, with a hard drop flagged automatically. Set an alert once, and you hear about it by email — not from someone else noticing first."

**[SCREEN 190–198s]: Sohovi logo. Text fades in: 'Free forever. No card. Runs entirely in your browser.' Then the URL.]**
NARRATION: "Sohovi — real data quality, priced for a real team, private by default, and built to keep watching after today. Start free at sohovi.com."

---

## SECTION 2 — LEARN SECTION TUTORIALS (14 videos)

> **Tone:** Friendly, direct, calm. Viewers are logged in and learning step by step — one action at a time, no fluff. Every video below states not just the click path but the real consequence of getting the underlying decision wrong, since "click here" without "here's what happens if you don't" is the exact weakness the review of the old 159-video set kept surfacing.

---

### PV2 — Set Up Your Workspace

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** None

**[SCREEN: First login. Onboarding screen: "Let's set up your workspace". Field: Organization Name. Type "Acme Analytics".]**
NARRATION: "Everything you connect to Sohovi lives inside an Organization — the top-level container for your billing, your team, and your data. Get this boundary right now, because assets don't move between organizations later."

**[SCREEN: Click 'Create Organization'. Dashboard loads. Sidebar hierarchy diagram: Organization → Business Units → Catalogs → Assets.]**
NARRATION: "Underneath that, you've got three more layers. Business Units, Catalogs, and Assets — and the reason to care isn't organizational tidiness — it's that scores, rules, and access can all be scoped at the Business Unit level."

**[SCREEN: Click 'New Business Unit'. Name it 'Finance'. Create a second one, 'Marketing'.]**
NARRATION: "Split into Business Units when two teams genuinely shouldn't see each other's rules or scores — Finance and Marketing, for instance. If everyone on your team should see everything, one Business Unit is fine — don't split for the sake of splitting."

**[SCREEN: Inside 'Finance' BU, click 'New Catalog'. Name it 'Customer Master Data'.]**
NARRATION: "A Catalog groups related data assets — one per source system is the right granularity. One catalog per individual file becomes ten near-identical catalogs with the same rules rebuilt ten times."

**[SCREEN: Inside the catalog, click 'New Data Asset'. Name it 'CustomerDB'.]**
NARRATION: "An Asset is where a specific file or connection actually lives — this is what you'll upload data into, build rules on, and run checks against."

**CTA:** Get the Business Unit and Catalog boundary right before you have fifty assets inside it — restructuring after the fact means re-pointing every rule.

---

### PV3 — Invite Your Team

**Platform:** Learn (In-App Tutorial)
**Duration:** 2 minutes
**Dataset:** None

**[SCREEN: Sidebar, click 'Team'. Page shows the account owner only. Button: 'Invite Member'.]**
NARRATION: "Click Team in the sidebar, then Invite Member, to bring in the rest of your team."

**[SCREEN: Modal: Email Address, Role (Admin / Member). Type 'jane@acmeanalytics.com'. Role dropdown open, showing both options with a description under each.]**
NARRATION: "Pick the role carefully — this isn't a formality. Members can view data, run checks, and build rules. Admins can do all of that, plus see billing and remove other people from the workspace."

**[SCREEN: Select 'Member'. Click 'Send Invite'. Success toast. Team page shows a 'Pending' row.]**
NARRATION: "Default to Member for anyone who's just working with data day to day — reserve Admin for whoever actually owns the account, not whoever asks first."

**[SCREEN: Hover the pending row. Options: 'Resend invite', 'Remove'.]**
NARRATION: "Invites sit as Pending until accepted — resend or cancel any time from here."

**CTA:** An over-provisioned Admin can see your billing and remove teammates — match the role to what someone actually needs to do.

---

### PV4 — Connect Your Data

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Data Asset page. Upload zone. Drag CustomerDB.csv in. File name and progress bar appear, completes in under 2 seconds.]**
NARRATION: "The simplest way in is a CSV or Excel upload — drag it onto the zone, and profiling starts immediately."

**[SCREEN: Re-upload a modified version of the same file — one column renamed. Yellow banner: 'Schema change detected — 1 column renamed or replaced.']**
NARRATION: "Re-upload a newer version of the same file any time — Sohovi compares the schema automatically and flags it if a column was added, removed, or renamed, before you even run a check."

**[SCREEN: Click 'Connect a Source' instead. List: Google Sheets, Airtable, Cloud Storage, REST API. Click 'Google Sheets'. OAuth popup, then a sheet picker.]**
NARRATION: "If your data lives somewhere else, connect it directly instead of exporting a file every time. Google Sheets asks you to authorize once, then pick a sheet — same profiling and rules apply from there on."

**[SCREEN: Click 'Airtable' instead. Field: Personal Access Token. Callout: 'Scope this token to read-only access on the base you're connecting — a broader token can write, not just read.']**
NARRATION: "For Airtable and REST API connections, you'll generate an access token — and it's worth scoping it to read-only. A token that can write back to your base is a bigger risk than Sohovi actually needs to take."

**[SCREEN: REST API option. URL field, Method dropdown, Headers, JSON Path field. Click 'Fetch Preview' before saving.]**
NARRATION: "For a REST API, always click Fetch Preview before saving the connection. If the JSON path is wrong, you'll profile an empty or garbage response and get a DQ score that looks clean but is checking nothing — worse than no check at all."

**CTA:** Start with a CSV to learn the product, then move to a live connector once you know which checks you actually want running on autopilot.

---

### PV5 — Understanding Your Profiling Report

**Platform:** Learn (In-App Tutorial)
**Duration:** 3.5 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: CustomerDB.csv uploaded. Profiling dashboard loads. Column cards appear for all 6 columns within 2 seconds.]**
NARRATION: "Profiling is Sohovi looking at every column and building a statistical picture of it — before you write a single rule. It's the step that tells you what to even check."

**[SCREEN: Click 'phone'. Stats panel: row count, null %, min/max/avg length, inferred type.]**
NARRATION: "Every column gets the basics — how many values, how many are missing, and for numbers, min, max, average, and standard deviation."

**[SCREEN: Same 'phone' card, Outliers tab. Two values highlighted: one absurdly long string, one all-zeros, with a note: 'Flagged using IQR — the interquartile range — rather than a simple average, which misses problems in skewed data.']**
NARRATION: "Outliers are flagged using IQR, not a plain average — an average gets dragged around by the very outliers you're trying to catch. IQR looks at the middle of your data's spread instead, so it still works on lopsided columns."

**[SCREEN: Click 'id'. 'Duplicate Values' panel: '50 duplicate rows · 12 repeating values', top repeated values listed with counts.]**
NARRATION: "Duplicates are reported two ways — whole rows that match exactly, and individual values that repeat, with a count for each. A repeating customer ID is a different problem than two fully duplicate rows, and you can see both."

**[SCREEN: Click 'email'. 'Value Distribution' panel: top 20 values by frequency as a bar chart, a shorter 'rarest values' list below it.]**
NARRATION: "Value distribution shows your most common entries and your least common ones — the rare, one-off value is exactly where a typo or a data-entry mistake tends to hide."

**[SCREEN: Same 'email' card, Patterns tab. 'Most common pattern: word@word.word — 92% · Second pattern: word@word — 4%.']**
NARRATION: "Patterns show you the shape values take — not a strict format check yet, just what Sohovi actually observed. 92% of your emails match one shape. The other 8% don't, and that's worth a look before you assume every email is well-formed."

**[SCREEN: Yellow banner across the top: 'PII Detected — 3 columns may contain personally identifiable information: email, phone, first_name.']**
NARRATION: "And Sohovi flags personally identifiable information automatically — email, phone, name — so you know what you're handling before you decide to share, export, or build rules on this file."

**CTA:** Profiling isn't a formality before the real work — it's how you find out what to check in the first place, instead of guessing.

---

### PV6 — Building Your First DQ Rule

**Platform:** Learn (In-App Tutorial)
**Duration:** 3.5 minutes
**Dataset:** A (CustomerDB.csv, post-profiling)

**[SCREEN: Rules tab. Click 'Add Rule'. Form: Dimension dropdown, Rule Type dropdown, Column dropdown, Threshold slider, Weight slider.]**
NARRATION: "A rule has five parts: which dimension you're checking, which specific rule type inside that dimension, which column, how strict the threshold is, and how much it should weigh in your final score."

**[SCREEN: Dimension: Completeness. Rule Type: Not Null. Column: email. Threshold: 95%. Click 'Add Rule'.]**
NARRATION: "Completeness at 95% on email means Sohovi lets up to 5% of rows have a blank email before this rule fails — set that number to match how strict you actually need to be, not just 100% by default."

**[SCREEN: Add a second rule: Dimension Accuracy, Rule Type Positive Check, Column amount (hypothetical numeric column), Threshold 100%.]**
NARRATION: "Accuracy checks that a value is realistic — here, that an amount can't be negative. A negative sale is almost never a real transaction — it's a sign key was pressed twice or a refund was entered wrong, and it will corrupt any revenue total built on top of it."

**[SCREEN: Add a third rule: Dimension Validity, Rule Type Enum Validation, Column country, allowed_values field: 'US,CA,GB,IN,AU'.]**
NARRATION: "Validity checks a value against a format or a known list — type in the countries you actually expect, and anything else, like a typo or an old abbreviation, gets caught."

**[SCREEN: Add a fourth rule: Dimension Uniqueness, Rule Type Unique Column, Column id, Threshold 100%.]**
NARRATION: "Uniqueness checks that a column has no duplicates — critical on any column acting as an ID, because a duplicate ID silently inflates a customer count or a headcount."

**[SCREEN: Weight sliders shown on all four rules: email 3, amount 4, country 1, id 4.]**
NARRATION: "And weight decides how much each rule actually matters to your final score — a duplicate customer ID is probably a bigger deal than a slightly non-standard country name, so weight it that way."

**CTA:** Building a rule takes seconds once you know the five parts — the judgment call is always the threshold and the weight, not the mechanics.

---

### PV7 — Add a Description and Scope a Rule

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** B (SalesQ1.csv)

**[SCREEN: Open the email Completeness rule. 'Description (optional)' field below the threshold. Type: 'Required so Sales can follow up within 24 hours of signup.']**
NARRATION: "Every rule can carry a description — the reason it exists, not just what it checks. Six months from now, whoever looks at this rule doesn't have to guess why 95% and not 100%."

**[SCREEN: Rules list — the description shows as a quiet italic line under the rule. Run a check — the same description appears in Score Transparency and in the Failed Records popup.]**
NARRATION: "That description follows the rule everywhere — the rules list, the score breakdown, and the failed-records view when it fails. Context travels with the number, not just the rule name."

**[SCREEN: Same rule, 'Scope (optional)' section. Click '+ Add condition'. Column: region, Operator: ==, Value: US.]**
NARRATION: "Scope narrows which rows a rule actually checks. Add a condition — region equals US — and this rule only evaluates US rows. Every other row is skipped for this rule specifically, pass or fail."

**[SCREEN: Add a second condition: amount, Operator: >, Value: 500. Operator dropdown shown with all 8 choices: ==, !=, &gt;, &gt;=, &lt;, &lt;=, in, contains.]**
NARRATION: "Add a second condition, and they combine with AND — now it's US orders over $500 specifically. You've got eight operators to work with, including 'in' for a list and 'contains' for partial matches."

**[SCREEN: Rules list — a teal 'Scoped' badge appears next to the rule. Hover it: tooltip shows 'region == US AND amount > 500'.]**
NARRATION: "Scoped rules get a badge so you can tell at a glance which ones aren't checking the whole file — hover it any time to see the exact condition without reopening the rule."

**CTA:** Use scope whenever a rule should only apply to part of your data — a blanket rule on data that has real exceptions just trains people to ignore failures.

---

### PV8 — Get AI-Suggested Rules

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (CustomerDB.csv, freshly profiled, no rules yet)

**[SCREEN: Rules tab, empty state. Button: 'Get AI Suggestions'. Click it. Spinner for under a second.]**
NARRATION: "If you'd rather not pick dimensions and rule types by hand, click Get AI Suggestions."

**[SCREEN: Suggested rule cards appear: email — Completeness, 99% confidence; email — Validity (format), 97% confidence; id — Uniqueness, 96% confidence; country — Validity (Enum), 82% confidence.]**
NARRATION: "Sohovi looks at your column names, the types it detected, and the patterns and stats from profiling — then matches those against rule templates it's confident actually apply, with a confidence score attached to each one."

**[SCREEN: Callout overlay: 'This runs locally against your profiling results — no external API call, no data leaves your browser for this step.']**
NARRATION: "To be precise about what's happening: this is a local matching engine, not a call to an outside AI service — it's comparing your data's shape against known patterns, entirely in your browser."

**[SCREEN: Click 'Accept' on the email Completeness and Validity cards. They move into the active Rules list.]**
NARRATION: "Accept the ones that make sense — you're not obligated to take all of them. Each one you accept is added exactly as if you'd built it by hand."

**CTA:** Use this when you're starting from zero and don't yet know which dimensions your data actually needs — it's a starting point, not a replacement for judgment on thresholds and weights.

---

### PV9 — Write Rules in Plain English (AI Builder)

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Rules page. Click the 'AI Builder' tab next to 'Manual'. Simple UI: Column dropdown, a text box, 'Generate Rules' button.]**
NARRATION: "AI Builder is a different feature from AI Suggestions — this one takes a plain-English description you write, and turns it into a real rule."

**[SCREEN: Column: 'email'. Type into the box: 'Email must never be blank and must be a valid email address'. Click 'Generate Rules'.]**
NARRATION: "Select your column, describe what you want in your own words, and generate."

**[SCREEN: Two rule cards appear after a 2-second spinner: not_null — Completeness — 99% confidence; format_check email — Validity — 97% confidence.]**
NARRATION: "Two rules come back, correctly split into the two separate checks your sentence actually implied."

**[SCREEN: Callout overlay: 'Unlike AI Suggestions, this feature does call an external AI model — but only the column name and your typed description are sent. Your actual data never leaves your browser.']**
NARRATION: "Here's the honest difference from the last video: this one does send something outside your browser — just the column name and the sentence you typed, never your real data or rows."

**[SCREEN: Click 'Accept' on both. They appear in the active Rules list.]**
NARRATION: "Accept them, and they're saved exactly like any manually built rule."

**CTA:** Use AI Builder when you know exactly what you want to check but don't want to hunt through dropdowns to build it — it's the fastest path from an idea to a working rule.

---

### PV10 — Test Rules Safely in the Sandbox

**Platform:** Learn (In-App Tutorial)
**Duration:** 2 minutes
**Dataset:** B (SalesQ1.csv)

**[SCREEN: Asset page. Click 'Sandbox' tab. A rule builder identical to the main Rules tab, plus a 'Run Test' button.]**
NARRATION: "The Sandbox lets you build and test a rule against your real file without saving it to your live rule set yet."

**[SCREEN: Build a rule: Validity, Enum Validation, region, allowed_values 'US,CA,GB'. Add a Scope condition: amount > 100. Click 'Run Test'.]**
NARRATION: "Build it exactly like a real rule — dimension, type, threshold, even scope — then run it."

**[SCREEN: Results appear inline: '18 of 42 in-scope rows failed'. A red 'BREAKING' badge — click it, a Failed Records popup opens with the actual rows.]**
NARRATION: "You see the real result immediately — how many rows would actually fail, and which ones — before this rule is live and affecting your score."

**[SCREEN: Adjust the threshold from 100% to 90%. Click 'Run Test' again. Result changes to 'PASS — 4 of 42 exceed the 10% allowance'.]**
NARRATION: "Tune the threshold and re-test as many times as you want — this is where you find the number that actually reflects your data, instead of guessing and finding out after it's already tanked your score."

**[SCREEN: Click 'Save to Rules'. The rule moves into the live Rules tab.]**
NARRATION: "Once it looks right, save it — now it's a real, active rule."

**CTA:** Use the Sandbox before adding any rule you're not sure about — it's free to be wrong here, it isn't once the rule is live.

---

### PV11 — Run a DQ Check and Read Your Score

**Platform:** Learn (In-App Tutorial)
**Duration:** 3.5 minutes
**Dataset:** A (CustomerDB.csv, 6 rules configured)

**[SCREEN: Rules tab, 6 active rules. Button: 'Run DQ Check'. Click it. Progress: '1/6 … 6/6' completing in under 3 seconds for 550 rows.]**
NARRATION: "Click Run DQ Check, and every active rule runs against the file, right in your browser."

**[SCREEN: Score gauge animates 0 to 52, amber. Summary bar: Rules 6, Passed 3, Failed 3, Columns 6.]**
NARRATION: "52 out of 100. That's amber — meaning roughly half your rules are lying to you right now if you were about to ship a report off this file."

**[SCREEN: Column score grid: id 100, first_name 100, last_name 100, email 61, phone 84, country 100.]**
NARRATION: "Below the overall number, every column gets its own score — email at 61 is what's actually dragging you down, and email is exactly what Sales uses to follow up. A perfect ID column doesn't save a broken campaign."

**[SCREEN: Click 'Score Transparency'. Table: rule, weight, pass/fail, point contribution or penalty. email Completeness — BREAKING — weight 3 — penalty 18 points.]**
NARRATION: "Click Score Transparency, and the number stops being a mystery. Every rule shows its weight and exactly how many points it cost or added — nothing about this score is a black box you have to trust blindly."

**[SCREEN: Highlight: id Uniqueness — PASS — weight 4 — contributed 20 points.]**
NARRATION: "Passing rules contribute their full weight, too — so you can see exactly what's holding the score up, not just what's dragging it down."

**CTA:** A score without transparency is just a number you have to trust — a score with it is something you can actually defend to whoever's asking.

---

### PV12 — Investigate Failed/Breaking Records

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (post-run, score 52)

**[SCREEN: Rule Breakdown panel. Each rule ends in a colored pill — green 'PASS' or red 'BREAKING' (Sohovi's word for a failing rule).]**
NARRATION: "Every rule gets a pill. Green means it passed. Red 'BREAKING' means it failed — and unlike most tools, you don't have to just take the word for it."

**[SCREEN: Click the red 'BREAKING' badge next to 'email — Completeness'. A popup opens: the rule's description at the top, then a plain-English summary, then the actual failing rows with the email column highlighted red.]**
NARRATION: "Click the badge, and a popup opens pre-scoped to that exact rule — the description first if one was set, then the real rows, with the column that broke it highlighted so you're not hunting for it."

**[SCREEN: Multiple pill buttons above the table: 'not null (70)', 'regex match (44)'. Click between them.]**
NARRATION: "If more than one rule is failing on this column, switch between them — each pill shows its own live failure count."

**[SCREEN: Click 'Download CSV (70 rows)'. File downloads with a 'Rules Violated' column appended alongside the original data.]**
NARRATION: "Download it, and the file includes exactly which rule or rules each row violated — hand it straight to whoever owns the source data, no manual cross-referencing required."

**CTA:** Every BREAKING badge is a shortcut straight to the rows that caused it — click first, don't scroll looking for the problem.

---

### PV13 — Monitor Your Data Quality Over Time

**Platform:** Learn (In-App Tutorial)
**Duration:** 3.5 minutes
**Dataset:** A (multiple historical runs)

**[SCREEN: Asset page, 'Runs' tab. A Score Trend chart: line-and-area combo plotting score across 8 runs, climbing from 52 toward 93, with reference lines at 95, 80, 60.]**
NARRATION: "Every run you've ever done is saved and plotted on one chart — this is how you see whether your data is actually getting better, not just what today's score happens to be."

**[SCREEN: One point on the line has a red ring around it, tooltip: 'Anomaly — dropped 14 points vs. previous run.']**
NARRATION: "If a run ever drops hard compared to your own history, it gets flagged automatically, right on the chart — you don't have to notice the dip yourself."

**[SCREEN: Run History list below the chart. Click two specific runs, then 'Compare Runs'.]**
NARRATION: "For a closer before-and-after, pick any two runs and compare them directly."

**[SCREEN: Side-by-side comparison: Run 1 score 52, Run 2 score 89, delta +37. Rule-by-rule: email Completeness BREAKING → PASS.]**
NARRATION: "You get the score delta, and which specific rules flipped from failing to passing — proof of exactly what your cleanup fixed, not just a vague 'it's better now.'"

**[SCREEN: Alerts tab. Click 'Create Alert'. Type: 'Score Drop'. Threshold: 80. Notification email pre-filled.]**
NARRATION: "And you don't have to check the chart yourself every time, either. Set a Score Drop alert — here, below 80 — and you'll get an email the moment a run crosses that line."

**[SCREEN: Create a second alert: Type 'Schema Change', Trigger: 'Any change'.]**
NARRATION: "Add a Schema Change alert too, so a renamed or missing column gets flagged the moment it happens — before it silently breaks every rule that depends on it."

**CTA:** A single score tells you today. The trend, the comparison, and the alerts together are what tell you whether you're actually improving — or quietly sliding.

---

### PV14 — Save and Reuse Rule Sets with Workflows

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (4 rules built)

**[SCREEN: Rules tab, 4 active rules. Click 'Save as Workflow'. Name it 'Customer Data Standard'.]**
NARRATION: "Without this, every analyst who touches customer data ends up re-inventing what 'valid' means — one person's rules, another person's guess. A Workflow makes that a written standard instead of an opinion."

**[SCREEN: Workflows page. 'Customer Data Standard' listed with 4 rule chips: email Completeness, email Validity, id Uniqueness, phone Validity.]**
NARRATION: "It's a saved, named rule set — built once."

**[SCREEN: New file uploaded, profiled. Rules tab, click 'Apply Workflow', select 'Customer Data Standard'. All 4 rules populate instantly.]**
NARRATION: "Apply it to any new asset in one click — next month's export, a teammate's upload, anything of the same shape — and get the exact same checks, instantly, instead of rebuilt from memory."

**[SCREEN: One rule shows a yellow warning: 'phone column not found in this dataset — rule skipped'.]**
NARRATION: "If a column from the workflow doesn't exist in the new file, Sohovi skips that one rule and tells you — rather than silently failing or crashing the whole application."

**CTA:** The moment you notice you're rebuilding the same rules on a second file, that's the signal to save them as a Workflow instead.

---

### PV15 — Remediate, Export, and Report

**Platform:** Learn (In-App Tutorial)
**Business note:** Remediation requires a Business plan (`PlanGate minPlan="business"`) — frame for existing Business customers.
**Duration:** 3 minutes
**Dataset:** A (post-run, 70 failing rows)

**[SCREEN: Failed Records tab, 70 rows with email violations. Click 'Download Failed Records'. CSV includes a 'violation_reason' column: 'email null value', 'email invalid format'.]**
NARRATION: "Remediation starts with a clean download — every row that failed, plus a plain-language reason column so whoever fixes it doesn't have to guess what's wrong."

**[SCREEN: Fix the records in Excel — add missing emails, correct typos. Save. Back in Sohovi, click 'Upload New Version'.]**
NARRATION: "Fix what you can in your source system, then upload the corrected file as a new version of the same asset."

**[SCREEN: Run DQ Check on the new version. Score jumps from 52 to 89.]**
NARRATION: "Run it again. 52 to 89 — that jump is your proof the fix actually worked, not just a hope that it did."

**[SCREEN: Click 'Export Report'. Choose PDF or Excel. PDF preview: score, rule breakdown, charts, one page.]**
NARRATION: "Export a report when you need to hand this to someone who doesn't have a Sohovi login — a manager, a client, an auditor. PDF is the one-page, presentable version. Excel is the same data, raw, for anyone who wants to work with the numbers directly."

**[SCREEN: Separately, on the Profiling Dashboard, click 'Download Excel'. A 5-sheet workbook: Summary, Values, Patterns, Column Descriptions, DQ Glossary.]**
NARRATION: "For the deeper story behind the score, export the full profiling workbook instead — five sheets covering every column's stats, values, patterns, plain-English descriptions, and why each dimension applies. That's your paper trail that you checked, before someone else found the problem."

**CTA:** Remediation is a cycle — download, fix, re-upload, re-run. The export is what proves it happened.

---

## SECTION 3 — MARKETING / JOB-TO-BE-DONE VIDEOS (22 videos)

> **Tone:** YouTube/Instagram. Confident, concrete, one job per video. Each uses a different industry so watching two in a row never feels like the same video twice — this was the single biggest weakness found in the old 159-video set.

---

### PV16 — Find the Outlier Before Your Board Does

**Platform:** YouTube / Instagram
**SEO Target:** "outlier detection csv", "find data outliers automatically", "financial data outlier check"
**Duration:** 75 seconds
**Dataset:** B (SalesQ1.csv, negative amounts)

**Hook:** "One row in your revenue sheet says minus two hundred fifty dollars. Nobody typed that on purpose. And a simple average won't catch it — here's what will."

**[SCREEN: SalesQ1.csv profiling. amount column stats panel: min -250, max 4,800, avg 612.]**
NARRATION: "A simple average gets dragged around by the very outliers you're trying to find — it can hide a problem instead of showing it."

**[SCREEN: Outliers tab on the amount column. 10 values highlighted red, each below zero. Note: 'Flagged using IQR — the interquartile range.']**
NARRATION: "Sohovi flags outliers using IQR instead — the same method statisticians use to find what's genuinely unusual, not just far from the mean. Ten negative transactions, found automatically, before you built a single rule."

**[SCREEN: Add Accuracy rule: amount, Positive Check, threshold 100%. Run. Score 71. Failed records show the 10 rows.]**
NARRATION: "Turn it into an enforced rule, and every future upload gets checked the same way — automatically, not because someone happened to eyeball the sheet that week."

**CTA:** Free at sohovi.com — find the number that shouldn't exist before your board's meeting does.

---

### PV17 — Catch Duplicate Customers Before They Skew Your Numbers

**Platform:** YouTube / Instagram
**SEO Target:** "find duplicate customers csv", "duplicate detection data quality", "ecommerce duplicate customer records"
**Duration:** 75 seconds
**Dataset:** A (CustomerDB.csv, 50 duplicate rows)

**Hook:** "Your customer count says 550. Fifty of those are the same person, counted twice. Your growth chart has been lying to you."

**[SCREEN: CustomerDB.csv profiling. id column, Duplicate Values panel: '50 duplicate rows · 12 repeating values'.]**
NARRATION: "Sohovi finds duplicates two ways: whole rows that match exactly, and individual values — like a customer ID — that repeat, with a count for each."

**[SCREEN: Add Uniqueness rule: id, Unique Column, threshold 100%. Run. Score 68. Failed records: the 50 duplicate rows, grouped by repeated ID.]**
NARRATION: "Turn it into a rule, and every re-upload catches this instantly instead of a merge-and-forget problem quietly compounding for months."

**[SCREEN: Download failed records CSV. Highlight: 'Merged from two systems in March — likely cause.']**
NARRATION: "Download the list, hand it to whoever owns the source system — and your actual customer count stops being an estimate."

**CTA:** Free at sohovi.com — know your real number, not your inflated one.

---

### PV18 — See What Your Data Actually Looks Like in 10 Seconds

**Platform:** YouTube / Instagram
**SEO Target:** "data pattern detection", "value distribution chart csv", "spot data format inconsistency"
**Duration:** 75 seconds
**Dataset:** C (EmployeeDir.csv)

**Hook:** "Half your phone numbers look like this. The other half look like that. Nobody told you — until now."

**[SCREEN: EmployeeDir.csv profiling. phone column, Patterns tab: 'Most common pattern: 999-999-9999 — 88% · Second pattern: (999) 999-9999 — 8%.']**
NARRATION: "Sohovi converts every value into its actual shape — letters, digits, symbols — and shows you the patterns that shape falls into. 88% one format, 8% a completely different one, in the same column."

**[SCREEN: Same column, Value Distribution panel: top 20 values by frequency, a short 'rarest values' list below.]**
NARRATION: "Right next to it, value distribution shows your most common entries and your rarest ones — a typo that happened exactly once is exactly where it hides."

**[SCREEN: Add a Consistency rule: format_standardization on phone. Run. Score 82.]**
NARRATION: "Once you can see the shape of your data, standardizing it is a five-minute rule, not a guessing game."

**CTA:** Free at sohovi.com — your data has a shape. See it before you build anything on top of it.

---

### PV19 — Know What's Private Before You Hit Send

**Platform:** YouTube / Instagram
**SEO Target:** "detect pii in csv automatically", "check spreadsheet for personal data", "pii detection data quality tool"
**Duration:** 75 seconds
**Dataset:** A (CustomerDB.csv)

**Hook:** "You're about to email this spreadsheet to a vendor. Do you actually know what's in every column? Most people find out the hard way."

**[SCREEN: CustomerDB.csv profiling. Yellow banner: 'PII Detected — 3 columns may contain personally identifiable information: email, phone, first_name.']**
NARRATION: "The moment you upload, Sohovi flags every column that looks like it holds personal data — automatically, before you've decided to do anything with the file."

**[SCREEN: Click the banner. Expanded list: email (high confidence), phone (high confidence), first_name (name-based detection).]**
NARRATION: "It's checking column names and the actual values — a mix of keyword matching and pattern detection — not just guessing from a header that says 'email'."

**[SCREEN: Sample values shown masked: 'jo***@ex***.com', '555-***-**89'.]**
NARRATION: "And anywhere Sohovi shows you a sample of that data, it's masked first — so even looking at your own profiling report doesn't expose the full values unnecessarily."

**CTA:** Free at sohovi.com — know what's in the file before it leaves your hands.

---

### PV20 — Never Let a Blank Field Blow Up Your Follow-Up

**Platform:** YouTube / Instagram
**SEO Target:** "completeness data quality rule", "missing data crm", "check missing email crm csv"
**Duration:** 75 seconds
**Dataset:** A (CustomerDB.csv)

**Hook:** "A lead fills out your form. Sales tries to follow up. There's no email on file. That lead is gone — and nobody flagged it."

**[SCREEN: CustomerDB.csv, email column profiling: '14% null values'.]**
NARRATION: "14% of this file has no email at all — that's not a rounding error, that's roughly one in seven leads Sales can never actually reach."

**[SCREEN: Add Completeness rule: email, Not Null, threshold 95%. Add a description: 'Required so Sales can follow up within 24 hours.']**
NARRATION: "A Completeness rule is exactly this: is the field actually filled in. Set the threshold to how strict you need to be, and write down why — so it's not just a rule. It's a documented standard."

**[SCREEN: Run. Score drops to reflect the failure. Click the BREAKING badge — the 70 missing-email rows appear, ready to download.]**
NARRATION: "Run it, and you get the exact list of who's unreachable — not a vague sense that 'some leads' might be missing info."

**CTA:** Free at sohovi.com — a blank field is a lost conversation. Catch it before Sales does the hard way.

---

### PV21 — Make Sure a Code Actually Means What It Says

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "validate country code data quality", "customer master data validation finance", "reference list data quality check"
**Duration:** 2.5 minutes
**Dataset:** B (SalesQ1.csv — `region` column, framed as a customer master/billing table)

**Hook:** "Your finance team pulls the customer table. The region column has 'US', 'USA', 'U.S.', and one row that just says 'califronia'. Which of those are real — and which ones will break your revenue-by-region report?"

**[SCREEN: SalesQ1.csv region column value distribution: 'US' 140 rows, 'USA' 22 rows, 'CA' 18 rows, 'califronia' 1 row, blank 15 rows.]**
NARRATION: "One rule won't catch all of this — you need to combine a few."

**[SCREEN: Add rule 1 — Completeness, Not Null, region, threshold 100%. Add rule 2 — Validity, Enum Validation, region, allowed_values 'US,CA,GB,IN,AU,DE,FR,JP,BR,MX', threshold 100%.]**
NARRATION: "First, Completeness — region must never be blank. Second, and this is the real check: Validity, Enum Validation. Type in your known-good set of codes — this list is functioning as your reference table. Anything that doesn't exactly match, like 'USA' or 'califronia', fails."

**[SCREEN: Callout: 'This list lives inside the rule, not a separate uploaded file. Add a new code here if you expand into a new region.']**
NARRATION: "To be precise: this list lives inside the rule itself, not a separate uploaded master file. If you start selling into a new country, you come back here and add the code."

**[SCREEN: Scope section: account_status == Active. Weight: Enum Validation set to 4, Completeness set to 2.]**
NARRATION: "Scope it to active accounts only, and weight the code check higher than the blank check — a wrong-but-present code silently splits your revenue totals. A blank one is at least visible."

**[SCREEN: Run. Score 74. Click BREAKING badge on the Enum rule — the 'USA', 'CA' variants, and 'califronia' rows appear. Save as a Workflow named 'Customer Region Validation'.]**
NARRATION: "Run it, download the exact rows to fix, and save the combination as a Workflow — every future customer export gets the same reference-style check in one click."

**CTA:** Free at sohovi.com — a reference list you maintain beats five spellings of the same country.

---

### PV22 — Stop Counting the Same Customer Twice

**Platform:** YouTube / Instagram
**SEO Target:** "duplicate customer records ecommerce", "uniqueness data quality rule", "customer id deduplication"
**Duration:** 75 seconds
**Dataset:** A (CustomerDB.csv)

**Hook:** "Your marketing spend is calculated per customer. If your customer list has duplicates, you're paying to re-market to people you've already counted."

**[SCREEN: CustomerDB.csv, id column duplicate panel: '50 duplicate rows'.]**
NARRATION: "Fifty duplicate records in a 550-row file — that's not a rounding error in a customer acquisition cost calculation, that's a real distortion."

**[SCREEN: Add Uniqueness rule: id, Unique Column, threshold 100%. Run. Score reflects the failure.]**
NARRATION: "A Uniqueness rule catches this the moment it happens — not months later when someone notices the numbers don't add up."

**[SCREEN: Failed records show the 50 duplicated rows, grouped and counted per ID.]**
NARRATION: "And you get the exact list, grouped by which ID repeated and how many times — not just a total count."

**CTA:** Free at sohovi.com — know your real customer count before you calculate anything off of it.

---

### PV23 — Make "Active" and "active" the Same Thing Everywhere

**Platform:** YouTube / Instagram
**SEO Target:** "data consistency check", "standardize category values csv", "case consistency data quality"
**Duration:** 75 seconds
**Dataset:** A (CustomerDB.csv, hypothetical status column)

**Hook:** "Your report shows 40% active customers and 60% Active customers — as if those are two different groups. They're not. Your data just wasn't consistent."

**[SCREEN: Value distribution on a status column: 'active' (lowercase) 220 rows, 'Active' (capitalized) 330 rows, shown as two separate bars.]**
NARRATION: "To a spreadsheet, 'active' and 'Active' are two different values — which means every pivot table, every filter, and every chart built on this column is quietly splitting one group into two."

**[SCREEN: Add Consistency rule: status, Case Consistency, expected case: lowercase. Run. Score reflects the split.]**
NARRATION: "A Consistency rule enforces one case standard — and once it's enforced, that pivot table finally shows one real number instead of two fake ones."

**[SCREEN: After standardizing: single bar 'active' at 550 rows.]**
NARRATION: "Same data. One category. The number your report was always supposed to show."

**CTA:** Free at sohovi.com — the same value written two ways is still two lies about your data.

---

### PV24 — Catch the Record That Can't Possibly Be True

**Platform:** YouTube / Instagram
**SEO Target:** "cross field data validation", "impossible date data quality", "hr data accuracy check"
**Duration:** 90 seconds
**Dataset:** C (EmployeeDir.csv, with hire_date and termination_date columns)

**Hook:** "An employee's termination date is before their hire date. That's not a formatting quirk — that record is logically impossible, and it's sitting in your HR system right now."

**[SCREEN: EmployeeDir.csv — a row where termination_date (2022-01-05) is earlier than hire_date (2022-03-14).]**
NARRATION: "No single-column check catches this. Hire date looks fine on its own. Termination date looks fine on its own. It's only wrong when you compare them."

**[SCREEN: Add an Accuracy rule: Cross-Field Compare, column termination_date, reference_column hire_date, operator '>='.]**
NARRATION: "A cross-field rule compares two columns directly — termination date must be on or after hire date. Anything else isn't a formatting issue, it's an impossible record."

**[SCREEN: Run. Failed records: 3 rows where the comparison fails, highlighted.]**
NARRATION: "Three records, caught immediately — the kind of error that otherwise sits quietly in a system until an audit, a lawsuit, or a payroll dispute forces someone to notice it."

**CTA:** Free at sohovi.com — some errors aren't about one bad value, they're about two values that can't both be true.

---

### PV25 — Don't Let a Broken Link Between Records Cost You a Report

**Platform:** YouTube / Instagram
**SEO Target:** "referential integrity check csv", "foreign key validation data quality", "orphan records finance"
**Duration:** 90 seconds
**Dataset:** B (SalesQ1.csv, order_id referencing a customer_id column in the same file)

**Hook:** "An order references a customer ID that doesn't exist anywhere else in your file. That order will vanish the moment someone joins these tables — and nobody will know why the totals don't match."

**[SCREEN: SalesQ1.csv — order rows with a customer_id column; a handful of values don't appear anywhere in a reference column of known customer IDs added to the same sheet.]**
NARRATION: "This is a referential integrity problem — a value that's supposed to point to something else, pointing at nothing."

**[SCREEN: Add an Integrity rule: Referential Integrity, column customer_id, reference_column valid_customer_ids.]**
NARRATION: "The rule checks that every customer_id value exists somewhere in a reference column — here, one added to this same file. It's important to be precise: this checks within one uploaded file, not against a separate external system."

**[SCREEN: Run. Failed records: 6 orphaned order rows, none of their customer_id values found in the reference column.]**
NARRATION: "Six orders that will silently disappear the moment someone builds a report joining orders to customers — found now, instead of during a quarterly close."

**CTA:** Free at sohovi.com — a broken link between two columns is invisible until someone builds the report that needed it to hold.

---

### PV26 — Catch a Bad Data Day Before It Reaches Your Dashboard

**Platform:** YouTube / Instagram
**SEO Target:** "data quality monitoring over time", "detect data anomaly automatically", "data quality trend tracking"
**Duration:** 90 seconds
**Dataset:** A (multiple historical runs, one with a sudden drop)

**Hook:** "Your DQ score says 97. Looks fine. But it was 98 last week, and 98 the week before, and 98 for six months straight. A 97 today isn't fine — it's the first crack."

**[SCREEN: Score Trend chart: a flat line at 98 across 6 runs, then a visible dip.]**
NARRATION: "A single score, on its own, can't tell you this. You need the trend — and Sohovi plots every run you've ever done on one chart, automatically."

**[SCREEN: The dip point circled red, tooltip: 'Anomaly — dropped 14 points vs. previous run.']**
NARRATION: "When a run drops hard against your own history, it's flagged right on the chart — not because you happened to notice the number looked different."

**[SCREEN: Alerts tab. A Score Drop alert set to 80, and a Schema Change alert, both 'Active'.]**
NARRATION: "And you don't have to be watching the chart at all. Set an alert, and you get an email the moment a run crosses your threshold — or the moment a column gets renamed or disappears."

**CTA:** Free at sohovi.com — don't be the last person to find out your data broke. Find out from an email, not from your VP.

---

### PV27 — Never Take a Score's Word for It

**Platform:** YouTube / Instagram
**SEO Target:** "data quality score transparency", "how is a data quality score calculated", "explainable dq score"
**Duration:** 75 seconds
**Dataset:** A (post-run, score 52)

**Hook:** "A tool tells you your data quality score is 52. Great. Now explain to your team why — most tools can't answer that. Sohovi shows its work."

**[SCREEN: Score gauge: 52, amber. Click 'Score Transparency'.]**
NARRATION: "Every score breaks down into the rules that built it — nothing about it is a black box you're expected to just believe."

**[SCREEN: Table: rule, weight, pass/fail, point contribution. email Completeness — BREAKING — weight 3 — penalty 18 points. id Uniqueness — PASS — weight 4 — contributed 20 points.]**
NARRATION: "Every rule shows its weight, whether it passed, and exactly how many points it cost or added. Email completeness is the single biggest drag on this score — and now you know that, instead of just knowing the number is bad."

**[SCREEN: Formula overlay at the bottom: weighted average of all rule outcomes.]**
NARRATION: "It's a weighted average, shown in full — you can recompute it yourself if you want to. That's the difference between a score and an opinion."

**CTA:** Free at sohovi.com — a number nobody can explain isn't worth trusting. Get one you can.

---

### PV28 — Build Your Quality Checklist Once, Use It Forever

**Platform:** YouTube / Instagram
**SEO Target:** "reusable data quality rules", "data quality workflow template", "standardize data checks across files"
**Duration:** 90 seconds
**Dataset:** A (4 rules built, then applied to a new file)

**Hook:** "You built the perfect set of checks for last month's customer export. This month's export just landed. Are you really rebuilding all of it from memory?"

**[SCREEN: Rules tab, 4 rules built. Click 'Save as Workflow'. Name it 'Customer Data Standard'.]**
NARRATION: "Save a working rule set once, as a Workflow — a named, reusable standard instead of something that lives in one analyst's head."

**[SCREEN: New file uploaded. Rules tab, click 'Apply Workflow', select 'Customer Data Standard'. 4 rules populate instantly, mapped to matching columns.]**
NARRATION: "Apply it to any new file in one click — every future export gets the exact same standard, instead of whatever the person uploading it happens to remember."

**[SCREEN: One rule flagged: 'phone column not found — rule skipped', rest apply normally.]**
NARRATION: "If a column's missing, that one rule is skipped and flagged — not silently ignored, not a crash."

**CTA:** Free at sohovi.com — the moment you rebuild the same rule twice, that's the moment to save it once instead.

---

### PV29 — Skip the Rule-Writing Guesswork

**Platform:** YouTube / Instagram
**SEO Target:** "ai suggested data quality rules", "automatic data quality rules", "which rules should i check on my data"
**Duration:** 75 seconds
**Dataset:** A (CustomerDB.csv, freshly uploaded, zero rules)

**Hook:** "You just uploaded a 500-row file. You have no idea which columns need which checks. You don't have to guess."

**[SCREEN: Rules tab, empty. Click 'Get AI Suggestions'.]**
NARRATION: "Click Get AI Suggestions instead of starting from a blank dropdown."

**[SCREEN: Suggested cards: email — Completeness, 99% confidence. email — Validity, 97% confidence. id — Uniqueness, 96% confidence.]**
NARRATION: "Sohovi looks at your column names, types, and what profiling already found, and suggests the rules that actually fit — each with a confidence score, so you know how sure it is."

**[SCREEN: Click 'Accept' on the top three.]**
NARRATION: "Accept the ones that make sense. You've gone from a blank rule builder to three working checks in under a minute."

**CTA:** Free at sohovi.com — start with a suggestion, not a blank page.

---

### PV30 — Describe It, Don't Configure It

**Platform:** YouTube / Instagram
**SEO Target:** "write data quality rules in plain english", "no-code data quality rules", "ai rule builder non-technical"
**Duration:** 75 seconds
**Dataset:** A (CustomerDB.csv)

**Hook:** "You know exactly what you want checked. You just don't want to learn five dropdowns to say it. Now you don't have to."

**[SCREEN: Rules page, 'AI Builder' tab. Column: email. Text box: type 'Email must never be blank and must be a valid email address'.]**
NARRATION: "Pick your column, describe what you want in your own words — no rule-type vocabulary required."

**[SCREEN: Click 'Generate Rules'. Two cards appear: not_null — Completeness, format_check — Validity, both with confidence scores.]**
NARRATION: "Sohovi splits your sentence into the two separate rules it actually implied, and builds both."

**[SCREEN: Callout: 'Only the column name and your sentence are sent to generate this — never your actual data.']**
NARRATION: "And to be clear about what leaves your browser here: just the column name and the sentence you typed — never your real rows."

**CTA:** Free at sohovi.com — say what you want checked, skip the configuration.

---

### PV31 — Check Only What Actually Needs Checking

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "scope data quality rule to rows", "conditional data validation csv", "filter rows before dq check supply chain"
**Duration:** 90 seconds
**Dataset:** E (InventoryShipments.csv)

**Hook:** "One warehouse's feed is reliable. Another one lags by a day and always looks a little off. Checking both the same way just trains everyone to ignore the alerts from the second one."

**[SCREEN: InventoryShipments.csv, warehouse_country column with two values: US and IN.]**
NARRATION: "Instead of one blanket rule for the whole file, scope it."

**[SCREEN: Add rule: Timeliness, Not Future Date, ship_date. Expand Scope: warehouse_country == US.]**
NARRATION: "This rule only checks US warehouse rows — because you already know the other region's feed runs on a delay. Flagging it constantly just trains people to ignore real problems when they show up."

**[SCREEN: Add a description: 'India warehouse feed has a known 24-hour lag — checked separately.' Second rule created for warehouse_country == IN with a looser threshold.]**
NARRATION: "Write down why, build a second version with a threshold that actually matches that warehouse's reality. Now both regions get a rule that's fair to their actual data — instead of one rule that's wrong for half your file."

**CTA:** Free at sohovi.com — a rule that ignores real exceptions in your data isn't strict, it's just wrong half the time.

---

### PV32 — Banking: Catch What Manual KYC Review Misses

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality banking", "kyc data quality check", "bank customer data cleansing", "data quality for financial services"
**Duration:** 2 minutes
**Dataset:** D (CustomerAccounts.csv)

**Hook:** "Your core-banking export has 400 customers. 32 are missing an email on file. 30 are duplicates from your last system merge. Nobody caught it — until now."

**[SCREEN: CustomerAccounts.csv open in Excel. Visible blank cells in kyc_status and email columns, a few rows with TEST-0000 account numbers.]**
NARRATION: "This is a normal shape for a bank's customer export — and it's full of exactly the kind of gaps that fail an audit."

**[SCREEN: Drop CustomerAccounts.csv onto Sohovi. Profiling completes. Column cards: kyc_status shows 10% null, customer_id shows duplicates, balance shows an outlier flagged at $999,999,999.99.]**
NARRATION: "Drop it into Sohovi. Profiling runs entirely in your browser — for a bank, that's not a nice-to-have. That's the whole point. Your raw customer data never touches a server."

**[SCREEN: PII banner appears: 'PII detected in 4 columns' — email, phone, full name, account_number flagged.]**
NARRATION: "Sohovi automatically flags every column that holds personal data — email, phone, name, account number — before you do anything else with this file."

**[SCREEN: Add rules: Completeness on kyc_status at 100%, Uniqueness on customer_id, Accuracy: balance > 0. Scope the balance rule to branch_country == US.]**
NARRATION: "Set the rules that actually matter for compliance: KYC status must be filled in, customer IDs must be unique, balances must be sane. Scope any rule to a specific branch or region if your policy varies by geography."

**[SCREEN: Run DQ Check. Score 58/100. Failed Records popup open on kyc_status — the BREAKING badge clicked, showing the exact 40 missing-KYC rows.]**
NARRATION: "Run it. 58 out of 100 — and a clickable list of exactly which 40 customers are missing KYC status, ready to hand to compliance."

**CTA:** Banking data doesn't get a second chance at "oops." Catch it before it leaves your hands — free at sohovi.com.

---

### PV33 — Healthcare: Combine Checks Before You De-Identify a Single Record

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality healthcare", "patient data quality check", "EHR data cleansing", "HIPAA data quality tool"
**Duration:** 2.5 minutes
**Dataset:** F (PatientIntake.csv)

**Hook:** "A patient record with a birth date after their admission date. A duplicate intake for the same patient. Any one of these is a shrug. Both, across a few hundred records, is a compliance problem waiting to happen."

**[SCREEN: PatientIntake.csv in Excel. Visible blank cells in phone and country, 15 duplicate patient_id rows at the bottom, malformed emails with '@@'.]**
NARRATION: "This is a normal hospital intake export — and it's exactly the shape of file that fails an audit if nobody checks it first."

**[SCREEN: Drop into Sohovi. Profiling completes entirely client-side. PII banner: 'PII detected in 5 columns'.]**
NARRATION: "For patient data, browser-only processing isn't a nice-to-have — it's the only way this file should be checked before it's cleared for research or reporting use."

**[SCREEN: Add rules: Completeness on phone (90%), Uniqueness on patient_id (100%), a cross-field rule: date_of_birth before admission_date.]**
NARRATION: "Combine three checks: a missing phone number doesn't block a follow-up call. The same intake isn't counted twice. And a patient born after they were admitted — which isn't a formatting issue, it's an impossible record — gets caught."

**[SCREEN: Run DQ Check. Score 63/100. Click BREAKING badge on the cross-field rule. Failed Records: 8 rows with birth dates after admission dates.]**
NARRATION: "Eight impossible records, isolated and ready to send back to whoever owns that intake system."

**[SCREEN: Switch to sohovi.com/tools/de-identify. Drop the same file. Direct identifiers auto-detected, quasi-identifiers separated. k-anonymity check: k = 4.]**
NARRATION: "Once the data itself is clean, de-identification actually means something. The free De-Identify tool gives you a k-anonymity number your IRB or compliance reviewer will actually ask for."

**CTA:** Clean first, then de-identify — free at sohovi.com.

---

### PV34 — Supply Chain: Stop Phantom Inventory Before It Costs You

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality supply chain", "inventory data accuracy", "warehouse data cleansing", "logistics data quality"
**Duration:** 2 minutes
**Dataset:** E (InventoryShipments.csv)

**Hook:** "Your warehouse system says you shipped -40 units last Tuesday. Nobody's going to notice that until a customer complains. Here's how to catch it first."

**[SCREEN: InventoryShipments.csv in Excel — a few quantity_on_hand cells visibly negative, supplier_name blank in several rows.]**
NARRATION: "Negative inventory. Missing suppliers. A shipment dated next year. This is a normal day for a warehouse management export."

**[SCREEN: Drop into Sohovi. Profiling: quantity_on_hand flags 15 outliers, ship_date flags 6 future-dated rows.]**
NARRATION: "Profiling finds the impossible values automatically — negative stock and future ship dates don't need a rule to be obviously wrong, but Sohovi flags them as outliers immediately."

**[SCREEN: Add Accuracy rule: quantity_on_hand > 0. Add Timeliness rule: ship_date not a future date. Add Uniqueness on shipment_id.]**
NARRATION: "Turn those into enforced rules: quantity can't be negative, ship dates can't be in the future, shipment IDs can't repeat."

**[SCREEN: Scope a rule to warehouse_country == US, with a description explaining a known feed lag for another region.]**
NARRATION: "If one warehouse's feed is less reliable than another, scope the rule to just that region — and write down why, so the next person doesn't have to ask."

**[SCREEN: Run check. Score 61/100. Click the BREAKING badge on quantity_on_hand. Failed Records shows the 15 negative-stock rows. Download CSV.]**
NARRATION: "Run it, click straight through to the 15 broken rows, download the list — and send it to whoever owns that warehouse feed."

**CTA:** Bad inventory data doesn't just cost money — it costs trust with every customer who ordered something you didn't actually have. Catch it free at sohovi.com.

---

### PV35 — Why Your Data Never Leaves Your Browser

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "browser based data quality tool", "privacy first data quality", "client side data processing"
**Duration:** 90 seconds
**Dataset:** A (CustomerDB.csv)

**Hook:** "Every other data quality tool asks you to upload your file to their servers. Sohovi doesn't — and you don't have to take our word for it."

**[SCREEN: Drag CustomerDB.csv onto Sohovi's upload zone. Cut immediately to browser dev-tools Network tab: filtered to 'file uploads' — zero entries.]**
NARRATION: "Open your browser's network tab before you upload anything. Watch it while you do. Zero file-upload requests — your raw rows are processed right here, in memory, in your browser."

**[SCREEN: Profiling and rules run normally. Score appears. Then a second screen: Run History tab showing past runs with scores and dates.]**
NARRATION: "To be precise about what is saved: your score, your rule results, and your run history persist so alerts and trend charts work across sessions — but never your actual rows. That's a meaningful distinction, not a technicality."

**[SCREEN: Text overlay: 'No customer PII on our servers. No breach of data you never sent us.']**
NARRATION: "For anyone under GDPR, HIPAA, or just a policy against sending customer data to a third party — there's no exposure to negotiate, because there's nothing sent in the first place."

**CTA:** Free at sohovi.com — verify it yourself, don't just believe it.

---

### PV36 — The Data Quality Tool Priced for Actual Small Teams

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "affordable data quality tool", "data quality tool pricing", "data quality tool for small business"
**Duration:** 90 seconds
**Dataset:** None

**Hook:** "Most data quality platforms want a sales call and a contract with five or six zeros on it. You don't have that budget. You also don't need to."

**[SCREEN: Pricing page. Three columns: Free / Pro / Business.]**
NARRATION: "Free isn't a trial here — it's a real, permanent tier: profiling, scoring, manual and AI-assisted rule building, all ten dimensions, forever, no card required."

**[SCREEN: Pro column highlighted: $29/month. List: unlimited assets and rules, 90-day history, automatic PII detection, alerts, workflows, PDF/Excel reports.]**
NARRATION: "Pro removes the ceiling for twenty-nine dollars a month — unlimited assets and rules, plus alerts, workflows, and exportable reports."

**[SCREEN: Business column highlighted: $59/month. List: Sandbox, remediation workflow, live connectors.]**
NARRATION: "Business, for teams running this in production, adds a Sandbox, guided remediation, and live connectors — fifty-nine dollars a month, not an enterprise contract."

**[SCREEN: Closing text: 'Try the real product free. Upgrade only when you hit a real ceiling.']**
NARRATION: "Start on the free plan and actually use the product. Upgrade only when you hit a real limit — not before."

**CTA:** Start free at sohovi.com — no credit card, no expiration.

---

### PV37 — Free Tools Worth Bookmarking

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "free pii scanner online", "free data de-identification tool", "compare two csv files free"
**Duration:** 2 minutes
**Dataset:** D (CustomerAccounts.csv) for PII Audit and Compare; F (PatientIntake.csv) for De-Identify

**Hook:** "You don't need a Sohovi account for these three — they're free, standalone, and worth bookmarking on their own."

**[SCREEN: sohovi.com/tools/pii-audit. Drop CustomerAccounts.csv. Result: 'Found: 380 emails, 372 phone numbers, 1 SSN' with masked example matches.]**
NARRATION: "The PII Scanner checks any file for emails, phone numbers, SSNs, credit cards, and even accidentally-included API keys — before you send it to a vendor or upload it anywhere else. The file never leaves your browser to find this out."

**[SCREEN: sohovi.com/tools/de-identify. Drop PatientIntake.csv. Auto-detected direct identifiers vs. quasi-identifiers. k-anonymity check: k = 3.]**
NARRATION: "De-Identify separates direct identifiers — name, email, phone — from quasi-identifiers like date of birth and city, which can re-identify someone in combination. Choose suppress, mask, or generalize per column. Get a k-anonymity number your IRB will actually ask for."

**[SCREEN: sohovi.com/tools/compare. Two files dropped: last month's and this month's export. Match key: customer_id. Four buckets: Only in A (12), Only in B (8), Changed (34), Unchanged (346).]**
NARRATION: "Compare reconciles two versions of the same data — what disappeared, what's new, what changed, and exactly which cell changed and to what. No more finding this by eye in Excel."

**CTA:** All three, free, no sign-up — at sohovi.com/tools.

---

## SECTION 4 — RESEARCH-DRIVEN TEAM/INDUSTRY DEEP DIVES (Round 2, 14 videos)

> **Where these came from:** `audience_pain_points_research.md` ranked all 14 team/industry segments by content gap crossed with data volume. PV38–PV45 are the top 8 of that ranking (SaaS & Tech and Analytics & BI first: highest data volume, thinnest existing coverage). PV46–PV51 complete the remaining 6 — lower priority only because existing coverage is already deeper there, not because the pain points are weaker. Each follows the same three-stage arc documented in the research doc: a Shorts/Reels-length "Stage 1" hook (not scripted here — see the research doc for the plain-language line, zero product mention) leads into the full "Stage 2" demo below.

### PV38 — SaaS & Tech: The Invoice Nobody Can Explain

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "usage based billing reconciliation", "saas invoice data quality", "reconcile usage events csv"
**Duration:** 2 minutes
**Dataset:** G (UsageEvents.csv + BillingInvoices.csv)

**Hook:** "Somewhere in your SaaS company, a customer's invoice doesn't match what they actually used this month — and finance is going to find out before engineering does."

**[SCREEN: sohovi.com/tools/compare. Drop UsageEvents.csv (summed by account) next to BillingInvoices.csv. Match key: account_id. Buckets: Only in A (2), Only in B (0), Changed (11), Unchanged (47).]**
NARRATION: "Drop this month's usage-events export next to the billing export — free, no account needed. Eleven accounts changed between what was used and what was billed."

**[SCREEN: Click a 'Changed' row. Side-by-side: summed usage = 4,820, billed_quantity = 3,100.]**
NARRATION: "This account used 4,820 units and got billed for 3,100. That's not a pricing bug — that's a metering pipeline that dropped events."

**[SCREEN: Upload UsageEvents.csv into the core app. Profiling flags 15 duplicate event_id values.]**
NARRATION: "Upload the raw events file and profiling finds the other half of the story — 15 duplicate event IDs, from a retry that logged the same action twice for a different set of accounts."

**[SCREEN: AI builder text box: 'flag accounts where billed quantity differs from summed usage by more than 5%'. Rule appears in the rule list.]**
NARRATION: "Type the check in plain English — AI Builder on Pro turns it into a running rule. Every invoice run from here on gets checked before it goes out, not after a customer disputes it."

**[SCREEN: DQ score panel, 74, with a trend line labeled 'billing accuracy — last 6 cycles'.]**
NARRATION: "Save it as a Workflow and watch the trend line every billing cycle — catching this before the invoice sends, not after the support ticket."

**CTA:** Start free at sohovi.com — the reconciliation check above needs no account at all.

---

### PV39 — Analytics & BI: Same CSV, Two Dashboards, One Liar

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "why do my dashboards disagree", "tableau power bi different numbers", "data quality before dashboard"
**Duration:** 2 minutes
**Dataset:** H (MetricsExtract.csv)

**Hook:** "Two teams built a dashboard off the exact same export, and they don't agree on a single number. One of them is wrong — and it's not because anyone made a mistake in the tool."

**[SCREEN: Upload MetricsExtract.csv. Profiling runs. Column card for 'region': '3 unique-looking values collapse to 1: US / United States / us'.]**
NARRATION: "Same file, same warehouse pull — but the region column has three spellings of the same country. Group by region in one dashboard, and the US total silently splits into three rows instead of one."

**[SCREEN: Column card for 'active_flag': 'Null in 41 rows (10.3%)'.]**
NARRATION: "The active-user column is blank in one row out of ten. Depending on how a query treats null — excluded, or counted as false — that's a different active-user count in every report that touches this file."

**[SCREEN: AI rule suggestion panel: 'Suggested: Consistency rule — standardize region values before aggregation'. Click Accept.]**
NARRATION: "AI rule suggestions on Pro catch this without anyone having to notice it by eye first — it's already flagged as a Consistency issue before you write a single rule."

**[SCREEN: DQ score jumps from 61 to 89 after the rule runs. Breaking-records badge: 41 clickable rows.]**
NARRATION: "Score goes from 61 to 89 the moment the field is standardized. Every one of the 41 affected rows is one click away to download, so whoever built the wrong dashboard can see exactly which rows moved their number."

**CTA:** Free to try at sohovi.com — profile the extract before the next dashboard argument, not after.

---

### PV40 — Consulting: One Score, Every Consultant

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "consulting firm data quality standard", "client deliverable data quality", "standardize data quality across team"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv — "the inherited client file")

**Hook:** "A partner scopes the deal. A first-year associate does the work. The client isn't supposed to be able to tell the difference — but usually can."

**[SCREEN: Split screen. Left: 'Partner' logs in, uploads CustomerDB.csv, opens a saved Workflow. Right: 'Associate' logs in separately, uploads the same file, opens the same Workflow.]**
NARRATION: "Same client file. Two different people on the team, months apart. Both open the same saved rule Workflow instead of starting from a blank spreadsheet."

**[SCREEN: Both sides run the check. Both land on DQ score: 62. Same breaking-records count: 87.]**
NARRATION: "Both land on the same score, the same 87 breaking records — because the standard isn't in either person's head. It's in the Workflow."

**[SCREEN: Score transparency panel expanded: column-by-column breakdown, identical on both sides.]**
NARRATION: "The score-transparency panel means neither of them has to explain *why* it's a 62 from memory — the breakdown is the explanation, and it travels with the account."

**[SCREEN: PDF export button. Report titled 'Data Quality Audit — [Client Name] — Q2'.]**
NARRATION: "Export it as a PDF and it becomes part of the deliverable — a documented, repeatable quality bar, not a subjective 'looks clean to me.'"

**CTA:** Build the Workflow once at sohovi.com — every consultant after that opens the same standard, not a blank sheet.

---

### PV41 — Finance & Banking: Why 95% of Your AML Alerts Are Noise

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "aml false positive data quality", "sanctions screening data quality", "reduce transaction monitoring alerts"
**Duration:** 2.5 minutes
**Dataset:** J (TransactionMonitoring.csv)

**Hook:** "Most transaction-monitoring alerts your team closes out today aren't fraud — they're formatting. And that's a data problem, not a model problem."

**[SCREEN: Upload TransactionMonitoring.csv. Profiling flags 'customer_name': pattern inconsistency — 3 distinct formats detected ('Last, First' / 'First Last' / 'Initial. LAST').]**
NARRATION: "Before a single transaction is reviewed, profiling already sees the real problem: the same customer's name is written three different ways across this feed."

**[SCREEN: Filter view: rows where flag_reason = 'watchlist_match', cross-referenced against the name-format flag. Most flagged rows have a malformed name.]**
NARRATION: "Cross-reference that against which rows actually got flagged as a watchlist match, and the pattern is obvious on screen — the malformed names are over-represented in the alert queue. The matching engine isn't failing. The input is."

**[SCREEN: Column card for 'date_of_birth': 'Missing in 53 rows (15.1%)'.]**
NARRATION: "Add a missing date of birth on top of a misformatted name, and a screening engine has almost nothing solid to match against — that's how one real customer generates three false alerts."

**[SCREEN: AI builder: 'flag rows where customer_name doesn't match a standard Last, First pattern'. Sandbox badge next to the rule (Business).]**
NARRATION: "Write the standardization check in plain English, and test it in the Sandbox on Business before it touches a live monitoring feed — this is exactly the kind of change you want to prove out on a copy first."

**[SCREEN: DQ score before/after: 54 → 88. Caption: 'Same alerts. Cleaner names. Fewer false positives, hypothetically — score reflects the input data, not alert outcomes.']**
NARRATION: "The score measures the input feeding your monitoring system — not a guarantee about alert volume. It's a direct, defensible read on how much noise is coming from the data itself before anyone retunes the model."

**CTA:** Free to profile a sample feed at sohovi.com — the Sandbox and connectors above are on the Business plan.

---

### PV42 — Logistics & Supply Chain: Why Your Freight Bill Never Matches the TMS

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "freight invoice audit", "accessorial charge audit", "reconcile tms and carrier invoice"
**Duration:** 2 minutes
**Dataset:** I (TMSShipments.csv + CarrierInvoice.csv)

**Hook:** "Somewhere on this month's freight invoice is a charge for a shipment that, according to your own TMS, never needed it."

**[SCREEN: sohovi.com/tools/compare. Drop TMSShipments.csv next to CarrierInvoice.csv. Match key: shipment_id. Bucket 'Changed (20)' highlighted.]**
NARRATION: "Free reconciliation, no login — match the TMS shipment record against the carrier's invoice lines by shipment ID."

**[SCREEN: Click a changed row. TMS: accessorial_type = none. Invoice: charge_type = detention, amount = $340.]**
NARRATION: "The TMS says this shipment had no accessorial charge. The invoice bills $340 in detention anyway. That's the single highest-error category in freight billing, sitting right there in a downloadable row."

**[SCREEN: Upload CarrierInvoice.csv into the core app. Uniqueness rule flags 10 duplicate shipment_id rows.]**
NARRATION: "Ten shipments are billed twice under the same ID — a Uniqueness rule catches the double-bill in the same pass."

**[SCREEN: Remediation flow (Business): 'Export disputed lines' button. Downloaded file: 30 rows, $3,200 total.]**
NARRATION: "Export just the disputed lines — thirty rows, roughly $3,200 — as the exact packet to send back to the carrier, instead of re-auditing the whole invoice by eye."

**CTA:** The reconciliation check is free at sohovi.com/tools — remediation export shown above is on the Business plan.

---

### PV43 — Healthcare: The Interoperability Gap

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "reconcile patient records between ehr systems", "duplicate patients across clinics", "hipaa safe patient data comparison"
**Duration:** 2.5 minutes
**Dataset:** K (PatientPanelClinicA.csv + PatientPanelClinicB.csv)

**Hook:** "Two clinics in the same referral network each think this patient belongs only to them. They're both right, and that's the problem."

**[SCREEN: sohovi.com/tools/compare. Drop PatientPanelClinicA.csv next to PatientPanelClinicB.csv. Match attempted on patient_id — bucket 'Only in A (110), Only in B (110)' — a near-total mismatch.]**
NARRATION: "Matched on patient ID alone, these two clinics look like they share almost no patients — because each EHR assigns its own ID. That's not the real overlap."

**[SCREEN: Re-match on full_name + date_of_birth. Buckets update: 'Changed (15), Unchanged (25)' — 40 real shared patients surface.]**
NARRATION: "Re-match on name and date of birth instead, entirely in the browser. Forty shared patients appear — fifteen of them with a reformatted name or a differently-formatted birth date between the two systems."

**[SCREEN: sohovi.com/tools/de-identify. Drop the merged shared-patient list. k-anonymity check: k = 5. Toggle 'Safe Harbor (year-only dates)' vs 'k-anonymity (tunable)'.]**
NARRATION: "Once the panels are reconciled, de-identify the shared list before sharing it across the referral network. This tool's tunable k-anonymity keeps more analytical detail than blunt Safe Harbor date-stripping, while still passing a k-anonymity check."

**[SCREEN: Closing frame: 'Nothing above ever left this browser tab.']**
NARRATION: "Two EHRs, one reconciled and de-identified patient list — and no PHI ever left this browser tab to get there."

**CTA:** Both tools are free and require no sign-up — at sohovi.com/tools.

---

### PV44 — Non-profit: The Board Report That Almost Had the Wrong Number

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "nonprofit donor data quality", "grant reporting data accuracy", "free data quality tool for nonprofits"
**Duration:** 2 minutes
**Dataset:** L (DonorGrantTracker.csv)

**Hook:** "The spreadsheet has been passed between the ED, the bookkeeper, and the program lead all quarter. Nobody's sure the number in it is still right — and it's due to the funder Friday."

**[SCREEN: Upload DonorGrantTracker.csv (Free plan, no card). Profiling flags donor_name: '12 likely duplicate donors detected (nickname/spelling variants)'.]**
NARRATION: "Upload the tracker on the free plan — no card, no IT setup. Profiling alone catches twelve donors who are really the same person under a slightly different name."

**[SCREEN: AI builder: 'flag grant programs where total time allocation exceeds the approved budget'. Rule created, 10 rows flagged.]**
NARRATION: "Type the one rule that actually matters in plain English, and it catches ten rows where a program's reported time allocation has drifted past what was actually approved."

**[SCREEN: DQ score: 57, with each flagged row clickable and downloadable.]**
NARRATION: "Every one of those rows is a click away to check before Friday — not a funder finding it after the report's already out."

**[SCREEN: Closing text: 'Free tier. No dedicated data person required.']**
NARRATION: "No database platform to buy, no data hire to make — just the free tier, run before the report ships."

**CTA:** Start free at sohovi.com — no card, no expiration, built for exactly this.

---

### PV45 — E-commerce: Catch the SKU Before Amazon Suspends You

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "sku sync across amazon shopify walmart", "multichannel inventory reconciliation", "prevent amazon listing suspension"
**Duration:** 2 minutes
**Dataset:** M (AmazonListings.csv + ShopifyListings.csv + WalmartListings.csv)

**Hook:** "Somewhere in your catalog right now, the same SKU has three different stock counts across three channels — and one of them is about to get you suspended, not just oversold."

**[SCREEN: sohovi.com/tools/compare. Drop AmazonListings.csv next to ShopifyListings.csv. Match key: sku. Bucket 'Changed (9)'.]**
NARRATION: "Free reconciliation, no login — match this week's Amazon export against Shopify by SKU. Nine SKUs already disagree on quantity available."

**[SCREEN: Run a second compare: AmazonListings.csv vs WalmartListings.csv. Click a changed row: qty 42 vs qty 6.]**
NARRATION: "Same SKU, forty-two units on one channel, six on another — a one-hour sync delay is all it takes to get there, and it's exactly the gap that causes a double-sell."

**[SCREEN: Upload AmazonListings.csv into the core app. Validity rule flags 'gtin: 8 rows blank or malformed'.]**
NARRATION: "Upload the feed file itself and a Validity rule catches eight rows with a missing or malformed GTIN — the exact kind of attribute error that gets a listing silently suppressed, with no notification."

**[SCREEN: DQ score panel: 'Day-before score: 68 — 9 drifted SKUs, 8 malformed GTINs, all downloadable.']**
NARRATION: "Catch this the day before the sync push, not the day after the suspension email — every flagged row is one click away to download and fix."

**CTA:** Start free at sohovi.com — reconciliation above needs no account at all.

---

### PV46 — Marketing Agencies: The Pitch-Call Data Audit

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "agency data audit pitch", "prove data quality to a client", "rfp data quality differentiator"
**Duration:** 90 seconds
**Dataset:** A (CustomerDB.csv, framed as "a prospect's own exported list")

**Hook:** "Before you sign an NDA, before you sign a contract — you can still show a prospect exactly how good you are at this, live, on the call."

**[SCREEN: Discovery-call mockup. Prospect shares their screen; agency rep drags the prospect's own CustomerDB.csv into sohovi.com.]**
NARRATION: "No data-sharing agreement needed for this part — drag the prospect's own exported list in, right there on the call."

**[SCREEN: DQ score appears: 54, in under 10 seconds.]**
NARRATION: "A score in under ten seconds, on their real data, not a canned demo file."

**[SCREEN: Click one breaking record — a duplicate contact highlighted in red.]**
NARRATION: "Click through to one actual duplicate in their list. That's the moment a generic capability deck can't produce."

**[SCREEN: Closing text: 'Nothing above ever left this browser tab.']**
NARRATION: "And the reason there's no NDA required: none of it ever left this browser tab."

**CTA:** Free to run live on any call — at sohovi.com, no sign-up required for the prospect's file.

---

### PV47 — E-commerce & Product: The Launch Nobody Signed Off On

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "product launch data quality check", "catalog data validation before launch", "cross functional product data"
**Duration:** 2 minutes
**Dataset:** N (ProductCatalogHandoff.csv)

**Hook:** "This product page went live with a missing size and a $0.00 price — and it passed through four teams on the way there."

**[SCREEN: Upload ProductCatalogHandoff.csv. Profiling flags 'size: 10 apparel rows missing (required for this category)'.]**
NARRATION: "Scope the Completeness rule to just the apparel category — size doesn't matter for electronics, but it's a launch-blocker here. Ten rows fail immediately."

**[SCREEN: Validity rule card: 'price: 6 rows at $0.00 or negative'.]**
NARRATION: "A Validity rule catches the malformed prices in the same pass — the kind of error a spreadsheet formula would silently accept."

**[SCREEN: AI builder prompt: 'flag products missing a required attribute for their category'. Sandbox badge (Business) next to the test run.]**
NARRATION: "Type the actual launch-readiness check in plain English, and test it in the Sandbox on Business against this sample sheet before it's ever applied to the real import."

**[SCREEN: DQ score: 71, breaking records badge showing all 3 planted errors (missing size, bad price, duplicate SKU) as one downloadable list.]**
NARRATION: "One number, one downloadable list — merchandising and engineering are looking at the same evidence instead of two different spot-checks."

**CTA:** Free to profile the handoff sheet at sohovi.com — Sandbox shown above is on the Business plan.

---

### PV48 — Finance & Compliance: The Month-End Diff

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "duplicate vendor payment", "month end close reconciliation", "ap ledger data quality"
**Duration:** 2 minutes
**Dataset:** O (APExportMonth1.csv + APExportMonth2.csv)

**Hook:** "Somewhere in this month's AP export is a vendor who already got paid last month — under a different vendor ID."

**[SCREEN: sohovi.com/tools/compare. Drop APExportMonth1.csv next to APExportMonth2.csv. Match key: vendor_name + amount. Bucket 'Changed (8)'.]**
NARRATION: "Free reconciliation, no login — match both months by vendor name and amount instead of vendor ID, since that's exactly where the duplicate is hiding."

**[SCREEN: Click a changed row: same vendor_name, same amount, invoice_date four days apart, two different vendor_id values.]**
NARRATION: "Same vendor, same amount, four days apart, two different vendor IDs — invoice-matching controls built on vendor ID alone would never catch this."

**[SCREEN: AI builder: 'flag invoices with the same vendor and amount within 5 days'. Rule created.]**
NARRATION: "Turn that exact check into a plain-English rule so it runs automatically on next month's export instead of needing another manual diff."

**[SCREEN: PDF report export (Pro): 'Month-End Data Quality Control — [Period]'.]**
NARRATION: "Export it as a PDF and it's not just a fixed number for the auditor — it's documentation that the control existed."

**CTA:** The reconciliation check is free at sohovi.com/tools — PDF export shown above is on the Pro plan.

---

### PV49 — Marketing & Revenue Ops: Will This List Survive Customer Match?

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "customer match upload rate", "clean email list before campaign", "validate marketing list before upload"
**Duration:** 90 seconds
**Dataset:** A (CustomerDB.csv)

**Hook:** "Before you upload this list to Google or Meta, here's exactly which rows are about to fail to match — and why."

**[SCREEN: Upload CustomerDB.csv. Profiling flags 'phone: 20 rows invalid format (N/A, 00000000000)', 'email: 70 rows blank'.]**
NARRATION: "Malformed phone numbers and blank emails don't just look messy — they're rows that silently fail to match at the ad platform, quietly shrinking your audience."

**[SCREEN: Validity + Consistency rule pair applied. Breaking records: 90 rows highlighted.]**
NARRATION: "A Validity rule on phone format and a Consistency rule on casing catch every one of them before the file ever reaches an upload screen."

**[SCREEN: Export cleaned file. Caption: '550 rows in → 460 rows that will actually match.']**
NARRATION: "Export the list that will actually match — instead of finding out your match rate slipped, again, after the campaign already launched."

**CTA:** Free at sohovi.com — check a list before every upload, not after.

---

### PV50 — HR & People Operations: The Payroll Handoff Test

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "new hire payroll error", "hris payroll reconciliation", "hr data quality check"
**Duration:** 2 minutes
**Dataset:** C (EmployeeDir.csv) + P (PayrollRegister.csv)

**Hook:** "Catch the paycheck error before it's on the paycheck — not after someone messages HR about it."

**[SCREEN: sohovi.com/tools/compare. Drop EmployeeDir.csv next to PayrollRegister.csv. Match key: employee_id. Bucket 'Changed (6)'.]**
NARRATION: "Free reconciliation, no login — match this cycle's HRIS export against the payroll register for just the new hires."

**[SCREEN: Click a changed row: pay_group mismatch flagged; a second view shows tax_form_on_file = false for 4 of the same rows.]**
NARRATION: "Six people with a pay-group mismatch, four of them also missing a tax form on file — the exact combination that produces a wrong first paycheck."

**[SCREEN: AI builder: 'flag employee IDs appearing under more than one establishment'. Rule created, EEO-1-relevant.]**
NARRATION: "The same plain-English approach catches the EEO-1 double-count risk — an employee ID appearing under more than one establishment."

**[SCREEN: Workflow saved: 'Run automatically every pay cycle' toggle (Pro).]**
NARRATION: "Save it as a Workflow so it reruns automatically every pay cycle — before the run fires, not after the complaint."

**CTA:** The reconciliation check is free at sohovi.com/tools — the Workflow shown above is on the Pro plan.

---

### PV51 — Freelancers & Consultants: The 10-Minute Scope-Creep Save

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "client data worse than expected", "freelance data audit scope creep", "change order data quality evidence"
**Duration:** 90 seconds
**Dataset:** A (CustomerDB.csv, framed as "the client's file")

**Hook:** "The client said it was 'mostly fine.' The clock started twenty minutes ago. It is not mostly fine."

**[SCREEN: Upload CustomerDB.csv (Free plan). DQ score: 38.]**
NARRATION: "Free plan, no card — the score alone turns 'trust me, it's bad' into a number the client can see for themselves."

**[SCREEN: Breaking records badge: '4,200+ rows flagged' — click to preview a handful.]**
NARRATION: "Over four thousand flagged rows — not a vague complaint, a specific, checkable count."

**[SCREEN: Score-transparency panel, screenshotted directly into a draft email titled 'Scope Update'.]**
NARRATION: "Screenshot the transparency panel straight into a change-order email — messiness becomes evidence the client signs off on in the same call, not a negotiation later."

**CTA:** Free at sohovi.com — profile the file before you lock the fixed fee, not after.

---

---

## SECTION 5 — STAGE-1 SHORTS / REELS (Round 2, 18 videos)

> **What these are:** the "informational" stage of the three-stage arc from `audience_pain_points_research.md` — a symptom, in the viewer's own language, with **no Sohovi product shown and no sign-up push.** Someone doesn't yet know this has a name, let alone that a tool exists for it; the job of these 18 is purely "wait, that's literally my problem," so they work as stand-alone shorts even if the viewer never clicks through. Each one closes with a soft pointer to the matching Stage-2 tutorial (PV38–PV51) rather than a hard CTA. Tier-1 segments (highest data volume) get 2 each; Tier-2 segments get 1; Non-profit is the one Tier-3 exception, per the channel-allocation table in the research doc.

### PV52 — SaaS & Tech (A): The Invoice That Doesn't Add Up

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "usage based billing wrong", "saas invoice doesn't match usage"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why doesn't this customer's invoice match what they actually used this month?"

**[SCREEN: Text-on-screen over a plain invoice graphic — 'Billed: 3,100 units. Actually used: 4,820 units.']**
NARRATION: "If you charge by usage, this happens more than anyone admits — the metering pipeline drops or double-counts events under load, so the bill is wrong before pricing logic even runs."

**[SCREEN: Text — 'Usually, the customer notices first. In a support ticket.']**
NARRATION: "And it's rarely caught internally first — it shows up as a dispute."

**CTA:** How to catch this before the invoice sends — full breakdown linked in bio.

---

### PV53 — SaaS & Tech (B): Two Systems, Two Different Answers

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "crm and billing system out of sync", "why do my connected tools disagree"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why do two tools that are supposed to sync automatically always end up disagreeing?"

**[SCREEN: Text — 'CRM says: Active. Billing system says: Cancelled.']**
NARRATION: "Two-way syncs can't always agree on whose timestamp is the real one, so the same account looks different depending on which screen you're staring at."

**[SCREEN: Text — 'It doesn't fail loudly. It just quietly drifts.']**
NARRATION: "Nothing breaks — it just drifts, for weeks, until enough support tickets pile up that somebody finally checks."

**CTA:** How to catch the drift before customers do — full breakdown linked in bio.

---

### PV54 — Analytics & BI (A): Same Data, Two Dashboards, Different Answers

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "why do my dashboards disagree", "tableau power bi different numbers"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why do Tableau and Power BI show two different numbers for what's supposed to be the exact same metric?"

**[SCREEN: Text — two dashboard mockups side by side, same title, different number.]**
NARRATION: "Same warehouse, same metric name — but different refresh timing, filters, or how each tool treats a blank value, and suddenly nobody agrees on 'active users.'"

**[SCREEN: Text — 'Everyone assumes it's a tool problem. It's almost never the tool.']**
NARRATION: "It's not Tableau's fault, and it's not Power BI's — it's whatever's underneath both of them."

**CTA:** How to find which one's actually wrong — full breakdown linked in bio.

---

### PV55 — Analytics & BI (B): The Test Suite That Missed the One That Mattered

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "dbt tests passing wrong numbers", "data quality tests missed the bug"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why did a passing test suite not catch the number that was actually wrong?"

**[SCREEN: Text — 'Tests passing: ✔ ✔ ✔ ✔. Report: still wrong.']**
NARRATION: "A green test suite only proves the data matches the rules someone thought to write — not the ones nobody thought of yet."

**[SCREEN: Text — 'The bug wasn't in a column. It was in the logic connecting two of them.']**
NARRATION: "The break was never in one column — it was in how two columns related to each other, and nobody had written a test for that."

**CTA:** How to catch the rule nobody thought to write — full breakdown linked in bio.

---

### PV56 — Consulting: One Team, Two Different Standards

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "consulting deliverable quality inconsistent", "client notices quality drop consultant"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why does the quality of the work change depending on which person on the team actually touches the account?"

**[SCREEN: Text — 'Partner scopes it. Associate delivers it. Client notices the gap.']**
NARRATION: "The partner sells the engagement. A junior associate does the actual work. And 'clean enough' means something different to each of them."

**[SCREEN: Text — 'The client can always tell. They just don't always say so.']**
NARRATION: "Clients rarely say it out loud — they just quietly stop trusting the next deliverable as much as the first one."

**CTA:** How to make the quality bar the same no matter who's on it — full breakdown linked in bio.

---

### PV57 — Finance & Banking (A): Almost All of It Is Noise

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "aml alerts false positive", "why are our fraud alerts always nothing"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why do almost all of our fraud and AML alerts turn out to be nothing?"

**[SCREEN: Text — 'Alerts reviewed this week: 400. Actually fraud: single digits.']**
NARRATION: "Teams treat this as a model problem and retune the thresholds. It's usually not the model."

**[SCREEN: Text — 'Same person. Three name spellings. Three separate alerts.']**
NARRATION: "It's the same customer's name written three different ways across three systems — the matching engine isn't wrong. The input just gives it nothing solid to match."

**CTA:** Why this is a data problem, not a model problem — full breakdown linked in bio.

---

### PV58 — Finance & Banking (B): The Customer Everyone's Already Reviewed

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "duplicate customer review kyc", "same customer reviewed twice bank"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why does the same customer get reviewed by three different analysts who have no idea about each other?"

**[SCREEN: Text — 'KYC platform. Core banking. Transaction monitoring. Three different customer IDs. One actual person.']**
NARRATION: "Three systems, three IDs, and nothing links them — so three analysts each spend time reviewing a person someone else already cleared."

**[SCREEN: Text — 'Nobody's slow. The systems just don't talk.']**
NARRATION: "It's not a productivity problem. It's a silo problem wearing a productivity costume."

**CTA:** How to find the same person under three different IDs — full breakdown linked in bio.

---

### PV59 — Logistics & Supply Chain (A): The Count That Doesn't Match

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "warehouse inventory count wrong", "3pl inventory discrepancy"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why doesn't our warehouse count ever quite match what the system says we're supposed to have?"

**[SCREEN: Text — 'System of record: 1,200 units. Physical count: 1,140 units.']**
NARRATION: "A lot of that gap isn't theft or error — it's kilograms on one system and pieces on another, plus a manual end-of-shift count nobody double-checks."

**[SCREEN: Text — 'It usually gets booked as shrinkage. It's usually not shrinkage.']**
NARRATION: "The easiest explanation — shrinkage — is usually the wrong one."

**CTA:** How to tell a unit mismatch from real shrinkage — full breakdown linked in bio.

---

### PV60 — Logistics & Supply Chain (B): The Charge That Was Never Supposed to Be There

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "freight bill wrong charge", "accessorial charge dispute"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why did the freight bill include a charge for something that, according to our own system, never happened?"

**[SCREEN: Text — 'TMS record: no accessorial charge. Carrier invoice: $340 detention fee.']**
NARRATION: "Accessorial charges — detention, liftgate, fuel surcharge — are the single highest-error category on a freight invoice, and most teams never check them against their own shipment record."

**[SCREEN: Text — 'Multiply one $340 charge by a year of shipments.']**
NARRATION: "One charge is easy to miss. A year of them is real money quietly leaving through invoices nobody audited line by line."

**CTA:** How to catch it in one comparison — full breakdown linked in bio.

---

### PV61 — Healthcare (A): Same Patient, Two Clinics, Two People

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "duplicate patient records between clinics", "ehr interoperability patient match"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why do two clinics in the same referral network think this is two different patients?"

**[SCREEN: Text — 'Clinic A: Patient #4021. Clinic B: Patient #8890. Same person.']**
NARRATION: "Each EHR assigns its own patient ID — so two clinics treating the same referred patient can both be right and still completely disagree."

**[SCREEN: Text — 'A slightly different spelling. A different date format. That's all it takes.']**
NARRATION: "A nickname instead of a full name, or a birth date written the other way round, is enough to make the match invisible to both systems."

**CTA:** How to reconcile it without either system sharing raw data — full breakdown linked in bio.

---

### PV62 — Healthcare (B): The Bill That Got Denied for the Wrong Reason

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "medical billing data entry error", "claim denied data error not clinical"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why do so many medical bills get denied over something that was never actually a clinical mistake?"

**[SCREEN: Text — 'Denial reason: transposed insurance ID. Clinical care: correct.']**
NARRATION: "A huge share of claim denials trace back to a transposed ID or a missing code — not to anything that happened in the room with the patient."

**[SCREEN: Text — 'The care was right. The paperwork wasn't.']**
NARRATION: "The clinical work was fine. It's the data entry between the visit and the claim that cost the practice the payment."

**CTA:** How to catch the entry error before submission — full breakdown linked in bio.

---

### PV63 — E-commerce (A): The Suspension Nobody Saw Coming

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "amazon listing suspended suddenly", "why did my amazon listing get suppressed"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why did Amazon suspend a listing we didn't even know had a problem?"

**[SCREEN: Text — 'Missing field: GTIN. Result: listing suppressed. Notification: none.']**
NARRATION: "One missing or malformed product ID is enough to get a listing silently suppressed — and the marketplace doesn't always tell you why, or even that it happened."

**[SCREEN: Text — 'By the time you notice, you've already lost the sales.']**
NARRATION: "The first sign is usually a sales drop, not a warning."

**CTA:** How to catch it a day before it happens — full breakdown linked in bio.

---

### PV64 — E-commerce (B): Sold Twice, Shipped Once

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "oversold inventory multiple channels", "sku out of sync amazon shopify"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why did we sell the same item twice during our biggest sale of the year?"

**[SCREEN: Text — 'Amazon: 6 in stock. Shopify: 42 in stock. Same SKU.']**
NARRATION: "The moment a second sales channel gets added, the same SKU can carry two different stock counts — and a one-hour sync delay is all it takes to double-sell during peak."

**[SCREEN: Text — 'The penalty isn't just a refund. It's a suspension risk.']**
NARRATION: "Marketplaces don't just refund the customer — they can penalize the account for the cancellation that follows."

**CTA:** How to catch the drift before the next sync push — full breakdown linked in bio.

---

### PV65 — Non-profit: The Number That Almost Went to the Funder Wrong

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "nonprofit donor count wrong", "grant report data error"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why doesn't our donor count ever quite match between the spreadsheet and the database?"

**[SCREEN: Text — 'Same donor. Two names: "Bob Smith" and "Robert Smith." Counted twice.']**
NARRATION: "A donor under a nickname and a nonprofit under their legal name look like two people to a spreadsheet — and that inflates exactly the number a board or funder is going to ask about."

**[SCREEN: Text — 'The tracking sheet's been passed between three people all quarter.']**
NARRATION: "By the time the report is due, nobody's fully sure the number in it is still the real one."

**CTA:** How to check it before it goes to the funder — full breakdown linked in bio.

---

### PV66 — Marketing Agencies: The Error the Client Found First

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "client caught error in agency report", "agency reporting mistake"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why did the client spot the error in our report before we did?"

**[SCREEN: Text — 'Five platforms. Five manual pulls. One typo, copied straight into the deck.']**
NARRATION: "Reports built from five manual platform pulls are five separate chances for a miscopied number — and clients read their own numbers a lot more closely than we assume."

**[SCREEN: Text — 'One wrong number costs more trust than the whole report earned.']**
NARRATION: "It only takes one to make a client wonder what else might be off."

**CTA:** How to catch it before the report sends — full breakdown linked in bio.

---

### PV67 — E-commerce & Product: The Launch Nobody Signed Off On

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "product launched with missing data", "catalog error before launch"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "How did we launch a product page with a missing price and nobody caught it?"

**[SCREEN: Text — 'Engineering → Marketing → Legal → Sales. No checkpoint. Live storefront.']**
NARRATION: "A launch passes through four or five teams over email and spreadsheets, and not one step is actually gated — so an incomplete record reaches real customers."

**[SCREEN: Text — 'It surfaces in the returns queue. Not in QA.']**
NARRATION: "The first place it gets caught is usually the returns queue, not the review step that was supposed to catch it."

**CTA:** How to gate the handoff before launch — full breakdown linked in bio.

---

### PV68 — Finance & Compliance: Paid Twice, Under Two Different Names

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "duplicate vendor payment", "ap invoice paid twice"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why did we almost pay the same vendor invoice twice?"

**[SCREEN: Text — 'Vendor master: "Acme Corp" and "Acme Corporation." Two IDs. One vendor.']**
NARRATION: "The same vendor entered twice under two IDs is invisible to a matching control built on vendor ID — it just looks like two normal, unrelated payments."

**[SCREEN: Text — 'It's not fraud. It's a vendor master problem.']**
NARRATION: "Nobody did anything wrong — the vendor list itself just has the same company listed twice."

**CTA:** How to catch it before the payment run — full breakdown linked in bio.

---

### PV69 — Marketing & Revenue Ops: Fewer Matches, Same List

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "customer match rate declining", "why is my ad audience match rate dropping"
**Duration:** 30 seconds
**Dataset:** None

**Hook:** "Why do Google and Meta keep matching fewer of the customers I upload — even though I didn't change the list?"

**[SCREEN: Text — 'Same list. Match rate last quarter: 61%. This quarter: 43%.']**
NARRATION: "It's rarely the list getting worse — it's inconsistent formatting, casing, and partial rows that were always there, just quietly costing you match rate the platform never explains."

**[SCREEN: Text — 'The ad platform won't tell you which rows failed. Or why.']**
NARRATION: "You get a percentage. You don't get the reason."

**CTA:** How to check a list before you upload it — full breakdown linked in bio.

---

## SECTION 6 — DATA PROFILING SPOTLIGHT (Round 3, 5 videos)

> **Why this section exists:** Data Profiling is free on every Sohovi plan, including Free — no rule, no setup, the lowest-friction thing in the entire product to lead with. But across the other 69 videos, profiling only ever shows up as a stepping stone toward a full rules-and-monitoring flow (PV32/33/34, PV38–51) or as a generic, industry-agnostic mechanic (PV16–19). Nothing treats profiling alone as the hero for a specific team's data — that's the gap these 5 fill. **All 5 are strictly profiling-only:** no rule gets fully built, each just teases "one click away" at the end, so the free feature does the entire job of convincing. Each reuses a dataset already prepped in the Test Data Setup Guide — no new dataset work needed — and each leads with a different mechanic (outliers + pattern drift, completeness + the DQ Glossary, PII + duplicates, Scope Filter, category-scoped completeness) so none of the 5 feel like the same video reskinned. A natural future extension — not built here — would be a matching set of Stage-1, no-product Shorts feeding into these, the same way PV52–69 feed PV38–51.

---

### PV70 — Finance: The Report That's Wrong Before Anyone Touched a Formula

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "profile financial data before reporting", "data profiling for finance teams", "find errors in revenue data automatically"
**Duration:** 110 seconds
**Dataset:** B (SalesQ1.csv)

**Hook:** "Before anyone builds a formula, a pivot table, or a single chart off this revenue file — here's what's already wrong with it."

**[SCREEN: Drag SalesQ1.csv onto Sohovi's upload zone. Profiling dashboard loads in under 2 seconds. Column cards for order_id, customer_name, email, amount, date, region.]**
NARRATION: "This is Data Profiling — free on every Sohovi plan, including Free. No rule, no setup, no formula. Just drop the file in."

**[SCREEN: Click 'amount'. Outliers tab: 10 values highlighted red, all negative, ranging down to -$250. Note: 'Flagged using IQR — the interquartile range.']**
NARRATION: "Ten negative transactions, flagged automatically using IQR — not a simple average, which would've let a handful of negative numbers hide inside a total that still looks fine. Ten rows that shouldn't exist in a revenue column, found before anyone built a report on top of them."

**[SCREEN: Click 'region'. Value Distribution panel: 'US' 140 rows, 'USA' 22 rows, 'CA' 18 rows, 'califronia' 1 row, blank 15 rows.]**
NARRATION: "And the region column has five different ways of saying two or three real regions — including a plain typo. Group your next report by region as-is, and 'US' quietly splits into three separate bars instead of one."

**[SCREEN: Click 'customer_name'. Stats panel: '15 rows blank'.]**
NARRATION: "Fifteen rows with no customer name at all — revenue attributed to nobody, which means it's not attributed to anyone's sales number either."

**[SCREEN: Text card: 'Every one of these becomes a rule in one click.']**
NARRATION: "None of this needed a rule to find. Profiling caught it the moment the file landed — and turning any of it into a rule that runs on every future export is one click away."

**CTA:** Profiling is free, no card, at sohovi.com — see what's actually in your next export before you build anything on it.

---

### PV71 — HR: What This Cycle's New-Hire Sheet Isn't Telling You

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "hr data quality check", "new hire data errors", "data profiling for hr teams"
**Duration:** 100 seconds
**Dataset:** P (PayrollRegister.csv)

**Hook:** "The new-hire handoff sheet looks fine. Twenty rows, nothing obviously broken. Profiling disagrees."

**[SCREEN: Drag PayrollRegister.csv onto Sohovi. Profiling loads instantly. Column cards: employee_id, pay_group, tax_form_on_file.]**
NARRATION: "Small file. This is exactly the kind of sheet that gets a quick glance and a shrug — 'looks fine' — instead of an actual check. Profiling doesn't skip it just because it's short."

**[SCREEN: Click 'tax_form_on_file'. Stats panel: '4 of 20 rows — false or missing'.]**
NARRATION: "Four new hires with no tax form on file. Not a formatting issue — a compliance gap, sitting in a file that's about to feed a payroll run."

**[SCREEN: Click 'pay_group'. Value Distribution: 'weekly', 'biweekly', 'monthly' — six rows highlighted where the value doesn't match what was actually approved for that employee.]**
NARRATION: "And six of these employees are assigned a pay group that doesn't match what was actually approved for them — the exact kind of mismatch that produces a wrong first paycheck."

**[SCREEN: Expand the 'tax_form_on_file' column card. 'DQ Glossary' section: a blue 'completeness' pill, plain-English definition, then a rationale sentence specific to this column.]**
NARRATION: "If you're not sure why that counts as a 'Completeness' issue — Sohovi explains it in plain English, right on the column, so you don't need a data background to understand why it matters."

**[SCREEN: Text card: 'Catch it before the run — not after the complaint.']**
NARRATION: "Every one of these is checkable before the payroll run fires, not after someone messages HR about their check."

**CTA:** Free, no card, at sohovi.com — profile the handoff sheet before you approve it, not after.

---

### PV72 — Healthcare: Everything Wrong With This Patient File, Before You Write One Rule

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "patient data quality check", "hipaa data profiling", "ehr data errors before deidentifying"
**Duration:** 115 seconds
**Dataset:** F (PatientIntake.csv)

**Hook:** "Before this patient file goes anywhere — a rule, a report, a research dataset — here's what profiling finds in it, with zero rules written."

**[SCREEN: Drag PatientIntake.csv onto Sohovi. Profiling runs entirely client-side. Yellow banner across the top: 'PII Detected — 5 columns may contain personally identifiable information.']**
NARRATION: "First thing that happens, before anything else: personal data gets flagged automatically. Five columns here — name, email, phone, date of birth, and more — so you know exactly what you're handling before you share, export, or even look closer."

**[SCREEN: Click 'patient_id'. Duplicate Values panel: '15 duplicate rows'.]**
NARRATION: "Fifteen duplicate intake records — the same patient, admitted twice in the system. Left alone, that's the same person billed twice, or reviewed twice, or counted twice in a report."

**[SCREEN: Click 'email'. Patterns tab: 'Most common pattern: word@word.word — 92% · Second: malformed — 4%.' A few sample values shown with '@@' and missing domains.]**
NARRATION: "Malformed emails, sitting quietly at four percent of the file — patterns Sohovi surfaces without you scanning the column by eye."

**[SCREEN: Click 'date_of_birth'. Profiling shows it right alongside 'admission_date' — a handful of rows where the two values look inconsistent with each other.]**
NARRATION: "And profiling puts date of birth and admission date right next to each other — which is exactly how you'd spot, at a glance, the records where one comes after the other. That's not a formatting issue. That's an impossible record — and it's one rule away from being caught automatically instead of found by eye."

**[SCREEN: Cut to sohovi.com/tools/de-identify. PatientIntake.csv dropped in. k-anonymity check: k = 3.]**
NARRATION: "Once you know what's actually in the file, de-identifying it means something. The free De-Identify tool is the natural next step — same browser, same file, no upload."

**CTA:** Both are free, no card, no sign-up for De-Identify — at sohovi.com. Know what's in the file before it goes anywhere.

---

### PV73 — Supply Chain: One Warehouse's Data Is Not the Whole Feed's Data

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "warehouse data quality by region", "scope data profiling by warehouse", "supply chain data profiling"
**Duration:** 105 seconds
**Dataset:** E (InventoryShipments.csv)

**Hook:** "Profile your whole shipment feed at once, and your most reliable warehouse and your least reliable one average out into one number that describes neither of them."

**[SCREEN: Drag InventoryShipments.csv onto Sohovi. Profiling loads. Column cards: shipment_id, sku, supplier_name, warehouse_country, quantity_on_hand, unit_cost, ship_date.]**
NARRATION: "300 rows, two warehouse regions in one file. Profiled as a whole, the problems from the worse region get diluted by the better one — which means neither region gets an honest read."

**[SCREEN: Click 'quantity_on_hand'. Outliers tab: 15 negative values highlighted red across the full file.]**
NARRATION: "Fifteen rows of negative stock, somewhere in this file. Useful to know — but not useful enough to know which warehouse it's actually coming from."

**[SCREEN: Scope Filter panel on the Profiling page. Add condition: warehouse_country == US. Match badge updates: '154 of 300 rows'. Click 'Apply & Re-Profile'.]**
NARRATION: "So don't profile the lump. Scope it — filter down to just the US warehouse, and re-profile that slice on its own. The filter carries forward automatically, so everything downstream — rules, runs — respects it too."

**[SCREEN: Re-profiled view: 'quantity_on_hand' outliers now scoped to just US rows — a smaller, specific count. Swap the scope to warehouse_country == IN instead: a different profile entirely, with more null 'supplier_name' rows.]**
NARRATION: "Now you get two honest pictures instead of one blended guess — this warehouse's real negative-stock problem, and the other warehouse's real missing-supplier problem. That's a completely different issue a single blanket number would've hidden."

**[SCREEN: Text card: 'Scope it once. Every rule and run after that respects it.']**
NARRATION: "Scope a rule the same way later, and it's checking the region it's actually supposed to — not flagging a known, already-understood delay in one region as if it were a crisis in both."

**CTA:** Free, no card, at sohovi.com — profile the region, not just the file.

---

### PV74 — Ecommerce: What Your Catalog Handoff Sheet Is Hiding

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "product catalog data quality", "ecommerce data profiling before launch", "catalog handoff sheet errors"
**Duration:** 105 seconds
**Dataset:** N (ProductCatalogHandoff.csv)

**Hook:** "Merchandising hands off the sheet. Engineering imports it. Somewhere in that handoff, a size field went missing and a price went to zero — and profiling would have caught both before launch."

**[SCREEN: Drag ProductCatalogHandoff.csv onto Sohovi. Profiling loads. Column cards: product_id, category, product_name, price, size, sku.]**
NARRATION: "150 rows, three categories mixed in one sheet — electronics, apparel, home. A blanket look at 'size' says almost nothing, because size doesn't even apply to two of those three categories."

**[SCREEN: Scope Filter panel. Add condition: category == apparel. Click 'Apply & Re-Profile'. 'size' column stats now show: '10 of the scoped rows — blank'.]**
NARRATION: "Scope profiling to just the apparel rows, and the real gap shows up immediately: ten apparel products with no size at all — a launch-blocker for that category specifically, invisible if you'd profiled the whole sheet as one mixed bag."

**[SCREEN: Click 'price'. Outliers/stats panel: '6 rows at $0.00 or negative'.]**
NARRATION: "Six products priced at zero dollars or less — the kind of value a spreadsheet formula would accept without blinking, flagged here automatically."

**[SCREEN: Click 'sku'. Duplicate Values panel: '4 duplicate SKUs'.]**
NARRATION: "And four SKUs that already exist twice in this sheet — which, imported as-is, means two listings fighting over one product ID."

**[SCREEN: Text card: 'Catch it in the handoff sheet, not the returns queue.']**
NARRATION: "Every one of these is checkable in the handoff sheet, in seconds, before any of it becomes a live listing — and one click away from a rule that checks the next handoff automatically."

**CTA:** Free, no card, at sohovi.com — profile the sheet before the listing goes live.

---

*End of Priority Video Set — 74 videos.*

---

## ARCHIVE — Original 159-Video Brainstorm (Reference Only)

> **What this is:** The full original video-script backlog, kept intact for future ideas once the Priority 37 above are in production. It has real overlap (multiple industry-vertical videos following an identical formula, several near-duplicate scripts, a few unsourced or overstated claims — see the editorial audit that led to the Priority set above) — treat it as raw material to mine, not a production-ready list on its own.

---

## Part 1: Landing Page Video

---

### VIDEO 1 — Sohovi Platform Demo

**Platform:** Landing Page Hero Video
**Duration:** 2 minutes 45 seconds
**Dataset:** A (CustomerDB.csv — messy version)
**Style:** Confident, full product-tour pacing — not a 15-second teaser. Steady, unhurried narration; each feature gets enough screen time to actually read the UI. Background music: upbeat but low in the mix under narration.

---

**[SCREEN 0–5s]: CustomerDB.csv open in Excel — visible blank cells in the email column, duplicate rows at the bottom. Cut to the Sohovi upload zone.]**
NARRATION: "This is Sohovi — a complete data quality platform that runs entirely in your browser."

**[SCREEN 5–10s]: Drag CustomerDB.csv onto the upload zone. File name and progress bar appear. Cut to a browser dev-tools Network tab overlay: '0 requests sent'.]**
NARRATION: "Drop in a file, and it never touches a server — yours or ours. Open your network tab if you don't believe it. Zero uploads."

**[SCREEN 10–15s]: Text overlay: 'Free forever · No card' next to smaller comparison text: 'Great Expectations — needs an engineer to set up · Enterprise DQ platforms — from $25,000/year'.]**
NARRATION: "And it's free, forever, no card required — while most serious data quality tools either need an engineer to configure, or start at twenty-five thousand dollars a year. Here's everything you actually get."

**[SCREEN 15–24s]: Profiling dashboard loads in under 2 seconds. Column cards appear for id, first_name, last_name, email, phone, country. Click the 'phone' card — an outlier marker highlights two red values: one absurdly long digit string, one all-zeros.]**
NARRATION: "The moment you upload, every column is profiled automatically — starting with outliers. Sohovi uses IQR, the same statistical method analysts use by hand, not just a simple average — so it catches problems even in lopsided, real-world data."

**[SCREEN 24–31s]: Click the 'id' card. A 'Duplicate Values' panel opens: '50 duplicate rows · 12 repeating values', with the top repeated IDs listed.]**
NARRATION: "It finds duplicates two ways — not just whole rows that match, but individual values that repeat, and exactly how many times each one shows up."

**[SCREEN 31–39s]: Click the 'email' card. 'Value Distribution' panel: a bar chart of the top 20 values by frequency, plus a short 'rarest values' list underneath.]**
NARRATION: "It shows you value distribution — your most common entries, and your rarest ones, so a typo that only happened once doesn't stay invisible."

**[SCREEN 39–48s]: Click the 'phone' card's Patterns tab. 'Most common pattern: 999-999-9999 — 88% · Second pattern: (999) 999-9999 — 8%.']**
NARRATION: "And it detects patterns — the actual shape your data takes — so you know immediately that most of your phone numbers are formatted one way, and a chunk of them are formatted completely differently."

**[SCREEN 48–56s]: Click into the Rules tab. Click 'Add Rule'. Fill in: Dimension Completeness, Rule Type Not Null, Column email, Threshold 95%. Click 'Add Rule' — it appears in the list instantly.]**
NARRATION: "Turning any of that into an enforced rule takes seconds. Pick a column, pick what to check, set a threshold — no query language, no code."

**[SCREEN 56–62s]: Three more rules added in fast cuts: country — Enum Validation; id — Uniqueness; phone — Validity. Rules list now shows 4 active rules with dimension tags.]**
NARRATION: "And you're not limited to one rule per column, or one rule per file. Stack as many as your data actually needs."

**[SCREEN 62–70s]: Text card: 'Completeness' with the email rule visible behind it.]**
NARRATION: "Completeness checks that a field is actually filled in — like making sure every customer record has an email on file before it goes to Sales."

**[SCREEN 70–78s]: Text card: 'Validity' with the country rule and its Allowed Values list ('US, CA, GB, IN, ...') visible behind it.]**
NARRATION: "Validity checks that a value matches a real format or a known list — a country code that's actually a valid code, not 'US' and 'USA' quietly living side by side in the same column."

**[SCREEN 78–85s]: Text card: 'Uniqueness' with the id rule and a duplicate-count badge visible behind it.]**
NARRATION: "Uniqueness catches duplicate IDs before they quietly inflate a customer count or double-bill an account."

**[SCREEN 85–95s]: Text card: 'Consistency' with a value-distribution chart showing 'active' (lowercase, 40%) and 'Active' (capitalized, 60%) as two separate bars.]**
NARRATION: "And Consistency makes sure the same value is written the same way everywhere — so 'active' and 'Active' don't silently split what should be one category into two on your next report."

**[SCREEN 95–104s]: Open the email rule. A 'Description (optional)' field appears below the threshold. Type: 'Required so Sales can follow up within 24 hours of signup.']**
NARRATION: "Every rule can carry a description — write down why it exists, not just what it checks. It travels with the rule everywhere, including next to the result when something fails."

**[SCREEN 104–118s]: Same rule, 'Scope (optional)' section expanded. Add condition: country == US. Add a second condition: signup_date in the last 90 days. A teal 'Scoped' badge appears on the rule in the list.]**
NARRATION: "You don't have to check your whole file the same way either. Scope any rule to a subset of rows — here, only US customers from the last 90 days. Run it, and only that slice counts toward this rule, pass or fail. Every other row still gets checked by your other rules — just not this one."

**[SCREEN 118–126s]: Click 'Save as Workflow'. Name it 'Customer Data Standard'. It appears in the Workflows list with all 4 rules shown as chips.]**
NARRATION: "Once a rule set works, save it as a Workflow — one time."

**[SCREEN 126–133s]: New file uploaded. Rules tab, click 'Apply Workflow', select 'Customer Data Standard'. All 4 rules populate instantly, mapped to matching columns.]**
NARRATION: "From then on, every new file of the same type — next month's export, a teammate's upload — gets the exact same checks applied in one click. Build it once, reuse it forever."

**[SCREEN 133–142s]: Click 'Run DQ Check'. Score gauge animates from 0 to 52, amber. Score Transparency panel opens: each rule listed with its weight and point penalty.]**
NARRATION: "Run the check, and you get one score — but never a black box. Every rule shows its weight, and exactly how many points it cost or contributed."

**[SCREEN 142–150s]: Cut to the Score Trend chart: a line-and-area chart plotting score across 8 historical runs, climbing from 52 toward 93, with reference lines at 95, 80, and 60.]**
NARRATION: "And this is the part that matters most over time: every run is saved, and plotted on one trend line — so you can watch your score actually improve, run over run, instead of just knowing today's number."

**[SCREEN 150–158s]: One point on the trend line is circled in red with a tooltip: 'Anomaly — dropped 14 points vs. previous run.']**
NARRATION: "And if a run ever drops hard against your own history, Sohovi flags it automatically — so a bad file gets caught before it quietly ends up in someone's dashboard."

**[SCREEN 158–165s]: Sohovi logo. Text fades in: 'Free forever. No card. Runs entirely in your browser.' Then the URL.]**
NARRATION: "Sohovi — full data quality, priced for anyone, private by default. Start free at sohovi.com."

---

## Part 2: Learn / In-App Tutorial Videos

> **Tone:** Friendly, direct, calm. These are in-app guides — viewers are logged in and learning step by step. One action at a time. No fluff.

---

### GETTING STARTED

---

### VIDEO 2 — Create Your Organization

**Platform:** Learn (In-App Tutorial)
**Duration:** 2 minutes
**Dataset:** None

**[SCREEN: Sohovi sign-in page. User is logged in for the first time. Onboarding screen appears: "Let's set up your workspace".]**
NARRATION: "Welcome to Sohovi. The first thing you'll do is create your organization — this is the top-level workspace that holds all your data."

**[SCREEN: Onboarding form. Field: Organization Name. Type "Acme Analytics".]**
NARRATION: "Enter your organization name. This can be your company name, team name, or project name — whatever makes sense for your context."

**[SCREEN: Click 'Create Organization'. Dashboard loads. Left sidebar shows the org name 'Acme Analytics' at the top.]**
NARRATION: "Click Create. Your organization is set up. You'll see it here in the sidebar — this is your home base."

**[SCREEN: Top-right area of dashboard. Click the org name. Dropdown shows: 'Settings', 'Team', 'Billing'.]**
NARRATION: "You can always rename your organization or manage settings by clicking the org name at the top."

**[SCREEN: Return to main dashboard. Point to the left sidebar hierarchy: Organization → Business Units → Catalogs → Assets.]**
NARRATION: "Now you're ready to build out your data hierarchy. Next up — create your first Business Unit."

**CTA:** Click 'Getting Started → Create a Business Unit' in the Learn panel to continue.

---

### VIDEO 3 — Add Team Members

**Platform:** Learn (In-App Tutorial)
**Duration:** 2 minutes
**Dataset:** None

**[SCREEN: Dashboard sidebar. Click 'Team'.]**
NARRATION: "To collaborate with your team, click 'Team' in the left sidebar."

**[SCREEN: Team page. Shows current member — the account owner. Button in top-right: 'Invite Member'.]**
NARRATION: "Here you see all members of your organization. Right now it's just you. Let's add someone."

**[SCREEN: Click 'Invite Member'. Modal opens with two fields: Email Address, Role (Admin / Member).]**
NARRATION: "Click Invite Member. Enter their email address and choose their role."

**[SCREEN: Type email 'jane@acmeanalytics.com'. Select role 'Member'. Click 'Send Invite'.]**
NARRATION: "Members can view data, run DQ checks, and create rules. Admins can also manage team settings and billing. Choose accordingly."

**[SCREEN: Success toast: 'Invite sent to jane@acmeanalytics.com'. Team page shows pending invite row.]**
NARRATION: "The invitation is sent. They'll get an email with a link to join your workspace. Their status shows as 'Pending' until they accept."

**[SCREEN: Hover over the pending row. Options: 'Resend invite' and 'Remove'.]**
NARRATION: "You can resend or cancel any pending invite from here."

**CTA:** Once your teammate accepts, they'll appear as Active in your Team list.

---

### VIDEO 4 — Create a Business Unit

**Platform:** Learn (In-App Tutorial)
**Duration:** 2 minutes
**Dataset:** None

**[SCREEN: Dashboard. Left sidebar. Click 'Business Units'.]**
NARRATION: "Business Units are how you organize your data by department, team, or function. Think of them as folders at the top level."

**[SCREEN: Business Units page. Currently empty. Click 'New Business Unit'.]**
NARRATION: "Click 'New Business Unit'."

**[SCREEN: Modal with fields: Name, Description (optional).]**
NARRATION: "Give it a name that matches a real department or team — for example, 'Marketing', 'Finance', or 'Product'."

**[SCREEN: Type 'Marketing'. Add description: 'All marketing-owned customer and campaign data'. Click 'Create'.]**
NARRATION: "Add an optional description so your team knows what data belongs here. Then click Create."

**[SCREEN: Business Unit card appears for 'Marketing'. Shows: 0 Catalogs, DQ score pending.]**
NARRATION: "Your Business Unit is created. It starts with no catalogs and no score — we'll add those next."

**[SCREEN: Click 'New Business Unit' again. Create 'Finance'. Now two cards on the page.]**
NARRATION: "You can create as many Business Units as you need. One per department is a good starting point."

**CTA:** Next, create a Catalog inside your Business Unit.

---

### VIDEO 5 — Create a Catalog

**Platform:** Learn (In-App Tutorial)
**Duration:** 2 minutes
**Dataset:** None

**[SCREEN: Business Units page. Click on the 'Marketing' card.]**
NARRATION: "Click into a Business Unit to see its catalogs. A Catalog is a collection of related data assets — like 'Customer Data' or 'Campaign Reports'."

**[SCREEN: Marketing detail page. Catalogs section is empty. Click 'New Catalog'.]**
NARRATION: "Click 'New Catalog'."

**[SCREEN: Form — Name, Description.]**
NARRATION: "Name this catalog based on what kind of data it will hold."

**[SCREEN: Type 'Customer Data'. Description: 'CRM exports, email lists, customer records'. Click 'Create'.]**
NARRATION: "For example — 'Customer Data' for all your CRM and email list files."

**[SCREEN: Catalog card appears inside the Marketing Business Unit. Shows: 0 Data Assets, Score: N/A.]**
NARRATION: "The catalog is ready. Now you can start adding data assets — the actual files — inside it."

**CTA:** Head into the catalog and create your first Data Asset.

---

### VIDEO 6 — Create a Data Asset

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** None (no upload yet — just creation)

**[SCREEN: Inside the 'Customer Data' catalog. Empty state. Button: 'New Data Asset'.]**
NARRATION: "A Data Asset is a specific table, file, or dataset you want to monitor. Let's create one."

**[SCREEN: Click 'New Data Asset'. Form: Name, Description, Data Source (manual upload, Google Sheets, etc.).]**
NARRATION: "Click 'New Data Asset'. Give it a name that identifies what data it represents."

**[SCREEN: Type Name: 'Customer Email List'. Description: 'Monthly CRM export — all active customers'. Select source: 'Manual Upload'. Click 'Create'.]**
NARRATION: "Name it something specific — 'Customer Email List', not just 'customers'. You'll thank yourself later when you have twenty assets."

**[SCREEN: Data Asset page loads. Shows: No file uploaded yet. Upload zone in center. DQ Score: N/A.]**
NARRATION: "Your asset is created. Next step is uploading a file — which we'll cover in the Connecting Data section."

**[SCREEN: Left breadcrumb: Acme Analytics → Marketing → Customer Data → Customer Email List.]**
NARRATION: "Notice the breadcrumb at the top — you can always see exactly where you are in the hierarchy and click back to any level."

**CTA:** Move on to 'Upload a CSV or Excel File' to load your first dataset.

---

### CONNECTING DATA

---

### VIDEO 7 — Upload a CSV or Excel File

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Data Asset page for 'Customer Email List'. Large upload zone in center. Text: 'Drop your CSV or Excel file here'.]**
NARRATION: "Let's upload your first file. Sohovi accepts CSV and Excel files — .csv, .xls, and .xlsx all work."

**[SCREEN: Drag and drop CustomerDB.csv onto the upload zone. File name appears. Size shown: ~45 KB.]**
NARRATION: "Drag your file onto the upload zone — or click to browse. I'm using CustomerDB.csv, a 550-row customer file."

**[SCREEN: Progress indicator: 'Parsing file…' → 'Profiling columns…' → 'Done'. All processing happens in the browser — no server spinner, just local computation.]**
NARRATION: "Sohovi parses and profiles the file right here in your browser. Nothing is uploaded to any server. This is important — your raw data stays private."

**[SCREEN: Profiling dashboard loads. Column cards appear: id, first_name, last_name, email, phone, country. Each card shows key stats.]**
NARRATION: "Once done, you see the Profiling Dashboard. Every column is automatically analyzed — let's walk through what you're seeing."

**[SCREEN: Click on the 'email' column card. Expanded view shows: Total rows 550, Non-null: 480, Null: 70 (12.7%), Unique: 480, Duplicate: 70.]**
NARRATION: "The email column shows 70 null values — 12.7% of the dataset. And 70 duplicate rows. That's exactly what we introduced."

**[SCREEN: Scroll down. Other column cards visible. Country column shows a value distribution bar chart.]**
NARRATION: "Every column gets its own profile. Numerical columns show min, max, mean. Text columns show patterns and top values. Date columns show the date range."

**[SCREEN: Top right: 'Run History' button — currently shows 'No runs yet'.]**
NARRATION: "You haven't run any quality checks yet — that comes next. But profiling alone is already telling you a lot."

**CTA:** Next, add your first data quality rule.

---

### VIDEO 8 — Connect Google Sheets

**Platform:** Learn (In-App Tutorial)
**Plan:** Business plan required (`ConnectorGate`, `minPlan="business"`) — do not present as available on Free/Pro, and do not use as cold-acquisition content. Best suited for sales-assist / onboarding content aimed at teams already evaluating Business.
**Duration:** 3 minutes
**Dataset:** None (live Google Sheet)

**[SCREEN: Create new Data Asset. Select source: 'Google Sheets'. A connection panel appears.]**
NARRATION: "If your data lives in Google Sheets, you can connect directly — no CSV export needed."

**[SCREEN: 'Connect Google Sheets' button. Click it. Google OAuth consent screen appears in a popup.]**
NARRATION: "Click 'Connect Google Sheets'. You'll be asked to authorize Sohovi to read your Google Sheets."

**[SCREEN: OAuth popup. Permission shown: 'View your Google Spreadsheets'. Click 'Allow'.]**
NARRATION: "Sohovi only needs read access — it never writes to your sheet. Click Allow."

**[SCREEN: Back in Sohovi. Dropdown showing your Google Sheets files. Select a sheet. Then select the specific tab.]**
NARRATION: "Choose the spreadsheet and the specific sheet tab you want to connect."

**[SCREEN: Click 'Connect'. Profiling dashboard loads with the sheet data.]**
NARRATION: "Click Connect. Sohovi reads the current data and profiles it — exactly like a CSV upload."

**[SCREEN: 'Sync' button at top of the asset page. Shows 'Last synced: just now'.]**
NARRATION: "Any time you want fresh data from the sheet, hit Sync. You can also set this up on a schedule with alerts."

**CTA:** Your Google Sheet is now a monitored data asset.

---

### VIDEO 9 — Connect Airtable

**Platform:** Learn (In-App Tutorial)
**Plan:** Business plan required — see the note on VIDEO 8. Same caveat applies: enterprise/sales-assist content, not a free-tier hook.
**Duration:** 3 minutes
**Dataset:** None

**[SCREEN: New Data Asset → Source: Airtable. Connection panel appears with a field: 'Airtable API Key'.]**
NARRATION: "To connect Airtable, you'll need your Airtable API key. Let's grab it."

**[SCREEN: New browser tab opens to airtable.com/account. Point to 'API' section. Show where the key is generated.]**
NARRATION: "Go to airtable.com, open your account page, and generate a Personal Access Token with 'data.records:read' scope."

**[SCREEN: Copy the token. Back in Sohovi, paste into the API Key field. Fields appear: Base ID, Table Name.]**
NARRATION: "Paste it into Sohovi. Then enter your Base ID — you can find this in the Airtable URL — and the table name you want to connect."

**[SCREEN: Click 'Connect'. Column data loads and profiling begins.]**
NARRATION: "Click Connect. Sohovi fetches the records and profiles them."

**[SCREEN: Profiling dashboard showing Airtable data. Column cards visible.]**
NARRATION: "From here, it works exactly like any other data asset. Add rules, run checks, set alerts."

**CTA:** Your Airtable table is now connected and ready for DQ monitoring.

---

### VIDEO 10 — Connect Cloud Storage

**Platform:** Learn (In-App Tutorial)
**Plan:** Business plan required — see the note on VIDEO 8. Same caveat applies: enterprise/sales-assist content, not a free-tier hook.
**Duration:** 3 minutes
**Dataset:** None

**[SCREEN: New Data Asset → Source: Cloud Storage. Options: AWS S3, Google Cloud Storage, Azure Blob Storage.]**
NARRATION: "If your data lives in cloud storage — S3, GCS, or Azure — you can connect directly to the file."

**[SCREEN: Select 'AWS S3'. Fields: Bucket Name, File Path, Region, Access Key ID, Secret Access Key.]**
NARRATION: "Select your cloud provider. For S3, you'll need the bucket name, file path, region, and your AWS credentials."

**[SCREEN: Fill in example values: Bucket = 'acme-data-exports', Path = 'crm/customers_march.csv', Region = 'us-east-1'. Keys masked.]**
NARRATION: "We recommend creating a read-only IAM user for Sohovi — it only needs s3:GetObject permission on the specific bucket."

**[SCREEN: Click 'Connect'. File fetches, profiling dashboard appears.]**
NARRATION: "Click Connect. Sohovi fetches the file and profiles it. The raw file content is processed in your browser — only the profiling summary is stored."

**CTA:** For GCS and Azure, the flow is identical — just select the provider and fill in the equivalent credentials.

---

### VIDEO 11 — Connect a REST API

**Platform:** Learn (In-App Tutorial)
**Plan:** Business plan required — see the note on VIDEO 8. Same caveat applies: enterprise/sales-assist content, not a free-tier hook.
**Duration:** 3 minutes
**Dataset:** None

**[SCREEN: New Data Asset → Source: REST API. Fields: URL, HTTP Method, Headers, Authentication.]**
NARRATION: "If your data comes from an API — an internal service, a CRM, or a third-party integration — you can connect it here."

**[SCREEN: Enter a sample URL: https://api.example.com/v1/customers. Method: GET. Auth: Bearer Token. Paste example token.]**
NARRATION: "Enter the API endpoint URL, select GET, and add your authentication headers."

**[SCREEN: Optional: 'JSON Path' field. Enter $.data.records to extract nested data.]**
NARRATION: "If the JSON response is nested — like records inside a 'data' wrapper — use the JSON Path field to tell Sohovi where to find the records."

**[SCREEN: Click 'Fetch Preview'. A table of 5 sample rows appears.]**
NARRATION: "Click Fetch Preview to test the connection. You'll see the first few rows — make sure the columns look right before confirming."

**[SCREEN: Click 'Connect'. Full dataset fetches and profiling runs.]**
NARRATION: "Click Connect. Sohovi fetches all records and profiles them."

**CTA:** REST API data works identically to CSV uploads — rules, scores, alerts all apply.

---

### VIDEO 12 — Re-upload and Detect Schema Changes

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (CustomerDB.csv), then a modified version with a column added

**[SCREEN: Existing Data Asset 'Customer Email List' with previous run history visible.]**
NARRATION: "Your data changes over time. When you get a new version of a file, you can re-upload it here — and Sohovi will detect if anything changed."

**[SCREEN: Click 'Upload New Version'. Same upload zone appears.]**
NARRATION: "Click 'Upload New Version' on the data asset page."

**[SCREEN: Upload a slightly modified version of CustomerDB.csv — same structure but with a new column 'signup_date' added.]**
NARRATION: "I'm uploading a new version that has an extra column added — signup_date — to simulate what happens when your source system changes."

**[SCREEN: Alert banner appears at top: 'Schema change detected. New column: signup_date. No columns removed.']**
NARRATION: "Sohovi detects the schema change immediately. It tells you exactly what changed — new columns, removed columns, renamed columns."

**[SCREEN: Rule panel shows a yellow warning: 'signup_date column is new — no rules apply to it yet.' Option: 'Add Rule' next to it.]**
NARRATION: "Your existing rules are preserved. But the new column has no rules yet — Sohovi highlights this so nothing slips through."

**[SCREEN: Set up a Schema Change Alert. Toggle on. Set threshold to notify on 'Any column added or removed'.]**
NARRATION: "Want to be notified automatically next time this happens? Create a Schema Change alert — we'll cover alerts in detail later."

**CTA:** Re-uploads create a new run entry in your run history, so you can compare data quality over time.

---

### DATA PROFILING

---

### VIDEO 13 — What Is Data Profiling?

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Profiling dashboard for CustomerDB.csv. Multiple column cards visible.]**
NARRATION: "Data profiling is the process of examining your data and collecting statistics about it — before you try to use it."

**[SCREEN: Zoom into the 'email' column card. Stats: total rows, null count, unique count, most common value.]**
NARRATION: "Think of it like a health check for your spreadsheet. Sohovi looks at every column and answers: What type of data is this? How much is missing? Are there duplicates? What patterns does it follow?"

**[SCREEN: Click 'first_name' card. Stats: 0 nulls, 490 unique values out of 550 rows, top value: 'James (3 times)'.]**
NARRATION: "For text columns you see how many unique values exist, the most common values, and whether anything looks suspicious."

**[SCREEN: Click 'id' column card. Shows: min=1, max=550, mean=275.5, no nulls.]**
NARRATION: "For numeric columns, you get min, max, mean, and standard deviation. Outliers are flagged automatically."

**[SCREEN: Overview card at top: 6 columns profiled, 2 columns with issues, overall null rate 5.2%.]**
NARRATION: "The overview card gives you an instant summary — how many columns have issues and your overall null rate across the whole file."

**[SCREEN: Privacy banner: 'All profiling runs in your browser. Your raw data never leaves your device.']**
NARRATION: "And everything runs right here in your browser. Your data never touches a server. That is not a small thing."

**CTA:** Now that you understand what profiling gives you, let's go deeper into reading column statistics.

---

### VIDEO 14 — Reading Column Statistics

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Profiling dashboard. Click on the 'email' column card to expand it.]**
NARRATION: "Click any column card to see its full statistics. Let's start with the email column."

**[SCREEN: Expanded email stats: Total: 550, Non-null: 480, Null: 70, Null %: 12.7%, Unique: 480, Duplicate: 70.]**
NARRATION: "Total rows is 550. Non-null is 480 — so 70 cells are blank. 12.7% of your email column is missing."

**[SCREEN: Pattern section: 'Most common pattern: word@word.word — 92% of non-null values. Anomaly: 8% do not match standard email pattern'.]**
NARRATION: "Below the counts, Sohovi shows pattern analysis. 92% of emails follow a standard format. 8% don't — those are your typos and corrupted values."

**[SCREEN: Click 'phone' column card. Shows: Null: 0, Pattern: valid US format 76%, other format 20%, invalid 4%.]**
NARRATION: "The phone column has no nulls — but 4% are completely invalid, and 20% are in a different format. That is a mixed-format problem."

**[SCREEN: Click 'country' column. Top-values bar chart: US 28%, UK 15%, Canada 12%.]**
NARRATION: "The country column shows which countries appear most. Useful for spotting unexpected values or data skews."

**CTA:** Statistics tell you what is in your data. Next — distribution charts show you the shape of it.

---

### VIDEO 15 — Value Distribution Charts

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Profiling dashboard. Click on the 'country' column card. Bar chart visible.]**
NARRATION: "Value distribution charts show how your data is spread across possible values — your visual at-a-glance check."

**[SCREEN: Bar chart: US tallest bar, then UK, Canada, etc. Hover over bars to see exact counts.]**
NARRATION: "USA is the most common. That makes sense for a US-based CRM. If you suddenly see an unexpected country dominating, that is a signal to investigate."

**[SCREEN: Click 'id' column card. Distribution shows a flat even bar — all values roughly equal height.]**
NARRATION: "An auto-increment ID shows a flat distribution — every value appears once. Flat is good here. It confirms no duplicates."

**[SCREEN: Click 'email' column. Null distribution pie: 87.3% filled (white), 12.7% null (red).]**
NARRATION: "For columns with nulls, you see a fill chart — how complete the column is. The red slice is your missing data. You want it as small as possible."

**[SCREEN: 'phone' column. Pattern distribution: three slices — valid US, other format, invalid.]**
NARRATION: "Pattern charts show the mix of formats. Ideally one format dominates. Multiple formats mean inconsistent data entry somewhere upstream."

**CTA:** These charts let you spot problems visually before you write a single rule.

---

### VIDEO 16 — PII Detection

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Profiling dashboard. Yellow warning banner at top: 'PII Detected — 3 columns may contain personally identifiable information'.]**
NARRATION: "When Sohovi profiles your data, it automatically scans for PII — personally identifiable information. If it finds any, you see this banner."

**[SCREEN: Click banner. Expands: email (PII: email address), phone (PII: phone number), first_name and last_name (PII: personal name).]**
NARRATION: "It flagged email, phone, and name columns — all correct. These are columns that could identify a real person."

**[SCREEN: Each PII column card has a small orange tag 'PII'. Click 'email' card. Note at bottom: 'Handle with care — GDPR/CCPA may apply'.]**
NARRATION: "PII-tagged columns carry a reminder about data regulations. This does not block you from working with the data — it is a heads-up to handle it responsibly."

**[SCREEN: Click 'id' column. No PII tag. Just an auto-increment integer.]**
NARRATION: "Non-PII columns like ID have no tag. Sohovi does not over-flag — only genuine personal data gets flagged."

**[SCREEN: Privacy note: 'Sohovi never sends PII to any server. All PII detection runs in your browser.']**
NARRATION: "Worth saying again — your data, including the PII columns, never leaves your browser. Detection is entirely local."

**CTA:** Knowing which columns contain PII helps you apply the right rules and handle data responsibly.

---

### VIDEO 17 — Outlier Detection

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** B (SalesQ1.csv)

**[SCREEN: Profiling dashboard for SalesQ1.csv. Click 'amount' column card.]**
NARRATION: "Outliers are values that fall far outside the normal range. For numeric columns, Sohovi detects them automatically."

**[SCREEN: Amount stats: min = -250.00 highlighted red, max = 9,847.00, mean = 412.30. Outlier section: '10 values flagged — 5% of column'.]**
NARRATION: "The minimum value is -250. A negative sale amount is almost certainly a data entry error — not a real transaction."

**[SCREEN: Outlier section lists 10 flagged values with row numbers.]**
NARRATION: "Sohovi lists every outlier row. Row 5, row 22, row 47 — the exact rows with negative amounts."

**[SCREEN: Click 'View in Failed Records'. Shows those rows with 'amount' column highlighted.]**
NARRATION: "Click View in Failed Records to see the full row context — who placed the order, which region, what date."

**[SCREEN: Back on profiling. Click 'date' column. min=2024-01-01, max=2024-12-31, but 2 rows flagged with dates in 2019.]**
NARRATION: "The date column has 2 rows from 2019 — five years before the rest of the data. Outlier detection catches those too."

**CTA:** Use outlier detection to catch impossible or improbable values before they corrupt your analysis.

---

### VIDEO 18 — Pattern Recognition

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Profiling dashboard. Click 'phone' column card. Pattern section visible.]**
NARRATION: "Pattern recognition tells you what format your data follows — and how consistently it follows it."

**[SCREEN: Pattern analysis: '+1XXX-XXX-XXXX: 76%, +1 (XXX) XXX-XXXX: 20%, invalid/other: 4%'.]**
NARRATION: "The phone column has two valid formats — US standard and US parenthesis format — plus 4% completely invalid entries. This is a classic mixed-format problem."

**[SCREEN: Click 'email' column. Pattern: 'word@word.word: 92%, other: 8%'. Click the drill-down arrow on 'other'.]**
NARRATION: "The email column shows 8% don't match the standard pattern. Click the arrow to see examples."

**[SCREEN: Drill-down shows: 'john.doe@' (incomplete), 'notanemail', 'jane@@company.com'.]**
NARRATION: "These are the actual bad values. Incomplete addresses, double @ signs, missing domains. Now you know exactly what to fix."

**[SCREEN: Click 'id' column. Pattern: 'Integer (sequential): 100%'. Clean.]**
NARRATION: "The ID column shows a clean sequential integer pattern. 100% consistent. That is exactly what you want to see."

**CTA:** Pattern recognition is the foundation for Validity rules — which we cover next.

---

### DATA QUALITY RULES

---

### VIDEO 19 — Add a Completeness Rule

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Data Asset page. Click 'Rules' tab. Empty rules panel. Click 'Add Rule'.]**
NARRATION: "Now let's add your first data quality rule. Click the Rules tab, then Add Rule."

**[SCREEN: Rule type selector: Completeness, Accuracy, Validity, Uniqueness, Consistency. Click 'Completeness'.]**
NARRATION: "Select Completeness. This rule checks that a column isn't missing values."

**[SCREEN: Rule form: Column selector (dropdown), Threshold (percentage, default 95%), Weight (1-5).]**
NARRATION: "Choose which column to check. I'll select 'email'. Set the threshold — how complete does it need to be? 95% means at most 5% nulls are acceptable."

**[SCREEN: Below Rule Type, an optional 'Description' textarea. Type: 'Email is required so Sales can follow up within 24 hours of signup.']**
NARRATION: "Before you set the threshold, there's an optional Description field. Use it to write down why the rule exists — it'll show up later in the rules list, in your run results, and in the failed records view, so nobody has to guess."

**[SCREEN: Select column: email. Threshold: 95%. Weight: 3 (medium). Click 'Save Rule'.]**
NARRATION: "The weight controls how much this rule impacts your overall DQ score. I'll set it to 3 — medium importance."

**[SCREEN: Rule appears in the list: 'email — Completeness — 95% — Weight 3'.]**
NARRATION: "The rule is saved. Sohovi won't run it yet — it runs all rules together when you click Run DQ Check."

**[SCREEN: Add a second rule: customer_name — Completeness — 100%. Weight 5.]**
NARRATION: "Let's add another. Customer name must always be present — 100% completeness. Weight 5 — this one is critical."

**CTA:** Click Run DQ Check to see how your data scores against these rules.

---

### VIDEO 20 — Add an Accuracy Rule

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** B (SalesQ1.csv)

**[SCREEN: SalesQ1 Data Asset. Rules tab. Click 'Add Rule' then select 'Accuracy'.]**
NARRATION: "An Accuracy rule checks that values fall within an expected range or meet a logical condition. Perfect for numeric data."

**[SCREEN: Accuracy rule form: Column, Condition (greater than, less than, between, equals), Value.]**
NARRATION: "Select the 'amount' column. For condition, choose 'greater than'. For value, enter 0."

**[SCREEN: Configure: Column = amount, Condition = greater than, Value = 0. Weight = 4. Save.]**
NARRATION: "This rule says: every sale amount must be greater than zero. Any negative or zero value is a violation."

**[SCREEN: Add a second accuracy rule: date — between — 2024-01-01 and 2024-12-31. Weight 3.]**
NARRATION: "Let's add one for the date column — all dates should fall within the expected range for this file."

**[SCREEN: Two accuracy rules in the list.]**
NARRATION: "These two rules will catch the negative amounts and the 2019 date outliers we spotted during profiling."

**CTA:** Accuracy rules are your guard rails for numeric and date columns.

---

### VIDEO 21 — Add a Validity Rule

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: CustomerDB Data Asset. Rules tab. Add Rule — Validity.]**
NARRATION: "A Validity rule checks that values follow a specific format — like a valid email address, a phone number pattern, or a specific list of allowed values."

**[SCREEN: Validity rule form: Column, Validation Type (regex, allowed values, date format, numeric range).]**
NARRATION: "Select the 'email' column. For validation type, choose Regex pattern."

**[SCREEN: Preset appears: 'Standard email format'. Click to use it.]**
NARRATION: "Sohovi has built-in presets for common patterns. Select the standard email format preset — no need to write regex yourself."

**[SCREEN: Save rule. Add a second: phone column — Regex — US phone preset. Weight 2.]**
NARRATION: "Add another for phone using the US phone number preset."

**[SCREEN: Add a third: country column — Allowed values — list the 20 expected countries.]**
NARRATION: "For the country column, use Allowed Values — only these specific countries are considered valid."

**CTA:** Validity rules are your format enforcers. If it does not match the pattern, it is a violation.

---

### VIDEO 22 — Add a Uniqueness Rule

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: CustomerDB Data Asset. Rules — Add Rule — Uniqueness.]**
NARRATION: "A Uniqueness rule ensures no duplicate values exist in a column — or combination of columns."

**[SCREEN: Rule form: Column (single or multi-select), Threshold (default 100% unique).]**
NARRATION: "Select the 'id' column. Threshold defaults to 100% — every ID must be unique."

**[SCREEN: Save. Then add another: email — Uniqueness — 100%. Weight 4.]**
NARRATION: "Add the same for email. Each email address should appear only once in your list."

**[SCREEN: Optional: click 'Add column' and select both first_name AND last_name together for a multi-column rule.]**
NARRATION: "You can also check uniqueness across a combination of columns — first name plus last name together should be unique."

**[SCREEN: Three uniqueness rules in the list.]**
NARRATION: "Multi-column uniqueness is powerful for natural keys — like name combinations or address combinations."

**CTA:** Uniqueness rules catch duplicates before they reach your reports or email campaigns.

---

### VIDEO 23 — Add a Consistency Rule

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** B (SalesQ1.csv)

**[SCREEN: SalesQ1 Data Asset. Rules — Add Rule — Consistency.]**
NARRATION: "A Consistency rule checks that values in one column are logically consistent with values in another column."

**[SCREEN: Rule form: Primary column, Condition, Related column or value.]**
NARRATION: "Let's create a rule that says: if the region is US, the currency should be USD. Cross-column consistency."

**[SCREEN: Configure: Primary column = region, Condition = 'when value is', Value = 'US', Then: currency column must equal 'USD'.]**
NARRATION: "Select the primary column — region. Set the condition — when value equals US. Then specify the dependent column — currency must equal USD."

**[SCREEN: Save. Rule shows: 'region=US means currency=USD'.]**
NARRATION: "Any row where the region is US but the currency is not USD will be flagged as a consistency violation."

**[SCREEN: Add simpler rule: date column — year must be 2024.]**
NARRATION: "You can also check consistency against a fixed value — like all dates must be in the year 2024."

**CTA:** Consistency rules catch the sneaky errors that look fine in isolation but break your logic downstream.

---

### VIDEO 24 — Using AI Rule Suggestions

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: CustomerDB Data Asset. Rules tab. Button at top: 'Get AI Suggestions'.]**
NARRATION: "Not sure which rules to add? Sohovi can suggest them based on the data it already profiled."

**[SCREEN: Click 'Get AI Suggestions'. Panel slides in with 6 suggested rules, each with a checkbox.]**
NARRATION: "Click Get AI Suggestions. Sohovi's rule engine analyzes your column types, patterns, and profiling results, then recommends rules."

**[SCREEN: Suggested rules list: 1) email Completeness 95%, 2) email Validity email format, 3) id Uniqueness 100%, 4) phone Validity phone pattern, 5) first_name Completeness 100%, 6) country Allowed values.]**
NARRATION: "It is suggesting exactly what you would expect — completeness on email and name, uniqueness on ID, validity on email and phone, and an allowed-values list for country."

**[SCREEN: Each suggested rule card has its own small 'Add a description (optional)…' input, right under the reason text.]**
NARRATION: "Before you accept any of these, you can type a short description right on that card — it gets saved along with the rule the moment you accept it."

**[SCREEN: Check all 6. Click 'Add Selected Rules'.]**
NARRATION: "Select the ones you want. I will take all six. Click Add Selected Rules."

**[SCREEN: Six rules now in the rules list.]**
NARRATION: "All six rules added in one click. AI suggestions work best after profiling runs — the more data Sohovi has seen, the better the suggestions."

**CTA:** You can always add, edit, or delete suggested rules — they are a starting point, not a constraint.

---

### VIDEO 25 — Testing Rules in the Sandbox

**Platform:** Learn (In-App Tutorial)
**Plan:** Business plan required (`PlanGate minPlan="business"` on the Sandbox route) — not visible to Free or Pro users. Frame for existing Business customers or sales-assist demos, not cold acquisition.
**Duration:** 3.5 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Data Asset page. Open the Sandbox tab. Two panels side by side: 'Configure Rule' on the left, 'Result' on the right.]**
NARRATION: "Before you commit to a rule, test it in the Sandbox. It runs against your real in-memory file, but nothing here touches your saved rules or run history until you choose to save it."

**[SCREEN: Left panel, top to bottom: Column = email, Dimension = Completeness, Rule Type = Not Null, Threshold (%) = 100.]**
NARRATION: "Configure it exactly like a real rule — column, dimension, rule type, threshold. I'll set email to Not Null at 100%."

**[SCREEN: Below Threshold, a 'Description (optional)' textarea. Type: 'Testing whether 100% is realistic for email.']**
NARRATION: "There's an optional Description field here too — write your reasoning now, and it carries straight over if you decide to save this as a real rule."

**[SCREEN: Below Description, a collapsed 'Scope (optional)' row. Click it open. Add condition: country == US.]**
NARRATION: "The same Scope section from the rule builder lives here as well — so you can test a scoped rule before you ever commit to it. I'll scope this to country equals US."

**[SCREEN: Click 'Run Test'. Brief spinner: 'Evaluating rule…'.]**
NARRATION: "Click Run Test. Sohovi evaluates the rule against your real file right now, in your browser."

**[SCREEN: Result panel: a colored score box, a red 'BREAKING' badge next to it, the description text beneath, then a 'Total rows / Failed rows / Severity' stat row.]**
NARRATION: "The result comes back BREAKING — that's Sohovi's word for a failing rule, everywhere in the product, not just here. Your description shows right next to the badge."

**[SCREEN: Click the red BREAKING badge itself. A 'Failed Records' popup opens with the real failing rows — just the US ones, since that's what we scoped.]**
NARRATION: "Click the badge, and it opens the same Failed Records view a real run would give you — actual rows, ready to download — so you can sanity-check the rule before saving anything."

**[SCREEN: Close the popup. Change threshold to 85. Click 'Run Test' again. Badge flips to green 'PASS'.]**
NARRATION: "Loosen the threshold to 85 and run it again — now it passes. Tune and re-run as many times as you want; nothing is saved until you say so."

**[SCREEN: Click 'Save Rule' next to Run Test. Toast notification: 'Rule saved to asset'.]**
NARRATION: "Happy with it? Click Save Rule. It's added to this asset's real rules — description, scope, and all."

**CTA:** Always sandbox a new or scoped rule on real data before committing — especially when tuning thresholds.

---

### VIDEO 26 — Rule Weights and Thresholds

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (CustomerDB.csv — with 6 rules added)

**[SCREEN: Rules tab showing 6 active rules. Each has a Weight value (1-5) next to it.]**
NARRATION: "Every rule has two settings that control how much it impacts your DQ score: the threshold and the weight."

**[SCREEN: Click edit icon on the 'email — Completeness' rule. Threshold field set to 95%.]**
NARRATION: "The threshold is your pass or fail line. 95% completeness means: if more than 5% of emails are null, this rule fails."

**[SCREEN: Slider showing threshold. Move from 95% to 80%. Tooltip: 'At 80%: rule PASSES with current data. At 95%: rule FAILS'.]**
NARRATION: "Sohovi shows you whether your current data would pass or fail at each threshold level. Use this to set realistic but meaningful targets."

**[SCREEN: Weight field set to 5. Tooltip: 'Weight 5 = this rule contributes most to overall score. Weight 1 = minor impact'.]**
NARRATION: "The weight controls how much a rule matters to the final score. Weight 5 rules are critical — if they fail, your score drops significantly. Weight 1 rules are informational."

**[SCREEN: Score breakdown preview showing how 6 rules combine by weight to produce the final score.]**
NARRATION: "The Score Transparency panel shows exactly how each rule's weight combines to produce your final number. Nothing is a black box."

**CTA:** Set weights based on business priority — what would actually cause a real problem if the data was wrong?

---

### SCORES AND RESULTS

---

### VIDEO 27 — Run DQ Checks

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (CustomerDB.csv — with rules set up)

**[SCREEN: Data Asset page. Rules tab shows 6 active rules. Large button at top: 'Run DQ Check'.]**
NARRATION: "You have uploaded your file and set up your rules. Now let's run the actual data quality check."

**[SCREEN: Click 'Run DQ Check'. Progress: 'Running rules… 1/6… 2/6… 3/6…' completes in under 3 seconds.]**
NARRATION: "Click Run DQ Check. All rules execute right here in your browser. A 550-row file takes under 3 seconds."

**[SCREEN: Results appear. Score gauge fills to 52/100 — amber. Top summary bar: Rules 6, Passed Rules 3, Failed Rules 3, Columns 6.]**
NARRATION: "The score is calculated. 52 out of 100 — amber, which means significant issues but not completely broken data."

**[SCREEN: Rule Breakdown panel: green 'PASS' badges for id Uniqueness, country Allowed Values, first_name Completeness. Red 'BREAKING' badges for email Completeness, email Validity, phone Validity.]**
NARRATION: "Three rules passed, three are breaking — that's Sohovi's word for a failing rule. ID uniqueness and first name completeness are fine. Email completeness, email format, and phone format are breaking."

**[SCREEN: Run History tab at bottom. Shows this run with timestamp and score 52/100.]**
NARRATION: "Every run is saved in your history. You can always come back and compare results over time."

**CTA:** Let's look at what that score of 52 actually means.

---

### VIDEO 28 — Understanding the DQ Score

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (post-run, score 52)

**[SCREEN: DQ Score gauge showing 52/100 in amber. Below: 'Fair — significant issues present'.]**
NARRATION: "Your DQ score is a number from 0 to 100 that represents how trustworthy your data is, based on the rules you set."

**[SCREEN: Color band legend: 95 and above = Excellent green, 80 to 94 = Good teal, 60 to 79 = Fair amber, below 60 = Poor red.]**
NARRATION: "The score falls into four bands. Green means excellent shape. Teal is good. Amber means investigate. Red means serious problems."

**[SCREEN: Score of 52 in amber-to-red zone. Tooltip: 'Your data has multiple failing rules. Address them before using in reports or dashboards'.]**
NARRATION: "52 is in the amber zone. It means your data is usable but risky — reports built on this data could show wrong numbers."

**[SCREEN: Click 'What makes up this score?' link. Score breakdown expands showing each rule, pass/fail, weight, and contribution.]**
NARRATION: "Click 'What makes up this score?' to see the full breakdown. Every rule shows its weight and whether it passed or failed."

**[SCREEN: Breakdown: email Completeness failed — cost 18 points. email Validity failed — cost 15 points. phone Validity failed — cost 8 points. Three passing rules contributed full weight.]**
NARRATION: "The email completeness failure hit hardest because it had the highest weight. Phone validity had less impact because its weight was set to 2."

**CTA:** A score tells you how worried to be. The breakdown tells you what to fix first.

---

### VIDEO 29 — Column-Level Scores

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (post-run)

**[SCREEN: DQ results page. Scroll below the overall score gauge. Grid of column score cards appears.]**
NARRATION: "Below the overall score, you see individual scores for each column. This is where you find out exactly which columns are dragging your score down."

**[SCREEN: Column grid: id 100 green, first_name 100 green, last_name 100 green, email 61 amber, phone 84 teal, country 100 green.]**
NARRATION: "ID, first name, last name, and country all score 100 — perfect. Email scores 61 because two rules failed on it. Phone scores 84 — one rule barely passed."

**[SCREEN: Click 'email' column score card. Expands: Completeness rule BREAKING 12.7% null threshold 95%. Validity rule BREAKING 8% invalid format.]**
NARRATION: "Click any column card to see which specific rules passed or failed for that column."

**[SCREEN: Click 'phone' column. Validity rule: PASS — 96% match the pattern. Threshold was 95%. Borderline.]**
NARRATION: "Phone shows a borderline pass. 96% validity against a 95% threshold. One more bad record and it would fail."

**CTA:** Column-level scores tell you exactly where to focus your data cleaning effort.

---

### VIDEO 30 — Viewing Failed Records

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (post-run)

**[SCREEN: DQ results page (Scoring Dashboard). Three panels side by side: 'Column Scores', 'Rule Breakdown', 'Failed Records'.]**
NARRATION: "After you run a check, Failed Records is the third panel — always visible, no tab to click."

**[SCREEN: Failed Records panel. A row of pill buttons across the top, one per failing rule: 'not null (70)', 'regex match (44)'. 'not null (70)' is highlighted.]**
NARRATION: "Each failing rule gets its own pill with a live failure count. Click one to switch the table below to that rule's failing rows."

**[SCREEN: Below the pills, the rule's Description (if one was set), then a one-line plain-English summary, then the table — row number, a handful of data columns, with the violating column (email) highlighted in red.]**
NARRATION: "If you wrote a Description when you created the rule, it shows right here — context before you even look at the rows. Then the table itself, with the column that broke the rule highlighted so you don't have to hunt for it."

**[SCREEN: Click the 'Column Scores' panel, then click the 'email' card. Both 'Rule Breakdown' and 'Failed Records' narrow to just email's rules.]**
NARRATION: "Click any column score to filter the whole view — Rule Breakdown and Failed Records both narrow down instantly."

**[SCREEN: In the middle 'Rule Breakdown' panel, click the red 'BREAKING' badge next to a rule. A popup opens with the same Failed Records table, pre-scoped to that exact rule.]**
NARRATION: "You can also jump here directly — click any BREAKING badge in Rule Breakdown, and a popup opens already scoped to that rule, no scrolling required."

**[SCREEN: Click 'Download CSV (70 rows)'. File downloads with a 'Rules Violated' column alongside the original data.]**
NARRATION: "Download the failed records as a CSV — it includes every row currently in view, plus which rule or rules each one violated. Hand it to the data owner, fix it, then re-upload."

**CTA:** Failed records give you a precise hit list for fixing your data — no manual searching required.

---

### VIDEO 31 — Score Transparency Panel

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (post-run)

**[SCREEN: DQ results. Click 'Score Transparency' tab.]**
NARRATION: "The Score Transparency panel shows exactly how your final score was calculated — rule by rule, weight by weight."

**[SCREEN: Table: Rule name, Column, Pass/Fail, Weight, Score contribution, Penalty.]**
NARRATION: "Every rule is listed. Pass or fail. Its weight. How many points it contributed. How many points it penalized."

**[SCREEN: Under the email Completeness row, a muted line of text — the rule's own Description, written when the rule was created: 'Email is required so Sales can follow up within 24 hours.']**
NARRATION: "If the rule has a Description, it shows right under the rule — context for the score, not just a number."

**[SCREEN: Highlight: email Completeness — BREAKING — Weight 3 — Penalty 18.2 points.]**
NARRATION: "Email completeness is breaking — Sohovi's word for a failing rule — and because it had weight 3, it cost 18 points. That is the biggest drag on the score."

**[SCREEN: Click the red 'BREAKING' badge on the email Completeness row. A 'Failed Records' popup opens, pre-scoped to that rule, with a CSV download.]**
NARRATION: "Click that BREAKING badge and a Failed Records popup opens straight from this panel — the exact rows, ready to download — without leaving Score Transparency."

**[SCREEN: Highlight: id Uniqueness — PASS — Weight 4 — Contribution 20 points.]**
NARRATION: "ID uniqueness passed, and because it is weight 4, it added 20 points. Passing rules contribute their full weight."

**[SCREEN: Bottom of panel: formula shown — weighted average of all rule outcomes.]**
NARRATION: "The final score is a weighted average. No surprises. No black box. You can verify the calculation yourself."

**CTA:** Use score transparency to explain your DQ score to stakeholders — not just '52', but here is exactly why.

---

### VIDEO 32 — Comparing Runs Over Time

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (two runs — before and after cleanup)

**[SCREEN: Data Asset page. 'Run History' tab. Shows two runs: Run 1 score 52 Jan 15, Run 2 score 89 Jan 22.]**
NARRATION: "Every time you run a DQ check, Sohovi saves the result. Over time you build a history — and can compare any two runs."

**[SCREEN: Click 'Compare Runs'. Select Run 1 and Run 2. Click 'Compare'.]**
NARRATION: "Click Compare Runs, select two runs, and click Compare."

**[SCREEN: Side-by-side comparison. Left: Run 1 score 52. Right: Run 2 score 89. Delta: +37 points.]**
NARRATION: "Both scores side by side, and the delta — a 37-point improvement."

**[SCREEN: Rule-level comparison: email Completeness Run 1 BREAKING to Run 2 PASS. email Validity Run 1 BREAKING to Run 2 PASS. phone Validity Run 1 BREAKING to Run 2 PASS.]**
NARRATION: "Each rule shows whether its status changed between runs. You can see exactly which fixes moved the needle."

**[SCREEN: Schema comparison: Run 1 — 6 columns. Run 2 — 6 columns. 'No schema changes detected'.]**
NARRATION: "The schema comparison shows whether any columns were added, removed, or renamed between runs."

**CTA:** Run comparison is your proof of improvement — great for showing stakeholders that your cleanup work paid off.

---

### MONITORING AND REPORTING

---

### VIDEO 33 — Create a Score-Drop Alert

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** None

**[SCREEN: Data Asset page. Click 'Alerts' tab. Empty state. Click 'Create Alert'.]**
NARRATION: "Alerts tell you when something goes wrong — without you having to check manually every day."

**[SCREEN: Alert type selector: 'Score Drop' and 'Schema Change'. Click 'Score Drop'.]**
NARRATION: "Select Score Drop. This alert fires when your DQ score falls below a threshold you set."

**[SCREEN: Alert form: Threshold (score number), Notification email (pre-filled with account email).]**
NARRATION: "Set the threshold. I'll use 80. If the score drops below 80, I want to know immediately."

**[SCREEN: Notification email pre-filled. Option to add additional emails.]**
NARRATION: "Notifications go to your email by default. Add additional addresses — like a team lead or a data engineer."

**[SCREEN: Click 'Save Alert'. Alert appears in list: 'Score Drop Alert — threshold 80 — Active'.]**
NARRATION: "Save it. The alert is now active. Next time you run a DQ check and the score is below 80, you will get an email."

**CTA:** Set score alerts for any asset where data quality is business-critical.

---

### VIDEO 34 — Create a Schema Change Alert

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** None

**[SCREEN: Alerts tab. Click 'Create Alert' then select 'Schema Change'.]**
NARRATION: "A Schema Change alert fires when the structure of your data changes — columns added, removed, or renamed."

**[SCREEN: Schema change alert form: Trigger options — 'Any change', 'Column removed only', 'Column added only'.]**
NARRATION: "Choose when to trigger. Any change is the safest option — it catches everything."

**[SCREEN: Select 'Any change'. Notification email filled. Click 'Save'.]**
NARRATION: "Select Any change and save."

**[SCREEN: Alert active. Tooltip: 'This alert fires on the next re-upload if column count or names differ from the last run'.]**
NARRATION: "Next time you re-upload a file, Sohovi compares the schema to the last run. If anything changed, the alert fires before you even run a quality check."

**CTA:** Schema alerts are your early warning system for upstream data pipeline changes you didn't ask for.

---

### VIDEO 35 — View Alert Events

**Platform:** Learn (In-App Tutorial)
**Duration:** 2 minutes
**Dataset:** None

**[SCREEN: Left sidebar. Click 'Alerts' (global page). List of all alerts across all assets.]**
NARRATION: "The global Alerts page shows every alert event across all your data assets in one place."

**[SCREEN: Alert events list: asset name, alert type, triggered date, score at time, status new or reviewed.]**
NARRATION: "When an alert fires, it appears here as an event. You see which asset triggered it, what type of alert, when it happened, and what the score was."

**[SCREEN: Click an alert event row. Detail panel: full run details, what changed, link to the run.]**
NARRATION: "Click any event to see details — including a direct link to the run that triggered it."

**[SCREEN: 'Mark as Reviewed' button. Click — status changes to 'Reviewed'.]**
NARRATION: "Mark alerts as Reviewed once you have investigated them. This keeps your alerts inbox clean and actionable."

**CTA:** Check your Alerts page after each data refresh to stay on top of quality issues across all assets.

---

### VIDEO 36 — Create a Reusable Workflow

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** None

**[SCREEN: Left sidebar. Click 'Workflows'. Empty state. Click 'New Workflow'.]**
NARRATION: "A Workflow is a saved collection of rules you can apply to any data asset. Perfect for recurring data types — like monthly CRM exports or weekly sales reports."

**[SCREEN: Workflow form: Name, Description, then a rule builder identical to the asset-level rules panel.]**
NARRATION: "Give the workflow a name — Customer Data Standard — and build the rules you want to reuse."

**[SCREEN: Add 4 rules: email Completeness 95%, email Validity email format, id Uniqueness 100%, phone Validity phone pattern.]**
NARRATION: "I will add the four rules I always apply to customer data. These are my standards for any file with customer information."

**[SCREEN: Click 'Save Workflow'. Workflow appears in list with 4 rules visible as chips.]**
NARRATION: "Save the workflow. Now I can apply these exact 4 rules to any asset in one click — without rebuilding them every time."

**CTA:** Create workflows for every recurring data type your team works with.

---

### VIDEO 37 — Apply a Workflow to a New Upload

**Platform:** Learn (In-App Tutorial)
**Duration:** 2 minutes
**Dataset:** A (new upload scenario)

**[SCREEN: New Data Asset created. CustomerDB.csv uploaded and profiled.]**
NARRATION: "You have uploaded a new file. Instead of manually adding rules one by one, apply a saved workflow."

**[SCREEN: Rules tab. Button: 'Apply Workflow'. Click it. Dropdown: 'Customer Data Standard'.]**
NARRATION: "In the Rules tab, click Apply Workflow. Select the workflow you want to use."

**[SCREEN: Select 'Customer Data Standard'. 4 rules added instantly to the rules list.]**
NARRATION: "All four rules added instantly. The workflow maps its rules to matching column names automatically."

**[SCREEN: One rule has a yellow warning: 'phone column not found in this dataset — rule skipped'.]**
NARRATION: "If a column from the workflow does not exist in the new file, Sohovi skips that rule and warns you — rather than failing silently."

**[SCREEN: Click 'Run DQ Check'. Score appears.]**
NARRATION: "Consistent quality checks, every time, for every file of the same type."

**CTA:** Workflows turn data quality from a one-off task into a repeatable process.

---

### VIDEO 38 — Remediate Failed Records

**Platform:** Learn (In-App Tutorial)
**Plan:** Business plan required (`PlanGate minPlan="business"` on the Remediation route) — not visible to Free or Pro users. Frame for existing Business customers, not cold acquisition.
**Duration:** 3 minutes
**Dataset:** A (post-run, failed records visible)

**[SCREEN: Failed Records tab. 70 rows with email violations. Download button at top.]**
NARRATION: "Remediation is the process of fixing the bad records. Sohovi identifies them — then you fix them in your source system."

**[SCREEN: Click 'Download Failed Records'. CSV downloads with a 'violation_reason' column appended.]**
NARRATION: "Download the failed records. The file includes a violation_reason column so whoever fixes the data knows exactly what is wrong with each row."

**[SCREEN: Open downloaded file in Excel. violation_reason column: 'email null value', 'email invalid format'.]**
NARRATION: "Open it in Excel. Each row has its violation explained. Email null value means the email is missing. Email invalid format means it is there but wrong."

**[SCREEN: Fix the records — add missing emails, correct typos. Save as fixed_CustomerDB.csv.]**
NARRATION: "Fix what you can — add the missing emails, correct the typos. Save the fixed file."

**[SCREEN: Back in Sohovi. Click 'Upload New Version'. Upload the fixed file.]**
NARRATION: "Upload the fixed version as a new version of the same asset."

**[SCREEN: Run DQ Check on new version. Score jumps from 52 to 89.]**
NARRATION: "Run the check. The score jumps from 52 to 89. The remediation worked."

**CTA:** Remediation is a cycle — download, fix, re-upload, re-run. Repeat until your score meets your target.

---

### VIDEO 39 — Export DQ Reports

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (post-run with results)

**[SCREEN: Data Asset results page. Button top-right: 'Export Report'. Click it.]**
NARRATION: "Need to share your data quality results with a manager, client, or compliance team? Export a report."

**[SCREEN: Export modal. Format options: PDF, Excel XLSX. Report scope: 'This run only' or 'Full run history'.]**
NARRATION: "Choose PDF for sharing or presenting. Choose Excel if you want the raw numbers to work with further."

**[SCREEN: Select PDF. Scope: 'This run only'. Click 'Generate Report'.]**
NARRATION: "I will generate a PDF report for this single run."

**[SCREEN: PDF report shows: asset name, run date, overall score 52/100, rule breakdown table, failed record count, column scores.]**
NARRATION: "The report includes the overall score, rule-by-rule breakdown, failed record counts, and column-level scores. Everything a stakeholder needs in one document."

**[SCREEN: Excel version shown. Separate sheets: Summary, Rule Results, Failed Records, Column Scores.]**
NARRATION: "The Excel version has separate sheets for each section — great for building your own dashboards on top of the data."

**CTA:** Export reports after every major run to keep a paper trail of your data quality over time.

---

## Part 3: YouTube & Instagram Videos

> **Tone:** Fun, punchy, SEO-first. Hook in the first 5 seconds. Relatable pain points. Everyday analogies. End with a clear CTA.

---

### FREE TOOLS SERIES

---

### VIDEO 40 — Free Online Test Data Generator (No Sign-Up Required)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "free test data generator", "generate fake csv data online", "create sample data for testing"
**Duration:** 90 seconds
**Dataset:** None (demo IS the tool)

**Hook:** "Your dev environment needs 1,000 realistic customer records — but you cannot use real customer data. Here is the free tool that solves this in 30 seconds."

**[SCREEN: sohovi.com/tools/test-data-generator — tool loads instantly, no login prompt.]**
NARRATION: "Go to sohovi.com/tools/test-data-generator. No account. No credit card. Nothing."

**[SCREEN: Click the 'Customer list' quick preset. Six columns auto-populate: id, first_name, last_name, email, phone, country.]**
NARRATION: "Click the Customer list preset. Six columns appear instantly — ID, name, email, phone, country."

**[SCREEN: Change row count to 1000. Click Generate. File downloads instantly — no waiting, no upload step.]**
NARRATION: "Set row count to 1,000. Hit Generate. Done. One thousand realistic fake customers — names, emails, phone numbers, countries — all fabricated, all usable."

**[SCREEN: Open the downloaded CSV in Excel/Preview. Names look real. Emails follow real patterns. Phones formatted correctly.]**
NARRATION: "These are not random strings. They look like real data — which means your tests actually test something."

**[SCREEN: Scroll down to the 'Industry presets' row. Click 'SaaS subscriptions'. Six new columns auto-populate: subscription_id, customer_email, plan, mrr, signup_date, subscription_status.]**
NARRATION: "Need something industry-specific? There are presets for supply chain, finance, insurance claims, healthcare, HR, dropshipping, and SaaS — each with fields that actually make sense for that domain."

**[SCREEN: Click 'Add Column'. Select type 'Company name'. Column added live.]**
NARRATION: "Or build your own. 28 column types available — UUID, boolean, date, URL, lorem ipsum, SKU, plan tier, salary, and more."

**[SCREEN: Toggle output format to JSON. Click Download. File saves.]**
NARRATION: "Download as CSV or JSON. Use it to seed your database, test your API, or demo your app — all without touching real customer data."

**[SCREEN: URL bar showing sohovi.com/tools/test-data-generator.]**
NARRATION: "Free. Private. Fast. sohovi.com/tools/test-data-generator — link in description."

**CTA:** Link in description. No account needed — just go and generate.

---

### VIDEO 41 — How to Remove Duplicate Rows from a CSV (Free Tool, No Excel Needed)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "remove duplicate rows csv online free", "find duplicates in csv", "csv duplicate remover"
**Duration:** 90 seconds
**Dataset:** A (CustomerDB.csv with 50 duplicate rows)

**Hook:** "Plot twist — your customer list has 50 people in it twice. Your last email campaign hit them all twice. Here is how to fix it in 30 seconds, no Excel required."

**[SCREEN: sohovi.com/tools/remove-duplicates — clean simple UI with a file drop zone.]**
NARRATION: "Go to Sohovi's free Duplicate Row Remover. Drop your CSV file in."

**[SCREEN: Drop CustomerDB.csv. File name appears. Progress bar. Result: '550 rows uploaded. 50 duplicate rows found'.]**
NARRATION: "It scans instantly — entirely in your browser. 550 rows uploaded. 50 duplicates found."

**[SCREEN: Preview table shows the duplicate rows highlighted. Option: 'Remove all duplicates' or 'Preview first'.]**
NARRATION: "You can preview the duplicates before removing them — so you know exactly what is getting cut."

**[SCREEN: Click 'Remove All Duplicates'. Row count updates: '500 rows remaining'.]**
NARRATION: "Click Remove All Duplicates. 500 clean rows remain."

**[SCREEN: Click Download. Clean CSV saves to desktop.]**
NARRATION: "Download the clean file. Done. No formulas. No Excel. No VLOOKUP nightmares."

**[SCREEN: Privacy banner: 'Your file never leaves your browser'.]**
NARRATION: "And your data never leaves your browser — so you can safely run this on real customer files."

**CTA:** Free at sohovi.com/tools/remove-duplicates — link in description.

---

### VIDEO 42 — Convert CSV to JSON Online (Free, Instant, No Code)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "convert csv to json online free", "csv to json converter", "csv to json no coding"
**Duration:** 75 seconds
**Dataset:** C (EmployeeDir.csv — clean, good for conversion demo)

**Hook:** "Your backend expects JSON. Your spreadsheet exports CSV. This free tool converts it in one click — and it works on 100,000 rows."

**[SCREEN: sohovi.com/tools/csv-to-json. Drop zone visible.]**
NARRATION: "Go to Sohovi's free CSV to JSON converter. Drop your CSV file in."

**[SCREEN: Drop EmployeeDir.csv. Instant preview of JSON output appears on the right panel.]**
NARRATION: "The JSON output appears instantly on the right. Your column headers become keys, your rows become objects."

**[SCREEN: Output mode toggle: 'Array of objects' selected. Other options: 'Keyed by first column', 'Nested by column'.]**
NARRATION: "Choose your output format. Array of objects is standard. Keyed by first column creates a lookup object — perfect for APIs."

**[SCREEN: Toggle to 'Keyed by first column'. JSON updates live: keys are employee IDs, values are the row objects.]**
NARRATION: "Switch to Keyed — now the employee ID is the key. Much easier to look up individual records."

**[SCREEN: Click Download JSON. File saves.]**
NARRATION: "Download your JSON file. Paste it directly into your API, seed script, or config file."

**CTA:** Free at sohovi.com/tools/csv-to-json — link in description.

---

### VIDEO 43 — Convert JSON to CSV Online (Free, Handles Nested JSON)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "convert json to csv online free", "json to csv converter", "flatten nested json to csv"
**Duration:** 75 seconds
**Dataset:** None (paste JSON directly in demo)

**Hook:** "Someone gave you a JSON file and you need a spreadsheet. Normally that is a 20-minute coding job. Here it is in 10 seconds."

**[SCREEN: sohovi.com/tools/json-to-csv. Two panels: JSON input on left, CSV preview on right.]**
NARRATION: "Go to Sohovi's JSON to CSV converter. Paste your JSON on the left — or upload a file."

**[SCREEN: Paste a sample JSON array of employee objects. Right panel instantly shows a clean CSV table.]**
NARRATION: "Paste the JSON. The CSV preview appears instantly. Column headers are pulled from the keys automatically."

**[SCREEN: Show nested JSON example — objects with a nested 'address' field containing city and country. Tool flattens it: 'address.city', 'address.country' as separate columns.]**
NARRATION: "Got nested objects? Sohovi flattens them automatically. A nested address becomes address.city and address.country — two clean columns."

**[SCREEN: Click Download CSV. Open in Excel — perfectly formatted spreadsheet.]**
NARRATION: "Download as CSV. Open in Excel. It is a perfectly formatted spreadsheet — no manual cleanup."

**CTA:** Free at sohovi.com/tools/json-to-csv — link in description.

---

### VIDEO 44 — Pick, Reorder, and Rename CSV Columns (Free Tool)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "select columns from csv online", "remove columns from csv free", "csv column picker tool"
**Duration:** 75 seconds
**Dataset:** A (CustomerDB.csv — 6 columns, demo dropping phone and reordering)

**Hook:** "Your CSV has 20 columns. You only need 4. Deleting columns in Excel sounds easy until you accidentally delete the wrong one. Here is the safer way."

**[SCREEN: sohovi.com/tools/csv-columns. Drop CustomerDB.csv.]**
NARRATION: "Go to Sohovi's CSV Column Picker. Drop your file in."

**[SCREEN: All 6 columns appear as draggable chips: id, first_name, last_name, email, phone, country. Each has a checkbox and an X.]**
NARRATION: "All your columns appear as cards. Click X to remove any you do not need."

**[SCREEN: Click X on 'phone'. It disappears. Click X on 'country'. Now 4 columns remain.]**
NARRATION: "I will remove phone and country. Now I have exactly the 4 columns I need."

**[SCREEN: Drag 'email' card to second position. Columns now order: id, email, first_name, last_name.]**
NARRATION: "Drag to reorder. I want email second for my CRM import."

**[SCREEN: Double-click 'first_name'. Rename field appears. Type 'name'. Column chip updates to 'name'.]**
NARRATION: "Double-click any column to rename it. first_name becomes just name."

**[SCREEN: Click Download. New CSV with 4 columns in the right order.]**
NARRATION: "Download. 4 columns, in the right order, with the right names. Ready to import."

**CTA:** Free at sohovi.com/tools/csv-columns — link in description.

---

### VIDEO 45 — Convert CSV to a Markdown Table (Free, GitHub-Ready)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "csv to markdown table converter", "convert spreadsheet to markdown", "csv to markdown github"
**Duration:** 60 seconds
**Dataset:** C (EmployeeDir.csv)

**Hook:** "You are writing documentation in Markdown and you need a table. Copying from a spreadsheet is a disaster. This takes 5 seconds."

**[SCREEN: sohovi.com/tools/csv-to-markdown. Drop EmployeeDir.csv.]**
NARRATION: "Drop your CSV into Sohovi's CSV to Markdown converter."

**[SCREEN: Markdown table output appears instantly. Pipes, dashes, aligned columns — perfect GitHub Markdown syntax.]**
NARRATION: "Instant Markdown table. Correct syntax, pipes, header row separator — ready to paste into any README or wiki."

**[SCREEN: Alignment selector: Left, Center, Right per column. Change 'id' to Right-aligned. Table updates.]**
NARRATION: "Set column alignment per column. Numbers look better right-aligned."

**[SCREEN: Click 'Copy to Clipboard'. Paste into a GitHub README file. Table renders perfectly.]**
NARRATION: "Copy to clipboard. Paste into your README. Renders perfectly in GitHub."

**CTA:** Free at sohovi.com/tools/csv-to-markdown — link in description.

---

### VIDEO 46 — Generate SQL INSERT Statements from CSV (Free, Supports MySQL, PostgreSQL, SQLite)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "csv to sql insert statements free", "generate sql from csv online", "convert csv to sql"
**Duration:** 90 seconds
**Dataset:** C (EmployeeDir.csv)

**Hook:** "You have a spreadsheet. Your database needs SQL INSERT statements. Normally that is a Python script or a long afternoon. Here it is in 20 seconds — free."

**[SCREEN: sohovi.com/tools/csv-to-sql. Drop EmployeeDir.csv.]**
NARRATION: "Go to Sohovi's CSV to SQL generator. Drop your CSV in."

**[SCREEN: SQL output appears instantly: INSERT INTO table_name (employee_id, first_name, last_name, email...) VALUES (1, 'James', 'Smith', 'james@...')...]**
NARRATION: "SQL INSERT statements generated instantly. One statement per row. Column names from your headers."

**[SCREEN: Database selector: MySQL, PostgreSQL, SQLite, MSSQL. Switch to PostgreSQL. Syntax updates — quotes change to match Postgres style.]**
NARRATION: "Pick your database engine. MySQL, PostgreSQL, SQLite, or SQL Server. The syntax adjusts automatically."

**[SCREEN: Table name field: currently 'table_name'. Type 'employees'. SQL updates: INSERT INTO employees...]**
NARRATION: "Set the table name. The SQL updates live."

**[SCREEN: Option: 'Batch INSERT' toggle on. Multiple rows combine into single INSERT statement.]**
NARRATION: "Turn on Batch INSERT to combine rows into a single statement — much faster for large imports."

**[SCREEN: Click Download SQL. File saves as employees.sql.]**
NARRATION: "Download the SQL file. Run it against your database. 100 rows inserted in one command."

**CTA:** Free at sohovi.com/tools/csv-to-sql — link in description.

---

### VIDEO 47 — Merge Multiple CSV Files into One (Free Tool)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "merge multiple csv files into one online free", "combine csv files free tool", "stack csv files"
**Duration:** 75 seconds
**Dataset:** Use two copies of Dataset C with slightly different rows

**Hook:** "You have 12 monthly CSV exports. Your boss wants one file. Doing this manually in Excel is a copy-paste nightmare. Here is how to merge all of them in 10 seconds."

**[SCREEN: sohovi.com/tools/csv-merger. Multiple file upload zone.]**
NARRATION: "Go to Sohovi's CSV Merger. Drop all your files in at once — up to 10 files supported."

**[SCREEN: Drop EmployeeDir_Jan.csv and EmployeeDir_Feb.csv. Both files appear in a list with row counts: File 1: 100 rows. File 2: 100 rows.]**
NARRATION: "I will drop two monthly employee exports. Both appear in the list with their row counts."

**[SCREEN: Schema preview shows both files have the same columns. Green checkmark: 'Schemas match'.]**
NARRATION: "Sohovi checks that both files have matching columns. Green checkmark — schemas match. Safe to merge."

**[SCREEN: Toggle: 'Stack mode' vs 'Schema union mode'. Stack mode selected — all rows combined vertically.]**
NARRATION: "Stack mode combines rows vertically — good when both files have identical columns. Schema union mode handles files with different columns, filling blanks where needed."

**[SCREEN: Click Merge. Preview shows 200 combined rows.]**
NARRATION: "Click Merge. 200 combined rows — both files stacked into one."

**[SCREEN: Click Download. Single merged CSV saves.]**
NARRATION: "Download the merged file. One clean CSV instead of 12 separate ones."

**CTA:** Free at sohovi.com/tools/csv-merger — link in description.

---

### VIDEO 48 — Excel Formula Explainer (Paste Any Formula, Get Plain English)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "excel formula explainer tool", "what does this excel formula do", "understand complex excel formula"
**Duration:** 75 seconds
**Dataset:** None (paste formula directly)

**Hook:** "Someone left you this formula: =IF(VLOOKUP(A2,Sheet2!A:C,3,FALSE)>100,SUM(B2:B10)*0.9,'N/A') — and zero explanation. Here is how to decode it in seconds."

**[SCREEN: sohovi.com/tools/formula-explainer. Large text area labeled 'Paste your formula here'.]**
NARRATION: "Go to Sohovi's Formula Explainer. Paste any Excel or Google Sheets formula."

**[SCREEN: Paste: =IF(VLOOKUP(A2,Sheet2!A:C,3,FALSE)>100,SUM(B2:B10)*0.9,'N/A'). Click Explain.]**
NARRATION: "Paste the formula. Click Explain."

**[SCREEN: Plain-English breakdown appears: 'This formula looks up the value in cell A2 in the first column of Sheet2 columns A through C. If the matching value in the third column is greater than 100, it calculates the sum of B2 to B10 multiplied by 0.9 (a 10% discount). Otherwise it returns N/A'.]**
NARRATION: "Plain English breakdown — instantly. It explains every nested function, what each argument means, and what the formula actually does end to end."

**[SCREEN: Individual function highlights: VLOOKUP highlighted in blue with its own explanation. IF highlighted in green. SUM highlighted in orange.]**
NARRATION: "Each function is highlighted separately. Click any one to see just that part explained."

**[SCREEN: Paste a simpler formula: =SUMIF(C:C,'Marketing',D:D). Explanation: 'Adds all values in column D where the corresponding value in column C equals Marketing'.]**
NARRATION: "Works on any formula — simple or nested 10 levels deep. 40-plus functions supported."

**CTA:** Free at sohovi.com/tools/formula-explainer — link in description.

---

### DATA QUALITY CONCEPTS SERIES

---

### VIDEO 49 — What Is Data Quality? (And Why Bad Data Costs Real Money)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "what is data quality", "why data quality matters", "data quality explained"
**Duration:** 2 minutes
**Dataset:** None (concept video)

**Hook:** "IBM estimated that bad data costs the US economy $3.1 trillion per year. Trillion. With a T. Here is what data quality actually means — and why it is your problem too."

**[SCREEN: Text on screen: '$3.1 Trillion. Per year. Because of bad data.']**
NARRATION: "Bad data is not a tech problem. It is a business problem. Wrong customer emails mean missed revenue. Duplicate invoices mean double payments. Missing records mean bad decisions."

**[SCREEN: Simple diagram: Data enters a system — some good (green), some bad (red). Bad data flows into reports, dashboards, emails, decisions.]**
NARRATION: "Data quality is the measure of how fit your data is for its intended use. It is not about perfection — it is about whether your data is reliable enough to act on."

**[SCREEN: Five dimension labels appear one by one: Completeness, Accuracy, Validity, Uniqueness, Consistency.]**
NARRATION: "There are five dimensions of data quality. Completeness — is everything there? Accuracy — are the values correct? Validity — do they follow the right format? Uniqueness — are there duplicates? Consistency — does related data agree?"

**[SCREEN: Sohovi dashboard showing a DQ score gauge at 47/100 with column cards below.]**
NARRATION: "Sohovi measures all five dimensions automatically — uploads a file, profiles every column, runs your rules, gives you a score from 0 to 100."

**[SCREEN: Score jumps from 47 to 91 after cleanup.]**
NARRATION: "Fix the issues. Re-run. Watch the score climb. Data quality is not a one-time project — it is an ongoing practice."

**CTA:** Start measuring your data quality for free at sohovi.com — link in description.

---

### VIDEO 50 — The 5 Dimensions of Data Quality Explained with Examples

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "5 dimensions of data quality", "data quality dimensions examples", "completeness accuracy validity"
**Duration:** 2.5 minutes
**Dataset:** A (CustomerDB.csv for examples)

**Hook:** "Data quality has five dimensions. Most people only check one. Here is what all five mean — with real examples from a customer database."

**[SCREEN: Title card: 'Dimension 1: Completeness'.]**
NARRATION: "Completeness — is the data all there? In our customer list, 70 email addresses are blank. That is a completeness problem. Sohovi shows it as a 12.7% null rate on the email column."

**[SCREEN: Title card: 'Dimension 2: Accuracy'.]**
NARRATION: "Accuracy — are the values correct? In our sales file, some order amounts are negative. A sale cannot be negative. That is an accuracy problem — the value exists, but it is wrong."

**[SCREEN: Title card: 'Dimension 3: Validity'.]**
NARRATION: "Validity — do values follow the right format? Our phone column has entries like '00000000000' and 'N/A'. Those are not phone numbers. Validity rules catch anything that does not match the expected pattern."

**[SCREEN: Title card: 'Dimension 4: Uniqueness'.]**
NARRATION: "Uniqueness — are there duplicates? We have 50 duplicate rows in our customer file. Same person, same email, same everything — twice. Uniqueness rules flag every one of them."

**[SCREEN: Title card: 'Dimension 5: Consistency'.]**
NARRATION: "Consistency — does related data agree? If a customer's region is set to US but their currency is EUR, something is inconsistent. Consistency rules catch these cross-column contradictions."

**[SCREEN: Sohovi profiling dashboard with all five dimension types highlighted across column cards.]**
NARRATION: "Sohovi checks all five dimensions automatically. You set the rules, it runs the checks, it gives you a score."

**CTA:** Free at sohovi.com — link in description.

---

### VIDEO 51 — What Is Data Profiling? (The Step Everyone Skips Before Analysis)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "what is data profiling", "data profiling explained", "data profiling example"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv)

**Hook:** "Most people load data into a dashboard and hope for the best. Data profiling is the step that tells you whether your data is actually trustworthy — before you build anything on top of it."

**[SCREEN: Analogy graphic: a doctor checking vitals before surgery — stethoscope, charts, checkboxes.]**
NARRATION: "Think of data profiling like a pre-surgery health check. You would not let a surgeon operate without checking your vitals first. You should not build a dashboard without checking your data first."

**[SCREEN: CustomerDB.csv uploaded to Sohovi. Profiling dashboard loads with column cards.]**
NARRATION: "Data profiling examines every column and answers three questions: What is in here? How much of it is missing? Does it follow the expected patterns?"

**[SCREEN: Scroll through column cards — email shows 12.7% null, id shows 50 duplicates, phone shows 4% invalid pattern.]**
NARRATION: "In under 5 seconds, Sohovi profiled 550 rows and found: 70 missing emails, 50 duplicate rows, and 22 invalid phone numbers. Without profiling, you would have no idea."

**[SCREEN: Stat: 'All processing runs in your browser. Zero uploads to any server'.]**
NARRATION: "And since all processing runs in your browser, you can safely profile real customer data — nothing is ever sent to a server."

**CTA:** Profile your own data for free at sohovi.com — link in description.

---

### VIDEO 52 — How DQ Scores Work in Sohovi

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality score explained", "how to measure data quality", "data quality scoring"
**Duration:** 2 minutes
**Dataset:** A (post-run, score 52)

**Hook:** "A data quality score is like a credit score for your data. One number that tells you how trustworthy it is — and a breakdown that tells you exactly why."

**[SCREEN: DQ score gauge at 52/100, amber. Color bands visible on the side: green, teal, amber, red.]**
NARRATION: "Sohovi scores your data from 0 to 100 based on the rules you set. Green is excellent — 95 and above. Teal is good — 80 to 94. Amber means investigate. Red means fix this before you use it."

**[SCREEN: Score Transparency panel — rule list with weights and contributions.]**
NARRATION: "The score is a weighted average of your rule results. Each rule has a weight — how important it is — and a pass or fail result."

**[SCREEN: Highlight: email Completeness — BREAKING — Weight 3 — cost 18 points. id Uniqueness — PASS — Weight 4 — earned 20 points.]**
NARRATION: "A failing rule with high weight costs you the most points. A passing rule with high weight earns you the most. It is transparent — you can verify every number."

**[SCREEN: Second run after cleanup — score 89. Delta shown: +37 points.]**
NARRATION: "Fix your data issues, re-run, and the score improves. The score tracks progress over time — not just a one-time judgment."

**CTA:** See your data score for free at sohovi.com — link in description.

---

### VIDEO 53 — What Are Data Quality Rules? (And How to Set Them Without Being a Data Engineer)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "what are data quality rules", "data quality rules examples", "how to set data quality rules"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv — rules panel)

**Hook:** "A data quality rule is just a question you ask about your data. Is this field empty? Is this number negative? Does this email look valid? Here is how to turn those questions into automated checks."

**[SCREEN: Sohovi rules panel. Empty. Click Add Rule.]**
NARRATION: "A data quality rule is a condition your data must meet. If the condition is not met, the row fails. It is that simple."

**[SCREEN: Add Completeness rule on email — 95% threshold. Rule saved.]**
NARRATION: "Rule one: the email column must be at least 95% complete. Any file where more than 5% of emails are blank — fails this rule."

**[SCREEN: Add Validity rule on email — email format regex preset.]**
NARRATION: "Rule two: every non-blank email must follow the standard email format. 'notanemail' or 'john@' — fails."

**[SCREEN: Add Uniqueness rule on id — 100% threshold.]**
NARRATION: "Rule three: every ID must be unique. Any duplicate ID — fails."

**[SCREEN: Three rules in the list. Click Run DQ Check. Score appears: 52/100. Failed records show.]**
NARRATION: "Three rules. One click to run. You get a score, a list of every failing row, and exactly which rule each row broke."

**[SCREEN: AI Suggestions button. Click it. Six rules suggested instantly.]**
NARRATION: "Not sure which rules to add? Click Get AI Suggestions — Sohovi recommends rules based on your column types and profiling results."

**CTA:** Set your first rule free at sohovi.com — link in description.

---

### VIDEO 54 — Data Completeness Explained: What It Means and Why Missing Values Break Everything

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data completeness explained", "what is completeness in data quality", "missing data problems"
**Duration:** 2 minutes
**Dataset:** A (email column with 12.7% null)

**Hook:** "You sent an email campaign to 10,000 customers. 1,270 of them never got it. Why? 12.7% of your email column was blank. That is a completeness problem."

**[SCREEN: CustomerDB.csv email column card. Stat: '70 null values — 12.7% of column'.]**
NARRATION: "Completeness measures how much of your data is actually there. A column with 12.7% null values means 127 out of every 1,000 records are missing that field."

**[SCREEN: Visual: 1,000 boxes. 127 turn red and go blank. Labelled 'Missing emails = missed customers'.]**
NARRATION: "Missing values are not just inconvenient — they are revenue. Missed emails. Undelivered invoices. Reports with wrong totals."

**[SCREEN: Sohovi Completeness rule on email — threshold 95%. Run. Rule FAILS. Shows '70 rows flagged'.]**
NARRATION: "Set a Completeness rule with a 95% threshold. Run the check. Sohovi flags every single row with a missing email — so you can fix them."

**[SCREEN: Download failed records. Fix in Excel. Re-upload. Score jumps from 52 to 71.]**
NARRATION: "Fix the missing values, re-upload, re-run. Your score improves and your next campaign reaches everyone it should."

**CTA:** Check your data completeness for free at sohovi.com — link in description.

---

### VIDEO 55 — Data Accuracy Explained: When Data Exists But Is Just Wrong

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data accuracy in data quality", "what is data accuracy", "inaccurate data examples"
**Duration:** 2 minutes
**Dataset:** B (SalesQ1.csv — negative amounts)

**Hook:** "Your sales report says revenue was minus $2,500 last quarter. The data is not missing — it is just wrong. That is a data accuracy problem. Here is how to catch it automatically."

**[SCREEN: SalesQ1.csv amount column. Outlier section shows 10 negative values.]**
NARRATION: "Accuracy measures whether values are correct — not just present. A negative sale amount exists in the data, but it is clearly wrong."

**[SCREEN: Accuracy rule: amount — greater than — 0. Weight 4. Save.]**
NARRATION: "Add an Accuracy rule: amount must be greater than zero. Any negative or zero value is a violation."

**[SCREEN: Run DQ Check. Score shows 71/100. Failed records: 10 rows with negative amounts highlighted.]**
NARRATION: "Run the check. 10 rows fail. The report immediately shows which rows, which amounts, and how far off they are."

**[SCREEN: Download failed records. Fix in source system. Re-upload. Score improves to 95.]**
NARRATION: "Fix those 10 rows in your source system. Re-upload. Score jumps to 95. Your revenue report is now trustworthy."

**CTA:** Catch accuracy problems before they reach your dashboard — free at sohovi.com.

---

### VIDEO 56 — Data Validity Explained: When the Format Is Wrong (Even If the Value Exists)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data validity in data quality", "what is data validity", "invalid data format examples"
**Duration:** 2 minutes
**Dataset:** A (phone and email columns with invalid formats)

**Hook:** "Your phone column has 'N/A', '00000000000', and '555-CALL-ME' in it. The cells are not empty — they just contain garbage. That is a validity problem."

**[SCREEN: CustomerDB.csv phone column card. Pattern analysis: 76% valid US format, 20% other format, 4% invalid.]**
NARRATION: "Validity checks whether values follow the expected format or pattern. A phone number that is just the word 'N/A' is not technically missing — it just is not a phone number."

**[SCREEN: Validity rule: phone — US phone format preset — threshold 95%. Save.]**
NARRATION: "Add a Validity rule using the US phone format preset. Anything that does not match the pattern is flagged."

**[SCREEN: Run. Failed records shows 22 rows — the ones with N/A and 00000000000 values.]**
NARRATION: "22 rows fail. Exactly the ones we put invalid values in. You now have a list of every record with a bad phone number."

**[SCREEN: Same concept for email — shows 'notanemail' and 'jane@@company.com' as examples of invalid format.]**
NARRATION: "Same principle applies to emails, dates, zip codes, URLs — any field that should follow a specific pattern."

**CTA:** Validate your data formats for free at sohovi.com — link in description.

---

### VIDEO 57 — Data Uniqueness Explained: Duplicates Are Quietly Destroying Your Data

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data uniqueness data quality", "duplicate data problems", "find duplicate records database"
**Duration:** 2 minutes
**Dataset:** A (50 duplicate rows)

**Hook:** "Your CRM has 5,000 customers. Except 800 of them are actually duplicates from when you migrated systems. You have been personalising emails to ghosts."

**[SCREEN: CustomerDB.csv id column card. Stat: 50 duplicate rows found.]**
NARRATION: "Uniqueness measures whether values appear more than once when they should not. Every customer ID should be unique. Every email address should appear only once."

**[SCREEN: Uniqueness rule: id — 100% unique threshold. Run. Score drops. Failed records shows 50 duplicate rows.]**
NARRATION: "Add a Uniqueness rule. Run the check. Sohovi flags every duplicate — all 50 of them."

**[SCREEN: Failed records table. Duplicate rows highlighted in pairs — you can see the original and the copy.]**
NARRATION: "The failed records show the duplicates in pairs — so you can see exactly which rows are the copies."

**[SCREEN: Sohovi free tool: remove-duplicates. Alternative quick fix.]**
NARRATION: "For a quick one-off fix, use Sohovi's free Duplicate Row Remover tool — no account needed, removes duplicates instantly."

**CTA:** Catch duplicates before they reach your reports — free at sohovi.com.

---

### VIDEO 58 — Data Consistency Explained: When Related Data Contradicts Itself

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data consistency data quality", "what is data consistency", "inconsistent data examples"
**Duration:** 2 minutes
**Dataset:** B (SalesQ1.csv — region and currency inconsistency)

**Hook:** "Your sales database says a customer is in the US — but their currency is set to EUR. Neither field is empty. Neither field is invalid. But together they are wrong. That is a consistency problem."

**[SCREEN: SalesQ1.csv. Two columns side by side: region=US, currency=EUR. Red highlight.]**
NARRATION: "Consistency checks whether values across different columns are logically compatible. US region plus EUR currency — that contradiction breaks downstream reporting."

**[SCREEN: Consistency rule: region=US must match currency=USD. Save.]**
NARRATION: "Add a Consistency rule: when region is US, currency must be USD. Simple cross-column logic."

**[SCREEN: Run. Failed records shows rows where the combination is impossible.]**
NARRATION: "Run the check. Every row where the region and currency do not agree gets flagged."

**[SCREEN: Another example: date column year inconsistent with the file's labeled year.]**
NARRATION: "Consistency works for any cross-field logic — dates that do not match the expected year, status fields that contradict each other, discount rates that exceed 100%."

**CTA:** Catch consistency problems before they corrupt your reports — free at sohovi.com.

---

### PROBLEM-SOLVING / HOW-TO SERIES

---

### VIDEO 59 — How to Find Duplicate Emails in Your Customer List (and Fix Them)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "how to find duplicate emails in csv", "remove duplicate emails list", "duplicate email checker free"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv with 50 duplicate rows)

**Hook:** "I once sent a 'Welcome to our newsletter' email to the same person 47 times in one hour. Why? Duplicate records in the database. Here is how to find and fix every duplicate in your customer list — in under 2 minutes."

**[SCREEN: sohovi.com — sign in — Dashboard — New Data Asset — Upload CustomerDB.csv.]**
NARRATION: "Upload your customer CSV to Sohovi. Profiling runs automatically."

**[SCREEN: Profiling dashboard. email column card: 'Unique: 480 of 550 — 50 duplicate values detected'.]**
NARRATION: "Click the email column. Sohovi immediately shows 50 duplicate values — before you even set a rule."

**[SCREEN: Add Uniqueness rule: email — 100% unique. Add second rule: id — 100% unique. Run DQ Check.]**
NARRATION: "Add a Uniqueness rule on email — and one on ID for good measure. Run the check."

**[SCREEN: Failed Records tab. 50 rows flagged. Each row shows the duplicate email with its pair.]**
NARRATION: "50 rows flagged. The Failed Records table shows you every duplicate — paired with its twin."

**[SCREEN: Download Failed Records. Open in Excel. Delete duplicates. Re-upload. Score jumps from 68 to 97.]**
NARRATION: "Download the failed records, remove the duplicates in Excel, re-upload, re-run. Score jumps from 68 to 97."

**CTA:** Stop sending emails twice. Find your duplicates free at sohovi.com — link in description.

---

### VIDEO 60 — How to Check if Your CRM Data Is Complete (Before It Costs You Revenue)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "check crm data quality", "crm data completeness check", "missing data crm export"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv — 70 missing emails)

**Hook:** "Your CRM export has 2,000 contacts. But how many of them are missing an email address? A phone number? A company name? Most people have no idea. Here is how to find out in 30 seconds."

**[SCREEN: Export CustomerDB.csv from a mock CRM. Upload to Sohovi.]**
NARRATION: "Export your CRM data as a CSV and drop it into Sohovi. Profiling runs instantly."

**[SCREEN: Overview: '2 columns with null values detected'. email: 12.7% null. first_name: 0% null.]**
NARRATION: "The overview flags which columns have missing values immediately. Email is 12.7% incomplete. First name is perfect."

**[SCREEN: Add Completeness rules: email 95%, phone 90%, first_name 100%. Run.]**
NARRATION: "Set completeness thresholds for each field. How complete does it need to be for your next campaign?"

**[SCREEN: Score 52/100. Failed records tab shows the specific contacts missing email or phone.]**
NARRATION: "Run the check. The score tells you how complete your CRM is overall. The failed records give you a list of exactly which contacts need filling in."

**[SCREEN: Download failed records. Send to sales team to fill in missing info. Re-upload. Score 91.]**
NARRATION: "Download the incomplete records. Send to your sales team to fill in the gaps. Re-upload. Score 91. Your next campaign reaches everyone."

**CTA:** Check your CRM completeness free at sohovi.com — link in description.

---

### VIDEO 61 — How to Validate Phone Numbers in a CSV (Without Writing a Single Formula)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "validate phone numbers csv", "check phone number format csv free", "phone number validation tool"
**Duration:** 90 seconds
**Dataset:** A (CustomerDB.csv — invalid phone values)

**Hook:** "Your SMS campaign bounced 300 numbers. They were all in your database. They just were not valid phone numbers. Here is how to catch that before your next send."

**[SCREEN: CustomerDB.csv phone column card in Sohovi profiling. Pattern analysis: 4% invalid format.]**
NARRATION: "After uploading to Sohovi, the phone column profile immediately shows 4% of values do not match any valid phone format."

**[SCREEN: Drill down on invalid pattern. Shows actual values: 'N/A', '00000000000', '555-CALL-ME'.]**
NARRATION: "Click in to see the actual invalid values. N/A, all zeros, and a word where digits should be."

**[SCREEN: Add Validity rule: phone — US phone format preset — threshold 95%. Save.]**
NARRATION: "Add a Validity rule using the US phone format preset. Threshold 95% — some international formats are acceptable."

**[SCREEN: Run DQ Check. Failed records: 22 rows with invalid phone numbers listed.]**
NARRATION: "Run the check. 22 rows flagged. Every invalid phone number in the file — listed with the full row context."

**[SCREEN: Download. Fix or remove invalid numbers. Re-upload. Score improves. SMS campaign ready.]**
NARRATION: "Download, fix or remove invalid numbers, re-upload. Your SMS list is now clean."

**CTA:** Validate your phone numbers free at sohovi.com — link in description.

---

### VIDEO 62 — How to Detect Schema Changes in Your Data Automatically

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "detect schema changes automatically", "data schema change detection", "column added removed alert"
**Duration:** 90 seconds
**Dataset:** C (EmployeeDir.csv — then a version with a new column)

**Hook:** "Your upstream data team added a column to your weekly export. Nobody told you. Your pipeline broke at 2am. Here is how to get notified automatically — before that ever happens again."

**[SCREEN: EmployeeDir.csv uploaded to Sohovi. 6 columns profiled. Score 97/100 — clean data.]**
NARRATION: "We have EmployeeDir.csv uploaded and a clean score of 97. Now let's simulate what happens when the source data changes."

**[SCREEN: Upload a new version of EmployeeDir.csv that has an extra column 'department' added.]**
NARRATION: "I will upload a new version of the file — this time with a new column called department added by the source system."

**[SCREEN: Alert banner appears: 'Schema change detected — 1 new column: department. No columns removed'.]**
NARRATION: "Sohovi catches it immediately. Schema change detected — one new column added. This fires before any DQ rules even run."

**[SCREEN: Set up Schema Change Alert. Any change. Email notification. Save.]**
NARRATION: "Set up a Schema Change alert so next time this happens, you get an email automatically."

**[SCREEN: Inbox showing a mock alert email: 'Schema change detected in EmployeeDir — department column added on Jan 22'.]**
NARRATION: "The next time your data source quietly adds or removes a column, you find out via email — not at 2am when something breaks."

**CTA:** Never be surprised by a schema change again — free at sohovi.com.

---

### VIDEO 63 — How to Generate GDPR-Safe Test Data (No Coding, No Real Customer Data)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "gdpr safe test data generator", "fake customer data for testing gdpr", "generate test data without real data"
**Duration:** 2 minutes
**Dataset:** None (demo is the Test Data Generator)

**Hook:** "Your QA team needs realistic customer data for testing. But you cannot share real customer data — GDPR violation. Here is the free tool that solves this permanently."

**[SCREEN: sohovi.com/tools/test-data-generator. No login required.]**
NARRATION: "Sohovi's Test Data Generator creates completely fabricated but realistic-looking data — 100% safe to share, zero GDPR risk."

**[SCREEN: Click Customer list preset. 6 columns appear. Set rows to 1,000. Click Generate.]**
NARRATION: "Click the Customer list preset. Generate 1,000 rows. Every name, email, and phone number is entirely made up."

**[SCREEN: Open the downloaded file. Names look real. Emails follow real patterns. Phones formatted correctly.]**
NARRATION: "They look exactly like real customer records — because the generator uses realistic patterns. Your tests will actually test something meaningful."

**[SCREEN: Add a custom 'subscription_tier' column — type: 'Plan tier'. Column appears, generating Free/Starter/Pro/Business/Enterprise values.]**
NARRATION: "Need fields specific to your app? Add custom columns. 28 types available — plan tiers, currency codes, job titles, and more."

**[SCREEN: Download as CSV. Also toggle to JSON. Download JSON version.]**
NARRATION: "Download as CSV for Excel and Sohovi. Download as JSON for your API or database seed script."

**[SCREEN: Privacy banner: 'All generation happens in your browser. Nothing is sent to any server'.]**
NARRATION: "Everything runs in your browser. No data is ever sent to a server. Share freely with your entire team."

**CTA:** Generate GDPR-safe test data free at sohovi.com/tools/test-data-generator — link in description.

---

### VIDEO 64 — How to Export SQL INSERT Statements from a CSV (No Python, No Scripts)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "convert csv to sql insert statements free", "csv to sql online no code", "generate sql from spreadsheet"
**Duration:** 90 seconds
**Dataset:** C (EmployeeDir.csv)

**Hook:** "You have a spreadsheet. You need SQL. Normally that means a Python script, a library, a virtual environment, and an hour of Stack Overflow. Or — 20 seconds with this free tool."

**[SCREEN: sohovi.com/tools/csv-to-sql. Drop EmployeeDir.csv.]**
NARRATION: "Go to Sohovi's CSV to SQL generator. Drop your CSV in."

**[SCREEN: SQL output generated instantly: INSERT INTO table_name (employee_id, first_name...) VALUES (1, 'James'...).]**
NARRATION: "SQL INSERT statements generated instantly. One per row. Column names pulled from your headers automatically."

**[SCREEN: Type table name: 'employees'. SQL updates live.]**
NARRATION: "Set the table name. SQL updates instantly."

**[SCREEN: Select PostgreSQL from the database dropdown. Syntax adjusts — quote style updates.]**
NARRATION: "Select your database. MySQL, PostgreSQL, SQLite, or SQL Server — syntax adjusts automatically."

**[SCREEN: Enable Batch INSERT mode. 100 rows collapse into a single INSERT statement.]**
NARRATION: "Turn on Batch INSERT. All 100 rows go into a single statement — much faster to execute on large tables."

**[SCREEN: Click Download SQL. File: employees.sql. Run against local database. Done.]**
NARRATION: "Download the .sql file. Run it. Done. No Python. No libraries. No headaches."

**CTA:** Free at sohovi.com/tools/csv-to-sql — link in description.

---

### VIDEO 65 — How to Merge Multiple CSV Files into One (Free, No Excel, No Code)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "merge multiple csv files into one free", "combine csv files online tool", "stack csv files no code"
**Duration:** 90 seconds
**Dataset:** Two copies of Dataset C (Jan + Feb exports)

**Hook:** "12 monthly CSV exports. Your boss wants one file. Option A: copy-paste in Excel for 45 minutes and inevitably mess something up. Option B: use this free tool and be done in 10 seconds."

**[SCREEN: sohovi.com/tools/csv-merger. Multi-file upload zone.]**
NARRATION: "Go to Sohovi's CSV Merger. Drop all your files in at once — up to 10 files supported."

**[SCREEN: Drop both CSV files. File list: EmployeeDir_Jan.csv 100 rows, EmployeeDir_Feb.csv 100 rows.]**
NARRATION: "Both files appear. Sohovi shows the row count for each."

**[SCREEN: Schema check: 'Schemas match — safe to merge'. Green checkmark.]**
NARRATION: "Sohovi automatically checks whether the files have matching columns. Green checkmark — schemas match."

**[SCREEN: Click Merge. Preview: 200 combined rows. Scroll to see Jan rows followed by Feb rows.]**
NARRATION: "Click Merge. 200 combined rows in the preview."

**[SCREEN: Click Download. Single employees_merged.csv saved.]**
NARRATION: "Download. One clean merged file. What used to take 45 minutes now takes 10 seconds."

**CTA:** Free at sohovi.com/tools/csv-merger — link in description.

---

### VIDEO 66 — How to Build a Data Quality Report in Under 5 Minutes

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality report example", "how to create data quality report", "data quality reporting tool free"
**Duration:** 2 minutes
**Dataset:** A (post-run with score 52, then 89 after fix)

**Hook:** "Your manager asks: how good is our data? Most people shrug and say 'pretty good I think'. Here is how to have an actual answer — with a one-page report — in under 5 minutes."

**[SCREEN: Sohovi. Upload CustomerDB.csv. Set up 4 rules. Run DQ Check. Score: 52/100.]**
NARRATION: "Upload your data, set your rules, run the check. Takes under 3 minutes for a 500-row file."

**[SCREEN: Click 'Export Report'. Select PDF. Scope: This run. Generate.]**
NARRATION: "Click Export Report. Select PDF. Generate."

**[SCREEN: PDF report: cover page with asset name and score, rule breakdown table, column scores, failed record count.]**
NARRATION: "The report has everything your manager needs: the overall score, which rules passed and failed, how many records had issues, and which columns are the problem."

**[SCREEN: After fixing data. Run 2 score: 89. Export second report. Two reports side by side showing improvement.]**
NARRATION: "Run it again after cleanup. Export a second report. Now you have proof of improvement — before and after, side by side."

**[SCREEN: Excel export shown — multiple sheets: Summary, Rules, Failed Records.]**
NARRATION: "Need the numbers for a spreadsheet or BI tool? Export as Excel instead — separate sheets for summary, rules, and failed records."

**CTA:** Generate your data quality report free at sohovi.com — link in description.

---

### VIDEO 67 — How to Set Up Automated Data Quality Alerts (So Problems Find You, Not the Other Way Around)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "automated data quality alerts", "data quality monitoring alerts", "get notified when data quality drops"
**Duration:** 90 seconds
**Dataset:** A (alert setup + mock triggered email)

**Hook:** "Most data quality problems are discovered when a report is already wrong and someone is already upset. Here is how to set up alerts that catch problems before that happens."

**[SCREEN: Sohovi. Data Asset page. Click Alerts tab. Create Alert — Score Drop.]**
NARRATION: "In Sohovi, go to any data asset, click Alerts, and create a Score Drop alert."

**[SCREEN: Set threshold to 80. Email pre-filled. Save. Alert active.]**
NARRATION: "Set the threshold to 80. Your email is pre-filled. Save it. The alert is now watching."

**[SCREEN: Create second alert — Schema Change — Any change. Save.]**
NARRATION: "Create a second alert for schema changes. Now you will know if any columns are added or removed from your source data."

**[SCREEN: Mock scenario: new CSV uploaded with issues. Score drops to 61. Alert email arrives in inbox: 'Score Drop Alert — CustomerDB score dropped to 61 — threshold was 80'.]**
NARRATION: "Next time someone uploads a bad file, or the score drops below 80, you get an email immediately — before anyone builds a report on that data."

**[SCREEN: Global Alerts page showing alert events across all assets.]**
NARRATION: "The global Alerts page shows all events across all your data assets in one place. Nothing slips through."

**CTA:** Set up your alerts free at sohovi.com — link in description.

---

### VIDEO 68 — How to Profile a Dataset Before Analysis (The Step That Saves Hours of Debugging)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data profiling before analysis", "how to profile a dataset", "exploratory data analysis csv"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv — fresh upload)

**Hook:** "You spent 3 hours building a pivot table. Then discovered the source data had 800 blank rows you did not know about. Data profiling is the 30-second check that saves you that 3-hour headache."

**[SCREEN: CustomerDB.csv dragged onto Sohovi upload zone. Profiling runs. Dashboard appears.]**
NARRATION: "Drop your CSV into Sohovi. Profiling runs automatically — no setup, no configuration."

**[SCREEN: Overview card: 6 columns profiled. 2 columns with issues. Null rate: 5.2%. Duplicate rows: 50.]**
NARRATION: "In 3 seconds you know: 2 columns have issues, 5.2% overall null rate, 50 duplicate rows. This is your data reality before you touch the analysis."

**[SCREEN: Click email column card. Distribution chart. Null rate 12.7% highlighted red.]**
NARRATION: "The email column is 12.7% incomplete. Any analysis grouping by email will silently exclude those rows."

**[SCREEN: Click phone column. Pattern analysis shows 3 different formats.]**
NARRATION: "The phone column has 3 different formats in it. Any regex or pattern match in your analysis will miss two of them."

**[SCREEN: Profiling dashboard showing outliers in SalesQ1 amount column.]**
NARRATION: "For numeric data, outlier detection flags the values that will skew your mean and corrupt your averages."

**CTA:** Profile before you analyse — free at sohovi.com — link in description.

---

### VIDEO 69 — How to Monitor Data Quality Over Time (Trends, Scores, Run History)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "monitor data quality over time", "track data quality trends", "data quality run history"
**Duration:** 2 minutes
**Dataset:** A (multiple runs — showing trend from 52 to 89)

**Hook:** "Your data quality score was 89 last month. This month it is 61. Something changed in your data pipeline — and you have no idea what or when. Here is how to track quality over time so you always know."

**[SCREEN: Sohovi Run History tab. Multiple runs listed: Run 1 score 52, Run 2 score 71, Run 3 score 89, Run 4 score 61.]**
NARRATION: "Every time you run a DQ check, Sohovi saves the result. Your run history is a timeline of your data quality."

**[SCREEN: Click Compare Runs. Select Run 3 score 89 and Run 4 score 61. Side by side comparison.]**
NARRATION: "Compare any two runs. Run 3 was 89. Run 4 dropped to 61. Something changed."

**[SCREEN: Rule comparison: email Completeness was PASS in Run 3, now BREAKING in Run 4. Null rate jumped from 2% to 18%.]**
NARRATION: "The rule comparison shows that email completeness suddenly jumped from 2% null to 18% null. Something in the data pipeline started dropping email values."

**[SCREEN: Schema comparison: Run 3 had 6 columns. Run 4 has 6 columns. No schema change. The problem is in the data, not the structure.]**
NARRATION: "Schema is unchanged — so it is not a structural problem. The source system is just producing more incomplete records."

**[SCREEN: Score Drop alert in inbox — would have caught this automatically.]**
NARRATION: "If you had a Score Drop alert set at 80, you would have been notified the moment Run 4 processed. This is why alerts matter."

**CTA:** Track your data quality over time — free at sohovi.com.

---

### VIDEO 70 — How to Automatically Detect PII in Your Dataset

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "detect pii in data automatically", "find pii in csv free", "personal data detection tool"
**Duration:** 90 seconds
**Dataset:** A (CustomerDB.csv — PII detected)

**Hook:** "You received a CSV from a vendor. Does it contain personal data? Names? Emails? You need to know before you process it — especially under GDPR. Here is how to check in 10 seconds."

**[SCREEN: CustomerDB.csv dropped into Sohovi. PII banner appears: '3 columns contain PII'.]**
NARRATION: "Drop the file into Sohovi. Profiling runs. PII detection runs automatically in the same step."

**[SCREEN: PII banner expanded: email — email address, phone — phone number, first_name and last_name — personal name.]**
NARRATION: "Three columns flagged: email, phone, and name. All correctly identified as personally identifiable information."

**[SCREEN: Click each PII column card. Orange PII tag visible. GDPR/CCPA note at bottom of each card.]**
NARRATION: "Each PII column gets a tag and a reminder that data protection regulations may apply."

**[SCREEN: id and country columns — no PII tag.]**
NARRATION: "Non-personal columns like ID and country are not flagged. Sohovi is precise — it does not over-flag."

**[SCREEN: Privacy note: 'All PII detection runs in your browser. Raw data never leaves your device'.]**
NARRATION: "And since detection runs entirely in your browser, you can safely scan files that contain real personal data."

**CTA:** Check any file for PII free at sohovi.com — link in description.

---

### VIDEO 71 — How to Fix Bad Data Using Sohovi's Remediation Workflow

**Platform:** YouTube / Blog / Instagram
**Plan:** Business plan required — same caveat as VIDEO 38. If used publicly, the hook/CTA should target teams already evaluating Business, not be framed as a free-tier capability.
**SEO Target:** "how to fix bad data", "data remediation process", "data quality remediation tool"
**Duration:** 2 minutes
**Dataset:** A (post-run, failed records)

**Hook:** "You ran a data quality check and got a score of 47. Congratulations — you now know your data has problems. But now what? Here is the exact process for fixing bad data systematically."

**[SCREEN: Sohovi. Score 47/100. Failed Records tab: 92 rows flagged.]**
NARRATION: "You have 92 failed records across three rule violations. Here is how to fix them systematically."

**[SCREEN: Filter Failed Records to 'email — Completeness'. 70 rows with blank email.]**
NARRATION: "Filter by violation type. Start with the biggest problem — 70 rows with missing email addresses."

**[SCREEN: Click 'Download Failed Records'. CSV downloads with violation_reason column.]**
NARRATION: "Download the failed records. The file includes a violation_reason column — so whoever fixes the data knows exactly what is wrong with each row."

**[SCREEN: Open in Excel. violation_reason column shows 'email: null value'. Fix by adding emails from another source or CRM lookup.]**
NARRATION: "Open in Excel. Add the missing emails from your CRM or customer records. Save the fixed file."

**[SCREEN: Back in Sohovi. Click Upload New Version. Upload fixed file. Run DQ Check. Score 71.]**
NARRATION: "Upload the fixed version. Run again. Score jumps from 47 to 71. Progress."

**[SCREEN: Repeat for email validity failures. Fix, re-upload, re-run. Score 89.]**
NARRATION: "Repeat for the next violation type. Fix. Re-upload. Re-run. Score 89. The remediation cycle — download, fix, upload, re-run — is how you systematically improve data quality."

**CTA:** Start fixing your data today — free at sohovi.com.

---

### VIDEO 72 — How to Use AI to Suggest Data Quality Rules (Without Being a Data Engineer)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "ai data quality rules", "automatic data quality rule suggestions", "data quality rules generator"
**Duration:** 90 seconds
**Dataset:** A (CustomerDB.csv — AI suggestions demo)

**Hook:** "Most people avoid data quality rules because they do not know which rules to set. Sohovi's AI looks at your data and tells you. Here is how."

**[SCREEN: CustomerDB.csv uploaded and profiled. Rules tab — zero rules added. Button: 'Get AI Suggestions'.]**
NARRATION: "You have uploaded your file and profiled it. Rules tab is empty. Click Get AI Suggestions."

**[SCREEN: 6 rule suggestions appear: email Completeness 95%, email Validity, id Uniqueness, phone Validity, first_name Completeness, country Allowed Values.]**
NARRATION: "Sohovi's rule engine analysed your column types and profiling results and suggested 6 rules. These are exactly what a data engineer would set manually."

**[SCREEN: Each suggestion has a confidence indicator — email suggestions are high confidence, phone is medium.]**
NARRATION: "Each suggestion has a confidence level. High confidence means the column type strongly suggests this rule. Medium means it is a good idea to verify."

**[SCREEN: Check all 6. Click Add Selected Rules. 6 rules instantly in the rules list.]**
NARRATION: "Accept all 6 in one click. They are now your active rules — edit any of them if you want to adjust thresholds."

**[SCREEN: Click Run DQ Check. Score 52/100. 3 rules fail.]**
NARRATION: "Run the check. You have a score and a full breakdown — all without writing a single rule from scratch."

**CTA:** Let AI set your first rules free at sohovi.com — link in description.

---

### VIDEO 73 — How to Compare Two Versions of Your Data (Before and After Cleaning)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "compare two csv files data quality", "before after data cleaning comparison", "data quality improvement tracking"
**Duration:** 90 seconds
**Dataset:** A (Run 1 score 52, Run 2 score 89)

**Hook:** "You cleaned your data for two weeks. Now your manager asks: how much better is it? Most people say 'a lot'. Here is how to show the exact numbers — side by side."

**[SCREEN: Sohovi Run History tab. Run 1: score 52, Jan 15. Run 2: score 89, Jan 29.]**
NARRATION: "Sohovi saves every run. Select two runs to compare."

**[SCREEN: Click Compare Runs. Select Run 1 and Run 2. Click Compare.]**
NARRATION: "Click Compare Runs. Select the before and after. Hit Compare."

**[SCREEN: Side-by-side. Left: 52/100 — 3 rules failed — 92 failed records. Right: 89/100 — 0 rules failed — 0 failed records.]**
NARRATION: "Before: 52, three rules failing, 92 bad records. After: 89, zero rules failing, zero bad records."

**[SCREEN: Delta stat prominently displayed: +37 points improvement. Failed records: -92.]**
NARRATION: "+37 point improvement. 92 records fixed. That is your proof of work — concrete, measurable, undeniable."

**[SCREEN: Export both run reports as PDF. Two pages side by side on screen.]**
NARRATION: "Export both runs as PDF reports. Put them in your slide deck. Show your manager the before and after."

**CTA:** Prove your data quality improvements with Sohovi — free at sohovi.com.

---

### SHORTS / QUICK TIPS SERIES

> **Format:** 60 seconds max. Vertical video (9:16). Zero warmup — hook in first 2 seconds. Punchy. Meme-energy. Always end with sohovi.com.

---

### VIDEO 74 — What Is Data Quality? (60-Second Answer)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "what is data quality short", "data quality explained 60 seconds"
**Duration:** 60 seconds
**Dataset:** None

**[SCREEN 0–3s: Bold text — 'What is data quality?']**
NARRATION: "Data quality is how trustworthy your data is."

**[SCREEN 3–10s: Spreadsheet with blank cells, duplicate rows, typos visible.]**
NARRATION: "Low quality data has missing values, duplicates, and incorrect formats — and it silently corrupts every report built on top of it."

**[SCREEN 10–25s: Sohovi score gauge at 47/100, red zone.]**
NARRATION: "Sohovi measures it on a scale of 0 to 100. Five dimensions — completeness, accuracy, validity, uniqueness, consistency."

**[SCREEN 25–40s: Rules being added rapidly — completeness, uniqueness, validity. Click Run. Score animates.]**
NARRATION: "You set your rules — what your data must look like. Sohovi runs the checks and tells you exactly which rows fail and why."

**[SCREEN 40–55s: Score jumps from 47 to 91 after cleanup. Green gauge.]**
NARRATION: "Fix the issues. Re-run. Watch the score climb. Data quality is not a one-time project — it is a habit."

**[SCREEN 55–60s: sohovi.com — 'Free. No credit card'.]**
NARRATION: "Check yours free at sohovi.com."

---

### VIDEO 75 — Your Data Has Problems. You Just Don't Know It. (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "bad data problems", "data quality issues you don't know about"
**Duration:** 60 seconds
**Dataset:** A (profiling dashboard)

**[SCREEN 0–3s: Text — 'You have 10,000 customer records.']**
NARRATION: "You have 10,000 customer records."

**[SCREEN 3–6s: Text — 'How many emails are missing?']**
NARRATION: "How many emails are missing?"

**[SCREEN 6–9s: Text — 'How many are duplicates?']**
NARRATION: "How many are duplicates?"

**[SCREEN 9–12s: Text — 'How many phone numbers are invalid?']**
NARRATION: "How many phone numbers are invalid?"

**[SCREEN 12–30s: CustomerDB.csv profiled in Sohovi. Column cards: email 12.7% null, id 50 duplicates, phone 4% invalid.]**
NARRATION: "Sohovi answers all three questions in under 5 seconds. Upload your CSV. It profiles every column automatically."

**[SCREEN 30–50s: Three rules added. Run. Score 52/100. Failed records table.]**
NARRATION: "Set your rules. Run. You get a score out of 100 and a list of every bad row. No formulas. No SQL."

**[SCREEN 50–60s: Score 52/100. Text: 'Half your data is broken. Now you know. sohovi.com'.]**
NARRATION: "52 out of 100. Awkward. Fix it before it breaks your next report. Free at sohovi.com."

---

### VIDEO 76 — Generate 1,000 Test Rows Instantly (Free Tool, No Code)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "generate test data instantly free", "fake data generator 1000 rows"
**Duration:** 60 seconds
**Dataset:** None (live demo)

**[SCREEN 0–5s: Text — 'Need test data? Right now? Watch.']**
NARRATION: "Need realistic test data? Right now? Watch."

**[SCREEN 5–20s: Open sohovi.com/tools/test-data-generator. Click Customer list preset. Set rows to 1000. Click Generate.]**
NARRATION: "sohovi.com/tools/test-data-generator. Click Customer list preset. Set 1,000 rows. Generate."

**[SCREEN 20–35s: File downloads instantly — 1,000 rows of names, emails, phones, countries.]**
NARRATION: "Done. 1,000 realistic fake customers. Names, emails, phones, countries — all fabricated, all usable."

**[SCREEN 35–45s: Open the CSV to show the data, then toggle format to JSON and download that too.]**
NARRATION: "Download as CSV. Or JSON. One click."

**[SCREEN 45–55s: Text — '28 column types. 10 presets. Up to 100,000 rows. No account. Free.']**
NARRATION: "28 column types. 10 ready-made presets. Up to 100,000 rows. No account required. Completely free."

**[SCREEN 55–60s: sohovi.com/tools/test-data-generator]**
NARRATION: "Link in bio."

---

### VIDEO 77 — Find Duplicate Rows in Any CSV (60 Seconds, Free)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "find duplicates in csv free", "duplicate row finder csv online"
**Duration:** 60 seconds
**Dataset:** A (CustomerDB with 50 duplicates)

**[SCREEN 0–5s: Text — 'Got duplicates in your CSV? Here is the fastest fix.']**
NARRATION: "Got duplicates in your CSV? Here is the fastest fix."

**[SCREEN 5–20s: sohovi.com/tools/remove-duplicates. Drop CustomerDB.csv. Result: '50 duplicate rows found'.]**
NARRATION: "sohovi.com/tools/remove-duplicates. Drop your file. 50 duplicates found. Instantly."

**[SCREEN 20–35s: Preview of duplicate rows. Click Remove All. Row count drops from 550 to 500.]**
NARRATION: "Preview them. Click Remove All. 500 clean rows remain."

**[SCREEN 35–50s: Click Download. Clean CSV saves.]**
NARRATION: "Download. Done. No Excel. No VLOOKUP. No counting by hand."

**[SCREEN 50–60s: Privacy banner + sohovi.com]**
NARRATION: "Your file never leaves your browser. Free at sohovi.com."

---

### VIDEO 78 — What Is a DQ Score? (60-Second Explainer)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "data quality score explained", "what is dq score"
**Duration:** 60 seconds
**Dataset:** A (score gauge animation)

**[SCREEN 0–5s: Score gauge animating from 0 to 52, stopping in red/amber zone. Text: '52/100'.]**
NARRATION: "This is a data quality score. 52 out of 100."

**[SCREEN 5–20s: Color band: below 60 red, 60-79 amber, 80-94 teal, 95+ green. Each zone labelled.]**
NARRATION: "Green is excellent — 95 or above. Teal is good. Amber means investigate. Red means fix this before using the data."

**[SCREEN 20–35s: Score Transparency panel showing rule weights and contributions.]**
NARRATION: "The score is a weighted average of your data quality rules. Each rule has a weight — how critical it is. Each pass adds points. Each fail deducts them."

**[SCREEN 35–50s: Score jumps from 52 to 89 after cleanup. Green gauge.]**
NARRATION: "Fix your data. Re-run. Score improves. It is your data's credit score — and unlike your actual credit score, you can fix this one today."

**[SCREEN 50–60s: sohovi.com — 'Free. See your score in minutes'.]**
NARRATION: "See yours free at sohovi.com."

---

### VIDEO 79 — Null Values Are Quietly Killing Your Analytics (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "null values data quality", "missing values analytics problems", "blank cells in data"
**Duration:** 60 seconds
**Dataset:** A (email column null stats)

**[SCREEN 0–5s: Text — 'Your average is wrong. Your totals are wrong. Your report is wrong. Why?']**
NARRATION: "Your average is wrong. Your totals are off. Your report is lying. Why?"

**[SCREEN 5–20s: Spreadsheet — SUM formula on a column with blank cells. Result is lower than expected.]**
NARRATION: "Blank cells. Null values. They are silently excluded from every formula, every chart, every calculation."

**[SCREEN 20–40s: CustomerDB.csv profiled in Sohovi. email column: 70 null values, 12.7% of column highlighted red.]**
NARRATION: "Sohovi shows you exactly how many nulls you have per column — and what percentage of your data is affected."

**[SCREEN 40–55s: Completeness rule set. Run. Failed records: 70 rows with blank emails listed.]**
NARRATION: "Set a Completeness rule. Run the check. Download every row with a null. Fix them. Your analytics get honest."

**[SCREEN 55–60s: sohovi.com]**
NARRATION: "Free at sohovi.com."

---

### VIDEO 80 — Check Email Validity in 30 Seconds (Free Tool)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "check email validity csv free", "validate email addresses free tool", "email format checker csv"
**Duration:** 60 seconds
**Dataset:** A (email column with invalid formats)

**[SCREEN 0–5s: Text — 'How many emails in your list are actually valid? Find out in 30 seconds.']**
NARRATION: "How many emails in your list are actually valid? 30 seconds."

**[SCREEN 5–20s: CustomerDB.csv uploaded to Sohovi. email column card: '8% do not match email format'.]**
NARRATION: "Upload your CSV. Sohovi profiles the email column immediately. 8% do not match the standard email format."

**[SCREEN 20–35s: Validity rule: email — email format — threshold 95%. Run.]**
NARRATION: "Add a Validity rule — email format preset, one click. Run."

**[SCREEN 35–50s: Failed records show: 'john.doe@' incomplete, 'notanemail', 'jane@@company.com'. All highlighted.]**
NARRATION: "Failed records show the exact bad emails. Incomplete addresses, double at signs, missing domains."

**[SCREEN 50–60s: Download failed records. Fix. sohovi.com.]**
NARRATION: "Download them. Fix them. sohovi.com — free."

---

### VIDEO 81 — What Is Data Profiling? (60-Second Explainer)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "what is data profiling short", "data profiling explained simply"
**Duration:** 60 seconds
**Dataset:** A (profiling dashboard)

**[SCREEN 0–5s: Text — 'You have data. But do you actually know what is in it?']**
NARRATION: "You have data. But do you actually know what is in it?"

**[SCREEN 5–20s: CustomerDB.csv uploaded. Profiling dashboard loads with column cards.]**
NARRATION: "Data profiling scans every column and tells you: how much is missing, what the values look like, and what patterns they follow."

**[SCREEN 20–40s: Click through email card, phone card, country card — each showing stats, patterns, distributions.]**
NARRATION: "In under 5 seconds on a 550-row file — null rates, duplicate counts, pattern analysis, outlier detection. Automatically."

**[SCREEN 40–55s: Text overlay: 'No formulas. No SQL. No coding. Just upload and see'.]**
NARRATION: "No formulas. No SQL. No coding. Upload and see."

**[SCREEN 55–60s: sohovi.com — 'Free. Private. Fast'.]**
NARRATION: "Free at sohovi.com."

---

### VIDEO 82 — CSV to SQL in Seconds (Free, No Code)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "csv to sql free online", "convert csv to sql fast", "csv to insert statements"
**Duration:** 60 seconds
**Dataset:** C (EmployeeDir.csv)

**[SCREEN 0–5s: Text — 'Spreadsheet in. SQL INSERT statements out. 10 seconds.']**
NARRATION: "Spreadsheet in. SQL INSERT statements out. 10 seconds."

**[SCREEN 5–25s: sohovi.com/tools/csv-to-sql. Drop EmployeeDir.csv. SQL appears instantly.]**
NARRATION: "sohovi.com/tools/csv-to-sql. Drop your CSV. SQL generated instantly."

**[SCREEN 25–40s: Type table name 'employees'. SQL updates. Select PostgreSQL — syntax updates.]**
NARRATION: "Set the table name. Pick your database engine — MySQL, Postgres, SQLite, SQL Server. Syntax adjusts automatically."

**[SCREEN 40–55s: Click Download. employees.sql file saves.]**
NARRATION: "Download the .sql file. Run it. Done. No Python. No pip install. No Stack Overflow."

**[SCREEN 55–60s: sohovi.com/tools/csv-to-sql]**
NARRATION: "Free. Link in bio."

---

### VIDEO 83 — Schema Change Detection Demo (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "schema change detection tool", "detect new columns csv automatically"
**Duration:** 60 seconds
**Dataset:** C (EmployeeDir + new version with extra column)

**[SCREEN 0–5s: Text — 'Your data pipeline broke at 2am. A column was renamed. Nobody told you.']**
NARRATION: "Your pipeline broke at 2am. A column got renamed. Nobody told you."

**[SCREEN 5–20s: EmployeeDir.csv v2 uploaded to Sohovi as new version. Alert banner: 'Schema change detected — 1 new column: department'.]**
NARRATION: "With Sohovi, the moment a new version is uploaded, schema changes are detected automatically."

**[SCREEN 20–35s: Create Schema Change alert. Any change. Email notification. Save.]**
NARRATION: "Set a Schema Change alert — Sohovi emails you immediately when any column is added or removed."

**[SCREEN 35–50s: Mock email: 'Schema change detected in EmployeeDir — department column added'.]**
NARRATION: "You get the email before any pipeline runs. Before any dashboard breaks. Before anyone is upset."

**[SCREEN 50–60s: sohovi.com]**
NARRATION: "Stop finding out at 2am. Free at sohovi.com."

---

### VIDEO 84 — AI Rule Suggestions in Action (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "ai data quality rules suggestions", "automatic data quality rules"
**Duration:** 60 seconds
**Dataset:** A (AI suggestions demo)

**[SCREEN 0–5s: Text — 'What rules should I set on this data? — Sohovi: let me handle that.']**
NARRATION: "What rules should I set on my data? Sohovi: let me handle that."

**[SCREEN 5–20s: CustomerDB.csv profiled. Rules tab empty. Click Get AI Suggestions.]**
NARRATION: "After profiling, click Get AI Suggestions."

**[SCREEN 20–35s: 6 rule suggestions appear — email completeness, email validity, id uniqueness, phone validity, country allowed values, name completeness.]**
NARRATION: "6 rules suggested instantly — completeness, validity, uniqueness — all based on your actual column types and patterns."

**[SCREEN 35–50s: Check all 6. Click Add Selected Rules. 6 rules in the list. Click Run DQ Check. Score appears.]**
NARRATION: "Accept all. Click Run. You have a data quality score — without writing a single rule from scratch."

**[SCREEN 50–60s: sohovi.com — 'Free. No data engineering required'.]**
NARRATION: "Free at sohovi.com. No data engineering required."

---

### VIDEO 85 — Privacy-First Data Processing: Your Data Never Leaves Your Browser (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "privacy first data tool", "data quality tool no upload", "process data in browser privately"
**Duration:** 60 seconds
**Dataset:** A (upload and profiling — emphasise browser processing)

**[SCREEN 0–5s: Text — 'Most data tools upload your file to their servers. Sohovi does not.']**
NARRATION: "Most data tools upload your file to their servers. Sohovi does not."

**[SCREEN 5–20s: CustomerDB.csv dragged onto Sohovi. No upload spinner. Profiling runs locally. Dashboard appears in under 3 seconds.]**
NARRATION: "When you drop a file into Sohovi, it processes entirely in your browser using Web Workers. The raw data never leaves your device."

**[SCREEN 20–35s: Network tab in browser DevTools open. File upload — zero network requests for the file itself. Only metadata posted after profiling.]**
NARRATION: "Open the network tab in your browser. Watch. Zero file upload. Only aggregated scores are saved — never your actual data."

**[SCREEN 35–50s: Text overlay: 'Safe for customer data. Safe for financial data. Safe for healthcare data'.]**
NARRATION: "Safe for customer data. Safe for financial data. Safe for anything you cannot afford to have leave your control."

**[SCREEN 50–60s: sohovi.com — 'Privacy-first data quality. Free forever'.]**
NARRATION: "Privacy-first data quality. Free at sohovi.com."

---

*End of Sohovi Video Scripts — 85 videos total*

*Generated for Sohovi | sohovi.com | Free data quality tools and platform*

---

## Part 3 (Continued): Industry / Use Case Videos

---

### VIDEO 86 — Data Quality for E-Commerce: Clean Your Product and Order Data

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality ecommerce", "ecommerce data quality problems", "clean product data csv"
**Duration:** 2 minutes
**Dataset:** B (SalesQ1.csv — order data with issues)

**Hook:** "Your e-commerce store has 10,000 orders. 300 have negative amounts. 500 are missing customer names. Your revenue report is lying to you — and here is how to fix it."

**[SCREEN: SalesQ1.csv open — negative amounts visible in amount column, blank customer_name cells.]**
NARRATION: "E-commerce data has two common problems: data entry errors in orders and missing customer information. Both corrupt your reports silently."

**[SCREEN: Upload SalesQ1.csv to Sohovi. Profiling dashboard loads. amount column card: 10 outliers flagged. customer_name: 7.5% null.]**
NARRATION: "Drop your orders CSV into Sohovi. In seconds, profiling flags the negative amounts as outliers and shows the missing customer names."

**[SCREEN: Add Accuracy rule: amount greater than 0. Add Completeness rule: customer_name 100%. Run DQ Check.]**
NARRATION: "Set two rules — amount must be positive, customer name must always be present. Run the check."

**[SCREEN: Score 71/100 amber. Failed Records: 25 rows. 10 negative amounts + 15 blank customer names.]**
NARRATION: "Score is 71. 25 rows failed. Here are the exact order IDs with problems — download them, fix the source, re-upload."

**[SCREEN: After fix. Re-run. Score 97/100. Green gauge.]**
NARRATION: "Fix those 25 records. Re-run. Score 97. Your revenue report is now accurate."

**CTA:** Clean your order data before it corrupts your analytics — free at sohovi.com.

---

### VIDEO 87 — Data Quality for Sales CRM: Fix Your Pipeline Before It Costs You Deals

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "crm data quality", "sales crm data problems", "clean crm data free tool"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv — CRM export scenario)

**Hook:** "Your sales team is working a pipeline of 500 leads. But 80 of them have no email address. 50 are duplicates from the last import. Your CRM data is sabotaging your sales. Here is how to clean it."

**[SCREEN: CustomerDB.csv — framed as a CRM export. Profiling shows email 12.7% null, 50 duplicate rows.]**
NARRATION: "This is a typical CRM export. 70 leads with no email — you cannot reach them. 50 duplicate records — your team is working the same lead twice."

**[SCREEN: Add Completeness rule: email 100%. Add Uniqueness rule: email 100%, id 100%. Run.]**
NARRATION: "Set three rules: email must be present, and both email and ID must be unique. Run the check."

**[SCREEN: Score 52/100. Failed Records: 120 rows — 70 missing email + 50 duplicates.]**
NARRATION: "120 broken records out of 550. That is 22% of your pipeline that is either unreachable or duplicated."

**[SCREEN: Download failed records. Fix in CRM or Excel. Re-upload. Score 95.]**
NARRATION: "Download, fix, re-upload. Score 95. Your sales team now has 500 clean, reachable, unique leads."

**CTA:** Audit your CRM data free at sohovi.com — link in description.

---

### VIDEO 88 — Data Quality for HR: Clean Employee Records Without a Data Team

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "hr data quality", "employee data quality", "clean employee records csv"
**Duration:** 2 minutes
**Dataset:** C (EmployeeDir.csv — clean, score 97 — then show what HR issues would look like)

**Hook:** "HR runs on data — payroll, onboarding, compliance. But most HR teams have no idea how clean their employee records actually are. Here is a 5-minute check that can save you from a compliance headache."

**[SCREEN: EmployeeDir.csv uploaded to Sohovi. Profiling: 100 rows, 0 nulls, 0 duplicates — score 97/100.]**
NARRATION: "When employee data is clean, Sohovi shows it instantly. Score 97. Everything present, no duplicates, all formats valid."

**[SCREEN: Simulate a real HR problem — show a modified version with blank emails in 10 rows and duplicate employee IDs in 5 rows.]**
NARRATION: "But in reality, HR exports often have gaps — missing contact details from new hires, duplicate entries from system migrations."

**[SCREEN: Add Completeness: email 100%, employee_id 100%. Uniqueness: employee_id 100%, email 100%. Run. Score drops to 74.]**
NARRATION: "Add completeness and uniqueness rules. Run the check. Score drops to 74 — 15 records with issues identified."

**[SCREEN: Download failed records. Shows which employees are missing email and which IDs are duplicated.]**
NARRATION: "Download the failed records. Fix the missing emails. Remove the duplicate entries. Your HR records are compliant and complete."

**CTA:** Check your employee data quality free at sohovi.com.

---

### VIDEO 89 — Data Quality for Marketing: Why Your Email Campaigns Keep Underperforming

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "marketing data quality", "email list data quality", "why email campaigns fail data"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv — framed as email marketing list)

**Hook:** "Your last email campaign had a 12% open rate. Industry average is 21%. The problem might not be your subject line. It might be your list. 12% of your contacts have no email address at all."

**[SCREEN: CustomerDB.csv profiled — email column: 12.7% null, 8% invalid format, 50 duplicate rows.]**
NARRATION: "A typical marketing list export shows three problems: missing emails, invalid email formats, and duplicate contacts. All three kill your campaign metrics."

**[SCREEN: Missing emails mean those contacts never receive the campaign. Invalid formats mean bounces. Duplicates mean some subscribers get emailed twice — and unsubscribe in frustration.]**
NARRATION: "Missing emails — those contacts are simply skipped. Invalid formats — hard bounces that damage your sender reputation. Duplicates — double sends that annoy subscribers."

**[SCREEN: Three rules set: email Completeness 100%, email Validity email format, email Uniqueness 100%. Run. Score 47/100.]**
NARRATION: "Three rules. Run the check. Score 47. That is how unhealthy this list is."

**[SCREEN: Download failed records. Fix. Re-upload. Score 94. List cleaned.]**
NARRATION: "Clean the list. Re-run. Score 94. Now your campaign reaches real people with valid addresses — exactly once."

**CTA:** Clean your marketing list before your next campaign — free at sohovi.com.

---

### VIDEO 90 — Data Quality for Finance: Catch Data Entry Errors Before Month-End Close

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "financial data quality", "data entry errors finance", "accounting data quality check"
**Duration:** 2 minutes
**Dataset:** B (SalesQ1.csv — negative amounts, framed as financial data)

**Hook:** "It is the last day of the month. Your revenue report shows a negative transaction. Your CFO is asking questions. Here is how to catch these errors automatically — before close, not after."

**[SCREEN: SalesQ1.csv framed as a financial export. amount column: 10 negative values visible.]**
NARRATION: "Financial data entry errors are common — a minus sign in the wrong place, a decimal point off by one, a date in the wrong year. They look small. They cause big problems."

**[SCREEN: Sohovi profiling. amount column: outlier detection flags 10 negative values. date column: 2 dates in 2019 flagged.]**
NARRATION: "Sohovi catches them automatically. Outlier detection on the amount column flags every negative value. Date outliers flag the two records from 2019 — five years out of range."

**[SCREEN: Accuracy rules: amount greater than 0, date between 2024-01-01 and 2024-12-31. Run. Score 71/100. 12 rows flagged.]**
NARRATION: "Two accuracy rules — amounts must be positive, dates must be within the year. Run. 12 rows flagged."

**[SCREEN: Failed records exported. Fix in source system. Re-run before close. Score 98.]**
NARRATION: "Export the failed records to whoever owns the source data. Fix before the close. Re-run. Score 98. Your CFO gets clean numbers."

**CTA:** Catch financial data errors before they reach your reports — free at sohovi.com.

---

### VIDEO 91 — Data Quality for Small Businesses: You Don't Need a Data Engineer

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality small business", "small business data quality tool free", "data quality without data engineer"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv)

**Hook:** "Large enterprises have entire data engineering teams dedicated to data quality. You have a spreadsheet and a prayer. Here is a free tool that gives you enterprise-level data quality checks — in under 5 minutes."

**[SCREEN: Sohovi landing page. Text: 'Privacy-first data quality for everyone'. No enterprise pricing, no sales call required.]**
NARRATION: "Sohovi was built specifically for small teams and individual analysts who cannot afford Collibra or Informatica — and do not need to."

**[SCREEN: Upload CustomerDB.csv. Profiling runs. Column cards appear with stats.]**
NARRATION: "Upload your CSV. Profiling runs automatically in your browser — no setup, no configuration, no IT department required."

**[SCREEN: AI Suggestions — 6 rules suggested and added in one click. Run DQ Check. Score 52/100.]**
NARRATION: "Click Get AI Suggestions. Six rules added in one click — Sohovi recommends them based on your data. Run the check. You have a data quality score."

**[SCREEN: Failed records downloaded. Fixed in Excel. Re-uploaded. Score 91.]**
NARRATION: "Fix the issues in Excel — which you already know. Re-upload. Score 91. Enterprise-level data quality. Zero data engineering."

**CTA:** Start your first data quality check free at sohovi.com — no team required.

---

### VIDEO 92 — Data Quality for Freelance Data Analysts: How to Audit a Client's Data

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality freelance analyst", "how to audit client data", "data quality audit for clients"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv — framed as client data)

**Hook:** "A client hands you a CSV and says 'can you analyse this?' Before you spend 3 hours building a model on bad data — spend 5 minutes auditing it. Here is exactly how."

**[SCREEN: CustomerDB.csv received as 'client_data.csv'. Upload to Sohovi.]**
NARRATION: "First thing you do with any client data file — upload it to Sohovi before touching it in Excel or Python."

**[SCREEN: Profiling dashboard. Overview: 2 columns with issues, 12.7% null rate on email, 50 duplicates, 4% invalid phones.]**
NARRATION: "In under 5 seconds you know: two columns have issues, 12.7% of emails are missing, 50 duplicate rows, 4% of phone numbers are invalid."

**[SCREEN: Export the profiling summary. Share with client: 'Before I begin analysis, here are the data quality issues I found'.]**
NARRATION: "Export the profiling summary. Send it to the client before you start. This protects you — you documented the issues before the analysis, not after."

**[SCREEN: Run DQ Check with AI-suggested rules. Score 52/100. Export full PDF report.]**
NARRATION: "Run a full DQ check. Export the PDF report. Now you have a professional data quality audit document to deliver alongside your analysis."

**[SCREEN: PDF report showing client data quality score, rule breakdown, failed record count.]**
NARRATION: "This is a deliverable your client will value. It shows professionalism — and it justifies your rate."

**CTA:** Deliver a data quality audit with every project — free at sohovi.com.

---

### VIDEO 93 — Data Quality Before Building a Dashboard: The Step Everyone Skips

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality before dashboard", "check data before building dashboard", "dashboard bad data source"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv — then show what a bad dashboard looks like)

**Hook:** "You spent two weeks building a beautiful dashboard. Your stakeholder looks at it and says 'these numbers don't look right'. You spend another week debugging. Plot twist: the data was wrong the whole time."

**[SCREEN: Dramatic recreation — a polished Tableau/Power BI dashboard with incorrect revenue totals because of bad source data.]**
NARRATION: "The dashboard is not broken. The data feeding it is. And most people find out after the dashboard is built — not before."

**[SCREEN: CustomerDB.csv uploaded to Sohovi before any dashboard work. Profiling shows issues immediately.]**
NARRATION: "Before you connect any data source to a dashboard tool, run a DQ check in Sohovi. 5 minutes now saves days of debugging later."

**[SCREEN: Score 52/100. Three rules failing. Specific issues: 70 missing emails, 50 duplicates, 22 invalid phones.]**
NARRATION: "Score 52. Three issues. If you had built the dashboard on this data, your unique customer count would be inflated by 50, and your email-based metrics would be based on 12.7% fewer records than you thought."

**[SCREEN: Fix issues. Re-run. Score 91. Now connect to dashboard tool.]**
NARRATION: "Fix first. Re-run. Score 91. Now connect to your dashboard tool. Build on clean data."

**CTA:** Check your data before you build — free at sohovi.com.

---

### VIDEO 94 — Data Quality for Database Migrations: Validate Before You Move

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality database migration", "validate data before migration", "data migration quality check"
**Duration:** 2 minutes
**Dataset:** A and C (two datasets — old system and new system exports)

**Hook:** "You are migrating from one database to another. You export the old data, import it into the new system, and suddenly half your records are wrong. Here is how to catch problems before the migration — not after."

**[SCREEN: Old system export (CustomerDB.csv — messy). New system export (EmployeeDir.csv — clean).]**
NARRATION: "Before any migration, export a sample from your old system and run a data quality check. You need to know what you are moving."

**[SCREEN: Upload CustomerDB.csv (old system). Profiling: email 12.7% null, 50 duplicates, phone 4% invalid.]**
NARRATION: "The old system has significant issues — missing emails, duplicates, invalid phones. If you migrate this as-is, you carry all those problems into the new system."

**[SCREEN: Run DQ Check. Score 52/100. Download failed records. Fix before migration.]**
NARRATION: "Run the check. Score 52. Fix the 120 bad records before you migrate. Clean data in, clean data out."

**[SCREEN: After fix. Re-run. Score 91. Now run the same rules on the post-migration export to verify.]**
NARRATION: "After migration, run the same rules on the new system export to verify the data came across correctly. Score should match or improve."

**CTA:** Validate your data before any migration — free at sohovi.com.

---

### VIDEO 95 — Data Quality for SaaS: Monitor Your User Data Over Time

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "saas data quality monitoring", "monitor user data quality", "saas data pipeline quality"
**Duration:** 2 minutes
**Dataset:** A (multiple runs showing score trend over time)

**Hook:** "Your SaaS has 5,000 users. Every week your signup form collects new data. Every week some of it is garbage — invalid emails, fake phone numbers, incomplete profiles. Here is how to monitor it automatically."

**[SCREEN: Sohovi dashboard showing multiple run history. Score trend: 89, 87, 91, 73, 68 — a dip visible.]**
NARRATION: "Set up a data asset for your weekly user export. Every time you run a check, the result is saved. Over time you see trends — and that dip at week four is worth investigating."

**[SCREEN: Click on week 4 run — score 73. Compare to week 3 — score 91. Rule comparison: email Validity suddenly failing more — went from 2% invalid to 11% invalid.]**
NARRATION: "Week four dropped from 91 to 73. The comparison shows email validity spiked — 11% of new signups have invalid email formats. Something changed in your signup form."

**[SCREEN: Schema Change Alert and Score Drop Alert both active. Mock email notification received.]**
NARRATION: "With a Score Drop alert at 80, you would have been notified automatically when the score dropped below your threshold."

**[SCREEN: Fix the signup form validation. Next week's run: score 92. Trend recovers.]**
NARRATION: "Fix the form validation on your frontend. Next week's score recovers to 92. Continuous monitoring, continuous improvement."

**CTA:** Monitor your user data quality automatically — free at sohovi.com.

---

### VIDEO 96 — Data Quality for Startups: Build Good Data Habits Early

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "startup data quality", "data quality early stage startup", "good data habits startup"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv)

**Hook:** "The best time to fix your data quality is when you have 500 customers. The worst time is when you have 50,000 and your VC asks why your retention metrics don't match your revenue numbers."

**[SCREEN: Text graphic — '500 customers: easy to fix. 50,000 customers: expensive consultant required'.]**
NARRATION: "Bad data habits compound. The mess you ignore at 500 customers is 100 times harder to clean at 50,000."

**[SCREEN: Sohovi workflow: upload weekly user export, apply Customer Data Standard workflow, run check, score 94.]**
NARRATION: "The fix is simple: set up a reusable workflow in Sohovi with your data quality rules. Apply it every week to your user export. It takes under 3 minutes."

**[SCREEN: Workflow saved: 'User Signup Data Standard' — email completeness, email validity, id uniqueness, phone validity.]**
NARRATION: "Four rules — email completeness, email validity, ID uniqueness, phone validity. Saved as a workflow. Applied in one click to every future export."

**[SCREEN: Run history showing 8 weeks of green scores: 91, 93, 94, 92, 95, 91, 94, 96.]**
NARRATION: "Eight weeks of clean data. Every week. This is the data quality culture that makes your metrics trustworthy — and your investor updates credible."

**CTA:** Build good data habits now — free at sohovi.com.

---

### VIDEO 97 — Data Quality for Non-Technical Teams: No SQL, No Code Required

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality non technical", "check data quality without coding", "data quality tool no code"
**Duration:** 90 seconds
**Dataset:** A (CustomerDB.csv)

**Hook:** "Data quality is not just for data engineers. If you work in marketing, sales, HR, or finance — and you use spreadsheets — this is for you. No SQL. No Python. No coding at all."

**[SCREEN: Sohovi — clean, simple UI. No code editor. No terminal. Just a drag-and-drop upload zone.]**
NARRATION: "Sohovi is built for people who work with data but are not data engineers. Everything is point-and-click."

**[SCREEN: Drag CustomerDB.csv onto the upload zone. Profiling runs. Column cards appear with plain-English stats.]**
NARRATION: "Drag your file in. Profiling runs automatically. Every result is in plain English — no jargon, no SQL queries."

**[SCREEN: Click Get AI Suggestions. 6 rules appear. Check all. Click Add. Click Run DQ Check.]**
NARRATION: "Click Get AI Suggestions. Accept the rules. Click Run. You have a data quality score — no rules written by hand."

**[SCREEN: Score 52/100. Failed records downloaded. Open in Excel — familiar interface.]**
NARRATION: "Download the failed records. Fix them in Excel — the tool you already know. Re-upload. Done."

**CTA:** Data quality without code — free at sohovi.com.

---

### VIDEO 98 — How to Do a Data Quality Audit (Step-by-Step)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality audit steps", "how to do a data quality audit", "data quality audit process"
**Duration:** 2.5 minutes
**Dataset:** A (full end-to-end demo)

**Hook:** "A data quality audit sounds complicated. It is not. Here is the full process — from raw CSV to a professional audit report — in under 10 minutes."

**[SCREEN: Step 1 label card: '1. Profile Your Data'.]**
NARRATION: "Step one: profile your data. Upload your CSV to Sohovi. Let it scan every column and collect statistics — null rates, duplicates, patterns, outliers."

**[SCREEN: CustomerDB.csv profiled. Column cards showing stats across all 6 columns.]**
NARRATION: "In under 5 seconds: email 12.7% null, 50 duplicates, phone 4% invalid. That is your starting point."

**[SCREEN: Step 2 label card: '2. Set Your Rules'.]**
NARRATION: "Step two: set your quality rules. Use AI Suggestions to get a starting set. Add or adjust based on your business requirements."

**[SCREEN: 6 rules set via AI Suggestions. Run DQ Check. Score 52/100.]**
NARRATION: "Six rules set in one click. Run the check. Score 52 — now you have a baseline."

**[SCREEN: Step 3 label card: '3. Document the Issues'.]**
NARRATION: "Step three: document the issues. Download the failed records and the Score Transparency panel."

**[SCREEN: Step 4 label card: '4. Fix and Re-run'.]**
NARRATION: "Step four: fix the issues and re-run. Download failed records, fix in the source, re-upload, re-run."

**[SCREEN: Second run. Score 89. Compare runs side by side: 52 vs 89.]**
NARRATION: "Score jumps to 89. The run comparison shows exactly what improved."

**[SCREEN: Step 5 label card: '5. Export the Audit Report'.]**
NARRATION: "Step five: export the report. PDF or Excel. You now have a complete data quality audit — before score, after score, issues found, issues fixed."

**CTA:** Run your first audit free at sohovi.com — link in description.

---

### VIDEO 99 — Data Quality Checklist Before Any Analytics Project

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality checklist analytics", "before data analysis checklist", "data quality steps before analysis"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv)

**Hook:** "Before you open Tableau, Python, or Excel for analysis — run this checklist. 5 checks. 5 minutes. Saves hours of debugging."

**[SCREEN: Checklist card — 5 items appear one by one.]**

**[SCREEN: Check 1: 'Profile every column'. CustomerDB.csv uploaded. Column cards appear.]**
NARRATION: "Check one: profile every column. Upload to Sohovi and let it scan. What types of data do you have? How much is missing? Any obvious outliers?"

**[SCREEN: Check 2: 'Check null rates'. email column: 12.7% null highlighted red.]**
NARRATION: "Check two: look at null rates. Any column above 5% nulls needs attention before analysis."

**[SCREEN: Check 3: 'Check for duplicates'. id column: 50 duplicates.]**
NARRATION: "Check three: check for duplicates. Duplicates inflate counts, distort averages, and corrupt joins."

**[SCREEN: Check 4: 'Validate key formats'. email and phone columns — validity analysis shown.]**
NARRATION: "Check four: validate key column formats. Emails, phones, dates, IDs — make sure they match expected patterns."

**[SCREEN: Check 5: 'Run a DQ Check and score it'. Score 52/100. Below 80 = fix before analysis.]**
NARRATION: "Check five: run a DQ check and score it. Anything below 80 — fix the issues before you analyse. You cannot trust the results otherwise."

**CTA:** Run this checklist free at sohovi.com before your next analysis project.

---

### VIDEO 100 — How to Present Data Quality Results to Stakeholders

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "present data quality results stakeholders", "data quality report for management", "explain data quality to non technical"
**Duration:** 2 minutes
**Dataset:** A (two runs — before 52, after 89 — with PDF report)

**Hook:** "Your manager asks: is our data any good? Saying 'pretty good I think' is not an answer. Here is how to give a crisp, professional answer — with numbers and a one-page report."

**[SCREEN: DQ score gauge 52/100. Slide showing: 'Our data quality score is 52 out of 100. Here is why'.]**
NARRATION: "The score is your headline number. 52 out of 100 — amber — means significant issues present. Your stakeholder immediately knows: this data is usable but risky."

**[SCREEN: Score Transparency panel — rule breakdown. Translate to plain English: 'Email Completeness failed — 70 of 550 contacts have no email address'.]**
NARRATION: "The rule breakdown translates into plain business language. 70 contacts unreachable. 50 duplicate records inflating your counts. 22 invalid phone numbers."

**[SCREEN: After fix — score 89. Run comparison: before 52, after 89, delta +37. Visual improvement chart.]**
NARRATION: "After cleanup: score 89. Show the before and after. A 37-point improvement is concrete, measurable proof that the work was done."

**[SCREEN: Export PDF report. Two pages: before and after. Simple, professional, stakeholder-ready.]**
NARRATION: "Export the PDF report. Two pages — before score, issues found, after score, issues resolved. Send it. Your stakeholder has a clear, professional answer."

**CTA:** Generate your stakeholder-ready data quality report free at sohovi.com.

---

## Comparison / Educational Series

---

### VIDEO 101 — Why Excel Is Not Enough for Data Quality

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "excel data quality limitations", "why excel is not enough data quality", "better than excel for data quality"
**Duration:** 2 minutes
**Dataset:** A (side-by-side: Excel vs Sohovi)

**Hook:** "Excel can do a lot. But it is not a data quality tool. Here is what Excel cannot do — and what you should use instead."

**[SCREEN: Excel with CustomerDB.csv open. COUNTBLANK formula in email column. Result: 70.]**
NARRATION: "In Excel, finding null values requires COUNTBLANK formulas — manually, per column. It tells you the count. Nothing else."

**[SCREEN: Excel COUNTIF for duplicates — complex formula. Works, but shows only a number.]**
NARRATION: "Checking duplicates requires a COUNTIF formula that most people have to Google every time. It gives you a number — not a list of which rows are duplicates."

**[SCREEN: Sohovi profiling dashboard for same file. All stats visible instantly. No formula written.]**
NARRATION: "Sohovi profiles every column automatically — null rates, duplicates, patterns, outliers, PII — in one upload. No formulas."

**[SCREEN: Failed records table in Sohovi — exact rows with issues, downloadable, with violation reasons.]**
NARRATION: "Excel shows you that 70 emails are blank. Sohovi shows you which 70 rows, lets you download them, and tracks when you fixed them."

**[SCREEN: Sohovi run history showing score trends over 8 weeks. Excel has no equivalent.]**
NARRATION: "Excel has no run history. No scoring. No alerts. No workflows. It is a great tool — but it is not a data quality tool."

**CTA:** Go beyond Excel for data quality — free at sohovi.com.

---

### VIDEO 102 — Data Quality vs Data Governance: What Is the Difference?

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality vs data governance", "difference data quality data governance", "data governance explained"
**Duration:** 2 minutes
**Dataset:** None (concept video)

**Hook:** "Data quality and data governance are not the same thing. Most people use them interchangeably. Here is the actual difference — and why it matters for your team."

**[SCREEN: Two columns: 'Data Governance' and 'Data Quality'. Side-by-side definition cards.]**
NARRATION: "Data governance is the policies, processes, and ownership decisions around data — who can access what, how long to retain it, who is responsible for it."

**[SCREEN: Data Quality column fills with examples: completeness check, validity rule, DQ score.]**
NARRATION: "Data quality is the measurement of whether your data meets the standards set by governance. Governance says 'emails must be present'. Data quality measures whether they actually are."

**[SCREEN: Analogy — governance is the building code. Data quality is the building inspection.]**
NARRATION: "Think of it this way: governance is the building code. Data quality is the building inspection. You need both — but they are different jobs."

**[SCREEN: Sohovi as the inspection layer — rules enforce governance policies, scores measure compliance.]**
NARRATION: "Sohovi handles the data quality layer — measuring, scoring, and flagging violations against whatever standards your team has set."

**CTA:** Start measuring your data quality free at sohovi.com.

---

### VIDEO 103 — Free Data Quality Tools Compared (2025)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "free data quality tools 2025", "best free data quality tool", "data quality tools comparison free"
**Duration:** 2 minutes
**Dataset:** None (comparison overview)

**Hook:** "There are a handful of free data quality tools available. Here is an honest comparison of what each one actually does — and which one is right for you."

**[SCREEN: Comparison table with columns: Tool, Profiling, Rules/Scoring, Privacy (no upload), Free Tier, Ease of Use.]**
NARRATION: "When comparing data quality tools, these are the five things that matter: profiling, rule-based scoring, privacy, a real free tier, and whether a non-engineer can actually use it."

**[SCREEN: Row for Sohovi: Profiling yes, Rules/Scoring yes, Privacy yes (browser-only), Free yes, Ease yes — all green checkmarks.]**
NARRATION: "Sohovi checks all five. Browser-based processing — your data never leaves your device. Free forever tier. Point-and-click rules with AI suggestions."

**[SCREEN: Row for enterprise tools (Collibra, Informatica): Profiling yes, Rules yes, Privacy mixed, Free no, Ease no.]**
NARRATION: "Enterprise tools like Collibra and Informatica have powerful features — but they cost thousands of dollars per month and require dedicated implementation teams."

**[SCREEN: Row for manual Excel approach: Profiling partial, Rules no, Privacy yes, Free yes, Ease no.]**
NARRATION: "Excel is free and private — but it has no scoring, no run history, no workflows, and requires custom formulas for every check."

**[SCREEN: Sohovi highlighted as the recommended option for small teams, freelancers, and startups.]**
NARRATION: "For small teams, freelancers, and startups — Sohovi is the clear choice. Enterprise quality, zero enterprise budget."

**CTA:** Try the free tier at sohovi.com — link in description.

---

### VIDEO 104 — What Collibra and Informatica Do (And Why You Don't Need Them Yet)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "collibra alternative", "informatica alternative small team", "data quality tool without enterprise budget"
**Duration:** 2 minutes
**Dataset:** None (concept video)

**Hook:** "Collibra costs around $100,000 per year. Informatica IDQ starts at $50,000. They are powerful tools — for companies with 50 data engineers and a dedicated governance team. Here is what to use instead."

**[SCREEN: Enterprise pricing graphic — large numbers, enterprise sales required, 6-month implementation.]**
NARRATION: "Enterprise data quality tools are built for Fortune 500 companies with dedicated data teams. They require months of implementation and significant budget."

**[SCREEN: What they do: data lineage, enterprise cataloging, policy enforcement, cross-system governance.]**
NARRATION: "What they do well: enterprise-scale data lineage, cross-system cataloging, policy enforcement across hundreds of data sources. Genuinely powerful — at a genuinely large scale."

**[SCREEN: What most small teams actually need: profile a CSV, check for nulls and duplicates, get a score, set an alert.]**
NARRATION: "What most small teams actually need: profile a file, check for missing values and duplicates, get a score, set an alert. That is 95% of the value at 0% of the cost."

**[SCREEN: Sohovi dashboard. Same core functionality — profiling, rules, scoring, alerts, workflows — accessible to anyone.]**
NARRATION: "Sohovi gives you profiling, rule-based scoring, run history, alerts, and reusable workflows — for free. You can always move to an enterprise tool when you have 50 data engineers."

**CTA:** Start with Sohovi — free at sohovi.com. Scale to enterprise when you need it.

---

### VIDEO 105 — Why Your Dashboard Is Lying to You (It Is a Data Quality Problem)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "dashboard showing wrong numbers", "why dashboard is inaccurate", "fix dashboard data quality"
**Duration:** 2 minutes
**Dataset:** A (bad data → misleading analytics scenario)

**Hook:** "Your revenue dashboard says $420,000. Your finance team says $398,000. Someone is wrong. Nine times out of ten — it is a data quality problem, not a dashboard problem."

**[SCREEN: Animated split: dashboard showing $420,000 vs spreadsheet showing $398,000. Question mark between them.]**
NARRATION: "Dashboards do not lie — they just faithfully visualise whatever data you feed them. If the data is wrong, the dashboard is wrong."

**[SCREEN: SalesQ1.csv — amount column with 10 negative values. Sum of negatives: -$22,000. Explains the discrepancy.]**
NARRATION: "The discrepancy here is $22,000. Exactly the sum of 10 negative order amounts that were entered incorrectly — and included in the dashboard total."

**[SCREEN: Sohovi. Accuracy rule: amount greater than 0. Run. 10 rows flagged. Download. Fix. Re-run. Score 97.]**
NARRATION: "One Accuracy rule in Sohovi flags every negative amount. Download, fix, re-upload. Now the data feeding your dashboard is correct."

**[SCREEN: Dashboard now shows $398,000 — matching finance. Problem solved at the source.]**
NARRATION: "Dashboard now matches finance. Problem solved at the source — not by tweaking the dashboard."

**CTA:** Fix the data, not the dashboard — free at sohovi.com.

---

### VIDEO 106 — The Real Cost of Bad Data (With Real Examples)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "cost of bad data", "how much does bad data cost", "bad data business impact"
**Duration:** 2 minutes
**Dataset:** None (storytelling + Sohovi demo)

**Hook:** "IBM says bad data costs the US economy $3.1 trillion per year. That sounds abstract. Here are three specific ways bad data costs real businesses real money — and how to stop it."

**[SCREEN: Example 1: 'Email campaign sent to 10,000 contacts. 1,270 had blank email addresses. 1,270 customers never received the campaign'.]**
NARRATION: "Example one: an email campaign sent to 10,000 contacts. 12.7% had blank email addresses. That is 1,270 customers who never received the offer — and the revenue that went with them."

**[SCREEN: Example 2: 'Sales team worked 500 leads. 50 were duplicates from a system migration. 100 hours of sales time wasted on the same 50 leads twice'.]**
NARRATION: "Example two: a sales team working 500 leads — 50 of which were duplicates. 100 hours of sales time spent on leads that were already in the pipeline."

**[SCREEN: Example 3: 'Month-end report submitted. 10 negative order amounts included. CFO questions the numbers. 2 days spent investigating a $22,000 data entry error'.]**
NARRATION: "Example three: a month-end report with 10 negative order amounts. Two days of finance team time investigating a $22,000 data entry error."

**[SCREEN: All three examples are preventable with Sohovi in under 10 minutes total. Score 52 → 97.]**
NARRATION: "All three are preventable with a 10-minute data quality check. Completeness catches the missing emails. Uniqueness catches the duplicates. Accuracy catches the negative amounts."

**CTA:** Stop paying the cost of bad data — free at sohovi.com.

---

### VIDEO 107 — GDPR and Data Quality: What You Need to Know

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "gdpr data quality", "data quality gdpr compliance", "gdpr personal data management"
**Duration:** 2 minutes
**Dataset:** A (PII detection demo)

**Hook:** "GDPR requires you to keep personal data accurate and up to date. That is not just a legal obligation — it is a data quality problem. Here is how to stay compliant without a legal team."

**[SCREEN: GDPR Article 5 excerpt: 'Personal data shall be accurate and, where necessary, kept up to date'.]**
NARRATION: "GDPR Article 5 requires that personal data be accurate and kept up to date. That is a data quality requirement written into law."

**[SCREEN: CustomerDB.csv uploaded. PII banner: 3 columns contain PII — email, phone, first_name/last_name.]**
NARRATION: "Sohovi automatically detects which columns contain personal data — email, phone, name. These are the columns GDPR applies to."

**[SCREEN: email column: 70 nulls, 8% invalid format. Phone: 4% invalid. These are data quality violations AND GDPR accuracy issues.]**
NARRATION: "70 missing emails and 8% invalid formats are not just data quality problems — they represent inaccurate personal records that GDPR says you must maintain."

**[SCREEN: Privacy note: 'Sohovi processes all PII in your browser — raw data never sent to any server'.]**
NARRATION: "Sohovi is built privacy-first. Your personal data is profiled entirely in your browser. Nothing is sent to Sohovi's servers. That matters for GDPR compliance."

**CTA:** Maintain GDPR-compliant personal data quality — free at sohovi.com.

---

### VIDEO 108 — What Is a Data Catalog? (And Do You Need One?)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "what is a data catalog", "data catalog explained", "do I need a data catalog"
**Duration:** 2 minutes
**Dataset:** None (concept + Sohovi catalog feature demo)

**Hook:** "Your company has 50 CSV files, 3 databases, and 2 Google Sheets. Nobody knows which one is the authoritative source of truth. That is a data catalog problem."

**[SCREEN: Cluttered desktop with many files: customers_final.csv, customers_v2_final.csv, customers_ACTUAL_FINAL.csv.]**
NARRATION: "A data catalog is an organised inventory of your data assets — what data you have, where it lives, who owns it, and how good it is."

**[SCREEN: Sohovi hierarchy — Business Units → Catalogs → Data Assets. All assets visible in one place with DQ scores.]**
NARRATION: "In Sohovi, your data catalog is built into the platform. Every file you track becomes a data asset under a catalog — with a quality score attached."

**[SCREEN: Catalog page showing 'Customer Data' catalog — 3 data assets, scores 91, 74, 97. Easy to see which one is most reliable.]**
NARRATION: "Your team can see at a glance which version of customer data is the most reliable — not by filename, but by DQ score."

**[SCREEN: Search across all assets. Find 'customer' — three assets appear with their scores and last run dates.]**
NARRATION: "Global search finds any asset across all catalogs. No more 'which CSV is the real one' — just look at the scores."

**CTA:** Build your data catalog free at sohovi.com.

---

### VIDEO 109 — Data Quality vs Data Quantity: More Data Is Not Always Better

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality vs data quantity", "more data not better quality", "quality over quantity data"
**Duration:** 90 seconds
**Dataset:** A (small clean file vs large messy file comparison)

**Hook:** "Your competitor has 1 million records. You have 50,000. But their data quality score is 41. Yours is 94. Who has the better data? You do."

**[SCREEN: Two files: File A — 1,000,000 rows, DQ score 41/100. File B — 50,000 rows, DQ score 94/100.]**
NARRATION: "1 million records with a score of 41 means 590,000 rows with issues. 50,000 records with a score of 94 means 3,000 rows with issues. The smaller, cleaner dataset is more valuable for analysis."

**[SCREEN: Dashboard built on File A — revenue total inflated by duplicates, conversion rate wrong due to missing emails.]**
NARRATION: "More data with poor quality means more errors at scale. Duplicate records inflate counts. Missing fields corrupt conversion rates. Outliers skew averages."

**[SCREEN: Dashboard built on File B — clean numbers, trustworthy metrics.]**
NARRATION: "Less data, better quality — your metrics are accurate. You can act on them with confidence."

**CTA:** Measure your data quality, not just your data volume — free at sohovi.com.

---

### VIDEO 110 — 5 Signs Your Data Quality Is Hurting Your Business

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "signs of bad data quality", "bad data hurting business", "data quality problems symptoms"
**Duration:** 2 minutes
**Dataset:** None (storytelling)

**Hook:** "Bad data quality is like a slow leak. You do not notice it immediately — but eventually the floor collapses. Here are 5 signs it is already happening in your business."

**[SCREEN: Sign 1: 'Your reports disagree with each other'.]**
NARRATION: "Sign one: your reports give different numbers for the same metric. Sales says 420K. Finance says 398K. The data feeding each report has different quality issues."

**[SCREEN: Sign 2: 'Your email campaigns have unusually high bounce rates'.]**
NARRATION: "Sign two: high bounce rates and low open rates despite a large list. Invalid emails and missing addresses are silently reducing your reach."

**[SCREEN: Sign 3: 'Your team argues about whose data is correct'.]**
NARRATION: "Sign three: meetings where people argue about whose version of the data is right. That argument never happens when data quality is measured and visible."

**[SCREEN: Sign 4: 'Your dashboards get questioned by stakeholders'.]**
NARRATION: "Sign four: stakeholders who say 'I don't trust this dashboard'. They have been burned by wrong numbers before — and they remember."

**[SCREEN: Sign 5: 'You find problems only after decisions are made'.]**
NARRATION: "Sign five: you discover data errors after a decision has already been made on that data. Reactive, not proactive — the most expensive way to manage data quality."

**[SCREEN: Sohovi — run a DQ check, get a score, set an alert. Proactive data quality.]**
NARRATION: "All five symptoms are preventable. Profile your data. Set rules. Monitor over time. Fix problems before they reach your reports."

**CTA:** Stop the slow leak — free at sohovi.com.

---

### VIDEO 111 — Why Data Quality Is Everyone's Problem (Not Just IT)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality responsibility team", "who is responsible for data quality", "data quality not just IT"
**Duration:** 90 seconds
**Dataset:** None (concept)

**Hook:** "Data quality is not IT's problem. It is Marketing's problem when campaigns miss. Finance's problem when reports are wrong. Sales' problem when the pipeline has duplicates. It belongs to everyone."

**[SCREEN: Data flows through departments — Marketing enters contact data, Sales updates it, Finance reports on it, IT maintains the systems.]**
NARRATION: "Data quality problems are created at every stage. A sales rep enters a phone number as 'N/A'. A marketing tool imports duplicates. A finance export includes a typo. IT cannot fix all of these alone."

**[SCREEN: Sohovi — invite team members, share data assets, each department monitors their own data.]**
NARRATION: "Sohovi is built for team collaboration. Invite your marketing, sales, and finance leads. Each team monitors the data assets they own."

**[SCREEN: Business Unit 'Marketing' — catalog 'Email Lists' — score 94. Business Unit 'Finance' — catalog 'Revenue Data' — score 88.]**
NARRATION: "Marketing owns their email lists. Finance owns their revenue data. Each team sees their own quality score — and takes responsibility for it."

**CTA:** Give your whole team visibility into data quality — free at sohovi.com.

---

### VIDEO 112 — How to Build a Data Quality Culture in a Small Team

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality culture team", "build data quality habits team", "team data quality process"
**Duration:** 2 minutes
**Dataset:** None (process walkthrough)

**Hook:** "A data quality culture is not a tool. It is a habit. Here is how to build that habit in a small team — in three steps that take less than 30 minutes a week."

**[SCREEN: Step 1: 'Assign data ownership'. Business Units in Sohovi — Marketing, Finance, Sales.]**
NARRATION: "Step one: assign ownership. Every data asset in Sohovi belongs to a catalog, which belongs to a Business Unit. Make it clear who is responsible for each asset's quality."

**[SCREEN: Step 2: 'Set a standard'. Workflow 'Customer Data Standard' — 4 rules. Applied to every new customer file upload.]**
NARRATION: "Step two: set a standard. Create a reusable workflow with your minimum quality rules. Every file of the same type runs through the same checks — no exceptions."

**[SCREEN: Step 3: 'Review weekly'. Run history showing 8 weeks of scores. Monday morning DQ review — 10 minutes.]**
NARRATION: "Step three: review weekly. Monday morning, check last week's scores. Anything below 80 gets investigated. 10 minutes. That is your entire data quality process."

**[SCREEN: Score Drop alert email arriving Monday morning automatically.]**
NARRATION: "Set Score Drop alerts so you do not even have to remember to check — Sohovi emails you when something needs attention."

**CTA:** Build your data quality culture starting today — free at sohovi.com.

---

## More How-To / Workflow Series

---

### VIDEO 113 — How to Quality-Check Your Google Sheets Data

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "google sheets data quality check", "check data quality google sheets", "google sheets missing values duplicates"
**Duration:** 2 minutes
**Dataset:** None (Google Sheets connection demo)

**Hook:** "Your team lives in Google Sheets. Your data quality problems also live in Google Sheets. Here is how to run automated quality checks on any Sheet — without leaving Sohovi."

**[SCREEN: Google Sheet open — a customer list with visible blank cells and duplicate rows.]**
NARRATION: "Your Google Sheet looks fine. But it has 70 missing emails and 50 duplicate rows — and no built-in way to detect them automatically."

**[SCREEN: Sohovi — New Data Asset — Source: Google Sheets — Connect — OAuth popup — Allow.]**
NARRATION: "In Sohovi, create a new data asset and select Google Sheets as the source. Authorize with your Google account — read-only access."

**[SCREEN: Sheet selector. Choose the customer list sheet. Click Connect. Profiling runs. Column cards appear.]**
NARRATION: "Select the sheet. Click Connect. Sohovi reads the data and profiles every column instantly."

**[SCREEN: email column card: 12.7% null. id column: 50 duplicates. Same issues as the CSV version — but directly from the live sheet.]**
NARRATION: "Same issues caught — 12.7% missing emails, 50 duplicates — but this time pulled directly from your live Google Sheet."

**[SCREEN: Rules set — Completeness, Uniqueness. Run DQ Check. Score 52/100. Alert created: score drop below 80.]**
NARRATION: "Set your rules. Run the check. Create a Score Drop alert. Next time someone adds bad data to the sheet, you will know."

**CTA:** Connect your Google Sheets to Sohovi — free at sohovi.com.

---

### VIDEO 114 — How to Quality-Check Your Airtable Data

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "airtable data quality", "check data quality airtable", "airtable missing values duplicates"
**Duration:** 2 minutes
**Dataset:** None (Airtable connection demo)

**Hook:** "Airtable is great for managing data. It is not great at telling you how good that data is. Here is how to connect Airtable to Sohovi and get a real quality score in under 5 minutes."

**[SCREEN: Airtable base with a customer table open — some blank fields visible.]**
NARRATION: "Your Airtable base has customer data. But do you know how complete it is? How many duplicates? How many invalid formats?"

**[SCREEN: Sohovi — New Data Asset — Source: Airtable — API Key field.]**
NARRATION: "In Sohovi, create a new data asset and select Airtable as the source."

**[SCREEN: Airtable account page — generate Personal Access Token with data.records:read scope. Copy token.]**
NARRATION: "Go to your Airtable account and generate a Personal Access Token with read access. Copy it."

**[SCREEN: Paste token in Sohovi. Enter Base ID from the Airtable URL. Enter table name. Click Connect.]**
NARRATION: "Paste the token in Sohovi. Enter your Base ID — visible in the Airtable URL — and the table name. Click Connect."

**[SCREEN: Profiling runs. Column cards appear with Airtable data stats. Score 78/100 after running rules.]**
NARRATION: "Profiling runs. You now have full column stats and a DQ score for your Airtable data — just like any CSV."

**CTA:** Connect your Airtable data to Sohovi — free at sohovi.com.

---

### VIDEO 115 — How to Set Up a Data Quality Workflow for Your Team

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "team data quality workflow", "set up data quality process team", "data quality workflow small team"
**Duration:** 2 minutes
**Dataset:** A (workflow creation + team invite demo)

**Hook:** "Most teams check data quality reactively — only when something is already wrong. Here is how to set up a proactive workflow so problems are caught before they reach anyone."

**[SCREEN: Sohovi Workflows page. Click New Workflow. Name: 'Customer Data Standard'.]**
NARRATION: "Start by creating a reusable workflow. Name it after the data type it applies to — Customer Data Standard."

**[SCREEN: Add 4 rules to the workflow: email Completeness 95%, email Validity, id Uniqueness 100%, phone Validity.]**
NARRATION: "Add your standard rules — completeness, validity, uniqueness. These are the minimum quality standards for any customer file."

**[SCREEN: Save workflow. Go to Team page. Invite team members: sarah@company.com (Marketing), james@company.com (Sales).]**
NARRATION: "Save the workflow. Then invite your team — the people who own and upload this type of data."

**[SCREEN: Create Score Drop alert at 80 for the Customer Data asset. Add team member emails to the notification list.]**
NARRATION: "Set up alerts and add your team members' emails to the notification list. Now everyone who needs to know will be notified automatically."

**[SCREEN: Team member uploads a new file, applies the workflow in one click, runs the check — Score 74. Alert fires to both team members.]**
NARRATION: "Next time your team uploads customer data, they apply the workflow in one click and run the check. If the score drops, everyone gets notified immediately."

**CTA:** Set up your team data quality workflow — free at sohovi.com.

---

### VIDEO 116 — How to Prioritize Data Quality Fixes (Start With What Hurts Most)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "prioritize data quality fixes", "which data quality issues to fix first", "data quality fix priority"
**Duration:** 2 minutes
**Dataset:** A (post-run, multiple failing rules)

**Hook:** "Your data has 6 problems. You cannot fix all of them today. Here is a simple framework for deciding which ones to fix first — based on business impact, not just score contribution."

**[SCREEN: Sohovi results — 6 rules, 3 failing. Score 52/100. Failed records: email Completeness 70 rows, email Validity 44 rows, phone Validity 22 rows.]**
NARRATION: "Three rules failing. Which do you fix first? Look at two things: how many rows are affected, and what business process depends on that column."

**[SCREEN: Priority matrix — rows affected on one axis, business impact on the other. email Completeness: 70 rows, HIGH impact (campaigns cannot run without emails). Fix first.]**
NARRATION: "Email completeness: 70 rows affected, and you cannot run any campaign without an email address. Highest priority — fix this first."

**[SCREEN: email Validity: 44 rows, HIGH impact (bad emails cause hard bounces). Fix second.]**
NARRATION: "Email validity: 44 rows, high impact because invalid emails damage your sender reputation. Fix second."

**[SCREEN: phone Validity: 22 rows, MEDIUM impact (phone is used for SMS only). Fix third.]**
NARRATION: "Phone validity: 22 rows, medium impact — only used for SMS campaigns. Fix last, after the email issues are resolved."

**[SCREEN: Download failed records for each violation type separately. Fix in order of priority. Re-upload after each fix. Score climbs: 52 → 71 → 84 → 94.]**
NARRATION: "Download failed records for each violation separately. Fix in priority order. Score climbs step by step as you go."

**CTA:** Fix the right things first — start your data quality check free at sohovi.com.

---

### VIDEO 117 — How to Detect Outliers in Your Sales Data

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "detect outliers sales data", "outliers in sales data csv", "find abnormal values spreadsheet"
**Duration:** 90 seconds
**Dataset:** B (SalesQ1.csv — negative amounts and 2019 dates)

**Hook:** "One negative order amount in 200 records. One date from five years ago. Outliers are the needles in the haystack — and they will corrupt your averages if you miss them."

**[SCREEN: SalesQ1.csv uploaded to Sohovi. Click 'amount' column card. Outlier section: '10 values flagged — min value: -250.00'.]**
NARRATION: "Upload your sales CSV. Click the amount column card. Sohovi's outlier detection immediately flags the negative values — the minimum is -250, far outside the normal range."

**[SCREEN: Click 'date' column card. Outlier section: '2 dates from 2019 — 5 years outside the dataset range of 2024'.]**
NARRATION: "The date column also has outliers — two records from 2019, five years before the rest of the dataset."

**[SCREEN: Accuracy rules: amount greater than 0, date between 2024-01-01 and 2024-12-31. Run. 12 rows flagged in Failed Records.]**
NARRATION: "Set accuracy rules to enforce the expected ranges. Run the check. 12 rows flagged — the exact outliers."

**[SCREEN: Download failed records. Fix source data. Re-run. Score 97.]**
NARRATION: "Download, fix, re-run. Score 97. Your sales averages and totals are now free from outlier contamination."

**CTA:** Detect outliers before they corrupt your analysis — free at sohovi.com.

---

### VIDEO 118 — How to Find Data Entry Errors in a Spreadsheet

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "find data entry errors spreadsheet", "data entry errors csv detection", "catch typos spreadsheet free"
**Duration:** 90 seconds
**Dataset:** A (CustomerDB.csv — email typos, invalid phones)

**Hook:** "Someone typed 'N/A' in the phone number column. Someone else wrote 'john.doe@' as an email. These are not system errors — they are data entry errors. Here is how to find every single one."

**[SCREEN: CustomerDB.csv profiled. Pattern analysis on phone column shows 'N/A' and '00000000000' as anomalous values.]**
NARRATION: "Sohovi's pattern recognition flags values that don't match the expected format for a column. N/A in a phone field. All zeros. Incomplete email addresses."

**[SCREEN: Click email column drill-down on invalid pattern. Shows: 'john.doe@', 'notanemail', 'jane@@company.com'.]**
NARRATION: "The email column drill-down shows the actual bad values — incomplete addresses, double at signs, missing domains."

**[SCREEN: Validity rules on email and phone. Run. Failed Records: 66 rows with data entry errors.]**
NARRATION: "Set validity rules for both columns. Run the check. 66 rows with data entry errors — listed with the exact value and the row number."

**[SCREEN: Download. Fix the typos. Re-upload. Score 89.]**
NARRATION: "Download the failed records. Fix the typos. Re-upload. Score jumps from 52 to 89."

**CTA:** Find every data entry error in your spreadsheet — free at sohovi.com.

---

### VIDEO 119 — How to Check Date Formats in a CSV (Free Tool)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "validate date format csv free", "check date format csv online", "mixed date formats spreadsheet"
**Duration:** 90 seconds
**Dataset:** B (SalesQ1.csv — date column)

**Hook:** "Your date column has MM/DD/YYYY, YYYY-MM-DD, and DD-MM-YYYY all mixed together. Every tool you pipe this into will interpret them differently. Here is how to catch this in 30 seconds."

**[SCREEN: SalesQ1.csv date column in profiling. Pattern analysis: 'YYYY-MM-DD: 87%, MM/DD/YYYY: 8%, DD-MM-YYYY: 3%, other: 2%'.]**
NARRATION: "Sohovi's pattern recognition immediately shows the mix of date formats in your column. 87% are ISO standard. 13% are in other formats."

**[SCREEN: Validity rule: date column — date format — ISO 8601 preset (YYYY-MM-DD). Threshold 95%.]**
NARRATION: "Add a Validity rule using the ISO date format preset. Threshold 95% — at most 5% can be in other formats."

**[SCREEN: Run. Failed Records: 26 rows with non-standard date formats. Download.]**
NARRATION: "Run the check. 26 rows flagged. Download them, standardise the formats in Excel, re-upload."

**[SCREEN: Re-run after fix. Score improves. All dates now in consistent ISO format.]**
NARRATION: "After standardising: consistent format, clean column, no more ambiguous date parsing."

**CTA:** Validate your date formats free at sohovi.com — link in description.

---

### VIDEO 120 — How to Track Data Quality Week Over Week

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "track data quality over time weekly", "weekly data quality check", "data quality trend monitoring"
**Duration:** 2 minutes
**Dataset:** A (run history showing multiple weeks)

**Hook:** "One data quality score tells you where you are. Weekly scores tell you whether things are getting better or worse — and catch problems before they become emergencies."

**[SCREEN: Sohovi Run History tab. 8 weeks of runs visible. Scores: 52, 71, 84, 89, 91, 89, 74, 68.]**
NARRATION: "This is 8 weeks of data quality scores for one asset. It tells a story. Scores were improving — then something changed in week 7."

**[SCREEN: Click on week 7 run — score 74. Compare with week 6 — score 89. Rule comparison: email Completeness went from PASS to BREAKING. Null rate jumped from 3% to 19%.]**
NARRATION: "Week 7 dropped from 89 to 74. The comparison shows email completeness suddenly failed — null rate jumped from 3% to 19%. Something changed upstream."

**[SCREEN: Score Drop alert at 80 — would have fired at week 7 automatically.]**
NARRATION: "A Score Drop alert set at 80 would have fired automatically the moment week 7 processed. You would have known that Monday, not three weeks later."

**[SCREEN: Weekly schedule recommendation: every Monday morning, upload latest export, run check, review score.]**
NARRATION: "Best practice: every Monday morning, upload your latest data export, run the check, review the score. 5 minutes. That is your entire weekly data quality process."

**CTA:** Track your data quality weekly — free at sohovi.com.

---

### VIDEO 121 — How to Use Reusable Workflows Across Multiple Files

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "reusable data quality rules", "data quality workflow multiple files", "apply same rules different csv"
**Duration:** 90 seconds
**Dataset:** A and C (two different files, same workflow applied)

**Hook:** "You have 12 monthly customer exports. You want the same quality rules on all 12. Here is how to write those rules once — and apply them to every file in one click."

**[SCREEN: Sohovi Workflows page. 'Customer Data Standard' workflow — 4 rules saved.]**
NARRATION: "The Customer Data Standard workflow has 4 rules: email completeness, email validity, ID uniqueness, phone validity. Written once."

**[SCREEN: New Data Asset — upload CustomerDB_January.csv. Rules tab — click Apply Workflow — select Customer Data Standard. 4 rules added instantly.]**
NARRATION: "Upload January's export. Click Apply Workflow. 4 rules added in one click."

**[SCREEN: New Data Asset — upload CustomerDB_February.csv. Same workflow applied. Same 4 rules. Run both. Scores: Jan 89, Feb 74.]**
NARRATION: "Upload February's export. Same workflow. Same rules. Run both. January scores 89. February scores 74 — something is worse this month."

**[SCREEN: Compare February's failed records with January's. February has more missing emails — a new data source was added mid-month without proper validation.]**
NARRATION: "The run comparison shows February has more missing emails. A new data source was added mid-month without email validation on the form. Caught immediately."

**CTA:** Write your rules once, apply them everywhere — free at sohovi.com.

---

### VIDEO 122 — How to Catch Missing Values in Foreign Key Columns

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "missing foreign keys data quality", "foreign key validation csv", "check referential integrity csv"
**Duration:** 90 seconds
**Dataset:** B (SalesQ1.csv — customer_name as a soft foreign key)

**Hook:** "Your orders table has 200 rows. 15 of them have no customer name. That means 15 orders cannot be attributed to any customer — invisible revenue in your reports."

**[SCREEN: SalesQ1.csv profiled. customer_name column: 15 nulls — 7.5% of column.]**
NARRATION: "The customer name column has 15 missing values. These are orders that cannot be linked back to a customer in your CRM."

**[SCREEN: Completeness rule on customer_name — 100% threshold. Weight 5.]**
NARRATION: "Add a Completeness rule on customer_name — 100% threshold, weight 5. Every order must have a customer attribution."

**[SCREEN: Run. 15 rows fail. Failed Records shows order IDs, amounts, dates — all the context needed to identify which orders are unattributed.]**
NARRATION: "Run. 15 rows fail. The failed records show you the order IDs and amounts — enough to go back to the source and identify who placed each order."

**[SCREEN: Download failed records. Investigate and fill in missing customer names. Re-upload. Score improves. 0 unattributed orders.]**
NARRATION: "Download, investigate, fill in the missing names, re-upload. Zero unattributed orders — your revenue attribution is now complete."

**CTA:** Catch missing attribution before it corrupts your reports — free at sohovi.com.

---

### VIDEO 123 — How to Check If Your Data Is Ready for Analysis

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "is my data ready for analysis", "data quality check before analysis", "data analysis readiness check"
**Duration:** 2 minutes
**Dataset:** A (score 52 = not ready; score 89 = ready)

**Hook:** "How do you know when your data is actually ready for analysis? Most people just start. Here is a simple score-based readiness check that takes under 5 minutes."

**[SCREEN: CustomerDB.csv uploaded. AI Suggestions applied — 6 rules. Run. Score 52/100 amber.]**
NARRATION: "Run a data quality check before any analysis. Score 52 — amber. That means your data has significant issues."

**[SCREEN: Traffic light readiness guide: below 60 = NOT ready (red), 60-79 = proceed with caution (amber), 80+ = ready for analysis (green).]**
NARRATION: "Use this simple guide: below 60 means do not use this data for analysis — too many issues. 60 to 79 means use with caution and document known issues. 80 and above means your data is ready."

**[SCREEN: Score 52 — red zone. Failed records: 70 missing emails, 50 duplicates, 22 invalid phones. These will skew any analysis.]**
NARRATION: "Score 52 is in the red zone. 70 missing emails will create gaps in any email-based analysis. 50 duplicates will inflate all count metrics."

**[SCREEN: Fix issues. Re-run. Score 89 — green zone. Data ready for analysis.]**
NARRATION: "Fix the critical issues. Re-run. Score 89 — green zone. Now your analysis will produce reliable results."

**CTA:** Check if your data is analysis-ready — free at sohovi.com.

---

### VIDEO 124 — How to Validate Country and Region Data in a CSV

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "validate country data csv", "country name validation spreadsheet", "region data quality check"
**Duration:** 90 seconds
**Dataset:** A (country column — 20 valid countries + potential invalid entries)

**Hook:** "Your country column has 'United States', 'USA', 'US', 'U.S.A', and 'America' all referring to the same place. That is 5 different values for 1 country — and it will break every grouping and filter you build."

**[SCREEN: CustomerDB.csv country column in Sohovi profiling. Value distribution shows 'US', 'USA', and 'United States' as separate entries.]**
NARRATION: "The country column distribution shows multiple representations of the same country. US, USA, United States — three values, one country."

**[SCREEN: Validity rule: country — Allowed Values — enter the standardized list of 20 expected country names (US, UK, Canada, etc.). Threshold 100%.]**
NARRATION: "Add a Validity rule using the Allowed Values type. Enter your standardized country names — the exact strings you want. Threshold 100%."

**[SCREEN: Run. Failed Records shows all rows with non-standard country names: 'USA', 'United States', 'America' — flagged as violations.]**
NARRATION: "Run the check. Every non-standard country name is flagged. Download the failed records and standardize them to your chosen format."

**[SCREEN: After fix. Re-run. Score improves. Country column now has exactly 20 consistent values.]**
NARRATION: "After standardizing: consistent country names, clean grouping in any analysis, and no more mystery regions."

**CTA:** Standardize your country data free at sohovi.com. For the full pattern — combining this with completeness, weighting, and reference-column checks — see Video 157.

---

### VIDEO 125 — How to Clean a Marketing Email List (Step by Step)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "clean email list free", "email list cleaning tool", "how to clean marketing email list"
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv — framed as an email marketing list)

**Hook:** "Your email list has 5,000 contacts. Before you hit send on your next campaign, run this 4-step list cleaning process. It takes 10 minutes and will improve your open rate, reduce bounces, and protect your sender reputation."

**[SCREEN: Step cards appear one at a time.]**

**[SCREEN: Step 1 — Remove duplicates. sohovi.com/tools/remove-duplicates. Drop list. 50 duplicates found. Remove. Download clean file.]**
NARRATION: "Step one: remove duplicates. Go to Sohovi's free duplicate remover tool. Drop your list in. Remove all duplicate rows. Download the clean version."

**[SCREEN: Step 2 — Validate email formats. Upload to Sohovi. Add Validity rule on email column. Run. Flag all invalid formats.]**
NARRATION: "Step two: validate email formats. Upload to Sohovi. Add a Validity rule on the email column using the email format preset. Every invalid address is flagged."

**[SCREEN: Step 3 — Check completeness. Completeness rule: email 100%. Any row without an email is flagged and removed.]**
NARRATION: "Step three: check completeness. A Completeness rule on email at 100% catches any row where the email field was left blank."

**[SCREEN: Step 4 — Download the clean list. Final score: 97/100. Email list ready.]**
NARRATION: "Step four: download the cleaned list. Score 97. No duplicates, no invalid formats, no missing addresses. Your campaign is ready to send."

**CTA:** Clean your email list before every campaign — free at sohovi.com.

---

### VIDEO 126 — How to Use Score Transparency to Explain Issues to Your Team

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "explain data quality score", "data quality score breakdown explained", "show data quality results team"
**Duration:** 90 seconds
**Dataset:** A (Score Transparency panel)

**Hook:** "Your data quality score is 52. Your manager asks why. 'It is complicated' is not an answer. Here is how to give a precise, clear explanation in 60 seconds — using the Score Transparency panel."

**[SCREEN: Sohovi DQ results. Score 52/100. Click 'Score Transparency' tab.]**
NARRATION: "After running a DQ check, click Score Transparency. This panel shows exactly how the score was calculated — rule by rule."

**[SCREEN: Table: email Completeness BREAKING Weight 3 Penalty 18 points. email Validity BREAKING Weight 3 Penalty 15 points. phone Validity BREAKING Weight 2 Penalty 8 points. Three passing rules contributing full weight.]**
NARRATION: "Three rules are breaking. Email completeness — 18 point penalty. Email validity — 15 points. Phone validity — 8 points. Three rules passed and contributed their full weight."

**[SCREEN: Under the email Completeness row, a muted line — the rule's own Description, written when it was created: 'Email is required so Sales can follow up within 24 hours.']**
NARRATION: "If you wrote a Description when you built the rule, you don't even have to translate it live — it's sitting right there under the score, in your own words."

**[SCREEN: Translate to plain English for stakeholders: 'We lost 41 points because 70 emails are missing, 44 emails are incorrectly formatted, and 22 phone numbers are invalid'.]**
NARRATION: "Translate this directly: we lost 41 points because of three specific, fixable issues. 70 missing emails. 44 bad formats. 22 invalid phones."

**[SCREEN: Export the Score Transparency view or the PDF report. Share with team.]**
NARRATION: "Export the report and share it with your team. Everyone knows what is broken, why the score is 52, and exactly what to fix."

**CTA:** Make your data quality transparent — free at sohovi.com.

---

### VIDEO 127 — How to Run Your First Data Quality Check in Under 5 Minutes

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "first data quality check tutorial", "how to start data quality", "beginner data quality check"
**Duration:** 2 minutes
**Dataset:** A (full beginner walkthrough)

**Hook:** "You have never run a data quality check before. By the end of this video — you will have run one. It takes under 5 minutes. Let's go."

**[SCREEN: sohovi.com. Click Sign Up. Enter email. Account created in 30 seconds.]**
NARRATION: "Go to sohovi.com. Sign up — takes 30 seconds. No credit card required."

**[SCREEN: Dashboard loads. Left sidebar: Business Units. Click New Business Unit. Name: 'My Data'. Click Create.]**
NARRATION: "Create a Business Unit — just a folder for your data. Name it anything."

**[SCREEN: Click New Catalog inside the Business Unit. Name: 'Test Run'. Click Create. Then New Data Asset inside it. Name: 'Customer File'. Select Manual Upload.]**
NARRATION: "Create a Catalog and a Data Asset inside it. Name them anything. Select Manual Upload."

**[SCREEN: Upload CustomerDB.csv. Profiling runs in under 3 seconds. Column cards appear.]**
NARRATION: "Upload your CSV. Profiling runs in under 3 seconds — entirely in your browser."

**[SCREEN: Click Get AI Suggestions. 6 rules appear. Check all. Click Add Selected. Click Run DQ Check.]**
NARRATION: "Click Get AI Suggestions. Accept all suggested rules. Click Run DQ Check."

**[SCREEN: Score appears: 52/100. Rule breakdown visible. Failed records listed.]**
NARRATION: "You have a data quality score. A breakdown of what passed and failed. And a list of every row with an issue. You just ran your first data quality check."

**CTA:** Your first check is free at sohovi.com — takes under 5 minutes. Link in description.

---

## More Shorts / Reels Series

---

### VIDEO 128 — The Number 1 Reason Your Reports Are Wrong (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "why reports are wrong data quality", "inaccurate reports data"
**Duration:** 60 seconds

**[SCREEN 0–5s: Text — 'Your report is wrong. But your formulas are fine. So what is the problem?']**
NARRATION: "Your report is wrong. But the formulas are correct. So what is the problem?"

**[SCREEN 5–20s: CustomerDB.csv — email column with 70 blank cells. Revenue report that excludes those 70 customers silently.]**
NARRATION: "The data. 70 missing emails means 70 customers excluded from your email revenue report — without any error message, without any warning."

**[SCREEN 20–40s: Sohovi profiling — email 12.7% null, 50 duplicates. Score 52/100.]**
NARRATION: "Garbage in, garbage out. Sohovi profiles your data before it reaches any report — null rates, duplicates, invalid values — all visible in 5 seconds."

**[SCREEN 40–55s: Score after fix: 89/100. Clean data feeding clean reports.]**
NARRATION: "Fix the data. Fix the reports. In that order."

**[SCREEN 55–60s: sohovi.com]**
NARRATION: "Free at sohovi.com."

---

### VIDEO 129 — What Happens When You Skip Data Profiling (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "skip data profiling consequences", "why data profiling matters"
**Duration:** 60 seconds

**[SCREEN 0–5s: Text — 'You skipped data profiling. Here is what happens next.']**
NARRATION: "You skipped data profiling. Here is what happens next."

**[SCREEN 5–20s: Fast-cut sequence: build a dashboard on CustomerDB.csv without profiling. Revenue chart inflated by 50 duplicate records. Unique customer count wrong.]**
NARRATION: "You build a dashboard. The customer count is 550. But 50 of those are duplicates. Your unique customer count is wrong by 10%."

**[SCREEN 20–35s: Email campaign sent. 70 contacts with blank emails never receive it. Campaign metrics are off.]**
NARRATION: "You send a campaign. 70 contacts have no email. They never receive it. Your open rate looks terrible."

**[SCREEN 35–50s: Sohovi profiling — 5 seconds to catch all of these before they reach anything downstream.]**
NARRATION: "5 seconds of profiling catches all of this. Before the dashboard. Before the campaign. Before the bad decision."

**[SCREEN 50–60s: sohovi.com — 'Profile first. Always.']**
NARRATION: "Profile first. Always. Free at sohovi.com."

---

### VIDEO 130 — How to Find Data Entry Errors Instantly (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "find data entry errors fast", "detect typos csv instantly"
**Duration:** 60 seconds

**[SCREEN 0–5s: Text — 'Someone typed N/A in a phone number field. Here is how to find every mistake like that instantly.']**
NARRATION: "Someone typed N/A in a phone number field. Here is how to find every mistake like that."

**[SCREEN 5–25s: CustomerDB.csv uploaded to Sohovi. phone column pattern analysis: 4% invalid — 'N/A', '00000000000' shown as examples.]**
NARRATION: "Upload your file. Sohovi's pattern recognition flags every value that doesn't match the expected format for that column."

**[SCREEN 25–45s: Validity rule on phone. Run. Failed records: 22 rows — all the data entry errors listed.]**
NARRATION: "Add a Validity rule. Run. Every data entry error is listed — with the row number and the bad value."

**[SCREEN 45–60s: Download. Fix. sohovi.com]**
NARRATION: "Download. Fix. Done. Free at sohovi.com."

---

### VIDEO 131 — Your Dashboard Looks Fine. Your Data Disagrees. (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "dashboard wrong data quality", "dashboard looks fine but data is wrong"
**Duration:** 60 seconds

**[SCREEN 0–5s: Beautiful dashboard — clean charts, green numbers, all looks perfect.]**
NARRATION: "Your dashboard looks great."

**[SCREEN 5–15s: Zoom into source data. SalesQ1.csv — 10 negative amounts. Total sum includes those negatives, making revenue look lower than it is.]**
NARRATION: "But the source data has 10 negative order amounts. Your revenue total is $22,000 lower than it should be."

**[SCREEN 15–30s: Sohovi. Accuracy rule: amount greater than 0. Run. 10 rows flagged. Score 71.]**
NARRATION: "One Accuracy rule in Sohovi catches all 10. In under 3 seconds."

**[SCREEN 30–50s: Fix. Re-run. Score 97. Dashboard now shows correct revenue.]**
NARRATION: "Fix the 10 rows. Re-run. Score 97. Dashboard now shows the real number."

**[SCREEN 50–60s: sohovi.com — 'Fix the data. Trust the dashboard'.]**
NARRATION: "Fix the data. Trust the dashboard. Free at sohovi.com."

---

### VIDEO 132 — 5 Data Problems You Can Find in Under 1 Minute (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "data quality problems find fast", "5 data problems csv check"
**Duration:** 60 seconds

**[SCREEN 0–5s: Text — '5 data problems. 1 file. Under 60 seconds. Watch.']**
NARRATION: "5 data problems. One file. Under 60 seconds."

**[SCREEN 5–12s: Upload CustomerDB.csv to Sohovi. Profiling runs. Overview card appears.]**
NARRATION: "Upload to Sohovi."

**[SCREEN 12–22s: Problem 1 — email 12.7% null. Problem 2 — 50 duplicate rows.]**
NARRATION: "Missing emails — 70 rows. Duplicate records — 50 rows."

**[SCREEN 22–32s: Problem 3 — phone 4% invalid format. Problem 4 — email 8% invalid format.]**
NARRATION: "Invalid phone numbers — 22 rows. Invalid email formats — 44 rows."

**[SCREEN 32–42s: Problem 5 — PII detected — email, phone, name flagged. GDPR note visible.]**
NARRATION: "PII detected — email, phone, and name columns. Handle with care."

**[SCREEN 42–55s: All 5 problems found. 5 problems in 30 seconds. Score 52/100.]**
NARRATION: "5 problems. 30 seconds. Score 52. Now you know exactly what to fix."

**[SCREEN 55–60s: sohovi.com]**
NARRATION: "Free at sohovi.com."

---

### VIDEO 133 — Convert JSON to CSV in 10 Seconds (Free Tool)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "json to csv 10 seconds", "convert json to csv free fast"
**Duration:** 60 seconds

**[SCREEN 0–5s: Text — 'Got JSON. Need a spreadsheet. 10 seconds.']**
NARRATION: "Got JSON. Need a spreadsheet. 10 seconds."

**[SCREEN 5–25s: sohovi.com/tools/json-to-csv. Paste JSON array on left. CSV table appears instantly on right.]**
NARRATION: "sohovi.com/tools/json-to-csv. Paste your JSON. CSV preview appears instantly."

**[SCREEN 25–40s: Nested object in JSON — address.city and address.country appear as flat columns automatically.]**
NARRATION: "Nested objects get flattened automatically. address.city and address.country become separate columns."

**[SCREEN 40–55s: Click Download CSV. File saved. Open in Excel — perfect table.]**
NARRATION: "Download. Open in Excel. Perfect table. No code."

**[SCREEN 55–60s: sohovi.com/tools/json-to-csv — 'Free. Link in bio'.]**
NARRATION: "Free. Link in bio."

---

### VIDEO 134 — What Is a Completeness Rule? (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "completeness rule data quality explained", "what is data completeness rule"
**Duration:** 60 seconds

**[SCREEN 0–5s: Text — 'A completeness rule in 60 seconds'.]**
NARRATION: "A completeness rule — explained in 60 seconds."

**[SCREEN 5–20s: CustomerDB.csv email column. 70 blank cells visible. Null rate 12.7%.]**
NARRATION: "Your email column has 70 blank values — 12.7% of the file. A completeness rule checks whether that is acceptable."

**[SCREEN 20–35s: Sohovi rule builder. Completeness rule: email — threshold 95%. Means: at most 5% of emails can be blank.]**
NARRATION: "Set the threshold to 95%. That means: this rule passes only if at least 95% of emails are filled in."

**[SCREEN 35–50s: Run. 12.7% null is below 95% threshold. Rule FAILS. 70 rows flagged.]**
NARRATION: "12.7% null is below 95% — rule fails. 70 rows flagged. You now have a list of exactly which records need filling in."

**[SCREEN 50–60s: sohovi.com — 'Set your first completeness rule free'.]**
NARRATION: "Set yours free at sohovi.com."

---

### VIDEO 135 — Never Get Surprised by a Schema Change Again (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "schema change alert automatic", "detect column changes automatically"
**Duration:** 60 seconds

**[SCREEN 0–5s: Text — 'Your data pipeline broke at 2am. A column was removed. Nobody told you. Again.']**
NARRATION: "Your data pipeline broke. A column was removed. Nobody told you. Again."

**[SCREEN 5–25s: Sohovi — new version of EmployeeDir.csv uploaded. Alert banner: 'Schema change detected — column department added'.]**
NARRATION: "With Sohovi, schema changes are detected the moment a new file version is uploaded."

**[SCREEN 25–45s: Create Schema Change alert — any change — email notification. Save. Done.]**
NARRATION: "Set a Schema Change alert. Any column added or removed — email sent immediately."

**[SCREEN 45–58s: Mock email: 'Schema change detected — department column added in EmployeeDir'. Received before any pipeline runs.]**
NARRATION: "You get the email before any pipeline runs. Before anything breaks."

**[SCREEN 58–60s: sohovi.com]**
NARRATION: "Free at sohovi.com."

---

### VIDEO 136 — Your Phone Number Column Has Problems — Here Is Proof (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "phone number data quality check", "invalid phone numbers csv"
**Duration:** 60 seconds

**[SCREEN 0–5s: Text — 'Your phone number column has problems. Here is proof.']**
NARRATION: "Your phone number column has problems. Here is proof."

**[SCREEN 5–25s: CustomerDB.csv uploaded. phone column card: pattern analysis shows N/A, 00000000000, and 555-CALL-ME as examples of invalid values. 4% of column.]**
NARRATION: "Sohovi's pattern analysis shows exactly what is in your phone column. N/A. All zeros. Text where digits should be. 4% of your column is garbage."

**[SCREEN 25–45s: Validity rule: phone — US format preset. Run. 22 rows flagged. Download.]**
NARRATION: "Validity rule set. Run. 22 rows flagged — every invalid phone number, listed with its row number."

**[SCREEN 45–58s: Fix phone values. Re-run. 0 invalid phones. Score improves.]**
NARRATION: "Fix them. Re-run. Zero invalid phones."

**[SCREEN 58–60s: sohovi.com]**
NARRATION: "Free at sohovi.com."

---

### VIDEO 137 — Data Quality Score From 47 to 91 (Watch It Happen) (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "improve data quality score", "data quality before after"
**Duration:** 60 seconds

**[SCREEN 0–5s: Score gauge at 47/100 — red. Text: 'Before'.]**
NARRATION: "47 out of 100. Here is how we got to 91."

**[SCREEN 5–20s: Failed records downloaded — 120 rows. Opened in Excel. Missing emails filled in. Invalid phones fixed. Duplicate rows deleted.]**
NARRATION: "Download the 120 failed rows. Fill in missing emails. Fix invalid phones. Delete duplicates. Save."

**[SCREEN 20–40s: Clean file re-uploaded to Sohovi. Run DQ Check. Score animates: 47 → 71 → 84 → 91. Stops in green-teal zone.]**
NARRATION: "Re-upload. Run. Watch the score climb — 47, 71, 84, 91."

**[SCREEN 40–55s: Score 91/100. Green teal gauge. 0 failed records. Rule breakdown: all 6 rules PASS.]**
NARRATION: "91 out of 100. Six rules passing. Zero failed records. That data is ready to use."

**[SCREEN 55–60s: sohovi.com — 'Your score is waiting. Free'.]**
NARRATION: "What is your score? Free at sohovi.com."

---

### VIDEO 138 — The 30-Second Data Audit (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "quick data audit 30 seconds", "fast data quality check"
**Duration:** 60 seconds

**[SCREEN 0–5s: Text — 'A full data audit in 30 seconds. Watch.']**
NARRATION: "A full data audit. 30 seconds. Watch."

**[SCREEN 5–15s: Drag CustomerDB.csv onto Sohovi upload zone. Profiling completes in 3 seconds.]**
NARRATION: "Drop your file in. Profiling runs in 3 seconds."

**[SCREEN 15–25s: Overview: 2 columns with issues, 12.7% null rate, 50 duplicates, 4% invalid phones. All visible at once.]**
NARRATION: "Overview: two columns with issues, 70 missing emails, 50 duplicates, 22 invalid phones."

**[SCREEN 25–35s: Click Get AI Suggestions. 6 rules added. Click Run DQ Check. Score 52/100.]**
NARRATION: "AI suggestions. Accept. Run. Score 52."

**[SCREEN 35–50s: Failed records: 120 rows. Download button clicked. File saves.]**
NARRATION: "120 rows with issues. Download the list."

**[SCREEN 50–60s: Total time elapsed: 30 seconds. sohovi.com]**
NARRATION: "30 seconds. Full audit. Free at sohovi.com."

---

### VIDEO 139 — Connect Google Sheets to Data Quality Monitoring (60s)

**Platform:** YouTube Shorts / Instagram Reels
**SEO Target:** "google sheets data quality monitoring", "monitor google sheets data quality"
**Duration:** 60 seconds

**[SCREEN 0–5s: Text — 'Your Google Sheet is a data quality blind spot. Here is how to fix that in 2 minutes.']**
NARRATION: "Your Google Sheet is a data quality blind spot. Here is the fix."

**[SCREEN 5–25s: Sohovi — New Data Asset — Source: Google Sheets — Connect — OAuth — Allow. Sheet selector appears.]**
NARRATION: "In Sohovi, create a data asset. Select Google Sheets. Authorize with your Google account. Select the sheet."

**[SCREEN 25–40s: Profiling runs on the live sheet data. Column cards appear with stats. email: 8% null.]**
NARRATION: "Sohovi reads your live sheet and profiles every column. 8% of emails are missing."

**[SCREEN 40–55s: Completeness and Uniqueness rules set. Score Drop alert at 80. Active.]**
NARRATION: "Set your rules. Add a Score Drop alert. Done."

**[SCREEN 55–60s: sohovi.com — 'Your Google Sheet. Now monitored. Free'.]**
NARRATION: "Your Google Sheet. Now monitored. Free at sohovi.com."

---

---

## NEW FEATURE VIDEO SCRIPTS (Added with Behavioral Scoring & AI Builder features)

---

### VIDEO 140 — "Your Data Changed — And Sohovi Caught It" (Behavioral Scoring Demo)

**Platform:** YouTube (full demo) + Instagram Reel (60s cut)
**SEO Target:** "data quality anomaly detection", "behavioral data quality scoring", "detect data drift automatically"
**Duration:** 3–4 minutes (YouTube) / 60–90 seconds (Instagram Reel)
**Dataset:** CustomerDB.csv (normal run) → CustomerDB_nulls.csv (same file with email column nulled out 60%)

**Hook (0–5s):**
**[SCREEN 0–5s: Text overlay — 'Your DQ score says 98%... but something is wrong. Here is how Sohovi knows.']**
NARRATION: "Your DQ score says 98%. But something is wrong. And Sohovi caught it before you did."

**Setup — Clean Run (5–25s):**
**[SCREEN 5–15s: Sohovi dashboard → Asset → Scoring tab. DQ Score gauge showing 98. Green.]**
NARRATION: "Here is a clean run. 98 overall DQ score. Rules passing."

**[SCREEN 15–25s: Click Runs tab → click the clean run → Run detail page. Behavior Score card shows 100. 'Based on 5 historical runs.']**
NARRATION: "The Behavior Score is 100. This run is statistically consistent with the last 5 runs. Nothing anomalous."

**Introducing the Anomalous Run (25–60s):**
**[SCREEN 25–40s: Upload CustomerDB_nulls.csv. Profiling runs. DQ check runs. Score: 97. Static rules: mostly pass — the null check threshold was 80%, so it passes.]**
NARRATION: "Now here is a new file. The email column has 62% nulls. Our null rule threshold was set to 80% — so it still passes. DQ score: 97. Nothing looks wrong."

**[SCREEN 40–55s: Click Save Run. Navigate to the run detail page. DQ Score gauge: 97. Then — Behavior Score card below: score 30. Red flag visible.]**
NARRATION: "But look at the Behavior Score. 30 out of 100."

**[SCREEN 55–75s: Zoom into the BehaviorScoreCard. Flag: 'customer_email — Null Rate — Observed: 62.0% nulls. Expected ≈ 0.5%. Z-score: 28.4. Severity: HIGH.']**
NARRATION: "The null rate in customer_email is 62%. Historically it's 0.5%. That's a 28-sigma event. Sohovi flags it as a critical behavioral anomaly — even though the static DQ rule passed."

**Why This Matters (75–100s):**
**[SCREEN 75–100s: Side-by-side: DQ Score 97 (green) vs Behavior Score 30 (red). Annotation: 'DQ Score: checks your rules. Behavior Score: checks if the data is acting normally.']**
NARRATION: "Two scores. One checks whether your rules pass. The other checks whether your data is acting normally. You need both. Because rules check what you anticipated. Behavior catches everything else."

**CTA (100–110s):**
**[SCREEN 100–110s: sohovi.com. 'Behavioral Scoring. Free on Sohovi.']**
NARRATION: "Behavioral Scoring is automatic on every run. No configuration needed. Free at sohovi.com."

---

### VIDEO 141 — "Write Data Quality Rules in Plain English" (AI Builder Demo)

**Platform:** YouTube + Instagram Reel
**SEO Target:** "AI data quality rules", "write data quality rules plain english", "no-code data quality"
**Duration:** 2–3 minutes (YouTube) / 45 seconds (Instagram cut)

**Hook (0–5s):**
**[SCREEN 0–5s: Text — 'Stop memorizing rule types. Just describe what you want.']**
NARRATION: "Stop memorizing rule types. Just describe what you want — and Sohovi builds the rule for you."

**The Old Way — Brief (5–20s):**
**[SCREEN 5–20s: Manual tab of RuleBuilderPanel. Multiple dropdowns: Dimension, Rule Type, Parameters, Threshold. Animated clicks through the dropdowns to show complexity.]**
NARRATION: "The old way: pick a dimension, pick a rule type, fill in the parameters, set the threshold. For a non-technical user, that's a lot to learn."

**AI Builder in Action (20–75s):**
**[SCREEN 20–30s: Click 'AI Builder' tab. Tab switches. Simple UI: Column dropdown + Textarea + Generate button.]**
NARRATION: "Click AI Builder. Select your column. Then just... describe it."

**[SCREEN 30–45s: Column: 'email'. Textarea: slowly type 'Email must never be blank and must be a valid email address'. Click 'Generate Rules'.]**
NARRATION: "Email must never be blank and must be a valid email address. Generate."

**[SCREEN 45–65s: Spinner for 2 seconds. Two rule cards appear: (1) not_null — Completeness — 99% confidence — 'Email is a required field', (2) format_check email template — Conformity — 97% confidence — 'Email must match standard format'.]**
NARRATION: "Two rules, generated in under 3 seconds. Not null — completeness — 99% confidence. Format check — conformity — 97% confidence. Exactly right."

**[SCREEN 65–75s: Click 'Accept' on both cards. Buttons change to '✓ Added'. Navigate to Rules list — both rules appear.]**
NARRATION: "Accept both. They're instantly saved to your ruleset. Done."

**Privacy Note (75–90s):**
**[SCREEN 75–90s: Annotation overlay: 'Only column name + description sent to AI. Your actual data never leaves your browser.']**
NARRATION: "And your data is safe. Only the column name and your description are sent to the AI. Your actual data never leaves your browser."

**CTA (90–100s):**
**[SCREEN 90–100s: sohovi.com. 'AI Rule Builder. Free on Sohovi.']**
NARRATION: "AI Rule Builder. Free at sohovi.com. Link in bio."

---

### VIDEO 142 — "What Is Data Drift? (Explained in 60 Seconds)" (Educational)

**Platform:** YouTube Shorts + Instagram Reels
**SEO Target:** "what is data drift", "data drift explained", "data drift vs schema drift"
**Duration:** 60 seconds
**Format:** Screen recording + narration (no talking head required)

**[SCREEN 0–5s: Title card — 'What Is Data Drift?' + Sohovi logo]**
NARRATION: "Data drift. It's one of the sneakiest data quality problems. Here is what it is and how to catch it."

**Schema Drift (5–20s):**
**[SCREEN 5–20s: Simple table with columns: customer_id, email, phone, status. Then — columns change: phone disappears, mobile_phone appears. Red overlay: 'Schema Drift']**
NARRATION: "First: schema drift. This is when columns are added, removed, or renamed. Your pipeline expects 'phone' — now it's 'mobile_phone'. Everything downstream breaks. Sohovi detects this automatically on every upload."

**Statistical Drift (20–37s):**
**[SCREEN 20–37s: Bar chart showing null rate over 6 runs: 0.5%, 0.5%, 0.6%, 0.5%, 8%, 18%. Last bar is red. Text: 'Statistical Drift']**
NARRATION: "Second: statistical drift. Your null rate was 0.5% for months. Suddenly it's 18%. Your static rules said nothing. But the behavior has completely changed. Sohovi's Behavior Score flags this instantly using z-score analysis."

**Distribution Shift (37–52s):**
**[SCREEN 37–52s: Pie chart — Run 1: 'active' 60%, 'inactive' 30%, 'pending' 10%. Run 2: 'active' 5%, 'cancelled_fraud' 70%, 'inactive' 25%. Text: 'Distribution Shift']**
NARRATION: "Third: distribution shift. Your 'status' column had three values for two years. Today, 70% of rows say 'cancelled_fraud'. That's a new value — and a serious signal. Sohovi detects this automatically. No rule required."

**CTA (52–60s):**
**[SCREEN 52–60s: Sohovi run detail page — Behavior Score card showing three flags: schema drift, null_pct, distribution. sohovi.com]**
NARRATION: "Schema drift, statistical drift, distribution shift — Sohovi catches all three automatically. Free at sohovi.com."

---

---

## NEW FEATURE VIDEO SCRIPTS (Added with Rule Descriptions, Scope Filters, Breaking Records & DQ Glossary)

> **Context:** A recent update added five workflow upgrades to the rule builder, sandbox, scoring views, and profiling export: an optional free-text **Description** on every rule, generic **Scope conditions** (filter any rule to a subset of rows), **"Breaking"** replacing "Fail" everywhere a result is shown — plus a click-to-popup Failed Records view with CSV download — a per-column **DQ Glossary** explaining why each dimension applies, and a richer profiling Excel export with prose and glossary sheets. The five videos below cover each, in the same Learn/In-App style as Part 2.

---

### VIDEO 143 — Add a Description to Your DQ Rule

**Platform:** Learn (In-App Tutorial)
**Duration:** 2 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Data Asset page. Rules tab. Click 'Add Rule'. Column = email, Dimension = Completeness, Rule Type = Not Null.]**
NARRATION: "Every rule now has an optional Description field — a place to write down why the rule exists, not just what it checks."

**[SCREEN: Below Rule Type, a 'Description (optional)' textarea with placeholder 'Notes about why this rule exists or what it checks…'.]**
NARRATION: "Type a real reason. I'll write: 'Email is required so Sales can follow up within 24 hours of signup.'"

**[SCREEN: Set threshold 95%. Click 'Add Rule'. Success message: 'Rule created successfully.']**
NARRATION: "Save the rule like normal. The description travels with it everywhere from here on."

**[SCREEN: Rules list. Under the rule's threshold line, a small italic gray line shows the description text.]**
NARRATION: "In the rules list, it shows right under the rule as a quiet italic note — there for anyone who opens this asset later."

**[SCREEN: Run a DQ Check. Score Transparency panel — under the failing email rule, the same description text appears beneath the rule name.]**
NARRATION: "Run a check, and it follows the rule into Score Transparency too — so the score isn't just a number, it has context."

**[SCREEN: Click the rule's BREAKING badge. Failed Records popup opens — the description is the first line above the table.]**
NARRATION: "Open the Failed Records view for that rule, and the description is the first thing you see — before the data itself."

**[SCREEN: Rules page → 'Get AI Suggestions'. Each suggested rule card now has its own small 'Add a description (optional)…' input before you click Accept.]**
NARRATION: "And it's not just the manual builder — every AI-suggested rule has the same optional description box right on the card, before you accept it."

**CTA:** Use descriptions for any rule whose reasoning isn't obvious from its name — your team, and future you, will read it instead of guessing at it.

---

### VIDEO 144 — Scope a Rule to a Subset of Rows

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** B (SalesQ1.csv)

**[SCREEN: SalesQ1 Data Asset. Rules tab. Add Rule. Column = email, Dimension = Completeness, Rule Type = Not Null, Threshold 95%.]**
NARRATION: "Some rules shouldn't apply to every row. Sohovi's Scope conditions let you check a rule against only a filtered subset."

**[SCREEN: Below Threshold, a collapsed row: 'Scope (optional)' with a '+' on the right. Click it — it expands with helper text: 'Only evaluate rows matching all conditions below (e.g. status == Approved).']**
NARRATION: "Click Scope to expand it. Anything you add here narrows down which rows this specific rule is checked against — every other row is skipped entirely, pass or fail."

**[SCREEN: Click '+ Add condition'. A row appears: Column select, Operator select (defaults to '=='), Value input. Set Column = region, leave operator '==', type Value = 'US'.]**
NARRATION: "Add a condition: region equals US. We only want to enforce strict email completeness on US orders."

**[SCREEN: Click '+ Add condition' again. Second row: Column = amount, Operator changed to '>', Value = '500'.]**
NARRATION: "Add a second condition: amount greater than 500. Conditions stack with AND — so now this rule only runs against US orders over $500, where a missing email actually blocks a sales follow-up."

**[SCREEN: Operator dropdown opened, showing all 8 choices: equals, not equals, greater than, greater or equal, less than, less or equal, 'in (comma-separated)', contains.]**
NARRATION: "You've got eight operators to work with — equals, not equals, the four numeric comparisons, 'in' for a comma-separated list, and contains for partial text matches."

**[SCREEN: Click 'Add Rule'. Rules list shows the new rule with a small teal 'Scoped' pill and a filter icon next to it.]**
NARRATION: "Save it. Back in the rules list, scoped rules get a teal 'Scoped' badge so you can tell at a glance which rules aren't checking the whole file."

**[SCREEN: Hover the 'Scoped' badge. Tooltip shows: 'region == US AND amount > 500'.]**
NARRATION: "Hover over it any time to see exactly what the scope is, in plain text — no need to reopen the rule."

**[SCREEN: Run DQ Check. Failed Records for this rule only shows US orders over $500 with blank emails — other rows aren't touched.]**
NARRATION: "When you run the check, only in-scope rows count toward this rule's pass or fail — and only in-scope rows can show up as failed records for it."

**[SCREEN: Switch to the Sandbox. The same 'Scope (optional)' section appears there too, above the Run Test button.]**
NARRATION: "The same Scope section is available in the Sandbox, so you can test a scoped rule against your real file before you ever save it."

**CTA:** Scope conditions work on every dimension and rule type, not just completeness — use them whenever a rule should only apply to part of your data.

---

### VIDEO 145 — Breaking Records: Click a Badge to See and Download Failures

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (post-run, score 52)

**[SCREEN: Scoring Dashboard after a run. Top bar: score gauge 52, then Rules 6 / Passed Rules 3 / Failed Rules 3 / Columns 6.]**
NARRATION: "First, some terminology: Sohovi calls a failing rule 'Breaking' everywhere in the product — not 'Fail'. Same meaning, just the word you'll see on screen."

**[SCREEN: Three columns below the top bar: 'Column Scores', 'Rule Breakdown', 'Failed Records' — all visible at once, no tabs.]**
NARRATION: "After a run, these three panels sit side by side. No tab-switching — column scores, the rule-by-rule breakdown, and the actual failed records are all on screen together."

**[SCREEN: Middle 'Rule Breakdown' panel. Each rule row ends with a colored pill: green 'PASS' or red 'BREAKING'.]**
NARRATION: "Every rule gets a pill badge. Green PASS, or red BREAKING."

**[SCREEN: Click the red 'BREAKING' badge next to 'email — Completeness'. A popup titled 'Failed Records' opens.]**
NARRATION: "Click any BREAKING badge, and a popup opens — pre-scoped to that exact rule."

**[SCREEN: Inside the popup: the rule's Description (if set) at the top, then a one-line plain-English summary, then the table of actual failing rows with the email column highlighted in red.]**
NARRATION: "If the rule has a description, it's the first thing you see. Below it, the real rows — with the column that broke the rule highlighted so you don't have to hunt for it."

**[SCREEN: Pill buttons above the table: 'not null (70)', another rule '(44)'. Click between them.]**
NARRATION: "If more than one rule is failing, switch between them with these pills — each one shows its own live failure count."

**[SCREEN: Click 'Download CSV (70 rows)'. File downloads with a 'Rules Violated' column alongside the original data.]**
NARRATION: "Download the CSV. It includes every visible failing row, plus exactly which rule or rules each one broke."

**[SCREEN: Close the popup. The same red BREAKING badge with the same click-to-popup behavior also appears in the Sandbox after clicking Run Test.]**
NARRATION: "The exact same badge and popup show up in the Sandbox too, the moment you click Run Test — so you can see real failing rows before you've even saved the rule."

**[SCREEN: Navigate to Run History → open an old run. The BREAKING label is shown, but it's plain text — clicking it does nothing.]**
NARRATION: "One exception: past runs in your Run History show the BREAKING label, but you can't click through. Sohovi never stores your raw rows on the server — only the score — so once a session ends, there's nothing left to click into. Same privacy model that keeps your data in your browser in the first place."

**CTA:** Click first, scroll never — every BREAKING badge is a shortcut straight to the rows that caused it.

---

### VIDEO 146 — DQ Glossary: Why Each Dimension Applies to Your Columns

**Platform:** Learn (In-App Tutorial)
**Duration:** 2.5 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Profiling Dashboard for CustomerDB.csv. Under the 'email' column's name and type badge, a row of small colored pills: 'completeness', 'validity'.]**
NARRATION: "Every column card now shows which DQ dimensions actually apply to it — before you've written a single rule."

**[SCREEN: Click the 'id' column card. Pills show only 'uniqueness'.]**
NARRATION: "An ID column only gets 'uniqueness' — that's the dimension that actually matters for a key column."

**[SCREEN: Click 'email' card to expand it. Scroll to a section titled 'DQ Glossary — why these dimensions apply'.]**
NARRATION: "Expand any card and scroll down to the DQ Glossary section — this is where Sohovi explains its reasoning."

**[SCREEN: Inside, one block per dimension: a colored 'completeness' pill, '94% confidence', a gray definition sentence, a bold rationale sentence specific to this column, then 'Suggested checks: not null'.]**
NARRATION: "Each dimension gets its own card: a plain-English definition of what that dimension even means, then the specific reason it applies to THIS column — based on what Sohovi found when it profiled your file."

**[SCREEN: Read the definition aloud: 'Whether values that should be present actually are. Real-world extracts often have gaps from optional fields, failed integrations, or skipped entry — this flags how much of that gap exists here.']**
NARRATION: "These definitions assume your data isn't perfect — because real source data never is. That's the whole point of profiling before you analyze."

**[SCREEN: Scroll to the Validity block for email — the rationale mentions the 8% non-standard pattern found earlier in profiling.]**
NARRATION: "The rationale isn't generic — it references the actual pattern mismatch Sohovi found in your file, the same number you saw in the column's pattern breakdown."

**[SCREEN: Click 'Get AI Suggestions' on the Rules page — the suggested rules match the same dimensions just seen in the Glossary.]**
NARRATION: "This is the same reasoning engine behind AI Rule Suggestions — the Glossary just shows you the 'why' up front, per column, before you decide what to do about it."

**CTA:** Read the Glossary before you write rules — it tells you what to check and why, not just what's possible.

---

### VIDEO 147 — Export the Full Profiling Report (5-Sheet Excel Workbook)

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Profiling Dashboard toolbar. Far right, a navy 'Download Excel' button with a download icon.]**
NARRATION: "Every profiling session can be exported as a full Excel workbook — not just a screenshot of the dashboard."

**[SCREEN: Click 'Download Excel'. File saves as 'CustomerDB_profiling.xlsx'.]**
NARRATION: "Click it. The file is named after your original upload with _profiling added, so it's obvious what it is later."

**[SCREEN: Open in Excel. Tab 1 'Summary' — one frozen-header row per column: type, row/null/unique counts and percentages, min/max/avg/std dev, lengths, outlier count, top 3 patterns, PII detected and type.]**
NARRATION: "Tab one, Summary — every stat for every column in one flat table. This is your spreadsheet-native version of the dashboard."

**[SCREEN: Tab 2 'Values' — Column Name | Value | Count | Percentage, grouped and shaded by column.]**
NARRATION: "Tab two, Values — every distinct value per column, with light shading alternating column by column so you can see where one ends and the next begins."

**[SCREEN: Tab 3 'Patterns' — same layout, but for detected format patterns instead of raw values.]**
NARRATION: "Tab three, Patterns — the same idea, but for formats. Useful for spotting the mixed-format problems we saw earlier in phone and email."

**[SCREEN: Tab 4 'Column Descriptions' — two columns: Column Name, Description. Each row a full sentence, e.g. '"email" is a text column with 550 rows. 12.7% of values are missing. 87.3% are unique. Most common format "word@word.word" (92%). Appears to contain PII (email).']**
NARRATION: "Tab four is new — Column Descriptions. One plain-English paragraph per column, written for a human, not a dashboard."

**[SCREEN: Tab 5 'DQ Glossary' — Column Name | Dimension | Definition | Why It Applies Here | Confidence (%) | Suggested Checks, one row per column-dimension pair.]**
NARRATION: "Tab five is also new — the DQ Glossary from the dashboard, flattened into one sortable, filterable table: every dimension, every column, the definition, the specific reason it applies, and the confidence score."

**[SCREEN: Sort the DQ Glossary tab by Confidence descending in Excel.]**
NARRATION: "Because it's a real spreadsheet, you can sort and filter it — for example, by confidence, to see Sohovi's strongest findings first."

**CTA:** Hand this workbook to a stakeholder who doesn't even have a Sohovi login — it's the full case for why your data needs work, not just the conclusion.

---

---

## DOMAIN VERTICALS & UNCOVERED FEATURES (Banking, Supply Chain, Free Tools, Differentiators)

> **Context:** A feature/value audit turned up two real gaps: (1) no industry video exists for Banking or Supply Chain specifically — only generic or partially-related verticals (HR, Finance, E-commerce, etc.) — and (2) three live, zero-coverage free tools (PII Audit, De-Identify, Compare) plus two genuinely differentiated capabilities (date-format ambiguity resolution, the DQ Glossary's "why" reasoning) had no dedicated marketing video. The 8 scripts below close those gaps, plus one transparency video laying out exactly what's free vs. Pro vs. Business — see the "Plan Tiers" note added to several earlier videos for why that distinction matters.

---

### VIDEO 148 — Data Quality for Banking: Catch What Manual Review Misses

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality banking", "kyc data quality check", "bank customer data cleansing", "data quality for financial services"
**Duration:** 2 minutes
**Dataset:** D (CustomerAccounts.csv)

**Hook:** "Your core-banking export has 400 customers. 32 are missing an email on file. 30 are duplicates from your last system merge. Nobody caught it — until now."

**[SCREEN: CustomerAccounts.csv open in Excel. Visible blank cells in kyc_status and email columns, a few rows with TEST-0000 account numbers.]**
NARRATION: "This is a normal shape for a bank's customer export — and it's full of exactly the kind of gaps that fail an audit."

**[SCREEN: Drop CustomerAccounts.csv onto Sohovi. Profiling completes. Column cards: kyc_status shows 10% null, customer_id shows duplicates, balance shows an outlier flagged at $999,999,999.99.]**
NARRATION: "Drop it into Sohovi. Profiling runs entirely in your browser — for a bank, that's not a nice-to-have, that's the whole point. No customer PII ever touches a server."

**[SCREEN: PII banner appears: 'PII detected in 4 columns' — email, phone, full name, account_number flagged.]**
NARRATION: "Sohovi automatically flags every column that holds personal data — email, phone, name, account number — before you do anything else with this file."

**[SCREEN: Add rules: Completeness on kyc_status at 100%, Uniqueness on customer_id, Accuracy: balance > 0. Scope the balance rule to branch_country == US.]**
NARRATION: "Set the rules that actually matter for compliance: KYC status must be filled in, customer IDs must be unique, balances must be sane. Scope any rule to a specific branch or region if your policy varies by geography."

**[SCREEN: Run DQ Check. Score 58/100. Failed Records popup open on kyc_status — the BREAKING badge clicked, showing the exact 40 missing-KYC rows.]**
NARRATION: "Run it. 58 out of 100 — and a clickable list of exactly which 40 customers are missing KYC status, ready to hand to compliance."

**[SCREEN: Switch to sohovi.com/tools/pii-audit. Drop the same file. Result: '4 PII types found — 412 instances' with a breakdown by type.]**
NARRATION: "Before this file goes anywhere — an email to a vendor, an upload to a BI tool — run it through the free PII Scanner first. It's a second, independent check, and it takes ten seconds."

**CTA:** Banking data doesn't get a second chance at "oops." Catch it before it leaves your hands — free at sohovi.com.

---

### VIDEO 149 — Data Quality for Supply Chain: Stop Phantom Inventory Before It Costs You

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality supply chain", "inventory data accuracy", "warehouse data cleansing", "logistics data quality"
**Duration:** 2 minutes
**Dataset:** E (InventoryShipments.csv)

**Hook:** "Your warehouse system says you shipped -40 units last Tuesday. Nobody's going to notice that until a customer complains. Here's how to catch it first."

**[SCREEN: InventoryShipments.csv in Excel — a few quantity_on_hand cells visibly negative, supplier_name blank in several rows.]**
NARRATION: "Negative inventory. Missing suppliers. A shipment dated next year. This is a normal day for a warehouse management export."

**[SCREEN: Drop into Sohovi. Profiling: quantity_on_hand column flags 15 outliers, ship_date flags 6 future-dated rows.]**
NARRATION: "Profiling finds the impossible values automatically — negative stock and future ship dates don't need a rule to be obviously wrong, but Sohovi flags them as outliers immediately."

**[SCREEN: Add Accuracy rule: quantity_on_hand > 0. Add Timeliness rule: ship_date not a future date. Add Uniqueness on shipment_id.]**
NARRATION: "Turn those into enforced rules: quantity can't be negative, ship dates can't be in the future, shipment IDs can't repeat."

**[SCREEN: Scope a rule to warehouse_country == US. Add a Description: 'US warehouses use a different ERP feed — checked separately because of the integration lag.']**
NARRATION: "If one warehouse's feed is less reliable than another, scope the rule to just that region — and write down why, so the next person doesn't have to ask."

**[SCREEN: Run check. Score 61/100. Click the BREAKING badge on quantity_on_hand. Failed Records popup shows the 15 negative-stock rows. Download CSV.]**
NARRATION: "Run it, click straight through to the 15 broken rows, download the list, and send it to whoever owns that warehouse feed."

**[SCREEN: Re-run after a fix. Score climbs to 92.]**
NARRATION: "Fix it upstream, re-run, and now your inventory numbers are something your ops team can actually plan around."

**CTA:** Bad inventory data doesn't just cost money — it costs trust with every customer who ordered something you didn't actually have. Catch it free at sohovi.com.

---

### VIDEO 150 — Free PII Scanner: See Every Email, SSN, and API Key Before You Send a File

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "pii scanner online free", "check csv for personal information", "find ssn in spreadsheet", "scan file for api keys"
**Duration:** 75 seconds
**Dataset:** D (CustomerAccounts.csv)

**Hook:** "You're about to email a CSV to a vendor. Do you actually know everything that's in it? Most people don't — until it's too late."

**[SCREEN: sohovi.com/tools/pii-audit. Drop CustomerAccounts.csv onto the upload zone.]**
NARRATION: "Go to Sohovi's free PII Scanner. Drop in any CSV or Excel file."

**[SCREEN: Scan completes in seconds. Result panel: 'Found: 380 emails, 372 phone numbers, 1 SSN, 0 credit cards, 0 API keys' with example matches shown (masked).]**
NARRATION: "It scans the whole file for emails, phone numbers, social security numbers, credit cards, physical addresses — even API keys and AWS secrets someone accidentally left in a column."

**[SCREEN: Click the 'SSN' result. One row expands showing the masked match — '***-**-1234' — and which column and row number it's in.]**
NARRATION: "Click any result to see exactly where it is — which column, which row — without exposing the full value on screen."

**[SCREEN: Privacy banner: 'This file was never uploaded. Everything you see happened in your browser.']**
NARRATION: "And the file never left your browser to find this out. That's not a caveat — that's the entire point of a PII scanner you can trust."

**[SCREEN: sohovi.com/tools/pii-audit — 'Free. No sign-up.']**
NARRATION: "Free, no account needed. Run it on anything before you send it. Link in description."

**CTA:** Scan before you send — free at sohovi.com/tools/pii-audit.

---

### VIDEO 151 — De-Identify Your Data for Research in Under 2 Minutes (k-Anonymity, HIPAA Safe Harbor)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "de-identify data online free", "anonymize csv for research", "k-anonymity tool", "hipaa safe harbor de-identification"
**Duration:** 90 seconds
**Dataset:** F (PatientIntake.csv)

**Hook:** "Your IRB wants de-identified data. Your research partner wants a CSV. You don't have a statistician on call. Here's the free tool that does both."

**[SCREEN: sohovi.com/tools/de-identify. Drop PatientIntake.csv.]**
NARRATION: "Drop your dataset into Sohovi's free De-Identifier — built for exactly this handoff."

**[SCREEN: Tool auto-detects: 'Direct identifiers: full_name, email, phone. Quasi-identifiers: date_of_birth, city, country.']**
NARRATION: "It automatically separates direct identifiers — name, email, phone, the obvious stuff — from quasi-identifiers like date of birth and city, which can re-identify someone in combination, even if no single column does alone."

**[SCREEN: Method selector per column: full_name → Suppress, email/phone → Mask, date_of_birth → Generalize to year, city → Generalize to region.]**
NARRATION: "Choose a method per column: suppress, mask, or generalize. Generalizing date of birth down to just the birth year, for instance, keeps it useful for research while reducing re-identification risk."

**[SCREEN: k-anonymity check: 'k = 3 — every combination of quasi-identifiers matches at least 3 records.']**
NARRATION: "Run the k-anonymity check. It tells you, in plain terms, the minimum group size for any combination of the remaining quasi-identifiers — the actual measure your IRB or reviewer will ask about."

**[SCREEN: Click 'Export'. Downloads the de-identified CSV plus a 'methods_log.txt' describing exactly what was done to each column.]**
NARRATION: "Export the de-identified file and a methods log you can drop straight into your IRB appendix — it documents exactly what was masked, suppressed, or generalized, and why."

**CTA:** Free, in your browser, nothing uploaded — at sohovi.com/tools/de-identify.

---

### VIDEO 152 — Compare Two Spreadsheets and See Exactly What Changed (Free Reconciliation Tool)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "compare two csv files online", "spreadsheet diff tool free", "reconcile two spreadsheets"
**Duration:** 75 seconds
**Dataset:** Two snapshots of Dataset D (CustomerAccounts.csv) — "last month" vs "this month"

**Hook:** "Two exports of the same data, one week apart. Something changed. Finding it by eye in Excel is how afternoons disappear."

**[SCREEN: sohovi.com/tools/compare. Two upload zones: 'File A' and 'File B'.]**
NARRATION: "Drop last month's export as File A, this month's as File B."

**[SCREEN: Match-key selector: pick 'customer_id' as the key column.]**
NARRATION: "Pick the column that uniquely identifies a record — here, customer_id — so Sohovi knows how to line the two files up."

**[SCREEN: Four result buckets appear: 'Only in A (12)', 'Only in B (8)', 'Changed (34)', 'Unchanged (346)'.]**
NARRATION: "Four buckets, instantly: rows that disappeared, rows that are new, rows that changed, and rows that didn't."

**[SCREEN: Click 'Changed (34)'. Table shows each changed row with the old and new value side by side, changed cells highlighted.]**
NARRATION: "Click into Changed, and see exactly which cell changed and what it changed from and to — not just that the row is different."

**[SCREEN: Click 'Download' on the 'Only in A' bucket — the 12 rows that vanished between exports.]**
NARRATION: "Download any bucket on its own. The 12 records that disappeared between exports? That's your first question for whoever owns the source system."

**CTA:** Free, no sign-up — at sohovi.com/tools/compare.

---

### VIDEO 153 — Why Your Dates Are Secretly Wrong (Date Format Ambiguity, Explained)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "date format ambiguity", "mm/dd vs dd/mm data quality", "date parsing errors csv"
**Duration:** 75 seconds
**Dataset:** A (CustomerDB.csv, with a date column added)

**Hook:** "03/04/2024. Is that March 4th, or April 3rd? Your spreadsheet doesn't know. Most tools just guess — and guess wrong, silently."

**[SCREEN: A simple two-column CSV: id, signup_date — values like '03/04/2024', '15/06/2024', '07/22/2024' mixed together.]**
NARRATION: "Look at this column. Some values, like 15/06/2024, are only valid one way — day first, because there's no 15th month. Others, like 03/04/2024, could mean either."

**[SCREEN: Upload to Sohovi. Profiling dashboard, signup_date column expanded. 'Detected Date Formats' section: 'DD/MM/YYYY — 64% of values — day-first confirmed' with a confidence bar.]**
NARRATION: "Sohovi looks at every value in the column — not just the first one — and uses the unambiguous ones, like 15/06, to statistically resolve the ambiguous ones. It tells you 'day-first confirmed,' not just 'we assumed.'"

**[SCREEN: Second pattern row: 'MM/DD/YYYY — 12% of values — mixed format'. Amber warning: 'Mixed date formats detected — this is a data quality issue.']**
NARRATION: "And if a chunk of the column genuinely doesn't match the dominant format, it tells you that too — because that's not a parsing nuance, that's a real bug somewhere upstream."

**[SCREEN: Add a Conformity rule using the detected format_check template, auto-filled.]**
NARRATION: "Turn the detected format straight into an enforced rule — Sohovi pre-fills the template for you."

**CTA:** Stop guessing what a date means. Free at sohovi.com.

---

### VIDEO 154 — Sohovi Doesn't Just Flag Problems — It Explains Them (DQ Glossary)

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality dimensions explained", "why does this dq rule apply", "data quality glossary tool"
**Duration:** 90 seconds
**Dataset:** A (CustomerDB.csv)

**Hook:** "Most data quality tools tell you WHAT broke. Almost none tell you WHY a rule applies to that column in the first place. Here's the one that does."

**[SCREEN: Generic mockup, text only: a bare rule list — 'email — not_null — 95%' — no explanation.]**
NARRATION: "Most tools hand you a rule builder and a column list, and leave you to figure out what to check and why."

**[SCREEN: Sohovi Profiling Dashboard, CustomerDB.csv. Column cards each show small colored pills under the name: 'completeness', 'validity' for email.]**
NARRATION: "Sohovi shows you which dimensions actually apply to each column — before you write a single rule."

**[SCREEN: Expand the 'email' card. Scroll to 'DQ Glossary — why these dimensions apply'. Validity block: a definition sentence, then a bold rationale: '8% of values don't match the standard email pattern found in this column.']**
NARRATION: "Then it explains itself. Not a generic definition — the actual reason, grounded in what it found in your file. 8% of your emails don't match the pattern it detected. That's why Validity is flagged here, specifically."

**[SCREEN: Confidence shown: '94% confidence'. Suggested checks: 'not null, regex match'.]**
NARRATION: "A confidence score, and the specific checks it'd suggest — so you're making an informed decision, not a guess."

**[SCREEN: Download Excel. 'DQ Glossary' tab — the same explanations, every column, in one sortable spreadsheet.]**
NARRATION: "Export the whole thing as a spreadsheet, and you've got a document you can hand to a stakeholder who's never opened Sohovi — the case for why your data needs work, not just the verdict."

**CTA:** See it explain itself — free at sohovi.com.

---

### VIDEO 155 — Free vs Pro vs Business: What You Actually Get at Each Tier

**Platform:** YouTube / Blog / Website (pricing page embed)
**SEO Target:** "sohovi pricing", "data quality tool free plan", "sohovi pro vs business"
**Duration:** 2 minutes
**Dataset:** None

**Hook:** "Most pricing pages bury what's actually free. Here's exactly what you get at each tier — no asterisks."

**[SCREEN: Sohovi pricing page, three columns: Free / Pro / Business.]**
NARRATION: "Let's be precise about this, because it matters when you're deciding what to actually build your workflow around."

**[SCREEN: Free column highlighted. List: 5 data assets, 5 rules per asset, 1 business unit, 7-day run history, full profiling, DQ Glossary, manual rule builder across all 10 dimensions, plain-English AI rule builder, DQ scoring, BREAKING records with download, 5-sheet profiling Excel export, schema-change detection, all 12 free standalone tools.]**
NARRATION: "Free isn't a trial — it's a real, permanent tier. Five assets, five rules each, profiling, the DQ Glossary, manual and plain-English rule building, scoring, and the full profiling export. All of it, forever, no card required."

**[SCREEN: Pro column highlighted. List: unlimited assets and rules, 90-day history, automatic PII detection in profiling, bulk AI rule suggestions across your whole file, Alerts (score-drop, schema-change), reusable Workflows, PDF/Excel run reports.]**
NARRATION: "Pro removes the ceiling — unlimited assets and rules — and adds what matters once you're monitoring data on an ongoing basis: automatic PII detection, AI suggestions across your whole file at once, alerts, reusable workflows, and exportable run reports."

**[SCREEN: Business column highlighted. List: unlimited business units and history, Sandbox (test before you save), Remediation workflow, live connectors (Google Sheets, Airtable, cloud storage, REST API).]**
NARRATION: "Business is for teams running this in production: a Sandbox to test rules safely, a guided remediation workflow, and direct connectors — Google Sheets, Airtable, S3, REST APIs — so nobody's exporting a CSV by hand every time."

**[SCREEN: Closing text: "Try the real product free. Upgrade only when you hit a real ceiling."]**
NARRATION: "Try the real product on the free plan. Upgrade when you actually hit one of these ceilings — not before."

**CTA:** Start free at sohovi.com — no credit card, no expiration.

---

---

## COMBINING MULTIPLE DQ CHECKS — INDUSTRY DEEP DIVES (Reference-Style Validation & Healthcare Vertical)

> **Context:** Two real gaps closed here. (1) The "Domain Verticals" section above (Videos 148–149) covers Banking and Supply Chain, but **Dataset F (PatientIntake.csv) was built for a Healthcare vertical video that was never written** — Video 158 closes that gap. (2) Every existing script demos one dimension at a time (Videos 19–23) or explains one combination mechanic in isolation — weights (Video 26), scope (Video 144), workflows (Videos 36–37). No script shows *how and why to stack several of these together* for a real compliance-style use case — the way a finance or ops team actually needs to check, for example, that every customer's country/region code is both present **and** drawn from a known-good set. Videos 156–159 below close that gap.
>
> **Important accuracy note for whoever records these:** Sohovi does **not** have a feature to upload a separate master/reference table (e.g. an ISO country-code list as its own file) and validate another dataset's column against it. What it actually has — and what these scripts demonstrate — is: **(a) Enum Validation** (Validity dimension, `allowed_values` parameter) — you type or paste the known-good set of values directly into the rule, and it's checked like a reference list every run; and **(b) Referential Integrity / No Orphan Values** (Integrity dimension, `reference_column` parameter) — checks that a column's values all exist in *another column within the same uploaded file*, e.g. if you append a "valid_regions" column to the same sheet before upload. There is no cross-file lookup. Do not imply otherwise on camera — say "your own reference list" or "a reference column in the same file," never "reference table" on its own, which oversells the feature.

---

### VIDEO 156 — How Multiple DQ Checks Combine Into One Quality Framework (Weights, Scope & Workflows)

**Platform:** Learn (In-App Tutorial)
**Duration:** 3.5 minutes
**Dataset:** A (CustomerDB.csv — 6 rules already configured, from Video 26)

**[SCREEN: Data Asset page, Rules tab. 6 active rules listed: id Uniqueness (weight 4), email Completeness (weight 3), email Validity (weight 3), phone Validity (weight 2), first_name Completeness (weight 1), country Allowed Values (weight 1).]**
NARRATION: "You rarely check a dataset with just one rule. Real data needs several checks working together. Here's exactly how Sohovi combines them into a single answer."

**[SCREEN: Click 'Run DQ Check'. All 6 rules execute in one pass — progress shows '1/6 … 6/6' in under 2 seconds.]**
NARRATION: "First: every active rule on an asset runs together, in one pass, every time you click Run DQ Check. There's no sequencing, no 'if this fails, then check that' — Sohovi evaluates all of them independently against the same file."

**[SCREEN: Score Transparency panel. Table: rule, weight, pass/fail, contribution. id Uniqueness weight 4 contributes 20 points. email Completeness weight 3, BREAKING, costs 18 points. country Allowed Values weight 1 contributes only 5 points.]**
NARRATION: "Second: weight decides how much each rule counts. A weight-4 rule like ID uniqueness swings the score four times harder than a weight-1 rule like country formatting. This is your first combination lever — decide what actually matters, and weight it accordingly."

**[SCREEN: Switch to the Rules tab. Open the country Allowed Values rule. Expand its Scope section: region == US.]**
NARRATION: "Third: scope. Any single rule can be narrowed to a subset of rows with AND-combined conditions — column, operator, value. This rule only checks US rows; every other region is skipped for this rule, pass or fail, while still being checked by your other rules."

**[SCREEN: Left sidebar → Workflows. 'Customer Data Standard' workflow shown with 4 rule chips: email Completeness, email Validity, id Uniqueness, phone Validity.]**
NARRATION: "Fourth: workflows. Once you've combined a set of rules — with the right weights and scopes — for one asset, save that exact combination as a Workflow. It's a template, not a pipeline: no rule inside it depends on another, but the whole bundle travels together to any new asset."

**[SCREEN: Diagram overlay: 'One Run = All Rules Evaluated → Grouped by Column → Weighted Average per Column → Weighted Average = Overall Score'.]**
NARRATION: "So the real combination math is: every rule evaluates independently, rolls up into a weighted column score, and every column score rolls up into one weighted overall score. Weight controls impact. Scope controls which rows count. Workflows control which rules travel together. That's the whole toolkit — and it's enough to build a real quality framework, which is exactly what the next few videos do for specific industries."

**CTA:** Don't just add rules — decide their weight, their scope, and whether they belong in a reusable workflow. That's the difference between a checklist and a framework.

---

### VIDEO 157 — Finance Deep Dive: Validating a Customer's Country or Region Code the Right Way

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "validate country code data quality", "customer master data validation finance", "reference list data quality check", "enum validation vs referential integrity"
**Duration:** 3 minutes
**Dataset:** B (SalesQ1.csv — `region` column, framed as a customer master/billing table)

**Hook:** "Your finance team pulls the customer table. The `region` column has 'US', 'USA', 'U.S.', and one row that just says 'califronia'. Which of those are real, valid codes — and which ones will break your revenue-by-region report? Here's how to check every row against a reference list, and combine that with the other checks that actually make it reliable."

**[SCREEN: SalesQ1.csv open in Sohovi profiling. region column value distribution: 'US' 140 rows, 'USA' 22 rows, 'CA' 18 rows, 'califronia' 1 row, blank 15 rows.]**
NARRATION: "This is a normal customer or sales table — one region column, several different spellings for what should be the same handful of codes, and some blanks. One rule won't catch all of this. You need to combine a few."

**[SCREEN: Add rule 1 — Dimension: Completeness, Rule Type: Not Null, Column: region, Threshold 100%.]**
NARRATION: "Rule one: Completeness. Region must never be blank — set the threshold to 100% if a missing region is never acceptable for a billing record."

**[SCREEN: Add rule 2 — Dimension: Validity, Rule Type: Enum Validation (Allowed Values), Column: region, allowed_values field: type 'US,CA,GB,IN,AU,DE,FR,JP,BR,MX'. Threshold 100%.]**
NARRATION: "Rule two is the actual reference-list check: Validity, Enum Validation. Type in your known-good set of codes — this comma-separated list is functioning as your reference table. Anything that doesn't exactly match one of these values, like 'USA' or 'califronia', fails."

**[SCREEN: Callout overlay: 'No external file upload for this list — you maintain it here, in the rule itself. Update it here if you add a new region.']**
NARRATION: "Important: this list lives inside the rule, not in a separate uploaded reference file. If you start selling into a new country, you come back to this rule and add the code — there's no second file to keep in sync."

**[SCREEN: Add rule 3 — Dimension: Integrity, Rule Type: Referential Integrity, Column: region, reference_column: a second column added to this same file called valid_region_codes (one code per row, extra rows blank).]**
NARRATION: "If you'd rather maintain your valid codes as data instead of typed into a rule, there's a second option: add a reference_column to the same file — here, a valid_region_codes column — and use a Referential Integrity or No Orphan Values rule. It checks that every region value exists somewhere in that column. The catch: it has to be in the same uploaded file. Sohovi doesn't check against a separate master spreadsheet."

**[SCREEN: Scope section on the Enum Validation rule expanded: account_status == Active.]**
NARRATION: "Now scope it: account_status equals Active. Closed or legacy accounts often have stale region data nobody's going to fix — scoping keeps this rule focused on records that actually matter for this month's reporting."

**[SCREEN: Set weight: Completeness weight 2, Enum Validation weight 4 — annotation: 'A wrong region silently breaks a report. A missing one is at least visible.']**
NARRATION: "Weight the enum check higher than the completeness check. A blank region is obvious and gets caught downstream. A wrong-but-present code — like 'USA' instead of 'US' — silently splits your revenue-by-region totals and nobody notices until the numbers don't add up."

**[SCREEN: Run DQ Check. Score 74/100. Click the BREAKING badge on the Enum Validation rule — Failed Records popup shows the 'USA', 'CA' variants, and 'califronia' rows. Download CSV.]**
NARRATION: "Run it. Every non-standard code is right there, ready to download and hand to whoever owns the source CRM."

**[SCREEN: Save these 3 rules as a Workflow named 'Customer Region Validation'. Apply it to a second file, EmployeeDir.csv-style structure with a region column, in one click.]**
NARRATION: "Save this exact combination — completeness, enum validation, and the scope — as a Workflow. Every future customer export gets the same reference-style check applied in one click, with no rebuilding."

**CTA:** "Reference table" in Sohovi means one of two things: a list you maintain inside the rule, or a column you maintain inside the same file. Pick the one that matches how your valid values actually change — free at sohovi.com.

---

### VIDEO 158 — Data Quality for Healthcare: Combining Completeness, Uniqueness, and Cross-Field Checks for Patient Intake

**Platform:** YouTube / Blog / Instagram
**SEO Target:** "data quality healthcare", "patient data quality check", "EHR data cleansing", "HIPAA data quality tool", "hospital intake data validation"
**Duration:** 2.5 minutes
**Dataset:** F (PatientIntake.csv)

**Hook:** "A patient record with a birth date after their admission date. A duplicate intake for the same patient. A missing phone number for a follow-up call. Any one of these is a shrug. All three, across a few hundred records, is a compliance problem waiting to happen."

**[SCREEN: PatientIntake.csv in Excel. Visible blank cells in phone and country, 15 duplicate patient_id rows at the bottom, malformed emails with '@@'.]**
NARRATION: "This is a normal hospital intake or EHR export — and it's exactly the shape of file that fails an audit if nobody checks it first."

**[SCREEN: Drop into Sohovi. Profiling completes entirely client-side. PII banner: 'PII detected in 5 columns' — full_name, email, phone, date_of_birth, city flagged.]**
NARRATION: "Drop it into Sohovi. For patient data, browser-only processing isn't a nice-to-have — it's the only way this file should ever be checked before it's cleared for research or reporting use. Sohovi flags every column holding personal health information automatically."

**[SCREEN: Add rules: Completeness on phone (90% threshold), Uniqueness on patient_id (100%), Consistency/Accuracy cross-field rule: date_of_birth before admission_date.]**
NARRATION: "Combine three checks: Completeness, so a missing phone number doesn't block a follow-up call. Uniqueness on patient_id, so the same intake isn't counted twice in a headcount or billing report. And a cross-field check — date_of_birth must be before admission_date. A patient born after they were admitted is not a rare-format issue, it's an impossible record."

**[SCREEN: Scope the cross-field rule: admission_date in the last 12 months — annotation: 'older records may have known legacy data-entry issues already reported.']**
NARRATION: "Scope that impossible-record check to the last 12 months, if older intake records already have known, already-reported issues you don't need re-flagged every run."

**[SCREEN: Run DQ Check. Score 63/100. Click BREAKING badge on the cross-field rule. Failed Records popup: 8 rows with birth dates after admission dates.]**
NARRATION: "Run it. Eight impossible records, isolated and ready to send back to whoever owns that intake system — not buried in a spreadsheet of 250 rows."

**[SCREEN: Switch to sohovi.com/tools/de-identify. Drop the same file. Direct identifiers auto-detected: full_name, email, phone. Quasi-identifiers: date_of_birth, city, country. k-anonymity check: k = 4.]**
NARRATION: "Once the data itself is clean, that's when de-identification actually means something. Run it through the free De-Identify tool — it separates direct identifiers from quasi-identifiers, and gives you a k-anonymity number your IRB or compliance reviewer will actually ask for."

**CTA:** Clean first, then de-identify — checking data quality before you strip identifiers means the k-anonymity number you hand over is measuring real data, not silently-duplicated or logically-impossible rows. Free at sohovi.com.

---

### VIDEO 159 — Which DQ Checks to Combine, By Industry (Quick Reference)

**Platform:** YouTube Shorts / Instagram Reel / Blog (cheat-sheet style)
**SEO Target:** "data quality rules by industry", "which data quality checks to use", "data quality framework by industry"
**Duration:** 90 seconds
**Dataset:** None (recap references Datasets A–F)

**Hook:** "Different industries break in different places. Here's exactly which checks to combine for five of them — in under 90 seconds."

**[SCREEN: Title card: 'Combining DQ Checks — By Industry'. Five rows appear one at a time, each: Industry name, 3 dimension icons, one-line reason.]**

**[SCREEN: Row 1 — Banking. Icons: Completeness + Uniqueness + Accuracy. Text: 'KYC status filled in + no duplicate customers + balances that make sense.']**
NARRATION: "Banking: Completeness on KYC status, Uniqueness on customer ID, Accuracy on balance. Scope by branch or country when policy varies by region — see Video 148."

**[SCREEN: Row 2 — Supply Chain. Icons: Accuracy + Timeliness + Uniqueness. Text: 'Quantity can't be negative + ship dates can't be in the future + no duplicate shipments.']**
NARRATION: "Supply chain: Accuracy on quantity, Timeliness on ship date, Uniqueness on shipment ID — scoped per warehouse if one region's feed lags. Video 149 walks through it."

**[SCREEN: Row 3 — Finance / Customer Master. Icons: Completeness + Validity (Enum) + Integrity. Text: 'Region present + region matches a known-good list + optionally checked against a reference column.']**
NARRATION: "Finance and customer master data: Completeness plus Enum Validation against your own reference list, weighted higher than the completeness check — that's the deep dive in Video 157."

**[SCREEN: Row 4 — Healthcare. Icons: Completeness + Uniqueness + Cross-Field Accuracy. Text: 'Phone present + no duplicate intakes + birth date before admission date.']**
NARRATION: "Healthcare: Completeness, Uniqueness on patient ID, and a cross-field check for logically impossible dates — then de-identify once it's clean. Video 158."

**[SCREEN: Row 5 — E-Commerce / CRM. Icons: Completeness + Validity + Uniqueness. Text: 'Email present + valid format + no duplicate contacts.']**
NARRATION: "E-commerce and CRM data: Completeness and Validity on email, Uniqueness on contact ID — the same three-rule combo from the very first Learn tutorials."

**[SCREEN: Closing frame: 'The pattern: 2–3 dimensions + scope for exceptions + save as a Workflow.']**
NARRATION: "The pattern repeats: two or three dimensions combined, scope conditions for the exceptions, saved as a Workflow so it runs the same way every time. Free at sohovi.com."

**CTA:** Start with the combination that matches your industry — free at sohovi.com.

---

*End of Sohovi Video Scripts — 159 videos total*
*(142 original scripts + 5 rule-description/scope/breaking/glossary videos + 8 domain-vertical & uncovered-feature videos)*
