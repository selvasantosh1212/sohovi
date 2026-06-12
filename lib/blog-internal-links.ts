/**
 * Runtime internal link injection for blog posts.
 * Maps data quality terms to their canonical blog post slugs.
 * Injects markdown links into prose on first occurrence only.
 */

// Sorted longest-first so multi-word phrases match before shorter substrings.
const TERM_SLUG_MAP: [string, string][] = [
  // Multi-word concepts — must come first
  ["6 dimensions of data quality", "data-quality-six-dimensions-hub"],
  ["six dimensions of data quality", "data-quality-six-dimensions-hub"],
  ["data quality dimensions", "data-quality-six-dimensions-hub"],
  ["data quality dimension", "what-is-data-quality-dimension"],
  ["data quality framework", "what-is-data-quality-framework"],
  ["data quality audit", "audit-data-quality-5-steps"],
  ["data quality rules", "what-is-data-quality-rule"],
  ["data quality rule", "what-is-data-quality-rule"],
  ["data quality maturity", "data-quality-maturity-model"],
  ["data quality ROI", "calculate-roi-data-quality-investment"],
  ["data quality culture", "build-data-quality-culture-company"],
  ["data quality monitoring", "set-up-data-quality-monitoring"],
  ["data quality checks", "automate-data-quality-checks"],
  ["data quality check", "automate-data-quality-checks"],
  ["master data management", "what-is-master-data-management"],
  ["metadata management", "what-is-metadata-management"],
  ["reference data management", "what-is-reference-data-management"],
  ["anomaly detection", "what-is-data-anomaly-detection"],
  ["data profiling", "data-profiling-vs-data-quality-monitoring"],
  ["data governance", "data-governance-vs-data-quality"],
  ["data stewardship", "data-stewardship-what-it-is"],
  ["data completeness", "what-is-data-completeness"],
  ["data consistency", "what-is-data-consistency"],
  ["data uniqueness", "what-is-data-uniqueness"],
  ["data integrity", "what-is-data-integrity"],
  ["data timeliness", "what-is-data-timeliness"],
  ["data accuracy", "what-is-data-accuracy"],
  ["data validity", "what-is-data-validity"],
  ["data conformity", "what-is-data-conformity"],
  ["data precision", "what-is-data-precision"],
  ["data cleaning process", "data-cleaning-complete-process"],
  ["data cleansing process", "data-cleaning-complete-process"],
  ["data cleansing", "what-is-data-cleansing"],
  ["data enrichment", "what-is-data-enrichment"],
  ["data observability", "what-is-data-observability"],
  ["data normalization", "what-is-data-normalization"],
  ["data standardization", "what-is-data-standardization"],
  ["data lineage", "what-is-data-lineage"],
  ["data wrangling", "what-is-data-wrangling"],
  ["data catalog", "what-is-data-catalog"],
  ["data dictionary", "what-is-data-dictionary"],
  ["data drift", "what-is-data-drift"],
  ["data currency", "what-is-data-currency"],
  ["schema validation", "what-is-schema-validation"],
  ["fuzzy matching", "fuzzy-matching-customer-data"],
  ["fuzzy dedupe", "fuzzy-matching-customer-data"],
  ["standardize phone numbers", "standardize-phone-numbers-spreadsheet"],
  ["phone number format", "standardize-phone-numbers-spreadsheet"],
  ["missing values", "handling-missing-values-without-python"],
  ["anonymize data", "anonymize-csv-before-sharing"],
  ["pseudonymization", "anonymize-csv-before-sharing"],
  ["anonymization", "anonymize-csv-before-sharing"],
  ["Salesforce migration", "salesforce-data-migration-checklist"],
  ["cost of bad data", "bad-data-cost-small-business"],
  ["leading zeros", "excel-leading-zeros-fix"],
  ["OpenRefine", "sohovi-vs-openrefine"],
  ["RAG pipeline", "data-quality-rag-pipeline"],
  ["duplicate records", "what-is-data-uniqueness"],
  ["duplicate leads", "duplicate-leads-costing-real-estate-teams"],
  ["poor data quality", "hidden-costs-poor-data-quality"],
  ["bad data", "bad-data-bad-business-decisions"],
  // Single-word / short concepts — lower priority
  ["ETL pipeline", "what-is-etl"],
  ["data audit", "what-is-data-audit"],
  // Free tools — link to the matching browser-based tool
  ["remove duplicate rows", "/tools/remove-duplicates"],
  ["duplicate row remover", "/tools/remove-duplicates"],
  ["remove duplicates from CSV", "/tools/remove-duplicates"],
  ["CSV to JSON converter", "/tools/csv-to-json"],
  ["convert CSV to JSON", "/tools/csv-to-json"],
  ["JSON to CSV converter", "/tools/json-to-csv"],
  ["convert JSON to CSV", "/tools/json-to-csv"],
  ["CSV to SQL generator", "/tools/csv-to-sql"],
  ["convert CSV to SQL", "/tools/csv-to-sql"],
  ["merge multiple CSV files", "merge-multiple-csv-files"],
  ["combine CSV files", "merge-multiple-csv-files"],
  ["merge CSV files", "/tools/csv-merger"],
  ["CSV merger", "/tools/csv-merger"],
  ["test data generator", "/tools/test-data-generator"],
  ["generate test data", "/tools/test-data-generator"],
  ["Excel formula explainer", "/tools/formula-explainer"],
  ["explain Excel formula", "/tools/formula-explainer"],
];

/** Strip `[INTERNAL LINK: ...]` and `[IMAGE: ...]` placeholder lines left by the seed process. */
export function cleanInternalLinkPlaceholders(content: string): string {
  return content
    .replace(/^\[INTERNAL LINK:[^\]]*\]\s*$/gm, "")
    .replace(/\[IMAGE:[^\]]*\]/g, "")
    .replace(/\n{3,}/g, "\n\n");
}

/**
 * Injects markdown hyperlinks for the first occurrence of each known data
 * quality term in the prose body. Skips headings, code blocks, and text
 * that is already inside a markdown link. Never links to the current post.
 */
export function injectInternalLinks(content: string, currentSlug: string): string {
  // Split into segments: code blocks are preserved verbatim.
  // Pattern matches fenced code blocks (``` ... ```)
  const CODE_BLOCK = /(```[\s\S]*?```|`[^`\n]+`)/g;
  const segments: { text: string; isCode: boolean }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = CODE_BLOCK.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: content.slice(lastIndex, match.index), isCode: false });
    }
    segments.push({ text: match[0], isCode: true });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    segments.push({ text: content.slice(lastIndex), isCode: false });
  }

  // Track which terms have already been linked (first-occurrence-only rule)
  const linked = new Set<string>();

  const processed = segments.map(({ text, isCode }) => {
    if (isCode) return text;
    return injectIntoProse(text, currentSlug, linked);
  });

  return processed.join("");
}

function injectIntoProse(prose: string, currentSlug: string, linked: Set<string>): string {
  // Process line-by-line so we can skip headings
  const lines = prose.split("\n");
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trimStart();
    // Skip heading lines and image lines
    if (trimmed.startsWith("#") || trimmed.startsWith("![") || trimmed.startsWith("[IMAGE")) {
      result.push(line);
      continue;
    }
    result.push(injectIntoLine(line, currentSlug, linked));
  }

  return result.join("\n");
}

function injectIntoLine(line: string, currentSlug: string, linked: Set<string>): string {
  for (const [term, slug] of TERM_SLUG_MAP) {
    if (slug === currentSlug) continue;       // no self-links
    if (linked.has(term.toLowerCase())) continue; // already linked elsewhere in post

    // Build case-insensitive regex that won't match inside existing [...](...) links
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Negative lookbehind: not preceded by [
    // Negative lookahead: not followed by ] or ) that would indicate it's already linked
    const regex = new RegExp(`(?<!\\[)\\b(${escaped})\\b(?![^[]*\\])`, "i");
    const m = regex.exec(line);
    if (!m) continue;

    // Double-check: ensure the match is not already inside a markdown link
    const before = line.slice(0, m.index);
    const openBrackets = (before.match(/\[/g) ?? []).length;
    const closeBrackets = (before.match(/\]/g) ?? []).length;
    if (openBrackets > closeBrackets) continue; // we're inside [...

    const href = slug.startsWith("/") ? slug : `/blog/${slug}`;
    line = line.slice(0, m.index) + `[${m[1]}](${href})` + line.slice(m.index + m[1].length);
    linked.add(term.toLowerCase());
  }
  return line;
}
