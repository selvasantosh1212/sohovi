const categoryCtaMap: Record<string, string> = {
  "healthcare": "Healthcare teams use Sohovi to validate patient data before it reaches production — try it free",
  "recruitment": "Clean candidate spreadsheets automatically — Sohovi spots gaps, duplicates, and format errors instantly",
  "hr": "Clean candidate spreadsheets automatically — Sohovi spots gaps, duplicates, and format errors instantly",
  "finance": "Validate client data before submission — Sohovi catches errors and mismatches in minutes",
  "mortgage": "Validate client data before submission — Sohovi catches errors and mismatches in minutes",
  "agencies": "Deliver clean data to every client — Sohovi audits your files automatically",
  "marketing": "Stop sending campaigns to bad data — Sohovi validates your list before you hit send",
  "ecommerce": "Stop bad product data from reaching customers — Sohovi flags quality issues before they ship",
  "data-quality": "Sohovi profiles your datasets for quality issues in minutes — see what's broken before it breaks your pipeline",
  "data quality": "Sohovi profiles your datasets for quality issues in minutes — see what's broken before it breaks your pipeline",
  "analytics": "Trust the data behind your dashboards — Sohovi validates quality at the source",
  "operations": "Catch data errors before they slow your team down — Sohovi flags issues automatically",
  "logistics": "Accurate data keeps shipments moving — Sohovi validates your records before they cause delays",
  "real estate": "Stop losing deals to bad CRM data — Sohovi finds gaps and duplicates in your lead records",
  "sales": "Your pipeline is only as good as your data — Sohovi profiles your CRM records for free",
  "nonprofit": "Donor data you can trust — Sohovi validates contact records and flags duplicates automatically",
};

const tagCtaMap: Record<string, string> = {
  "csv": "Upload your CSV and see exactly what's wrong — Sohovi profiles quality in seconds",
  "spreadsheet": "Upload your spreadsheet and get an instant quality report — free with Sohovi",
  "data cleaning": "Stop cleaning data manually — Sohovi shows you exactly what needs fixing and where",
  "validation": "Automated data validation that runs in minutes — see how Sohovi works free",
  "duplicates": "Find and fix duplicates across your dataset — Sohovi surfaces them automatically",
  "completeness": "Spot missing values and gaps before they cause problems — try Sohovi free",
  "compliance": "Meet data quality requirements without the manual audit — Sohovi does the checks for you",
  "machine learning": "Clean training data, better models — Sohovi profiles your dataset for quality issues before they corrupt your ML pipeline",
  "ai": "Your AI is only as good as your data — Sohovi catches quality issues before they reach your models",
};

const fallbackCta = "See exactly what's wrong with your data — try Sohovi free";

export function getBlogCTA(
  category: string | null,
  tags: string[]
): { text: string; href: string } {
  const cat = (category ?? "").toLowerCase();
  if (categoryCtaMap[cat]) {
    return { text: categoryCtaMap[cat], href: "/sign-up" };
  }

  for (const tag of tags) {
    const t = tag.toLowerCase();
    if (tagCtaMap[t]) {
      return { text: tagCtaMap[t], href: "/sign-up" };
    }
    for (const key of Object.keys(categoryCtaMap)) {
      if (t.includes(key) || key.includes(t)) {
        return { text: categoryCtaMap[key], href: "/sign-up" };
      }
    }
  }

  return { text: fallbackCta, href: "/sign-up" };
}

// ── Section-level contextual CTAs ────────────────────────────────────────────
// Scans the text of the section the reader just finished to pick the most
// relevant Sohovi feature to surface.

const sectionCtaRules: { keywords: string[]; text: string }[] = [
  {
    keywords: ["duplicate", "duplicates", "deduplicat"],
    text: "Find every duplicate automatically — Sohovi surfaces exact matches and near-duplicates across your entire dataset",
  },
  {
    keywords: ["completeness", "missing value", "missing field", "null", "blank"],
    text: "See every missing value at a glance — Sohovi's completeness check runs across all columns in under a minute",
  },
  {
    keywords: ["data profil", "profiling", "profile your"],
    text: "Profile your dataset instantly with Sohovi — completeness rates, type distributions, and outliers for every column, free",
  },
  {
    keywords: ["rule", "validat", "format check", "regex", "constraint"],
    text: "Define your own validation rules and let Sohovi enforce them automatically — no code, no engineers needed",
  },
  {
    keywords: ["monitor", "drift", "trend", "anomaly", "alert", "threshold"],
    text: "Track data quality trends over time with Sohovi — catch drift and anomalies before they reach your pipeline",
  },
  {
    keywords: ["accuracy", "accurate", "inaccurate", "wrong value", "incorrect"],
    text: "Measure data accuracy against your own standards — Sohovi scores each column and highlights affected rows",
  },
  {
    keywords: ["pii", "sensitive data", "gdpr", "hipaa", "personal data", "privacy"],
    text: "Sohovi auto-detects PII in your datasets — emails, phones, SSNs flagged instantly, all processing stays in your browser",
  },
  {
    keywords: ["machine learning", "ml model", "training data", "ai model", "artificial intelligence"],
    text: "Clean training data, better models — Sohovi profiles quality issues in your dataset before they corrupt your ML pipeline",
  },
  {
    keywords: ["decision", "forecast", "report", "dashboard", "analytics", "business intelligence"],
    text: "Make decisions you can trust — Sohovi validates the data underneath your most important reports before you act on them",
  },
  {
    keywords: ["migration", "import", "warehouse", "etl", "pipeline"],
    text: "Validate data quality before it enters your warehouse — Sohovi catches errors at the source, not after migration",
  },
  {
    keywords: ["crm", "salesforce", "lead", "contact", "customer record"],
    text: "Your CRM is only as good as its data — Sohovi finds gaps, duplicates, and format errors in your contact records",
  },
  {
    keywords: ["email list", "email campaign", "sender reputation", "bounce", "deliverability"],
    text: "Validate your email list before you send — Sohovi flags invalid formats, duplicates, and missing fields instantly",
  },
  {
    keywords: ["spreadsheet", "excel", "csv", "google sheet"],
    text: "Upload your spreadsheet and get a full quality report in seconds — Sohovi runs entirely in your browser, free",
  },
  {
    keywords: ["small business", "non-technical", "no-code", "without an engineer", "without it"],
    text: "No engineers or code needed — Sohovi is built for business users who need real data quality answers fast",
  },
  {
    keywords: ["leading zero", "zip code format", "serial number format", "remove leading zero"],
    text: "Stop re-fixing the same file every week — set a validation rule once in Sohovi and get flagged the moment a leading zero goes missing",
  },
  {
    keywords: ["date format", "mm/dd", "dd/mm", "iso 8601", "date corruption", "date silently", "wrong date"],
    text: "Not sure if your dates are already silently corrupted? Profile the file free in Sohovi — mixed date formats light up instantly",
  },
  {
    keywords: ["merge csv", "combine csv", "schema mismatch", "mismatched column", "different columns"],
    text: "Merging files with mismatched columns? Drop them into our free CSV merger — it aligns columns and flags what doesn't match",
  },
  {
    keywords: ["anonymize", "anonymization", "pseudonymize", "re-identify", "dpa", "data processor", "gdpr tool"],
    text: "Anonymize your file in the browser — it never touches a server, which means the anonymization itself doesn't create a privacy problem",
  },
  {
    keywords: ["rag pipeline", "retrieval", "llm data", "fine-tun", "knowledge base", "chatbot answer", "vector embed"],
    text: "Before you blame the model, profile your source data — drag your knowledge-base export into Sohovi and see what your AI has been reading",
  },
  {
    keywords: ["quickbooks", "xero import", "import error", "csv import fail", "rejected import"],
    text: "Run your import file through Sohovi first — catch format errors, duplicates, and missing fields in one screen before QuickBooks sees it",
  },
  {
    keywords: ["salesforce migration", "go-live", "crm migration", "data migration checklist", "pre-migration"],
    text: "The data prep phase of this checklist takes days in Excel or an afternoon in Sohovi — upload your export and work through it free",
  },
];

/**
 * Returns a Sohovi CTA based on keywords found in the given section text.
 * Falls back to the category/tag-based CTA if no section keywords match.
 */
export function getContextualCTAForSection(
  sectionText: string,
  fallbackCategory: string | null,
  fallbackTags: string[]
): { text: string; href: string } {
  const lower = sectionText.toLowerCase();
  for (const { keywords, text } of sectionCtaRules) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return { text, href: "/sign-up" };
    }
  }
  return getBlogCTA(fallbackCategory, fallbackTags);
}

// ── Inline Sohovi mention rules ───────────────────────────────────────────────
// Each rule: if the paragraph contains any of the `signals`, append this
// sentence (with a [Sohovi](/sign-up) hyperlink) after it.
// Sentences are kept short and editorial — a natural continuation of the prose.

const inlineMentionRules: { signals: string[]; sentence: string }[] = [
  {
    signals: ["duplicate", "duplicates", "deduplicat"],
    sentence:
      "[Sohovi](/sign-up) automatically finds every duplicate in your dataset — including near-matches — and shows you exactly which rows are affected.",
  },
  {
    signals: ["completeness", "missing value", "missing field", "null value", "blank field", "empty field"],
    sentence:
      "[Sohovi](/sign-up) profiles every column in your dataset for completeness and flags the exact rows where values are missing — free to try.",
  },
  {
    signals: ["data profil", "profiling your", "profile your data", "profile the dataset"],
    sentence:
      "[Sohovi](/sign-up) runs a full data profile on any CSV or spreadsheet in under a minute — completeness rates, type distributions, outliers, and more.",
  },
  {
    signals: ["validat", "format check", "regex", "invalid format", "format error"],
    sentence:
      "[Sohovi](/sign-up) lets you set up validation rules for any column and instantly see which rows fall outside them — no code or SQL required.",
  },
  {
    signals: ["data quality rule", "quality rules", "quality checks", "automated check"],
    sentence:
      "[Sohovi](/sign-up) applies your data quality rules automatically across the whole dataset and highlights every violation — so nothing slips through.",
  },
  {
    signals: ["monitor", "data drift", "trend", "anomaly", "alert", "threshold"],
    sentence:
      "[Sohovi](/sign-up) tracks quality trends across runs and alerts you when a metric — null rate, duplicate count, score — moves outside its normal range.",
  },
  {
    signals: ["accuracy", "inaccurate", "wrong value", "incorrect value"],
    sentence:
      "[Sohovi](/sign-up) scores your dataset against your own accuracy standards and highlights the columns and rows where values fall outside expected ranges.",
  },
  {
    signals: ["pii", "sensitive data", "gdpr", "hipaa", "personal data", "privacy"],
    sentence:
      "[Sohovi](/sign-up) automatically detects PII in your datasets — emails, phone numbers, SSNs — all processed client-side so your data never leaves the browser.",
  },
  {
    signals: ["machine learning", "ml model", "training data", "ai model"],
    sentence:
      "[Sohovi](/sign-up) profiles your training data for quality issues — missing values, outliers, type mismatches — before they corrupt your model.",
  },
  {
    signals: ["migration", "data import", "warehouse", "before importing", "before migrating"],
    sentence:
      "[Sohovi](/sign-up) validates your dataset before it enters the warehouse — catching format errors, nulls, and duplicates at the source.",
  },
  {
    signals: ["crm", "salesforce", "lead data", "contact data", "customer record"],
    sentence:
      "[Sohovi](/sign-up) finds gaps, duplicates, and format errors in your CRM data — so your team is working from records they can trust.",
  },
  {
    signals: ["email list", "email campaign", "sender reputation", "bounce rate", "deliverability"],
    sentence:
      "[Sohovi](/sign-up) validates your email list for invalid formats, duplicates, and missing fields before you send — protecting your sender reputation.",
  },
  {
    signals: ["spreadsheet", "excel file", "csv file", "google sheet"],
    sentence:
      "[Sohovi](/sign-up) gives you a full quality report on any spreadsheet in seconds — upload your file and see exactly what needs fixing.",
  },
  {
    signals: ["bad data", "dirty data", "poor data quality", "low quality data", "data problem"],
    sentence:
      "[Sohovi](/sign-up) shows you exactly what is wrong with your data — completeness gaps, type mismatches, duplicates — in one clear report.",
  },
  {
    signals: ["cost", "revenue impact", "financial impact", "losing money", "expensive"],
    sentence:
      "[Sohovi](/sign-up) gives you the data quality picture you need to make the case for fixing it — and to track improvement over time.",
  },
  {
    signals: ["10 dimension", "dq dimension", "quality dimension", "completeness, validity", "completeness, uniqueness"],
    sentence:
      "[Sohovi](/sign-up) measures all 10 data quality dimensions — completeness, validity, uniqueness, accuracy, consistency, and more — automatically across every column.",
  },
];

/**
 * Walks content paragraph-by-paragraph and injects an inline Sohovi mention
 * (a plain markdown sentence with a hyperlink) after paragraphs that match
 * a problem-signal keyword.
 *
 * Rules:
 * - Skips headings, images, tables, code fences — only fires on prose
 * - Minimum 3 prose paragraphs between any two injections
 * - Maximum 3 injections per post
 * - First injection no earlier than the 3rd prose paragraph (reader gets
 *   context before seeing a mention)
 * - Each injection uses the best-match rule for that paragraph; falls back
 *   to a generic mention only when no prior injection has fired yet
 */
export function injectInlineSohoviMentions(
  content: string,
  category: string | null,
  tags: string[],
  maxMentions = 3
): string {
  const blocks = content.split(/\n\n+/);
  const output: string[] = [];
  let mentionCount = 0;
  let proseSinceLast = 0;
  let totalProse = 0;

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const isStructural =
      trimmed.startsWith("#") ||
      trimmed.startsWith("![") ||
      trimmed.startsWith("[IMAGE") ||
      trimmed.startsWith("```") ||
      trimmed.startsWith("|") ||
      trimmed.startsWith("---") ||
      trimmed.startsWith("**Q:") || // FAQ items
      trimmed.startsWith("**A:");

    output.push(trimmed);

    if (!isStructural) {
      totalProse++;
      proseSinceLast++;

      if (
        mentionCount < maxMentions &&
        totalProse >= 3 &&
        proseSinceLast >= 3
      ) {
        const lower = trimmed.toLowerCase();
        const matched = inlineMentionRules.find(({ signals }) =>
          signals.some((s) => lower.includes(s))
        );

        if (matched) {
          output.push(`> ${matched.sentence}`);
          mentionCount++;
          proseSinceLast = 0;
        } else if (mentionCount === 0 && totalProse >= 5) {
          // No keyword match yet — drop a generic mention once mid-article
          const fallback = getBlogCTA(category, tags);
          output.push(`> ${fallback.text} — [try Sohovi free](/sign-up).`);
          mentionCount++;
          proseSinceLast = 0;
        }
      }
    }
  }

  const joined = output.join("\n\n");

  // Remove duplicate blockquote CTAs (same text injected by both section and inline rules)
  const seen = new Set<string>();
  return joined.replace(/^> .+$/gm, (match) => {
    if (seen.has(match)) return "";
    seen.add(match);
    return match;
  });
}
