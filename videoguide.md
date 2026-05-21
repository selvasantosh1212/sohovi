# Sohovi Video Tutorial Scripts

7 video tutorials covering every major feature of Sohovi.
Each script includes: intro, step-by-step screen actions with narration, example data, and an outro.

---

## Video 1 — Getting Started: Org Setup (~4 min)

**What it covers:** Create an organization, invite members, build the Business Unit → Catalog → Data Asset hierarchy.

**Example data used:** "Acme Data Team" org, Finance department, Customer Transactions catalog, "Customer Orders Q1" asset.

---

### [0:00 – 0:20] Intro

> "Welcome to Sohovi. In this video, I'll show you how to set up your workspace from scratch — creating an organization, inviting teammates, and structuring your data catalog. This is the foundation everything else builds on. Let's go."

---

### [0:20 – 1:10] Create an Organization

**Screen action:** Click the organization switcher in the top bar (shows your name).

> "See this dropdown in the top bar? This is your organization switcher. Click it, and choose 'Create organization'."

**Screen action:** Type "Acme Data Team" in the name field, click Create.

> "Give your org a name — something your whole team will recognize. I'll use 'Acme Data Team'. Hit Create."

> "You're now inside a shared workspace. Everything you create here — assets, rules, scores — is visible to all members of this organization."

---

### [1:10 – 1:50] Invite Members

**Screen action:** Click org switcher → Manage → Members tab → Invite.

> "Now let's add your teammates. Click the org switcher again, then 'Manage'. Under the Members tab, hit Invite."

**Screen action:** Enter "alice@acme.com", select role "Admin", send invite.

> "Enter their email, pick a role — Admin for full access, Member for standard — and send the invite. They'll get an email link to join. Done."

---

### [1:50 – 2:30] Create a Business Unit

**Screen action:** Click "Business Units" in the sidebar → "New Business Unit".

> "Now we'll build our data hierarchy. First, Business Units — these represent departments or teams that own data."

**Screen action:** Fill in: Name: "Finance Team", Owner Name: "Priya Patel", Owner Email: "priya@acme.com", Description: "Owns all revenue and billing data."

> "Fill in the name, owner, and a description. This helps your team know who's responsible. Hit Create Business Unit."

---

### [2:30 – 3:10] Create a Catalog

**Screen action:** Click "Catalogs" in sidebar → "New Catalog" → select "Finance Team" as Business Unit.

> "Within each Business Unit you can have multiple Catalogs — think of them as topic folders. Let's create one for customer transaction data."

**Screen action:** Name: "Customer Transactions", Owner: "Priya Patel", click Create.

> "Name it, link it to the Finance Team business unit, and save. Now we have a home for our data assets."

---

### [3:10 – 3:50] Create a Data Asset

**Screen action:** Click "Data Assets" → "New Data Asset" → select "Customer Transactions" catalog.

> "Finally, a Data Asset — this is a single table or file you want to track quality on."

**Screen action:** Fill: Name: "Customer Orders Q1", Source System: "PostgreSQL", Owner: "data-team@acme.com", Business Meaning: "Customer orders for Q1 2024 from our main database."

> "Give it a name, source system, owner email, and a business meaning so teammates understand what this data is. Create it."

---

### [3:50 – 4:00] Outro

> "That's your workspace ready. Next, we'll upload data into this asset. Watch Video 2 to see how."

---

---

## Video 2 — Connecting Your Data (~5 min)

**What it covers:** Upload CSV/Excel, connect Google Sheets, connect Airtable, connect Cloud Storage URL.

**Example data used:** `customer_orders_q1.csv` (columns: order_id, customer_email, amount, order_date, status), a Google Sheets spreadsheet called "Q1 Sales Dashboard".

---

### [0:00 – 0:15] Intro

> "Sohovi supports multiple ways to bring your data in. I'll show you four: CSV/Excel upload, Google Sheets, Airtable, and Cloud Storage. Let's start with the most common — uploading a file."

---

### [0:15 – 1:20] Upload CSV or Excel

**Screen action:** Open "Customer Orders Q1" asset → click "Upload" tab.

> "Open your Data Asset and go to the Upload tab."

**Screen action:** Drag `customer_orders_q1.csv` into the drop zone.

> "Drag your file in — CSV or Excel both work. Sohovi parses it entirely in your browser. Your raw data never leaves your machine."

**Screen action:** Column preview shows: order_id (integer), customer_email (email), amount (float), order_date (date), status (string). Row count: 5,000.

> "A column preview appears immediately. You can see Sohovi already inferred the types — integer, email, float, date. Check the column names and row count, then confirm."

**Screen action:** Click "Confirm Upload". A "Run created" toast appears.

> "Hit Confirm. A new run is created and profiling starts automatically in the background."

---

### [1:20 – 2:30] Connect Google Sheets

**Screen action:** Upload tab → "Connect Source" → select "Google Sheets".

> "Instead of uploading a file, you can pull data live from Google Sheets. Choose 'Connect Source' then Google Sheets."

**Screen action:** Click "Connect with Google" → OAuth popup appears → sign in.

> "Authorize with your Google account."

**Screen action:** Spreadsheet dropdown shows list → select "Q1 Sales Dashboard" → Sheet dropdown → select "Orders".

> "Pick the spreadsheet and the specific tab you want. I'll choose 'Q1 Sales Dashboard' and the 'Orders' tab."

**Screen action:** Click "Fetch Data" → column preview with: order_id, rep_name, amount.

> "Click Fetch Data. Sohovi grabs a snapshot of the sheet and shows you the same column preview. Confirm and it's in."

> "Note: this is a snapshot — Sohovi doesn't continuously sync. Re-upload whenever you want fresh data."

---

### [2:30 – 3:30] Connect Airtable

**Screen action:** Upload tab → Connect Source → Airtable.

> "For Airtable, you'll need a Personal Access Token. Go to airtable.com/account, create a token with 'data.records:read' scope, and copy it."

**Screen action:** Paste token into the API Token field → select Base: "CRM Base" → Table: "Contacts".

> "Paste the token, select your base and table — I'm using our CRM contacts table — and fetch."

**Screen action:** Preview shows: Name, Email, Company, Deal Stage columns.

> "Same column preview. Confirm to ingest. Sohovi never stores your API token."

---

### [3:30 – 4:20] Connect Cloud Storage

**Screen action:** Upload tab → Connect Source → Cloud Storage.

> "If your file lives in S3, Azure Blob, or Google Cloud Storage, generate a pre-signed URL from your provider and paste it here."

**Screen action:** Paste a long S3 URL → click "Fetch File" → CSV preview loads.

> "Sohovi downloads the file from the URL and parses it in your browser — same as a direct upload. No credentials are stored."

---

### [4:20 – 5:00] Schema Change Detection

**Screen action:** Re-upload a new version of the CSV with an extra column "discount_code".

> "One more thing: when you re-upload a new version of the same data, Sohovi automatically detects schema changes."

**Screen action:** A yellow "Schema Changed" banner appears showing: Added: discount_code (green). No columns removed.

> "It flags which columns were added and which were removed — so you're never surprised by upstream data changes."

---

### [5:00] Outro

> "Your data is in. Now let's understand what Sohovi found during profiling. Watch Video 3."

---

---

## Video 3 — Understanding Data Profiling (~4 min)

**What it covers:** Profile tab walkthrough — column types, null rates, PII detection, outlier detection, value distributions, pattern recognition.

**Example data used:** `customer_orders_q1.csv` — 5,000 rows, columns: order_id, customer_email, amount, order_date, status.

---

### [0:00 – 0:15] Intro

> "After every upload, Sohovi profiles your data automatically. Let's walk through what profiling tells you and how to use it."

---

### [0:15 – 1:00] Column Statistics

**Screen action:** Open asset → Profile tab. Grid of column cards is shown.

> "Here's the Profile tab. Every column gets its own card showing key statistics."

**Screen action:** Point to `customer_email` card: Type: email, Null: 2%, Unique: 4,902/5,000, Min length: 6, Max length: 34.

> "For 'customer_email': Sohovi inferred the type as 'email', it's 2% null, and almost entirely unique. This tells me I should add a completeness rule and an email format validity rule."

**Screen action:** Point to `amount` card: Type: float, Min: $1.50, Max: $4,850, Mean: $127.40, Std Dev: $210.

> "For 'amount': float type, ranging from $1.50 to $4,850, with a mean of $127 but a large standard deviation — that wide spread is worth investigating."

---

### [1:00 – 1:45] PII Detection

**Screen action:** `customer_email` card shows a red "PII" badge labeled "email".

> "See this red PII badge on 'customer_email'? Sohovi automatically detected it contains email addresses, which are personal data."

**Screen action:** Hover over the badge to show tooltip: "PII Type: email".

> "Sohovi detects 6 PII types: email, phone, SSN, credit card numbers, IP addresses, and person names. Use this to decide what columns need access controls or masking."

---

### [1:45 – 2:30] Outlier Detection

**Screen action:** `amount` card shows an orange badge: "12 outliers".

> "The 'amount' column has an outlier badge — 12 values are statistically unusual, more than 3 standard deviations from the mean."

**Screen action:** Click to expand → sample outliers list: $4,200, $3,950, $4,850.

> "These are orders over $3,900. They may be legitimate large enterprise orders — or data entry errors. Set an accuracy rule to flag them for review."

---

### [2:30 – 3:15] Value Distribution Chart

**Screen action:** Expand `status` column card → bar chart appears: "completed: 61%, pending: 23%, cancelled: 11%, unknown: 5%."

> "Click any column to see the value distribution. For 'status', most orders are completed — expected. But 5% are 'unknown'. That shouldn't happen. I'll add a validity 'allowed values' rule to catch those."

---

### [3:15 – 3:50] Pattern Recognition

**Screen action:** Expand `order_id` card → Pattern section shows: "ORD-99999999: 100%".

> "Pattern recognition shows the structural format of text values. Every order ID follows the pattern 'ORD-' followed by 8 digits. I can convert this to a regex validity rule: `^ORD-\d{8}$`."

---

### [3:50 – 4:00] Outro

> "Profiling gives you everything you need to write smart quality rules. Let's do that in Video 4."

---

---

## Video 4 — Building Data Quality Rules (~6 min)

**What it covers:** Add completeness, accuracy, validity, uniqueness rules; use AI rule suggestions; test in sandbox; configure weights and thresholds.

**Example data used:** Same `customer_orders_q1.csv` asset.

---

### [0:00 – 0:15] Intro

> "Rules are the heart of Sohovi. They define exactly what 'good data' means for your asset. Let's build a complete rule set for our customer orders."

---

### [0:15 – 1:00] Completeness Rule

**Screen action:** Asset → Rules tab → "Add Rule".

> "First, a completeness rule on 'customer_email' — this column should never be blank."

**Screen action:** Dimension: Completeness, Type: null_check, Column: customer_email, Threshold: 0.98, Weight: 4. Click Save.

> "Dimension is Completeness, type is null_check. Threshold 0.98 means 98% of rows must be non-null. Weight 4 makes this an important rule. Save."

---

### [1:00 – 1:50] Accuracy Rule

**Screen action:** Add Rule → Dimension: Accuracy, Type: range_check, Column: amount, Min: 0, Max: 5000, Threshold: 0.99, Weight: 3.

> "Now accuracy — I know order amounts should be between $0 and $5,000. Anything outside that is suspect."

**Screen action:** Save rule.

> "Threshold 0.99 means 99% of orders must be in range. This catches data entry errors and outlier orders."

---

### [1:50 – 2:40] Validity Rule

**Screen action:** Add Rule → Dimension: Validity, Type: allowed_values, Column: status, Values: "completed, pending, cancelled, refunded", Threshold: 1.0, Weight: 3.

> "For 'status', I only want four valid values. I'll use 'allowed_values' and list them: completed, pending, cancelled, refunded."

**Screen action:** Save rule.

> "Threshold 1.0 means every single row must have a valid status. Any 'unknown' or typo will fail this rule."

---

### [2:40 – 3:20] Uniqueness Rule

**Screen action:** Add Rule → Dimension: Uniqueness, Type: duplicate_check, Column: order_id, Threshold: 1.0, Weight: 5.

> "Order IDs must be unique — no duplicates allowed. Weight 5, threshold 1.0. This is our most critical rule."

**Screen action:** Save rule.

---

### [3:20 – 4:00] AI Rule Suggestions

**Screen action:** Click the "Suggest Rules" sparkle button → loading spinner → list of suggested rules appears with confidence scores.

> "Don't want to configure everything manually? Click 'Suggest Rules'. Sohovi's ML engine analyzes your column profiles and suggests the most relevant rules."

**Screen action:** Suggested: "order_date: freshness_check (confidence 87%)" — click Accept. Another: "customer_email: format_validation email (confidence 95%)" — click Accept.

> "I'll accept the email format check and the date freshness rule. Dismissed ones disappear. These are immediately added to my rule list."

---

### [4:00 – 4:45] Rule Sandbox

**Screen action:** Click "Open Sandbox" → configure: Dimension: Validity, Type: regex_pattern, Column: order_id, Pattern: `^ORD-\d{8}$`, Threshold: 1.0.

> "Not sure about a rule? Use the Sandbox to test it first without saving."

**Screen action:** Click "Run Test" → Results: 4,983 pass (99.7%), 17 fail.

> "99.7% pass. 17 orders don't match the expected format. I'll investigate those before deciding on the threshold. Now I'll save it to the real rules list."

---

### [4:45 – 5:30] Configure Weights & Thresholds

**Screen action:** Click edit on the completeness rule → change Weight from 4 to 5.

> "Quick tip: use the edit button to tune any rule. Weight 5 is for business-critical rules — like a primary key. Weight 1 is for nice-to-have checks."

> "Threshold controls tolerance. 0.95 allows 5% failures. 1.0 is zero-tolerance. Match these to your actual business requirements."

---

### [5:30 – 6:00] Outro

> "You've got 6 rules covering completeness, accuracy, validity, and uniqueness. Let's run them and see the scores. Video 5 is next."

---

---

## Video 5 — Running Checks & Reading Scores (~5 min)

**What it covers:** Run DQ checks, read the score gauge, column scores, failed records, score transparency panel, run comparison.

**Example data used:** Same asset with 6 rules configured.

---

### [0:00 – 0:15] Intro

> "Rules are set. Now let's run the quality checks and understand what the score means."

---

### [0:15 – 0:40] Run DQ Checks

**Screen action:** Rules tab → click green "Run DQ Check" button.

> "Click the Run DQ Check button. Sohovi evaluates every active rule against your data in the browser. This usually takes a few seconds."

**Screen action:** Progress indicator, then "Run complete" toast.

> "Done. Let's see the results."

---

### [0:40 – 1:30] Overall Score

**Screen action:** Click Scoring tab → large gauge shows "82" in teal.

> "The overall score is 82 out of 100 — that puts us in the 'Good' band. Here's how to read the score: 95+ is Excellent, 80-94 is Good, 60-79 is Warning, below 60 is Critical."

> "82 is solid but not perfect. Our completeness and uniqueness rules are passing. Something else is dragging us down."

---

### [1:30 – 2:30] Column-Level Scores

**Screen action:** Scroll to Column Scores grid. Cards show: order_id: 100, customer_email: 94, amount: 88, status: 68 (red).

> "Here's the column grid. Order ID: perfect. Customer email: 94. Amount: 88. But look — 'status': 68. That's red. The validity rule is failing significantly."

**Screen action:** Click the 'status' card → expands to show: allowed_values rule: 68% pass rate, 1,600 rows failed.

> "Click to expand. The allowed_values rule is only passing 68% of rows. 1,600 out of 5,000 orders have an invalid status. That needs fixing upstream."

---

### [2:30 – 3:15] Failed Records

**Screen action:** Click "View Failed Records" → table shows rows with status values: "unknown", "CANCELLED" (wrong case), "Completed" (wrong case).

> "The Failed Records table shows exactly which rows failed and why. Look — 'CANCELLED' in all caps and 'Completed' with a capital C are failing because they don't match my allowed values list exactly. Case sensitivity issue."

> "I can either fix the source data or update my allowed values list to be case-insensitive. Either way, now I know exactly where to look."

---

### [3:15 – 3:45] Score Transparency Panel

**Screen action:** Click "Why this score?" → panel shows rule contributions: order_id duplicate_check: weight 5, score 100, contribution +14; status allowed_values: weight 3, score 68, contribution -9.

> "Click 'Why this score?' to see the full breakdown. Each rule's weight and score contribution is listed. The status rule is our biggest drag. The unique order_id rule is our biggest positive contributor."

> "Use this panel in data quality review meetings — it's a clear, auditable explanation."

---

### [3:45 – 4:30] Compare Runs

**Screen action:** Click Runs tab → two runs listed. Select both → comparison table appears.

> "After fixing the status issue and re-uploading, go to the Runs tab and select both runs."

**Screen action:** Comparison shows: status column: 68 → 97 (green arrow up). overall: 82 → 94.

> "The comparison shows our status score improved from 68 to 97, and the overall score jumped to 94. Quality confirmed."

---

### [4:30 – 5:00] Outro

> "You're reading scores like a pro. Now let's set up alerts so you're automatically notified when quality drops. Video 6."

---

---

## Video 6 — Alerts & Monitoring (~3 min)

**What it covers:** Create score-drop and schema-change alerts, create a reusable workflow, apply a workflow, view alert events.

**Example data used:** "Customer Orders Q1" asset.

---

### [0:00 – 0:15] Intro

> "Great data quality is only valuable if you can maintain it over time. Let's set up alerts and a reusable workflow."

---

### [0:15 – 0:55] Create a Score-Drop Alert

**Screen action:** Sidebar → Alerts → "New Alert".

> "Go to Alerts and create a new one."

**Screen action:** Asset: "Customer Orders Q1", Condition: "Score Drop", Threshold: 5. Save.

> "I want to be alerted if quality drops by more than 5 points in a single run. This catches sudden regressions — maybe a bad batch of data or a pipeline bug."

---

### [0:55 – 1:20] Create a Schema-Change Alert

**Screen action:** New Alert → Condition: "Schema Change" → Save.

> "Second alert: schema change. No threshold needed — any time a column is added or removed, I get notified. This is essential for catching silent upstream pipeline changes."

---

### [1:20 – 2:00] View Alert Events

**Screen action:** Bell icon in top bar shows badge "2" → click it → alert events list appears.

> "When an alert triggers, a badge appears on the bell icon. Click it to see what fired."

**Screen action:** Two events: "Score Drop: Customer Orders Q1 dropped from 94 to 79" and "Schema Change: 'discount_code' column added."

> "Two events: a score drop and a new column. Each shows the asset, the run, and what changed. Click to mark as read."

---

### [2:00 – 2:45] Create a Reusable Workflow

**Screen action:** Sidebar → Workflows → "New Workflow".

> "Workflows let you save your rule configuration so you can reuse it on future uploads — no rebuilding rules from scratch every month."

**Screen action:** Name: "Monthly Orders DQ", map: order_id → uniqueness, amount → accuracy, customer_email → completeness + validity.

> "Name it and map rules to column patterns. Next time I upload a new month's orders, I just apply this workflow — all rules pre-configured."

---

### [2:45 – 3:00] Outro

> "Monitoring is on autopilot. Last video covers remediation and reporting — what to do when you've found the problems."

---

---

## Video 7 — Remediation & Reporting (~3 min)

**What it covers:** Remediation tab, review failed records, export cleaned file, generate PDF/Excel DQ report.

**Example data used:** "Customer Orders Q1" asset after DQ run with failures in status column.

---

### [0:00 – 0:15] Intro

> "You found quality issues. Now what? Sohovi's remediation tab helps you fix them and export cleaned data. Let's go."

---

### [0:15 – 1:00] Remediation Tab — Review Failed Records

**Screen action:** Asset → Remediation tab → table shows failed rows grouped by severity.

> "The Remediation tab shows all rows that failed quality checks, sorted by severity — High, Medium, Low."

**Screen action:** High severity rows: order_id duplicates (3 rows). Medium: status "unknown" (1,600 rows). Low: amount slightly out of range (12 rows).

> "We have 3 duplicate order IDs — that's our highest priority. 1,600 rows with invalid statuses. And 12 orders just outside the acceptable amount range."

---

### [1:00 – 1:40] Fix Suggestions

**Screen action:** Click a duplicate order_id row → suggestion appears: "Duplicate of row 245. Review and remove or assign a unique ID."

> "Click any failed row to see a fix suggestion. For duplicates, Sohovi tells you which row it's a duplicate of. For status issues, it suggests the closest valid value."

**Screen action:** Click a "CANCELLED" status row → suggestion: "Normalize to 'cancelled' (case mismatch)."

> "For 'CANCELLED' — the suggestion is to normalize it to lowercase 'cancelled'. These are clear, actionable fixes."

---

### [1:40 – 2:20] Export Cleaned File

**Screen action:** Click "Export Cleaned File" → downloading spinner → CSV downloads.

> "Click Export Cleaned File. Sohovi downloads a CSV with two additions: a 'dq_status' column marking each row as 'pass' or 'fail', and a 'needs_review' flag on rows that need manual attention."

> "Share this file with the data owner or your engineering team. The flags make it easy to find and fix issues at the source."

---

### [2:20 – 2:50] Export DQ Report

**Screen action:** Sidebar → Reports → select "Customer Orders Q1" → choose PDF → Generate Report → PDF downloads.

> "Need to share results with leadership or a governance team? Go to Reports, select your asset, choose PDF or Excel, and download."

**Screen action:** PDF preview shows: overall score 82, column scores table, top failing rules, run history chart.

> "The PDF includes the overall score, column-level breakdown, top failing rules, and a run history chart. Perfect for a data quality review meeting."

---

### [2:50 – 3:00] Outro

> "You've completed the full Sohovi workflow: organize, connect, profile, define rules, score, monitor, and remediate. The Learn Center inside the app has step-by-step guides for every feature. Welcome to better data quality."

---

---

## Production Notes

**Recording order:** Record in script order (1 → 7) so assets exist when referenced in later videos.

**Sample data:** Create `customer_orders_q1.csv` with 5,000 rows before recording:
- Columns: order_id (ORD-XXXXXXXX), customer_email, amount (float), order_date (YYYY-MM-DD), status
- Intentionally include: 3 duplicate order_ids, 1,600 rows with status "unknown" or wrong case, 12 amounts > $5,000, 100 rows with null customer_email, 3 rows with malformed order_ids

**Screen resolution:** Record at 1920×1080, zoom browser to 125% for legibility.

**Cursor:** Use a large highlighted cursor so viewers can follow click locations.

**Voiceover:** Record narration separately and sync to screen recording for cleaner audio.
