/**
 * fileStore.ts
 *
 * Zustand store for parsed file data.
 * PRIVACY: rows are kept entirely in JS heap — never persisted to localStorage,
 * sessionStorage, or any server. Data disappears on page reload.
 */

import { create } from "zustand";
import type { ParsedData } from "@/types/profiling.types";
import type { ScopeCondition } from "@/types/dq.types";

export interface SchemaDiff {
  added: string[];
  removed: string[];
  renamed: { from: string; to: string }[];
}

interface FileState {
  data: ParsedData | null;
  /** Schema diff computed when a profiling snapshot is saved (new vs previous column_schema) */
  schemaDiff: SchemaDiff | null;
  /** Workflow that was active when the file was uploaded (carried through to save-to-history) */
  workflowId: string | null;
  /** True row count from the original parse/connect/bulk-process, captured once by
   *  setData() and never touched by applyScopeFilter — used to show "X of Y" once a
   *  scope filter has narrowed data.totalRows below the original count. */
  originalTotalRows: number | null;
  /** Scope filter currently in effect on data.rows/data.totalRows. Empty = unfiltered.
   *  This is the single source of truth for "is this asset's working dataset scoped" —
   *  the Rules page and DQ run need no scope-filter awareness of their own. */
  appliedScopeConditions: ScopeCondition[];
  /** Set parsed file data (called after file-parser worker completes) */
  setData: (data: ParsedData) => void;
  /** Store the schema diff returned from saveProfilingSnapshot */
  setSchemaDiff: (diff: SchemaDiff | null) => void;
  /** Store the active workflow ID (set when upload page is opened with ?workflowId=) */
  setWorkflowId: (workflowId: string | null) => void;
  /** Clear all file data (e.g. when navigating away or re-uploading) */
  clear: () => void;
  /**
   * Re-slice parsed data to use a different row as the column header.
   * rowIndex refers to the index in previewRows (0 = original header, no-op).
   * Rows before the selected header row are dropped (treated as metadata).
   */
  reapplyHeader: (rowIndex: number) => void;
  /**
   * Replace the working dataset with a filtered subset of its own rows — becomes
   * canonical for every downstream reader (profiling, Rules page, DQ run worker).
   * There is no undo; re-upload/re-fetch is the way back to the full dataset.
   */
  applyScopeFilter: (filteredRows: (string | null)[][], conditions: ScopeCondition[]) => void;
}

export const useFileStore = create<FileState>()((set) => ({
  data: null,
  schemaDiff: null,
  workflowId: null,
  originalTotalRows: null,
  appliedScopeConditions: [],
  setData: (data) =>
    set({ data, originalTotalRows: data.totalRows, appliedScopeConditions: [] }),
  setSchemaDiff: (diff) => set({ schemaDiff: diff }),
  setWorkflowId: (workflowId) => set({ workflowId }),
  clear: () =>
    set({
      data: null,
      schemaDiff: null,
      workflowId: null,
      originalTotalRows: null,
      appliedScopeConditions: [],
    }),
  reapplyHeader: (rowIndex: number) =>
    set((state) => {
      if (!state.data || !state.data.previewRows || rowIndex === 0) return state;
      const { previewRows, rows, totalRows } = state.data;
      if (rowIndex >= previewRows.length) return state;
      const newHeaders = previewRows[rowIndex].map((v) => String(v ?? "").trim());
      // data.rows[0] = previewRows[1], so data.rows[rowIndex-1] = previewRows[rowIndex] (the new header)
      // We want data starting at data.rows[rowIndex] = previewRows[rowIndex+1]
      const newRows = rows.slice(rowIndex);
      const newTotalRows = Math.max(0, totalRows - rowIndex);
      return {
        data: {
          ...state.data,
          headers: newHeaders,
          rows: newRows,
          totalRows: newTotalRows,
        },
        originalTotalRows: newTotalRows,
        appliedScopeConditions: [],
      };
    }),
  applyScopeFilter: (filteredRows, conditions) =>
    set((state) => {
      if (!state.data) return state;
      return {
        data: { ...state.data, rows: filteredRows, totalRows: filteredRows.length },
        appliedScopeConditions: conditions,
      };
    }),
}));
