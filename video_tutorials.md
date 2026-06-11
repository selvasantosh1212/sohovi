# Sohovi Video Scripts — Complete Production Guide

> **How to use this file:** Every script is ready to record. Follow the `[SCREEN]` cues for what to show on screen, and read the `NARRATION` lines aloud. Timestamps are guides — don't stress exact timing.

---

## Test Data Setup Guide

Before recording any demo video, generate these three datasets from **sohovi.com/tools/test-data-generator**. Save them to your desktop for quick access during recording.

---

### Dataset A — CustomerDB.csv (500 rows, intentionally messy)

**Step 1 — Generate the base file:**
- Go to `/tools/test-data-generator`
- Click the **"Customer list"** quick preset (auto-fills: id, first_name, last_name, email, phone, country)
- Set row count to **500**
- Click **Generate** → **Download CSV**

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
- Set row count to **200**
- Download CSV

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
- Download CSV

**Step 2 — No changes.** Keep this data perfectly clean.

**What this simulates:** A well-maintained HR system. Used to demonstrate what a high DQ score (95+) looks like, and for workflow/schema change demos.

---

## Part 1: Landing Page Video

---

### VIDEO 1 — Sohovi Platform Demo

**Platform:** Landing Page Hero Video
**Duration:** 60 seconds
**Dataset:** A (CustomerDB.csv — messy version)
**Style:** Fast-paced, professional. No voiceover pauses — tight cuts. Background music: upbeat but not distracting.

---

**[SCREEN 0–3s]: Open CustomerDB.csv in Excel. Zoom in on visible blank cells in the email column and duplicate rows at the bottom.]**
NARRATION: "Your spreadsheet looks fine. But can you actually trust this data?"

**[SCREEN 3–8s]: Drag and drop CustomerDB.csv onto the Sohovi upload zone. Show the file name appear and the progress bar fill.]**
NARRATION: "Sohovi scans your file instantly — right in your browser. Nothing leaves your computer."

**[SCREEN 8–18s]: Profiling dashboard loads. Pan across column cards — email card shows '14% null values', id card shows '50 duplicate rows', phone card shows pattern chart with '4% invalid format'.]**
NARRATION: "Every column — profiled. Missing values, duplicates, outliers, patterns — found automatically."

**[SCREEN 18–30s]: Click into the Rules panel. Add three rules in quick succession: Completeness on email (95% threshold), Uniqueness on id (100%), Validity on email format (regex email pattern).]**
NARRATION: "Set your quality rules in one click. Completeness. Uniqueness. Valid email format. Done."

**[SCREEN 30–42s]: Click 'Run DQ Check'. Score gauge animates from 0 to 47 — stops in red zone. Failed Records table appears showing flagged rows highlighted in red.]**
NARRATION: "Run the check. Get a score. 47 out of 100 — and here's every row that failed, and exactly why."

**[SCREEN 42–52s]: Show the Alerts panel. Create a score-drop alert set to trigger below 80. Toggle shows 'Active'.]**
NARRATION: "Set an alert. Next time this data drops below 80, you'll know before it breaks anything downstream."

**[SCREEN 52–58s]: Show second run (after cleanup). Score gauge animates to 93 — lands in green/teal zone.]**
NARRATION: "Fix the issues. Re-run. 93. That's the data your reports can trust."

**[SCREEN 58–60s]: Sohovi logo. Text fades in: "Free forever. Start at sohovi.com".]**
NARRATION: "Sohovi. Data quality for everyone."

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

**[SCREEN: Check all 6. Click 'Add Selected Rules'.]**
NARRATION: "Select the ones you want. I will take all six. Click Add Selected Rules."

**[SCREEN: Six rules now in the rules list.]**
NARRATION: "All six rules added in one click. AI suggestions work best after profiling runs — the more data Sohovi has seen, the better the suggestions."

**CTA:** You can always add, edit, or delete suggested rules — they are a starting point, not a constraint.

---

### VIDEO 25 — Testing Rules in the Sandbox

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (CustomerDB.csv)

**[SCREEN: Data Asset page. Rules tab. Button: 'Open Sandbox'. Click it.]**
NARRATION: "Before you commit to a rule, test it in the Sandbox — without affecting your run history or your score."

**[SCREEN: Sandbox panel. Left: rule builder. Right: live preview showing violation count in real time.]**
NARRATION: "The Sandbox has two panels. On the left you build a rule. On the right you instantly see how many rows would fail — in real time as you type."

**[SCREEN: Add Completeness on email at 100% threshold. Right panel updates: '70 rows would fail (12.7%)'.]**
NARRATION: "I set Completeness on email to 100%. The right panel immediately shows 70 rows would fail."

**[SCREEN: Change threshold to 85%. Right panel updates: '0 rows would fail'.]**
NARRATION: "Change the threshold to 85% — zero rows fail. Tune the threshold until it matches your actual business standard."

**[SCREEN: Add a Validity rule with a custom regex. Right panel shows real-time match count.]**
NARRATION: "Test any regex pattern and see immediately how many rows match. No guessing — instant feedback."

**[SCREEN: Click 'Save to Rules' from sandbox. Rule moves to the main rules list.]**
NARRATION: "When you are happy with it, click Save to Rules. It moves straight to your active rules."

**CTA:** Always sandbox new rules on real data before committing — especially when tuning thresholds.

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

**[SCREEN: Results appear. Score gauge fills to 52/100 — amber. Summary: '3 of 6 rules failed'.]**
NARRATION: "The score is calculated. 52 out of 100 — amber, which means significant issues but not completely broken data."

**[SCREEN: Rule results: green checkmarks for id Uniqueness, country Allowed Values, first_name Completeness. Red X marks for email Completeness, email Validity, phone Validity.]**
NARRATION: "Three rules passed, three failed. ID uniqueness and first name completeness are fine. Email completeness, email format, and phone format are failing."

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

**[SCREEN: Click 'email' column score card. Expands: Completeness rule FAIL 12.7% null threshold 95%. Validity rule FAIL 8% invalid format.]**
NARRATION: "Click any column card to see which specific rules passed or failed for that column."

**[SCREEN: Click 'phone' column. Validity rule: PASS — 96% match the pattern. Threshold was 95%. Borderline.]**
NARRATION: "Phone shows a borderline pass. 96% validity against a 95% threshold. One more bad record and it would fail."

**CTA:** Column-level scores tell you exactly where to focus your data cleaning effort.

---

### VIDEO 30 — Viewing Failed Records

**Platform:** Learn (In-App Tutorial)
**Duration:** 3 minutes
**Dataset:** A (post-run)

**[SCREEN: DQ results page. Click 'Failed Records' tab.]**
NARRATION: "The Failed Records tab shows every single row that violated at least one rule — with the specific violation highlighted."

**[SCREEN: Table with columns: row number, all data columns, Reason column. Rows with issues highlighted red.]**
NARRATION: "Each failed row shows all its data, plus a Reason column explaining the violation. Email blank. Phone invalid. You can see it plainly."

**[SCREEN: Filter dropdown: 'All violations', 'email Completeness', 'email Validity', 'phone Validity'. Select 'email Completeness'.]**
NARRATION: "Use the filter to narrow down to a specific violation. I'll filter to email completeness failures only."

**[SCREEN: 70 rows remain. Row numbers 10, 17, 24, 31 — the rows where we deleted the email.]**
NARRATION: "70 rows — exactly the ones where we left the email blank. Row 10, 17, 24 — all visible."

**[SCREEN: Click 'Download Failed Records (CSV)'. File downloads.]**
NARRATION: "Download the failed records as a CSV. Hand them off to the data owner, fix them, then re-upload."

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

**[SCREEN: Highlight: email Completeness — FAIL — Weight 3 — Penalty 18.2 points.]**
NARRATION: "Email completeness failed, and because it had weight 3, it cost 18 points. That is the biggest drag on the score."

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

**[SCREEN: Rule-level comparison: email Completeness Run 1 FAIL to Run 2 PASS. email Validity Run 1 FAIL to Run 2 PASS. phone Validity Run 1 FAIL to Run 2 PASS.]**
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

**[SCREEN: Change row count to 1000. Click Generate. Table fills with 1,000 rows of realistic-looking data.]**
NARRATION: "Set row count to 1,000. Hit Generate. Done. One thousand realistic fake customers — names, emails, phone numbers, countries — all fabricated, all usable."

**[SCREEN: Scroll through the table. Names look real. Emails follow real patterns. Phones formatted correctly.]**
NARRATION: "These are not random strings. They look like real data — which means your tests actually test something."

**[SCREEN: Click 'Add Column'. Select type 'Company name'. Column added live.]**
NARRATION: "Need a custom column? Add it. 16 column types available — UUID, boolean, date, URL, lorem ipsum, auto-increment ID, and more."

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

**[SCREEN: Highlight: email Completeness — FAIL — Weight 3 — cost 18 points. id Uniqueness — PASS — Weight 4 — earned 20 points.]**
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

**[SCREEN: Scroll through the data. Names look real. Emails follow real patterns. Phones formatted correctly.]**
NARRATION: "They look exactly like real customer records — because the generator uses realistic patterns. Your tests will actually test something meaningful."

**[SCREEN: Add a custom 'subscription_tier' column — type: boolean. Column appears.]**
NARRATION: "Need fields specific to your app? Add custom columns. 16 types available — UUID, boolean, date, URL, and more."

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

**[SCREEN: Rule comparison: email Completeness was PASS in Run 3, now FAIL in Run 4. Null rate jumped from 2% to 18%.]**
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

**[SCREEN 20–35s: Table fills instantly with 1,000 rows of names, emails, phones, countries.]**
NARRATION: "Done. 1,000 realistic fake customers. Names, emails, phones, countries — all fabricated, all usable."

**[SCREEN 35–45s: Click Download CSV. File saves in 1 second.]**
NARRATION: "Download as CSV. Or JSON. One click."

**[SCREEN 45–55s: Text — '16 column types. Up to 100,000 rows. No account. Free.']**
NARRATION: "16 column types. Up to 100,000 rows. No account required. Completely free."

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

**[SCREEN: Click on week 7 run — score 74. Compare with week 6 — score 89. Rule comparison: email Completeness went from PASS to FAIL. Null rate jumped from 3% to 19%.]**
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

**CTA:** Standardize your country data free at sohovi.com.

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

**[SCREEN: Table: email Completeness FAIL Weight 3 Penalty 18 points. email Validity FAIL Weight 3 Penalty 15 points. phone Validity FAIL Weight 2 Penalty 8 points. Three passing rules contributing full weight.]**
NARRATION: "Three rules failed. Email completeness — 18 point penalty. Email validity — 15 points. Phone validity — 8 points. Three rules passed and contributed their full weight."

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

*End of Sohovi Video Scripts — 142 videos total*
*(1 Landing Page + 41 Learn Tutorials + 100 YouTube/Instagram Videos + 3 New Feature Videos)*
