export type GuideStep = {
  step: number;
  action: string;
  detail?: string;
};

export type Guide = {
  id: string;
  title: string;
  summary: string;
  icon: string; // lucide icon name as string — used for display logic in components
  duration: string; // e.g. "2 min"
  steps: GuideStep[];
  example?: string;
  tip?: string;
  videoRef?: number; // which video tutorial covers this (1-7)
};

export type GuideCategory = {
  id: string;
  label: string;
  color: string; // tailwind bg color class
  guides: Guide[];
};

export const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    color: "bg-emerald-500",
    guides: [
      {
        id: "create-organization",
        title: "Create an Organization",
        summary: "Set up a shared workspace for your team so everyone can collaborate on data quality.",
        icon: "Building",
        duration: "2 min",
        steps: [
          { step: 1, action: "Click the organization switcher in the top bar (shows your name or current org name)." },
          { step: 2, action: 'Select "Create organization" from the dropdown.' },
          { step: 3, action: 'Enter your organization name (e.g. "Acme Data Team") and click Create.' },
          { step: 4, action: "You are now inside the new organization. All data assets, catalogs, and rules you create are scoped to this org." },
        ],
        example: 'Example: Name your org "Acme Corp — Data Quality" to keep it recognizable for teammates.',
        tip: "You can switch between Personal and Organization workspaces at any time using the org switcher. The Dashboard shows a Business Unit Health section summarising DQ scores across all your data once assets have been scored.",
        videoRef: 1,
      },
      {
        id: "add-members",
        title: "Add Members to Your Organization",
        summary: "Invite teammates so they can view, create, and manage data assets together.",
        icon: "Users",
        duration: "2 min",
        steps: [
          { step: 1, action: "Click the organization switcher in the top bar." },
          { step: 2, action: 'Click "Manage" next to your organization name.' },
          { step: 3, action: 'Go to the "Members" tab and click "Invite".' },
          { step: 4, action: "Enter the email address of the person you want to invite." },
          { step: 5, action: 'Choose their role — "Admin" for full access or "Member" for standard access — then send the invite.' },
          { step: 6, action: "They receive an email link. Once accepted, they appear in the Members list." },
        ],
        example: 'Example: Invite "alice@acme.com" as Admin and "bob@acme.com" as Member.',
        tip: "Alternatively, go to Dashboard → Team in the sidebar for a dedicated team management page.",
        videoRef: 1,
      },
      {
        id: "create-business-unit",
        title: "Create a Business Unit",
        summary: "Business Units represent departments or teams that own data (e.g. Marketing, Finance, Engineering).",
        icon: "Building2",
        duration: "2 min",
        steps: [
          { step: 1, action: 'In the sidebar, click "Business Units".' },
          { step: 2, action: 'Click the "New Business Unit" button (top right).' },
          { step: 3, action: 'Fill in the Name (e.g. "Marketing"), Owner Name (e.g. "Jane Smith"), Owner Email, and an optional Description.' },
          { step: 4, action: 'Click "Create Business Unit".' },
          { step: 5, action: "The new Business Unit appears in your list and is ready for Catalogs." },
        ],
        example: 'Example: Name: "Finance Team", Owner: "Priya Patel", Description: "Owns all revenue and billing data."',
        tip: "Think of Business Units as top-level folders that mirror your real org chart. Once assets are scored, each Business Unit card shows an aggregated DQ score (average across all assets in its catalogs). Green = Excellent (≥95), Teal = Good (≥80), Amber = Warning (≥60), Red = Critical (<60).",
        videoRef: 1,
      },
      {
        id: "create-catalog",
        title: "Create a Catalog",
        summary: "Catalogs group related data assets under a Business Unit (e.g. 'Customer Data Catalog' under Marketing).",
        icon: "BookOpen",
        duration: "2 min",
        steps: [
          { step: 1, action: 'In the sidebar, click "Catalogs".' },
          { step: 2, action: 'Click "New Catalog".' },
          { step: 3, action: "Select the Business Unit this catalog belongs to from the dropdown." },
          { step: 4, action: 'Fill in the catalog Name (e.g. "Customer Data") and Owner Name, then add an optional Description.' },
          { step: 5, action: 'Click "Create Catalog".' },
        ],
        example: 'Example: Catalog "Customer Transactions" under Business Unit "Finance Team".',
        tip: "One Business Unit can have multiple catalogs. Use catalogs to group assets by domain or project. Catalog cards automatically display an averaged DQ score once any of their assets have been scored — making it easy to spot quality gaps at a glance.",
        videoRef: 1,
      },
      {
        id: "create-data-asset",
        title: "Create a Data Asset",
        summary: "A Data Asset represents a single table or file you want to track quality for.",
        icon: "Database",
        duration: "2 min",
        steps: [
          { step: 1, action: 'In the sidebar, click "Data Assets".' },
          { step: 2, action: 'Click "New Data Asset".' },
          { step: 3, action: "Select the Catalog this asset belongs to." },
          { step: 4, action: 'Fill in the Name (e.g. "Customer Orders"), Source System (e.g. "Salesforce"), Owner Name and Email.' },
          { step: 5, action: "Optionally add a Business Meaning and Purpose to document what this data represents." },
          { step: 6, action: 'Click "Create Asset". You can then upload data or connect a source.' },
        ],
        example: 'Example: Name: "Customer Orders Q1", Source: "PostgreSQL", Owner: "data-team@acme.com".',
        tip: 'The "Business Meaning" field helps your team understand what this data is used for — fill it in for important assets.',
        videoRef: 1,
      },
    ],
  },
  {
    id: "connecting-data",
    label: "Connecting Data",
    color: "bg-blue-500",
    guides: [
      {
        id: "upload-csv-excel",
        title: "Upload a CSV or Excel File",
        summary: "The fastest way to get your data into Sohovi — drag and drop a file or browse your computer.",
        icon: "UploadCloud",
        duration: "3 min",
        steps: [
          { step: 1, action: "Open a Data Asset and click the Upload tab (or click 'Upload Data' on the asset page)." },
          { step: 2, action: "Drag your CSV or Excel file into the drop zone, or click to browse." },
          { step: 3, action: "Sohovi parses the file in your browser — no data is sent to a server during this step." },
          { step: 4, action: "A column preview appears. Verify that columns look correct (names, types, row count)." },
          { step: 5, action: 'Click "Confirm Upload" to save the run. Profiling starts automatically.' },
        ],
        example: "Example: Upload 'customer_orders_jan.csv' with columns: order_id, customer_email, amount, order_date, status.",
        tip: "Files up to ~50MB parse smoothly. For larger files, use a Cloud Storage pre-signed URL instead.",
        videoRef: 2,
      },
      {
        id: "connect-google-sheets",
        title: "Connect Google Sheets",
        summary: "Pull live data from a Google Sheets spreadsheet into Sohovi.",
        icon: "Table2",
        duration: "4 min",
        steps: [
          { step: 1, action: "Open a Data Asset → click the Upload tab → choose 'Connect Source'." },
          { step: 2, action: "Select 'Google Sheets' from the connector options." },
          { step: 3, action: "Click 'Connect with Google' and complete the OAuth login." },
          { step: 4, action: "Select the Spreadsheet you want from the dropdown list." },
          { step: 5, action: "Select the Sheet (tab) that contains your data." },
          { step: 6, action: 'Click "Fetch Data" — Sohovi reads the sheet and shows a column preview.' },
          { step: 7, action: "Confirm and Sohovi ingests the data for profiling and quality checks." },
        ],
        example: "Example: Connect 'Q1 Sales Dashboard' spreadsheet → 'Orders' tab (columns: order_id, rep_name, amount).",
        tip: "Sohovi fetches a snapshot — it does not continuously sync. Re-upload whenever you want fresh data.",
        videoRef: 2,
      },
      {
        id: "connect-airtable",
        title: "Connect Airtable",
        summary: "Import data from an Airtable base using your personal API token.",
        icon: "Grid",
        duration: "4 min",
        steps: [
          { step: 1, action: "In Airtable, go to airtable.com/account → API section → generate a Personal Access Token with 'data.records:read' scope." },
          { step: 2, action: "In Sohovi: Data Asset → Upload tab → Connect Source → Airtable." },
          { step: 3, action: "Paste your Airtable API token." },
          { step: 4, action: "Select the Base and then the Table you want to import." },
          { step: 5, action: 'Click "Fetch Data" to preview, then confirm to ingest.' },
        ],
        example: "Example: Connect 'CRM Base' → 'Contacts' table (columns: Name, Email, Company, Deal Stage).",
        tip: "Keep your API token safe — Sohovi never stores credentials on its servers.",
        videoRef: 2,
      },
      {
        id: "connect-cloud-storage",
        title: "Connect Cloud Storage (S3 / Azure / GCS)",
        summary: "Use a pre-signed URL to pull a CSV or Excel file from Amazon S3, Azure Blob, or Google Cloud Storage.",
        icon: "Cloud",
        duration: "3 min",
        steps: [
          { step: 1, action: "In your cloud provider, generate a pre-signed / SAS URL for the file (typically valid for 1–24 hours)." },
          { step: 2, action: "In Sohovi: Data Asset → Upload tab → Connect Source → Cloud Storage." },
          { step: 3, action: "Paste the full pre-signed URL into the input field." },
          { step: 4, action: 'Click "Fetch File" — Sohovi downloads and parses the file in your browser.' },
          { step: 5, action: "Review the column preview and confirm." },
        ],
        example: "Example: Paste an S3 pre-signed URL pointing to 's3://my-bucket/data/orders_2024.csv'.",
        tip: "The URL must be publicly accessible or pre-signed. Private bucket URLs without signing will fail.",
        videoRef: 2,
      },
      {
        id: "connect-rest-api",
        title: "Connect a REST API",
        summary: "Fetch data from any JSON REST API endpoint and use it as a data asset.",
        icon: "Plug",
        duration: "5 min",
        steps: [
          { step: 1, action: "In Sohovi: Data Asset → Upload tab → Connect Source → REST API." },
          { step: 2, action: "Enter the API endpoint URL (must return JSON)." },
          { step: 3, action: "Add your Bearer token if the endpoint requires authentication." },
          { step: 4, action: "Set the JSON path to the data array — e.g. 'data.records' if the array lives at response.data.records." },
          { step: 5, action: 'Click "Test & Fetch" to preview the first rows, then confirm to ingest.' },
        ],
        example: "Example: URL: 'https://api.myapp.com/v1/orders', Token: 'Bearer abc123', Path: 'orders'.",
        tip: "The endpoint must return a JSON array (or a nested array). Paginated APIs require fetching page 1 only.",
        videoRef: 2,
      },
      {
        id: "schema-change-detection",
        title: "Re-upload & Detect Schema Changes",
        summary: "When you upload a new version of the same data, Sohovi automatically flags added or removed columns.",
        icon: "GitCompare",
        duration: "2 min",
        steps: [
          { step: 1, action: "Open a Data Asset that already has at least one run." },
          { step: 2, action: "Upload a new file or re-connect the source." },
          { step: 3, action: "If columns were added or removed, Sohovi shows a 'Schema Changed' banner with a diff table." },
          { step: 4, action: "Review which columns were added (green) and which were removed (red)." },
          { step: 5, action: "Confirm the upload — the new run is tagged with a schema change flag." },
          { step: 6, action: "Any alert rules for schema changes will trigger automatically." },
        ],
        example: "Example: You add a 'discount_code' column in the new month's file — Sohovi highlights it as newly added.",
        tip: "Use schema change alerts (Alerts → New Alert → Schema Change) to get notified automatically when upstream data structure changes.",
        videoRef: 2,
      },
    ],
  },
  {
    id: "data-profiling",
    label: "Data Profiling",
    color: "bg-violet-500",
    guides: [
      {
        id: "what-is-profiling",
        title: "What Is Data Profiling?",
        summary: "Profiling automatically computes statistics for every column — it runs in your browser right after upload.",
        icon: "ScanLine",
        duration: "2 min",
        steps: [
          { step: 1, action: "After confirming an upload, profiling starts immediately — no extra button needed." },
          { step: 2, action: "Sohovi computes stats column-by-column: type, nulls, unique count, min/max, avg, std dev, value distribution, and more." },
          { step: 3, action: "All computation happens in your browser using a Web Worker — your raw data is never sent to the server." },
          { step: 4, action: 'Navigate to the asset\'s "Profile" tab to see results.' },
        ],
        tip: "Profiling results guide you on which quality rules to add. Look for high null % or unexpected types first.",
        videoRef: 3,
      },
      {
        id: "read-column-stats",
        title: "Read Column Statistics",
        summary: "Each column card shows key statistics to help you understand your data at a glance.",
        icon: "BarChart2",
        duration: "3 min",
        steps: [
          { step: 1, action: 'Open a Data Asset → click the "Profile" tab.' },
          { step: 2, action: "Each column shows a card with: inferred type, null count (and %), unique count, min value, max value, mean (avg), and standard deviation." },
          { step: 3, action: "Inferred types include: integer, float, boolean, date, datetime, email, phone, URL, UUID, JSON, string, or mixed." },
          { step: 4, action: "A high null % (e.g. 30%) signals you should add a Completeness rule." },
          { step: 5, action: "A low unique count on a supposedly unique column (e.g. order_id) signals you should add a Uniqueness rule." },
        ],
        example: "Example: Column 'customer_email' — Type: email, Null: 2%, Unique: 98%. Suggests adding an email format validity rule.",
        tip: "Click any column card to expand it and see the full distribution chart and sample values.",
        videoRef: 3,
      },
      {
        id: "value-distribution",
        title: "Value Distribution Charts",
        summary: "See the most common values in each column as a frequency bar chart.",
        icon: "PieChart",
        duration: "2 min",
        steps: [
          { step: 1, action: 'On the Profile tab, click a column card to expand it.' },
          { step: 2, action: "The chart shows the top 10 values with their count and percentage of total rows." },
          { step: 3, action: "For numeric columns, values are bucketed into ranges." },
          { step: 4, action: "Look for unexpected dominant values — e.g. if 'status' shows 80% 'unknown', that's a data quality issue." },
        ],
        example: "Example: Column 'order_status' — 'completed': 60%, 'pending': 25%, 'cancelled': 10%, 'unknown': 5%.",
        tip: "High concentration in a single value often indicates bad defaults or missing upstream logic.",
        videoRef: 3,
      },
      {
        id: "pii-detection",
        title: "PII Detection",
        summary: "Sohovi automatically detects personally identifiable information (PII) in your data and flags it.",
        icon: "ShieldAlert",
        duration: "2 min",
        steps: [
          { step: 1, action: "PII detection runs automatically during profiling — no setup needed." },
          { step: 2, action: "Columns detected as PII show a red 'PII' badge on the Profile tab." },
          { step: 3, action: "Sohovi detects 6 PII types: email address, phone number, SSN, credit card number, IP address, and person name." },
          { step: 4, action: "Use the PII information to decide whether this asset needs access controls or masking." },
        ],
        example: "Example: A column named 'contact' containing values like 'john.doe@acme.com' is flagged as PII type: email.",
        tip: "PII-flagged columns are highlighted but never masked by Sohovi — masking decisions remain with your team.",
        videoRef: 3,
      },
      {
        id: "outlier-detection",
        title: "Outlier Detection",
        summary: "Sohovi flags numeric values that fall far outside the normal range of the column.",
        icon: "AlertTriangle",
        duration: "2 min",
        steps: [
          { step: 1, action: "After profiling, numeric columns show an orange badge with the outlier count." },
          { step: 2, action: "Outliers are values that fall more than 3 standard deviations from the column mean (z-score method)." },
          { step: 3, action: "Expand the column card to see sample outlier values." },
          { step: 4, action: "High outlier counts suggest you should add an Accuracy → outlier_detection rule to flag these rows in DQ runs." },
        ],
        example: "Example: Column 'order_amount' — mean: $120, std dev: $30. A value of $5,000 is flagged as an outlier.",
        tip: "Outliers are not automatically failures — they may be legitimate. Set a threshold that matches your business expectations.",
        videoRef: 3,
      },
      {
        id: "pattern-recognition",
        title: "Pattern Recognition",
        summary: "See the common structural patterns in text columns — useful for detecting format inconsistencies.",
        icon: "Regex",
        duration: "2 min",
        steps: [
          { step: 1, action: "Expand a text column card on the Profile tab." },
          { step: 2, action: "The Pattern section shows common templates — letters become 'A', digits become '9', symbols are kept." },
          { step: 3, action: "Example: phone numbers might show patterns like '(999) 999-9999' and '999-9999' — two different formats." },
          { step: 4, action: "Use these patterns to write Validity → regex_pattern rules that enforce the correct format." },
        ],
        example: "Example: Column 'zip_code' shows 90% pattern '99999' and 10% pattern '99999-9999' — you may want to standardize.",
        tip: "Copy the dominant pattern and convert it to a regex (e.g. '^\\d{5}$') for a Validity rule.",
        videoRef: 3,
      },
    ],
  },
  {
    id: "quality-rules",
    label: "Data Quality Rules",
    color: "bg-amber-500",
    guides: [
      {
        id: "add-completeness-rule",
        title: "Add a Completeness Rule",
        summary: "Check that a column has no (or very few) missing values. The most common type of quality rule.",
        icon: "CheckSquare",
        duration: "3 min",
        steps: [
          { step: 1, action: 'Open a Data Asset → click the "Rules" tab.' },
          { step: 2, action: 'Click "Add Rule".' },
          { step: 3, action: 'Set Dimension to "Completeness".' },
          { step: 4, action: 'Set Rule Type to "null_check" (checks for missing/empty values).' },
          { step: 5, action: "Select the column from the dropdown (e.g. 'customer_email')." },
          { step: 6, action: "Set Threshold to 0.95 — meaning the rule passes if 95% or more of rows are non-null." },
          { step: 7, action: 'Optionally set a Weight (1–5) to influence how much this rule affects the overall score.' },
          { step: 8, action: 'Click "Save Rule".' },
        ],
        example: "Example: Column 'customer_email', null_check, threshold 0.98 — allows up to 2% missing emails.",
        tip: "Use 'populated_check' instead of 'null_check' if you also want to catch empty strings ('') as failures. Columns that already have one or more DQ rules are highlighted in amber in the data preview table at the top of the Rules page — making it easy to see which columns have coverage and which don't.",
        videoRef: 4,
      },
      {
        id: "add-accuracy-rule",
        title: "Add an Accuracy Rule",
        summary: "Verify that values fall within an expected numeric range or don't contain statistical outliers.",
        icon: "Target",
        duration: "3 min",
        steps: [
          { step: 1, action: 'Rules tab → "Add Rule" → Dimension: Accuracy.' },
          { step: 2, action: 'For range checks: Rule Type: "range_check". Set min and max allowed values.' },
          { step: 3, action: "Select the column (must be numeric — e.g. 'order_amount')." },
          { step: 4, action: "Set Threshold (e.g. 0.99 means 99% of rows must be in range)." },
          { step: 5, action: "Save the rule." },
          { step: 6, action: 'For outlier detection: Rule Type: "outlier_detection". Set z-score threshold (default: 3).' },
          { step: 7, action: 'For Cross-Field Compare: Rule Type: "cross_field_comparison". Select col A from the column selector. A "col b" dropdown then appears showing all other column names — pick the column to compare against, then set the operator (>=, <=, ==, etc.).' },
        ],
        example: "Example: Column 'order_amount', range_check, min: 0, max: 10000, threshold: 0.99 — flags orders over $10,000.",
        tip: "Combine range_check (business logic) + outlier_detection (statistical) on the same column for full accuracy coverage.",
        videoRef: 4,
      },
      {
        id: "add-validity-rule",
        title: "Add a Validity Rule",
        summary: "Enforce that values match a required format, pattern, or allowed list.",
        icon: "ShieldCheck",
        duration: "3 min",
        steps: [
          { step: 1, action: 'Rules tab → "Add Rule" → Dimension: Validity.' },
          { step: 2, action: 'For format checks: Rule Type: "regex_pattern". Enter a regex in the pattern field.' },
          { step: 3, action: "Select the column (e.g. 'zip_code') and set a threshold." },
          { step: 4, action: 'For allowed values: Rule Type: "allowed_values". Enter a comma-separated list of valid values.' },
          { step: 5, action: 'For format validation: Rule Type: "format_validation". Choose a format like "email", "phone", "url", or "date".' },
        ],
        example: "Example: Column 'zip_code', regex_pattern, pattern: '^\\d{5}$', threshold: 1.0 — all ZIP codes must be exactly 5 digits.",
        tip: "Use 'allowed_values' for columns with a fixed set of valid options like status fields (active, inactive, pending).",
        videoRef: 4,
      },
      {
        id: "add-uniqueness-rule",
        title: "Add a Uniqueness Rule",
        summary: "Detect duplicate values in columns that should be unique, like IDs or primary keys.",
        icon: "Fingerprint",
        duration: "2 min",
        steps: [
          { step: 1, action: 'Rules tab → "Add Rule" → Dimension: Uniqueness.' },
          { step: 2, action: 'Rule Type: "duplicate_check" — flags rows where the column value appears more than once.' },
          { step: 3, action: "Select the column (e.g. 'order_id')." },
          { step: 4, action: "Set Threshold: 1.0 means zero duplicates are allowed (strict uniqueness)." },
          { step: 5, action: 'For primary key scenarios: Rule Type: "primary_key_check" — combines uniqueness + non-null.' },
        ],
        example: "Example: Column 'customer_id', duplicate_check, threshold: 1.0 — every customer_id must be unique.",
        tip: "A threshold of 0.99 on duplicate_check means up to 1% duplicates are tolerated — useful for soft deduplication checks.",
        videoRef: 4,
      },
      {
        id: "add-consistency-rule",
        title: "Add a Consistency Rule",
        summary: "Ensure values in one column are logically consistent with values in another column.",
        icon: "Link",
        duration: "4 min",
        steps: [
          { step: 1, action: 'Rules tab → "Add Rule" → Dimension: Consistency.' },
          { step: 2, action: 'Rule Type: "cross_column_match" — compares two columns.' },
          { step: 3, action: "Select the primary column (col A) from the column dropdown (e.g. 'ship_date'). For the 'col b' parameter, a dropdown of all other column names appears — select the reference column (e.g. 'order_date')." },
          { step: 4, action: "Set the condition: e.g. ship_date must be >= order_date." },
          { step: 5, action: 'For conditional checks: Rule Type: "conditional_value_check" — if column A = X, then column B must = Y.' },
        ],
        example: "Example: cross_column_match — 'ship_date' must always be on or after 'order_date'.",
        tip: "Consistency rules catch logical contradictions that individual column rules miss — great for date sequences and status flows.",
        videoRef: 4,
      },
      {
        id: "ai-rule-suggestions",
        title: "Use AI Rule Suggestions",
        summary: "Let Sohovi analyze your data profile and suggest the most appropriate quality rules automatically.",
        icon: "Sparkles",
        duration: "3 min",
        steps: [
          { step: 1, action: 'On the Rules tab, click "Suggest Rules" (the sparkle button).' },
          { step: 2, action: "Sohovi's ML engine analyzes your column profiles — types, null rates, patterns, cardinality." },
          { step: 3, action: "A list of suggested rules appears with confidence scores and explanations." },
          { step: 4, action: 'Click "Accept" on rules you want to add, or "Dismiss" to skip them.' },
          { step: 5, action: "Accepted rules are added to your rules list immediately. Run DQ to evaluate them." },
        ],
        tip: "AI suggestions are a starting point — always review the thresholds and adjust them to match your business requirements.",
        videoRef: 4,
      },
      {
        id: "ai-rule-builder",
        title: "AI Rule Builder — Describe Rules in Plain English",
        summary: "Type what you want your column to satisfy in plain English and let Sohovi's AI generate the correct DQ rules instantly.",
        icon: "Sparkles",
        duration: "3 min",
        steps: [
          { step: 1, action: 'Go to your Data Asset → Rules tab.' },
          { step: 2, action: 'In the "Add Rule" panel on the right, click the "AI Builder" tab (next to "Manual").' },
          { step: 3, action: 'Select the column you want to validate from the Column dropdown.' },
          { step: 4, action: 'Type a plain-English description of what the column must satisfy. Example: "Phone must not be blank and must be a valid US phone format."' },
          { step: 5, action: 'Click "Generate Rules" and wait 2–3 seconds.' },
          { step: 6, action: 'Review the generated rules — each card shows the rule type, dimension, confidence score, and reason.' },
          { step: 7, action: 'Click "Accept" on any rule you want to add. It is instantly saved to your ruleset.' },
          { step: 8, action: 'Switch back to "Manual" tab at any time to add custom rules alongside AI-generated ones.' },
        ],
        tip: "Rules are generated locally in your browser using pattern matching — no API key, no external service, no data ever leaves your machine.",
        videoRef: 8,
      },
      {
        id: "rule-sandbox",
        title: "Test Rules in the Sandbox",
        summary: "Try out a rule against your data without saving it — perfect for tuning thresholds before committing.",
        icon: "FlaskConical",
        duration: "3 min",
        steps: [
          { step: 1, action: 'On the Rules tab, click "Open Sandbox".' },
          { step: 2, action: "Configure a rule just like in the main rule builder — dimension, type, column, threshold." },
          { step: 3, action: 'Click "Run Test" — Sohovi evaluates the rule against the current data.' },
          { step: 4, action: "See how many rows pass and fail, and the resulting score." },
          { step: 5, action: "Adjust the threshold and re-run until you find the right level." },
          { step: 6, action: "When happy, click 'Save to Rules' to add it as a real rule." },
        ],
        tip: "Use the sandbox to safely experiment with regex patterns before applying them to production rules.",
        videoRef: 4,
      },
      {
        id: "rule-weights-thresholds",
        title: "Configure Rule Weights & Thresholds",
        summary: "Control how much each rule affects the overall score and what passing looks like.",
        icon: "SlidersHorizontal",
        duration: "3 min",
        steps: [
          { step: 1, action: "In the Rules tab, click the edit (pencil) icon on any rule." },
          { step: 2, action: "Threshold (0–1): The minimum pass rate. 0.95 means 95% of rows must satisfy the rule for it to pass." },
          { step: 3, action: "Weight (1–5): How much this rule contributes to the overall column and asset score. Weight 5 = critical rule." },
          { step: 4, action: "A completeness rule on a required field (like 'customer_id') should have Weight 5. A nice-to-have rule can be Weight 1." },
          { step: 5, action: 'Save the changes.' },
        ],
        example: "Example: 'customer_email null_check' → threshold: 0.99, weight: 4. 'notes populated_check' → threshold: 0.5, weight: 1.",
        tip: "Lower the threshold for optional fields and raise it for critical business fields to get a meaningful quality score.",
        videoRef: 4,
      },
    ],
  },
  {
    id: "scoring-results",
    label: "Scores & Results",
    color: "bg-rose-500",
    guides: [
      {
        id: "run-dq-checks",
        title: "Run DQ Checks",
        summary: "Execute all active quality rules against your data to get a quality score.",
        icon: "PlayCircle",
        duration: "2 min",
        steps: [
          { step: 1, action: "Make sure your data is uploaded (at least one run exists) and rules are configured." },
          { step: 2, action: 'On the Rules tab, click the "Run DQ Check" button (green play button, top right).' },
          { step: 3, action: "Sohovi evaluates each rule against the data in your browser — results appear within seconds." },
          { step: 4, action: 'Navigate to the "Scoring" tab to see the results.' },
        ],
        tip: "You must have at least one active rule for DQ runs to produce a score. Deactivated rules are skipped.",
        videoRef: 5,
      },
      {
        id: "read-overall-score",
        title: "Understand the Overall Score",
        summary: "The DQ score (0–100) represents the overall health of your data asset. Here's how to read it.",
        icon: "Gauge",
        duration: "3 min",
        steps: [
          { step: 1, action: 'Open the "Scoring" tab of a Data Asset after running DQ checks.' },
          { step: 2, action: "The large score gauge shows your overall score: 0–100." },
          { step: 3, action: "Score bands: 95–100 = Excellent (green), 80–94 = Good (teal), 60–79 = Warning (amber), below 60 = Critical (red)." },
          { step: 4, action: "The score is a weighted average of all rule scores across all columns." },
          { step: 5, action: "A rule with Weight 5 that fails has much more impact than a Weight 1 rule that fails." },
          { step: 6, action: "On the main Dashboard, the Business Unit Health section shows an aggregated DQ score per Business Unit — averaged across all assets within that unit's catalogs. Cards highlighted in amber or red are your priority areas to investigate. Click any BU card to navigate directly to its detail page." },
        ],
        tip: "Aim for 90+ for production data assets. A score below 70 usually indicates actionable data issues that need fixing.",
        videoRef: 5,
      },
      {
        id: "column-scores",
        title: "View Column-Level Scores",
        summary: "Drill down into per-column quality scores to find exactly where problems are.",
        icon: "LayoutGrid",
        duration: "3 min",
        steps: [
          { step: 1, action: 'On the Scoring tab, scroll below the overall gauge to the Column Scores grid.' },
          { step: 2, action: "Each column card shows: column name, overall column score, and scores per quality dimension." },
          { step: 3, action: "Red columns are the highest priority to fix — they have the most failing rules." },
          { step: 4, action: "Click a column card to expand its rule-by-rule breakdown." },
        ],
        example: "Example: Column 'customer_email' — Completeness: 98, Validity: 72, Accuracy: 100. The validity score is dragging it down.",
        tip: "Sort columns by score ascending to immediately see your worst-performing columns at the top.",
        videoRef: 5,
      },
      {
        id: "failed-records",
        title: "View Failed Records",
        summary: "See the specific rows that violated quality rules so you can investigate and fix them.",
        icon: "TableProperties",
        duration: "3 min",
        steps: [
          { step: 1, action: "On the Scoring tab, click a column card to expand it." },
          { step: 2, action: 'Click "View Failed Records" to open the Failed Records table.' },
          { step: 3, action: "The table shows each failing row with: row number, the offending column value, the rule that failed, and severity." },
          { step: 4, action: "Severity levels: Low (minor issue), Medium (notable), High (critical — investigate immediately)." },
          { step: 5, action: "Use this table to understand patterns in failures and fix them at the source." },
        ],
        tip: "Failed records stay in memory during your session. Use Remediation tab to export them as a cleaned file.",
        videoRef: 5,
      },
      {
        id: "score-transparency",
        title: "Score Transparency Panel",
        summary: "Understand exactly why your score is what it is — rule by rule.",
        icon: "Eye",
        duration: "2 min",
        steps: [
          { step: 1, action: 'On the Scoring tab, click "Why this score?" or the Transparency icon.' },
          { step: 2, action: "The panel shows every rule, its pass/fail result, its weight, and its score contribution." },
          { step: 3, action: "Failed rules with high weights are highlighted — these are your priority fixes." },
          { step: 4, action: "Use this breakdown during data quality reviews to explain scores to stakeholders." },
        ],
        tip: "Screenshot this panel for data quality reports — it's a clear, auditable explanation of your score.",
        videoRef: 5,
      },
      {
        id: "behavior-score",
        title: "Behavior Score — Detect Anomalies Across Runs",
        summary: "Sohovi automatically compares each new run's statistics against historical baselines and flags unusual changes — even if your static rules still pass.",
        icon: "Activity",
        duration: "4 min",
        steps: [
          { step: 1, action: 'Save at least 3 DQ runs on the same asset (the same or similar CSV files each time).' },
          { step: 2, action: 'Open any run detail page: Runs tab → click a run.' },
          { step: 3, action: 'Below the DQ Score gauge, find the "Behavior Score" card.' },
          { step: 4, action: 'The Behavior Score is 0–100. A score of 100 means this run is statistically normal compared to your run history.' },
          { step: 5, action: 'If flags appear, each flag shows: the column name, which metric changed (null rate, mean, cardinality, distribution…), the observed vs expected value, and the z-score.' },
          { step: 6, action: 'Severity bands: Red = high (6+ standard deviations from baseline), Amber = medium (4–6 SD), Slate = low (3–4 SD).' },
          { step: 7, action: 'Use behavior flags to investigate upstream data issues that your static rules might miss — for example, a column that doubled its null rate but still passes a lenient threshold.' },
        ],
        example: "Example: Your customer_email column normally has 1% nulls. Today's run has 18% nulls. The Behavior Score flags null_pct as a high-severity anomaly (z-score = 8.4) — even if your not_null rule threshold was set at 80%.",
        tip: "Behavior scoring requires 2+ historical completed runs. A placeholder is shown until enough history is available. The more runs you have, the more accurate the baseline.",
        videoRef: 9,
      },
      {
        id: "compare-runs",
        title: "Compare Runs",
        summary: "Compare two different DQ runs side-by-side to see if quality improved or degraded.",
        icon: "GitDiff",
        duration: "3 min",
        steps: [
          { step: 1, action: 'On the Data Asset, click the "Runs" tab.' },
          { step: 2, action: "The run history shows all past runs with their overall score, date, and row count." },
          { step: 3, action: "Select two runs using the checkboxes to enter comparison mode." },
          { step: 4, action: "The comparison table shows score changes per column and flags new schema changes." },
          { step: 5, action: "Green = improved, Red = degraded, Gray = unchanged." },
        ],
        tip: "Run comparisons are most useful after a data pipeline change or source system migration to check for regressions.",
        videoRef: 5,
      },
    ],
  },
  {
    id: "monitoring-reporting",
    label: "Monitoring & Reporting",
    color: "bg-cyan-500",
    guides: [
      {
        id: "create-score-drop-alert",
        title: "Create a Score-Drop Alert",
        summary: "Get notified automatically when your data quality score drops below a threshold.",
        icon: "BellRing",
        duration: "3 min",
        steps: [
          { step: 1, action: 'In the sidebar, click "Alerts".' },
          { step: 2, action: 'Click "New Alert".' },
          { step: 3, action: "Select the Data Asset you want to monitor." },
          { step: 4, action: 'Set Condition to "Score Drop".' },
          { step: 5, action: "Set the threshold — e.g. 5 means alert when the score drops by more than 5 points in a single run." },
          { step: 6, action: 'Click "Save Alert".' },
          { step: 7, action: "When the condition is met, an alert event is created and the bell icon in the top bar shows a badge." },
        ],
        example: "Example: Alert 'Customer Orders Score Drop' — triggers when score drops by more than 5 points from the previous run.",
        tip: "Combine a score drop alert with a schema change alert on the same asset for full monitoring coverage.",
        videoRef: 6,
      },
      {
        id: "create-schema-change-alert",
        title: "Create a Schema Change Alert",
        summary: "Get alerted whenever columns are added or removed from your data — great for catching upstream pipeline changes.",
        icon: "Bell",
        duration: "2 min",
        steps: [
          { step: 1, action: 'Alerts → "New Alert" → select the Data Asset.' },
          { step: 2, action: 'Set Condition to "Schema Change".' },
          { step: 3, action: "No threshold needed — any schema change (added or removed column) triggers this alert." },
          { step: 4, action: 'Click "Save Alert".' },
        ],
        tip: "Schema change alerts protect you from silent breaking changes in upstream data pipelines.",
        videoRef: 6,
      },
      {
        id: "view-alert-events",
        title: "View Alert Events",
        summary: "See a history of all triggered alerts and which runs caused them.",
        icon: "BellDot",
        duration: "2 min",
        steps: [
          { step: 1, action: "Click the Bell icon in the top bar — a badge shows the number of unread alert events." },
          { step: 2, action: "The panel lists all triggered events with: alert name, asset, run date, and the trigger message." },
          { step: 3, action: "Click an event to mark it as read." },
          { step: 4, action: 'Go to Alerts → select an alert rule → scroll to "Recent Events" to see full history.' },
        ],
        tip: "Mark events as read to keep your alert feed clean. Unread count resets once you open the panel.",
        videoRef: 6,
      },
      {
        id: "distribution-shift",
        title: "Distribution Shift — Catch Unexpected New Values",
        summary: "Sohovi automatically detects when a categorical column gains new dominant values between runs — without any rule configuration.",
        icon: "TrendingUp",
        duration: "3 min",
        steps: [
          { step: 1, action: 'Run DQ on an asset that has categorical columns — for example: status, region, product_type, payment_method.' },
          { step: 2, action: 'On a subsequent run, if a new dominant value appears that was not present in the previous run, Sohovi flags it automatically.' },
          { step: 3, action: 'Open the run detail page → look for the "Behavior Score" card below the DQ Score gauge.' },
          { step: 4, action: 'Find flags with metric label "Distribution" — these are the distribution shift alerts.' },
          { step: 5, action: 'The flag message tells you: which column was affected, what new value appeared, and what percentage of rows it represents.' },
          { step: 6, action: 'Investigate the root cause: did an upstream system add a new status code? Did a pipeline join produce unexpected values? Was there a data entry error?' },
        ],
        example: "Example: Your order_status column has always contained pending, shipped, delivered. A new run arrives with cancelled_fraud as the top value at 22% frequency — Sohovi flags it as a high-severity distribution shift.",
        tip: "Distribution shift flags fire automatically based on historical patterns — you do not need to write any rules or configure thresholds for this to work.",
        videoRef: 9,
      },
      {
        id: "create-workflow",
        title: "Create a Reusable Workflow",
        summary: "Save a DQ rule configuration as a Workflow so you can apply the same rules to future uploads without starting from scratch.",
        icon: "Workflow",
        duration: "4 min",
        steps: [
          { step: 1, action: 'In the sidebar, click "Workflows".' },
          { step: 2, action: 'Click "New Workflow".' },
          { step: 3, action: "Name the workflow (e.g. 'Customer Orders DQ') and add a description." },
          { step: 4, action: "Use the column mapping editor to define which columns the workflow applies to and what rules to run on each." },
          { step: 5, action: 'Click "Save Workflow".' },
          { step: 6, action: "On your next upload, select this workflow on the upload page to auto-apply all mapped rules." },
        ],
        example: "Example: Workflow 'Monthly Sales DQ' maps: order_id → uniqueness + completeness; amount → accuracy range_check; email → validity format.",
        tip: "Workflows save hours when you repeatedly ingest the same type of data (e.g. monthly sales reports, weekly CRM exports).",
        videoRef: 6,
      },
      {
        id: "apply-workflow",
        title: "Apply a Workflow to a New Upload",
        summary: "Use a saved workflow to instantly apply pre-configured quality rules to a new data upload.",
        icon: "Zap",
        duration: "2 min",
        steps: [
          { step: 1, action: "Open a Data Asset → go to the Upload tab." },
          { step: 2, action: "After uploading or connecting your data, look for the 'Apply Workflow' section." },
          { step: 3, action: "Select the workflow you want from the dropdown." },
          { step: 4, action: "Sohovi maps the workflow's column rules to your new data's columns automatically." },
          { step: 5, action: "Run DQ checks — all workflow rules are applied in one click." },
        ],
        tip: "If column names changed slightly, use the column mapping editor in the workflow to update the mapping.",
        videoRef: 6,
      },
      {
        id: "remediation",
        title: "Remediate Failed Records",
        summary: "Review rows that failed quality checks, get fix suggestions, and export a cleaned version of your file.",
        icon: "Wrench",
        duration: "4 min",
        steps: [
          { step: 1, action: 'Open a Data Asset → click the "Remediation" tab.' },
          { step: 2, action: "The Failed Records table shows all rows that violated at least one rule, grouped by severity." },
          { step: 3, action: "Each row shows which rule failed, the failing value, and a suggested fix." },
          { step: 4, action: "Review suggestions — they include things like: 'Fill missing value', 'Round to 2 decimal places', 'Correct format to XX-XXX'." },
          { step: 5, action: 'Click "Export Cleaned File" to download a CSV with fixes applied where possible.' },
        ],
        tip: "The exported file highlights rows that still need manual attention with a 'needs_review' flag column.",
        videoRef: 7,
      },
      {
        id: "export-reports",
        title: "Export DQ Reports",
        summary: "Generate and download PDF or Excel quality reports for one or more data assets.",
        icon: "FileDown",
        duration: "2 min",
        steps: [
          { step: 1, action: 'In the sidebar, click "Reports".' },
          { step: 2, action: "Select the data asset(s) you want to include in the report." },
          { step: 3, action: "Choose the format: PDF (shareable summary) or Excel (raw scores and rule results)." },
          { step: 4, action: 'Click "Generate Report" and download the file.' },
        ],
        tip: "Share PDF reports in data governance meetings or with stakeholders who don't have Sohovi access.",
        videoRef: 7,
      },
    ],
  },
];

export function findGuideById(id: string): { guide: Guide; category: GuideCategory } | null {
  for (const category of GUIDE_CATEGORIES) {
    const guide = category.guides.find((g) => g.id === id);
    if (guide) return { guide, category };
  }
  return null;
}

export function getContextualGuides(pathname: string): { id: string; title: string }[] {
  if (pathname === "/dashboard") {
    return [
      { id: "read-overall-score", title: "Reading DQ Health Cards" },
      { id: "create-business-unit", title: "Create a Business Unit" },
    ];
  }
  if (pathname.startsWith("/dashboard/business-units")) {
    return [
      { id: "create-business-unit", title: "Create a Business Unit" },
      { id: "add-members", title: "Add Members to Your Org" },
    ];
  }
  if (pathname.startsWith("/dashboard/catalogs")) {
    return [
      { id: "create-catalog", title: "Create a Catalog" },
      { id: "create-business-unit", title: "Org Hierarchy Explained" },
    ];
  }
  if (pathname.startsWith("/dashboard/assets") && pathname.includes("/profile")) {
    return [
      { id: "what-is-profiling", title: "What Is Profiling?" },
      { id: "pii-detection", title: "PII Detection" },
      { id: "outlier-detection", title: "Outlier Detection" },
    ];
  }
  if (pathname.startsWith("/dashboard/assets") && pathname.includes("/rules")) {
    return [
      { id: "add-completeness-rule", title: "Add a Completeness Rule" },
      { id: "add-accuracy-rule", title: "Add an Accuracy Rule" },
      { id: "ai-rule-suggestions", title: "AI Rule Suggestions" },
    ];
  }
  if (pathname.startsWith("/dashboard/assets") && pathname.includes("/scoring")) {
    return [
      { id: "read-overall-score", title: "Reading Your Score" },
      { id: "failed-records", title: "View Failed Records" },
      { id: "score-transparency", title: "Score Transparency" },
    ];
  }
  if (pathname.startsWith("/dashboard/assets") && pathname.includes("/runs")) {
    return [
      { id: "compare-runs", title: "Compare Runs" },
      { id: "schema-change-detection", title: "Schema Change Detection" },
    ];
  }
  if (pathname.startsWith("/dashboard/assets") && pathname.includes("/remediation")) {
    return [
      { id: "remediation", title: "Remediate Failed Records" },
      { id: "export-reports", title: "Export Cleaned File" },
    ];
  }
  if (pathname.startsWith("/dashboard/assets") && pathname.includes("/upload")) {
    return [
      { id: "upload-csv-excel", title: "Upload CSV / Excel" },
      { id: "connect-google-sheets", title: "Connect Google Sheets" },
      { id: "connect-airtable", title: "Connect Airtable" },
    ];
  }
  if (pathname.startsWith("/dashboard/assets")) {
    return [
      { id: "create-data-asset", title: "Create a Data Asset" },
      { id: "upload-csv-excel", title: "Upload CSV / Excel" },
    ];
  }
  if (pathname.startsWith("/dashboard/alerts")) {
    return [
      { id: "create-score-drop-alert", title: "Create Score-Drop Alert" },
      { id: "create-schema-change-alert", title: "Schema Change Alert" },
    ];
  }
  if (pathname.startsWith("/dashboard/workflows")) {
    return [
      { id: "create-workflow", title: "Create a Workflow" },
      { id: "apply-workflow", title: "Apply Workflow to Upload" },
    ];
  }
  if (pathname.startsWith("/dashboard/reports")) {
    return [{ id: "export-reports", title: "Export DQ Report" }];
  }
  if (pathname.startsWith("/dashboard/team")) {
    return [
      { id: "add-members", title: "Add Members to Org" },
      { id: "create-organization", title: "Create an Organization" },
    ];
  }
  return [
    { id: "create-business-unit", title: "Create a Business Unit" },
    { id: "upload-csv-excel", title: "Upload Your First File" },
  ];
}
