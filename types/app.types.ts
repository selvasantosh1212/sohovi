// ============================================================
// Sohovi Application Types
// ============================================================

export interface BusinessUnit {
  id: string;
  clerk_user_id: string;
  name: string;
  description: string | null;
  owner_name: string | null;
  owner_email: string | null;
  created_at: string;
  updated_at: string;
  // Aggregated (not in DB, computed client-side from joins)
  catalog_count?: number;
  latest_dq_score?: number | null;
}

export interface Catalog {
  id: string;
  business_unit_id: string;
  clerk_user_id: string;
  name: string;
  description: string | null;
  owner_name: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  business_unit?: Pick<BusinessUnit, "id" | "name">;
  asset_count?: number;
  latest_dq_score?: number | null;
}

export interface DataAsset {
  id: string;
  catalog_id: string;
  clerk_user_id: string;
  name: string;
  source_system: string | null;
  upstream_file_name: string | null;
  purpose: string | null;
  business_meaning: string | null;
  owner_name: string | null;
  owner_email: string | null;
  latest_run_id: string | null;
  latest_dq_score: number | null;
  column_schema: string[] | null;
  created_at: string;
  updated_at: string;
  // Joined
  catalog?: Pick<Catalog, "id" | "name">;
}

export interface AssetRun {
  id: string;
  asset_id: string;
  clerk_user_id: string;
  run_at: string;
  file_name: string;
  file_size_bytes: number | null;
  row_count: number | null;
  column_count: number | null;
  overall_dq_score: number | null;
  schema_changed: boolean;
  schema_diff: SchemaDiff | null;
  workflow_id: string | null;
  status: "completed" | "failed" | "processing" | "profiled";
  notes: string | null;
  behavior_score: number | null;
  behavior_flags: import("./dq.types").BehaviorFlag[] | null;
  runs_compared: number | null;
}

export interface SchemaDiff {
  added: string[];
  removed: string[];
  renamed: { from: string; to: string }[];
}

export interface DQRule {
  id: string;
  asset_id: string;
  clerk_user_id: string;
  column_name: string | null;
  dimension: DQDimension;
  rule_type: string;
  parameters: Record<string, unknown>;
  threshold: number;
  weight: number;
  is_active: boolean;
  is_suggested: boolean;
  created_at: string;
  updated_at: string;
}

export type DQDimension =
  | "completeness"
  | "accuracy"
  | "consistency"
  | "validity"
  | "uniqueness"
  | "integrity"
  | "timeliness"
  | "currency"
  | "conformity"
  | "precision";

export interface DQScore {
  id: string;
  run_id: string;
  asset_id: string;
  column_name: string;
  dimension: DQDimension;
  rule_type: string;
  score: number;
  threshold: number | null;
  status: "pass" | "fail";
  severity: "low" | "medium" | "high" | null;
  total_records: number | null;
  failed_records: number | null;
  message: string | null;
  created_at: string;
}

export interface ProfilingSummary {
  id: string;
  run_id: string;
  asset_id: string;
  column_name: string;
  inferred_type: string | null;
  row_count: number | null;
  null_count: number | null;
  null_pct: number | null;
  unique_count: number | null;
  unique_pct: number | null;
  min_value: string | null;
  max_value: string | null;
  avg_value: number | null;
  std_dev: number | null;
  min_length: number | null;
  max_length: number | null;
  avg_length: number | null;
  top_values: ValueFrequency[] | null;
  bottom_values: ValueFrequency[] | null;
  value_frequency: ValueFrequency[] | null;
  pattern_summary: PatternEntry[] | null;
  pii_detected: boolean;
  pii_type: string | null;
  outlier_count: number | null;
  sample_values: unknown[] | null;
  created_at: string;
}

export interface ValueFrequency {
  value: string;
  count: number;
  pct: number;
}

export interface PatternEntry {
  pattern: string;
  count: number;
  pct: number;
}

export interface Workflow {
  id: string;
  asset_id: string;
  clerk_user_id: string;
  name: string;
  description: string | null;
  column_mappings: Record<string, string>;
  is_active: boolean;
  run_count: number;
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  asset_id: string;
  clerk_user_id: string;
  name: string;
  condition: "score_drop" | "schema_change" | "rule_failure" | "anomaly";
  threshold_value: number | null;
  dimension: DQDimension | null;
  column_name: string | null;
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
}

export interface AlertEvent {
  id: string;
  alert_id: string;
  run_id: string;
  triggered_at: string;
  message: string | null;
  is_read: boolean;
}

export interface BlogPost {
  id: string;
  clerk_user_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  tags: string[];
  category: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  key_takeaways: string[];
  faqs: { q: string; a: string }[];
  post_type: 'how-to' | 'explainer' | 'listicle' | 'review' | null;
  pull_quote: string | null;
  internal_links: { href: string; title: string }[];
  author_name: string | null;
  author_role: string | null;
  author_bio: string | null;
  published: boolean;
  published_at: string | null;
  view_count: number;
  read_time_min: number | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Form input types (subset of DB types)
// ============================================================

export interface BusinessUnitInput {
  name: string;
  description?: string;
  owner_name?: string;
  owner_email?: string;
}

export interface CatalogInput {
  business_unit_id: string;
  name: string;
  description?: string;
  owner_name?: string;
}

export interface DataAssetInput {
  catalog_id: string;
  name: string;
  source_system?: string;
  upstream_file_name?: string;
  purpose?: string;
  business_meaning?: string;
  owner_name?: string;
  owner_email?: string;
}
