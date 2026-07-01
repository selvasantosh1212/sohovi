import type { ColumnProfile } from "@/types/profiling.types";
import type { DQDimension } from "@/types/app.types";
import type { DQGlossaryEntry, SuggestedRule } from "@/types/dq.types";
import { suggestRules } from "@/lib/ml/rule-suggester";
import { DIMENSION_DEFINITIONS } from "@/lib/dq-engine/dimension-meta";

function mergeReasons(group: SuggestedRule[]): string {
  const distinct = Array.from(new Set(group.map((g) => g.reason.trim())));
  return distinct.map((r) => (r.endsWith(".") ? r : `${r}.`)).join(" ");
}

/** Aggregates rule-suggester output by column + dimension, for the DQ Glossary (UI + export). */
export function buildDQGlossary(profiles: ColumnProfile[]): DQGlossaryEntry[] {
  const suggestions = suggestRules(profiles);

  const byColumn = new Map<string, SuggestedRule[]>();
  for (const s of suggestions) {
    const arr = byColumn.get(s.column_name) ?? [];
    arr.push(s);
    byColumn.set(s.column_name, arr);
  }

  const entries: DQGlossaryEntry[] = [];

  for (const profile of profiles) {
    const colSuggestions = byColumn.get(profile.column_name) ?? [];

    const byDimension = new Map<DQDimension, SuggestedRule[]>();
    for (const s of colSuggestions) {
      const arr = byDimension.get(s.dimension) ?? [];
      arr.push(s);
      byDimension.set(s.dimension, arr);
    }

    const dimEntries: DQGlossaryEntry[] = Array.from(byDimension.entries()).map(
      ([dimension, group]) => ({
        column_name: profile.column_name,
        dimension,
        definition: DIMENSION_DEFINITIONS[dimension],
        rationale: mergeReasons(group),
        confidence: Math.max(...group.map((g) => g.confidence)),
        rule_types: Array.from(new Set(group.map((g) => g.rule_type))),
      })
    );

    dimEntries.sort((a, b) => b.confidence - a.confidence);
    entries.push(...dimEntries);
  }

  return entries;
}
