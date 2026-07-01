/**
 * ruleBuilderUIStore.ts
 *
 * Zustand store that syncs the "selected column" across the Rules page
 * widgets (DataPreviewTable, RuleBuilderPanel, RuleSuggestionsPanel) so
 * clicking a column in the data preview pre-fills the Add Rule form and
 * filters AI suggestions, instead of each widget owning a separate copy
 * of "add a rule for this column" UI. Session-only, same pattern as
 * fileStore/profilingStore/globalScopeFilterStore.
 */

import { create } from "zustand";

interface RuleBuilderUIState {
  selectedColumn: string | null;
  setSelectedColumn: (column: string | null) => void;
}

export const useRuleBuilderUIStore = create<RuleBuilderUIState>()((set) => ({
  selectedColumn: null,
  setSelectedColumn: (column) => set({ selectedColumn: column }),
}));
