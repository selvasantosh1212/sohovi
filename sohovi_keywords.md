# Sohovi Keyword Bank — Video Titles, Descriptions & Tags

**Purpose:** a practical keyword reference for on-camera YouTube/Shorts/Reels content — not an essay. Pull phrases straight into titles, descriptions, and tag fields.

**How this fits with existing files:**
- `most_asked_dq_qstns.md` already has 45+7 validated FAQ-style *questions* for Shorts/Reels scripts — don't re-derive those here. This file is the raw *keyword/phrase* layer underneath: the words people actually type into Google/YouTube search, which you weave into the titles, descriptions, and tags wrapped around those question-scripts.
- `audience_pain_points_research.md` has the 14 segment pain-points and Sohovi feature-fit already mapped to a Stage 1/2/3 funnel. The Industry-specific section below reuses the same 14 segment names and gives each one a keyword list to seed titles/tags for the videos already planned for that segment in `video_tutorials.md`.
- `video_tutorials.md` has 74 priority scripts (+159 archive). Use this file to choose *which* keyword to lead a title/description with once a script topic is picked — this file doesn't propose new scripts, it arms existing ones.

**Method:** real web searches (WebSearch tool) across 8 buckets — core terms, comparison/BOFU, industry language, symptom language, YouTube tutorial patterns, AI-era, no-code/free, and regulatory/compliance. No search-volume tool was used, so nothing below is a volume claim — items are described directionally ("recurs across many vendor blogs," "a common forum/tutorial phrasing") based on what surfaced repeatedly across searches, consistent with the numbers guardrail already used in `audience_pain_points_research.md`.

**Intent tags** reuse the exact three-value taxonomy already live in this repo's blog frontmatter (`searchIntent: "informational" | "commercial" | "bofu"`) and in `audience_pain_points_research.md`'s funnel-stage framework — informational = symptom/definition, zero product framing; commercial = "how do I actually check/fix this" with room for a tool demo; bofu = actively comparing tools/vendors.

## Usage tips

- **Title formula:** lead with one specific long-tail/symptom phrase (the hook), then anchor with a head term in parentheses or after a colon for search context — e.g. *"Why Your CRM Keeps Making Duplicate Contacts (Data Quality Explained)"*. Long-tail earns the click; head term earns the categorization.
- **Description structure:** first 1-2 sentences = the exact long-tail phrase restated naturally (this is what shows in search snippets) → then 2-3 head terms woven into a plain-English summary → then a paragraph with industry-specific and comparison keywords for anyone who scrolls the full description → end with a CTA line and the free-tool URL.
- **Tags:** mix broad head terms (data quality, data cleaning) with 3-5 long-tail/symptom phrases and 1-2 competitor/comparison terms per video. Don't tag every video with every competitor name — only tag "alternative"/"vs" terms on videos that actually touch that comparison, or it reads as keyword stuffing to both viewers and the algorithm.
- **Shorts/Reels hooks** should almost always come from the Long-tail & symptom-language section, not the Core/head-terms section — nobody searches "data quality dimensions" as a 15-second hook, but "why does my data not match across systems" stops a scroll.
- **BOFU keywords** belong in dedicated comparison videos/blog posts and their descriptions, not sprinkled into Stage-1 Shorts — matches the existing Stage 1 rule in `audience_pain_points_research.md` ("zero product mention").

---

## 1. Core / Head Terms

Recurred across nearly every search bucket — these are the categorization anchors, not the hooks.

- data quality — *commercial*
- data profiling — *informational*
- data validation — *commercial*
- data cleaning — *informational*
- data quality tool — *commercial*
- data quality software — *commercial*
- data quality checker — *commercial*
- data quality score — *informational*
- data quality dimensions — *informational*
- data quality metrics — *informational*
- data quality framework — *informational*
- data quality checklist — *informational*
- data cleansing — *informational*
- data quality management — *informational*
- data quality assessment — *commercial*
- data integrity — *informational*
- data quality issues — *informational*
- data quality analyst — *informational*
- data hygiene — *informational*
- data governance — *informational*
- data quality monitoring — *commercial*
- data quality rules / rules engine — *commercial*
- data accuracy vs data quality — *informational*
- duplicate data / duplicate records — *informational*
- outlier detection — *informational*
- data quality KPI — *informational*

## 2. Long-Tail & Symptom-Language Keywords

Real phrasing people search when they don't know the term "data quality" yet — highest value for Shorts/Reels hooks. These recur near-verbatim as article titles, forum thread titles, or "People Also Ask" patterns.

- why does my data not match across systems — *informational*
- why does my data never match across tabs/systems/tools — *informational*
- how to find duplicate rows in excel — *informational*
- how to remove duplicate rows in excel — *informational*
- detect outliers in data excel — *informational*
- how to find outliers in excel — *informational*
- csv has errors how to fix — *informational*
- how to fix a broken/malformed csv file — *informational*
- csv import errors and how to fix them — *informational*
- why is my crm full of duplicates — *informational*
- why does my crm create duplicate leads — *informational*
- how to clean messy data — *informational*
- how to clean messy data in excel — *informational*
- excel data quality checklist — *informational*
- why don't my two dashboards show the same number — *informational*
- why do tableau and power bi show different numbers — *informational*
- inconsistent data across systems how to fix — *informational*
- data doesn't match between spreadsheet and database — *informational*
- how to spot fake/duplicate submissions in a spreadsheet — *informational*
- why is my inventory count wrong — *informational*
- why do two systems disagree on the same customer — *informational*
- how to tell if my data has a quality problem — *informational*
- most common data quality issues — *informational*
- what causes missing or blank fields in a dataset — *informational*
- same field formatted 5 different ways (dates, phone numbers, currency) — *informational*
- how to spot fake data in a spreadsheet — *informational*
- how to check if a csv file has duplicates before uploading — *informational*
- why does my invoice not match my usage — *informational*
- why did my dashboard number suddenly change — *informational*
- how do I know if my crm data is clean — *informational*

## 3. Comparison / Alternative / BOFU Keywords

Competitor + "vs" + "alternative to" phrases — reserve for dedicated comparison content, matches the existing `bofu`-tagged post pattern (`great-expectations-alternatives-simpler.md`, `sohovi-vs-excel-data-quality.md`).

- data quality tool vs excel — *bofu*
- excel vs dedicated data quality software — *bofu*
- can excel/google sheets actually manage data quality at scale — *bofu*
- great expectations alternative — *bofu*
- great expectations vs soda vs dbt — *bofu*
- soda vs great expectations — *bofu*
- dbt tests alternative — *bofu*
- dbt tests vs data quality tool — *bofu*
- beyond dbt tests data quality — *bofu*
- best data quality tools 2026 — *bofu*
- top data quality tools ranked — *bofu*
- data quality software for small business — *bofu*
- best data quality tools for small companies — *bofu*
- cheap data quality tool — *bofu*
- free data quality tool — *bofu*
- free data quality software — *bofu*
- Talend alternative — *bofu*
- Talend Open Studio alternative — *bofu*
- Informatica alternative — *bofu*
- Informatica data quality alternative — *bofu*
- Informatica alternative for small business — *bofu*
- OpenRefine alternative — *bofu*
- OpenRefine alternative online — *bofu*
- Monte Carlo alternative — *bofu*
- Monte Carlo alternative for small teams — *bofu*
- Collibra alternative — *bofu*
- data quality tool build vs buy — *bofu*
- should I build my own data quality checks or buy a tool — *bofu*
- Ataccama alternative — *bofu*
- data observability tool comparison — *bofu*
- data quality tool no data engineer required — *bofu*

## 4. Free / No-Code Keywords

- no code data quality — *commercial*
- no code data quality tool — *commercial*
- data quality tool no coding required — *commercial*
- data quality checker online free — *commercial*
- free csv data quality checker — *commercial*
- check data quality without knowing how to code — *commercial*
- free online data quality score — *commercial*
- no-signup data quality tool — *commercial*
- browser-based data quality tool (no upload to server) — *commercial*
- free reconciliation tool compare two csv files — *commercial*
- diff two csv files online free — *commercial*
- free duplicate finder online — *commercial*
- free PII scanner online — *commercial*
- data quality tool for non-technical users — *commercial*

## 5. AI-Era Keywords

- data quality for AI — *informational*
- garbage in garbage out — *informational*
- garbage in garbage out AI — *informational*
- RAG data quality — *informational*
- data quality for RAG / retrieval-augmented generation — *informational*
- LLM training data quality — *informational*
- why AI makes data quality more important — *informational*
- can AI automatically detect data quality issues — *informational*
- can AI fix data quality problems — *informational*
- AI data quality tools 2026 — *commercial*
- agentic AI data quality — *commercial*
- AI won't fix your data problems — *informational*
- AI trained on AI-generated garbage — *informational*
- data quality for AI-ready data — *informational*
- why AI projects fail data quality — *informational*
- AI agents that detect bad data automatically — *commercial*

## 6. Regulatory / Compliance Keywords

- BCBS 239 data quality — *informational*
- BCBS 239 requirements — *informational*
- BCBS 239 data quality dimensions (accuracy, integrity, completeness, timeliness) — *informational*
- KYC data quality — *informational*
- KYC AML data quality — *informational*
- perpetual KYC — *informational*
- AML false positives data quality — *informational*
- GDPR data quality requirements — *informational*
- GDPR accuracy principle — *informational*
- does GDPR require good data quality — *informational*
- CCPA data accuracy requirements — *informational*
- HIPAA data quality checklist — *informational*
- HIPAA compliance checklist — *informational*
- HIPAA safe harbor de-identification — *informational*
- data quality risk data aggregation (BCBS 239) — *informational*
- data quality issue register / DQ issue log — *informational*
- regulatory-aligned data quality — *informational*

---

## 7. Industry-Specific Keyword Clusters

Same 14 segment names as `audience_pain_points_research.md`, ordered as in that file (Teams, then Industries).

### Marketing & Revenue Ops
- CRM data hygiene — *informational*
- CRM deduplication — *commercial*
- how to deduplicate crm records — *commercial*
- crm duplicate leads — *informational*
- Customer Match list upload rate — *informational*
- Google Customer Match data quality — *commercial*
- Meta Custom Audience match rate — *informational*
- email list hygiene — *informational*
- sender reputation bad list data — *informational*
- lead scoring data quality — *informational*
- fuzzy matching duplicate contacts — *informational*
- data hygiene best practices — *informational*
- how to clean a contact list before a campaign — *commercial*
- TCPA consent data compliance — *informational*

### Analytics & BI Teams
- why do two dashboards show different numbers — *informational*
- tableau vs power bi different numbers same data — *informational*
- data quality before data warehouse — *commercial*
- shadow metrics self-serve BI — *informational*
- dbt test suite passing but dashboard wrong — *informational*
- schema change alert data pipeline — *commercial*
- data quality for business intelligence — *commercial*
- reasons two reports disagree — *informational*
- data drift detection — *commercial*
- do you trust the data behind your dashboards — *informational*
- null-skewed column dashboard — *informational*
- validate data before loading warehouse — *commercial*

### E-commerce & Product (internal team)
- product information management data quality — *informational*
- PIM data quality — *commercial*
- catalog data quality checklist — *commercial*
- missing product attributes before launch — *informational*
- cross-functional product launch data errors — *informational*
- SKU data inconsistency across teams — *informational*
- how to catch a bad product launch before it ships — *commercial*
- product data completeness rules — *commercial*
- merchandising vs engineering data mismatch — *informational*

### HR & People Operations
- HR data quality — *informational*
- payroll data validation — *commercial*
- payroll errors causes and fixes — *informational*
- HRIS payroll data mismatch — *informational*
- new hire paycheck error causes — *informational*
- employee data duplicate records — *informational*
- HR dashboard data quality issues — *informational*
- EEO-1 filing data errors — *informational*
- terminated employee still active in system — *informational*
- HR data integrity — *informational*
- how to reconcile HRIS and payroll exports — *commercial*

### Finance & Compliance
- duplicate vendor payment — *informational*
- vendor master data duplicate — *informational*
- month-end close reconciliation errors — *informational*
- accounts payable duplicate invoice detection — *commercial*
- expense report data quality — *informational*
- QuickBooks import errors — *informational*
- audit-ready data quality report — *commercial*
- reconcile trial balance spreadsheet — *commercial*
- invoice matching controls data quality — *informational*
- how to catch a duplicate payment before it goes out — *commercial*

### Freelancers & Consultants (solo)
- freelance data cleaning pricing — *informational*
- how to scope a messy client data project — *informational*
- client data worse than quoted — *informational*
- how to price a data cleanup project — *informational*
- data quality audit as a paid deliverable — *commercial*
- before and after data quality score case study — *commercial*
- freelance data analyst rates — *informational*
- how to prove you cleaned a client's data — *commercial*
- data quality report for client deliverable — *commercial*

### Logistics & Supply Chain
- 3PL WMS EDI data quality — *informational*
- warehouse inventory count doesn't match system — *informational*
- inventory discrepancy between systems — *informational*
- unit of measure mismatch ERP WMS — *informational*
- freight bill accessorial charge errors — *informational*
- reconcile TMS shipment export vs carrier invoice — *commercial*
- customs paperwork data errors HS code — *informational*
- EDI data quality error rate — *informational*
- demand forecast bad data — *informational*
- reconcile 3PL inventory without EDI platform — *bofu*
- phantom inventory data quality — *informational*

### Marketing Agencies
- agency client reporting mistakes — *informational*
- marketing data quality issues — *informational*
- how agencies avoid reporting errors — *commercial*
- cross-client data contamination agency — *informational*
- affiliate lead-gen fraud data quality — *informational*
- how to audit a prospect's data on a pitch call — *commercial*
- multi-client data hygiene workflow — *commercial*
- agency RFP data rigor — *bofu*

### SaaS & Tech
- usage-based billing invoice wrong — *informational*
- metering data duplicate events — *informational*
- reconcile usage events vs invoice — *commercial*
- SaaS churn data quality — *informational*
- SaaS reporting dashboard wrong numbers — *informational*
- PQL data quality sales handoff — *informational*
- multi-tenant data leak duplicate tenant id — *informational*
- CRM product billing sync drift — *informational*
- best data quality tool for SaaS company without data engineers — *bofu*
- data quality tool for startups without a data team — *bofu*

### Consulting (firms)
- consulting firm data quality standardization — *informational*
- deliverable quality varies by consultant — *informational*
- client engagement quality bar consistency — *informational*
- consulting data governance framework — *informational*
- how consulting firms standardize data quality across clients — *bofu*
- account handoff data context loss — *informational*
- confidentiality risk sharing client files — *informational*

### Non-profit
- nonprofit donor data cleanup — *informational*
- duplicate donor records — *informational*
- how to clean donor database — *commercial*
- nonprofit data hygiene checklist — *commercial*
- donor management system data quality — *informational*
- grant report data accuracy — *informational*
- free data quality tool for nonprofits — *commercial*
- CRM record count pricing tier nonprofit — *informational*
- NCOA address data cleanup — *informational*

### Finance & Banking
- KYC AML data quality — *informational*
- AML false positive alerts data quality — *informational*
- sanctions screening data quality — *informational*
- duplicate customer record banking — *informational*
- core banking data migration validation — *informational*
- transaction monitoring data quality — *informational*
- data quality tool for banks vs enterprise platforms — *bofu*
- BCBS 239 data quality compliance — *informational*
- bank data quality small business banking — *bofu*

### Healthcare
- healthcare data quality HIPAA — *informational*
- duplicate patient records EHR — *informational*
- patient panel mismatch across EHRs — *informational*
- medical billing data entry error rate — *informational*
- HIPAA safe harbor de-identification vs k-anonymity — *informational*
- EHR data quality challenges — *informational*
- copy-paste bloat EHR notes — *informational*
- HIPAA-safe data quality tool for multi-site practices — *bofu*
- interoperability data quality between clinics — *informational*

### E-commerce (industry — external sellers)
- Amazon Shopify Walmart listing data quality — *informational*
- marketplace listing errors — *informational*
- SKU mismatch across sales channels — *informational*
- Walmart listing quality score — *informational*
- Amazon listing suppressed malformed attribute — *informational*
- overselling multi-channel inventory sync — *informational*
- reconcile inventory across amazon shopify walmart — *commercial*
- subscription LTV dirty billing data — *informational*
- sohovi vs manually checking marketplace dashboards — *bofu*

---

## 8. YouTube Title / Tag Pattern Notes

Recurring phrasing structures observed across top-ranking data-cleaning/profiling/quality tutorial titles — plug a Sohovi topic into these instead of inventing a new structure each time.

- **"[Do X] in [Y] Minutes"** — e.g. "Master Data Cleaning in Just 15 Minutes," "Reconcile Two CSVs in 60 Seconds." Strong for tool-demo Stage 2 videos.
- **"How to Do [X] (Step-by-Step Tutorial on Real-Life Dataset)"** — tutorials that promise a real, messy dataset outperform ones that promise only theory.
- **"[Tool A] vs [Tool B]: Which One Actually [does the job]"** — the dominant BOFU-comparison structure (great expectations vs soda, dbt vs data quality tool).
- **"What Is [X]? | [X] for Beginners"** — definitional/glossary pattern, matches Core/head-term informational content.
- **"[N] Essential/Common [X] Checks/Issues/Mistakes"** — listicle pattern, very common for "data quality checks with pandas," "common CSV errors," "client reporting mistakes." High rewatch/save value.
- **"Let's Build a [X] in Python (Step-by-Step Tutorial)"** — build-along pattern for technical-audience content.
- **"Why [Surprising Thing] Happens (And How to Fix It)"** — the strongest hook pattern in symptom-language search results ("Why Your Data Never Matches Across Business Systems (And How to Fix It)," "Why Inventory Numbers Don't Match Across Your Systems"). Matches Sohovi's existing Stage-1 hook style almost exactly — reuse this structure liberally.
- **"The Real Reason Your [X] Is [Bad Outcome]"** — root-cause reveal pattern, pairs well with a "not a [model/tool] problem, a data problem" twist (mirrors the existing "95% of AML alerts are noise" hook already in `audience_pain_points_research.md`).
- **"[Number]% of [X] Has [Problem]"** — stat-led hook pattern (e.g. "30-80% of medical bills contain a data-entry error"); use directionally, never as an on-screen exact citation per the numbers guardrail.
- **"Don't DIY: Use [Tool/Method] to [Solve X] For You"** — positions a tool as the alternative to manual/DIY effort, a natural BOFU/commercial title shape.
- **"[Format] Data Quality Checklist You Can Use Today"** — downloadable-checklist framing, strong for a pinned-comment/description lead magnet.
