// Maps [IMAGE: description] placeholder text to SVG diagram filenames.
// Returns null when no match is found — callers should silently drop unmatched placeholders.
export function resolveDiagram(description: string): string | null {
  const d = description.toLowerCase();

  // ── Flow diagrams ──────────────────────────────────────────────────────────
  if ((d.includes("automated") || d.includes("automation")) && d.includes("workflow")) return "blog-flow-01-automated-dq-workflow.svg";
  if (d.includes("framework") && (d.includes("component") || d.includes("overview"))) return "blog-flow-02-dq-framework-components.svg";
  if (d.includes("problem") && d.includes("cascade")) return "blog-flow-03-problem-cascade.svg";
  if (d.includes("duplicate") && d.includes("cascade")) return "blog-flow-04-duplicate-cascade.svg";
  if (d.includes("etl") && d.includes("gate")) return "blog-flow-05-etl-quality-gates.svg";
  if (d.includes("etl") && (d.includes("stage") || d.includes("validation"))) return "blog-flow-06-etl-validation-stages.svg";
  if (d.includes("api") && d.includes("validation")) return "blog-flow-07-api-validation-flow.svg";
  if ((d.includes("dead letter") || d.includes("dead-letter")) && (d.includes("streaming") || d.includes("queue"))) return "blog-flow-08-streaming-dead-letter-queue.svg";
  if (d.includes("account") && d.includes("tier") && d.includes("routing")) return "blog-flow-09-account-tier-routing.svg";
  if (d.includes("training") && d.includes("model")) return "blog-flow-10-training-data-model-quality.svg";
  if (d.includes("dedup") && d.includes("strategy") && d.includes("cycle")) return "blog-flow-11-dedup-strategy-cycle.svg";
  if (d.includes("prevention") && d.includes("reactive") && d.includes("approach")) return "blog-flow-12-prevention-vs-reactive.svg";
  if (d.includes("presend") || (d.includes("pre-send") && d.includes("quality"))) return "blog-flow-13-presend-quality-check.svg";
  if (d.includes("dead letter") && d.includes("alert")) return "blog-flow-14-dead-letter-queue-alert.svg";
  if (d.includes("lineage")) return "blog-flow-15-data-lineage.svg";
  if (d.includes("mdm") || d.includes("golden record") || d.includes("master data")) return "blog-flow-16-mdm-golden-record.svg";
  if (d.includes("hr") && (d.includes("termination") || d.includes("offboarding"))) return "blog-flow-17-hr-termination-gap.svg";
  if (d.includes("null") && d.includes("entry point")) return "blog-flow-18-null-entry-points.svg";
  if (d.includes("three") && (d.includes("system") || d.includes("unif"))) return "blog-flow-19-three-system-unification.svg";
  if (d.includes("list") && d.includes("import") && d.includes("dedup")) return "blog-flow-20-list-import-dedup.svg";
  if (d.includes("analyst") && d.includes("workflow")) return "blog-flow-21-analyst-workflow.svg";
  if (d.includes("raw") && d.includes("csv") && d.includes("clean")) return "blog-flow-22-raw-csv-to-clean.svg";
  if (d.includes("proactive") && d.includes("reactive")) return "blog-flow-23-proactive-vs-reactive.svg";
  if (d.includes("integration") && d.includes("checkpoint")) return "blog-flow-24-integration-checkpoints.svg";
  if (d.includes("validation") && d.includes("layer")) return "blog-flow-25-validation-layer.svg";

  // ── Before/after comparisons ───────────────────────────────────────────────
  if ((d.includes("dirty") && d.includes("clean")) || (d.includes("before") && d.includes("after") && d.includes("data"))) return "blog-ba-01-dirty-vs-clean.svg";
  if (d.includes("phone") && (d.includes("normaliz") || d.includes("format") || d.includes("standard"))) return "blog-ba-02-phone-normalization.svg";
  if (d.includes("address") && (d.includes("normaliz") || d.includes("standard")) && !d.includes("usps")) return "blog-ba-03-address-normalization.svg";
  if (d.includes("duplicate") && (d.includes("contact") || d.includes("merged") || d.includes("merge"))) return "blog-ba-04-duplicate-contacts-merged.svg";
  if (d.includes("state") && (d.includes("iso") || d.includes("abbreviat"))) return "blog-ba-05-state-iso-normalization.svg";
  if (d.includes("encoding") || d.includes("character encoding")) return "blog-ba-06-encoding-fix.svg";
  if (d.includes("enrichment") || d.includes("enrich")) return "blog-ba-07-contact-enrichment.svg";
  if (d.includes("schema") && d.includes("mismatch")) return "blog-ba-08-schema-mismatch.svg";
  if (d.includes("date") && (d.includes("format") || d.includes("standard"))) return "blog-ba-09-date-format-variants.svg";
  if (d.includes("order") && d.includes("id") && d.includes("format")) return "blog-ba-10-order-id-format-validation.svg";
  if (d.includes("cross") && d.includes("field") && d.includes("fail")) return "blog-ba-11-cross-field-failure.svg";
  if (d.includes("usps") || (d.includes("address") && d.includes("usps"))) return "blog-ba-12-usps-address-normalization.svg";

  // ── Charts ─────────────────────────────────────────────────────────────────
  if (d.includes("quality score") && d.includes("decline")) return "blog-chart-01-quality-score-decline.svg";
  if (d.includes("order") && d.includes("status") && d.includes("distribution")) return "blog-chart-02-order-status-distribution.svg";
  if (d.includes("z-score") || d.includes("zscore") || d.includes("bell curve") || d.includes("normal distribution")) return "blog-chart-03-zscore-bell-curve.svg";
  if (d.includes("null rate") && d.includes("heatmap")) return "blog-chart-04-null-rate-heatmap.svg";
  if (d.includes("pipeline") && d.includes("detection") && d.includes("cost")) return "blog-chart-05-pipeline-detection-cost.svg";
  if (d.includes("problem") && d.includes("cost")) return "blog-chart-06-dq-problem-cost.svg";
  if (d.includes("cleanup") && d.includes("maintenance")) return "blog-chart-07-cleanup-vs-maintenance.svg";
  if (d.includes("three") && d.includes("metric")) return "blog-chart-08-three-dq-metrics.svg";
  if (d.includes("email") && d.includes("list") && d.includes("funnel")) return "blog-chart-09-email-list-funnel.svg";
  if (d.includes("address") && d.includes("validation") && d.includes("funnel")) return "blog-chart-10-address-validation-funnel.svg";
  if (d.includes("bounce") && d.includes("source")) return "blog-chart-11-email-bounce-sources.svg";
  if (d.includes("drift") && (d.includes("schema") || d.includes("statistical"))) return "blog-chart-12-schema-vs-statistical-drift.svg";
  if (d.includes("maturity") && d.includes("model")) return "blog-chart-13-maturity-model.svg";
  if (d.includes("prevention") && d.includes("cost") && d.includes("comparison")) return "blog-chart-14-prevention-cost-comparison.svg";
  if (d.includes("threshold") && d.includes("zone")) return "blog-chart-15-quality-threshold-zones.svg";
  if (d.includes("status") && d.includes("field") && d.includes("variant")) return "blog-chart-16-status-field-variants.svg";
  if (d.includes("industry") && d.includes("field") && d.includes("standard")) return "blog-chart-17-industry-field-standardization.svg";

  // ── Tables / dashboard mockups ─────────────────────────────────────────────
  if (d.includes("data profile") && (d.includes("report") || d.includes("field"))) return "blog-table-01-data-profile-report.svg";
  if (d.includes("scorecard")) return "blog-table-02-dq-scorecard.svg";
  if (d.includes("rule") && (d.includes("definition") || d.includes("template"))) return "blog-table-03-rule-definition-template.svg";
  if (d.includes("threshold") && d.includes("dashboard")) return "blog-table-04-quality-threshold-dashboard.svg";
  if (d.includes("observability") && d.includes("dashboard")) return "blog-table-05-observability-dashboard.svg";
  if (d.includes("migration") && d.includes("quality")) return "blog-table-06-premigration-quality-dashboard.svg";
  if (d.includes("data dictionary") || d.includes("schema") && d.includes("dictionary")) return "blog-table-07-data-dictionary.svg";
  if (d.includes("tiered") && d.includes("threshold")) return "blog-table-08-tiered-thresholds.svg";
  if (d.includes("vendor") && d.includes("master")) return "blog-table-09-vendor-master-dedup.svg";
  if (d.includes("product") && d.includes("id") && d.includes("mapping")) return "blog-table-10-product-id-mapping.svg";
  if (d.includes("pivot") || (d.includes("case") && d.includes("variant"))) return "blog-table-11-pivot-case-variants.svg";
  if (d.includes("ai rule builder") || (d.includes("ai") && d.includes("rule") && d.includes("builder"))) return "blog-table-12-ai-rule-builder.svg";
  if (d.includes("dq") && d.includes("behavior") && d.includes("score")) return "blog-table-13-dq-vs-behavior-score.svg";
  if (d.includes("behavioral") && d.includes("blind")) return "blog-table-14-behavioral-scoring-blindspots.svg";

  // ── Venn / funnel ──────────────────────────────────────────────────────────
  if (d.includes("governance") && d.includes("quality") && (d.includes("venn") || d.includes("overlap"))) return "blog-venn-01-governance-quality-venn.svg";
  if (d.includes("accuracy") && d.includes("within")) return "blog-venn-02-accuracy-within-dq.svg";
  if (d.includes("database") && d.includes("merge") && d.includes("complex")) return "blog-venn-03-database-merge-complexity.svg";
  if (d.includes("management") && d.includes("wheel")) return "blog-venn-04-data-management-wheel.svg";
  if (d.includes("prevention") && d.includes("detective")) return "blog-funnel-01-prevention-vs-detective.svg";
  if (d.includes("priority") && d.includes("matrix")) return "blog-funnel-02-priority-matrix.svg";
  if (d.includes("recovery") && d.includes("spectrum")) return "blog-funnel-03-recovery-spectrum.svg";
  if (d.includes("ai") && d.includes("automation") && d.includes("suitab")) return "blog-funnel-04-ai-automation-suitability.svg";

  // ── Broad fallback matches (lower specificity) ─────────────────────────────
  if (d.includes("workflow") || d.includes("pipeline") || d.includes("flow diagram")) return "blog-flow-01-automated-dq-workflow.svg";
  if (d.includes("before") && d.includes("after")) return "blog-ba-01-dirty-vs-clean.svg";
  if (d.includes("bar chart") || d.includes("chart") || d.includes("graph")) return "blog-chart-08-three-dq-metrics.svg";
  if (d.includes("heatmap")) return "blog-chart-04-null-rate-heatmap.svg";
  if (d.includes("funnel")) return "blog-chart-09-email-list-funnel.svg";
  if (d.includes("table") || d.includes("dashboard") || d.includes("screenshot")) return "blog-table-01-data-profile-report.svg";
  if (d.includes("venn") || d.includes("overlap") || d.includes("diagram")) return "blog-venn-01-governance-quality-venn.svg";

  return null;
}
