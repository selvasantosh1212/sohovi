/**
 * fileStore.ts
 *
 * Zustand store for parsed file data.
 * PRIVACY: rows are kept entirely in JS heap — never persisted to localStorage,
 * sessionStorage, or any server. Data disappears on page reload.
 */

import { create } from "zustand";
import type { ParsedData } from "@/types/profiling.types";

export interface SchemaDiff {
  added: string[];
  removed: string[];
  renamed: { from: string; to: string }[];
}

interface FileState {
  data: ParsedData | null;
  /** Schema diff computed when a profiling snapshot is saved (new vs previous column_schema) */
  schemaDiff: SchemaDiff | null;
  /** Set parsed file data (called after file-parser worker completes) */
  setData: (data: ParsedData) => void;
  /** Store the schema diff returned from saveProfilingSnapshot */
  setSchemaDiff: (diff: SchemaDiff | null) => void;
  /** Clear all file data (e.g. when navigating away or re-uploading) */
  clear: () => void;
  /**
   * Re-slice parsed data to use a different row as the column header.
   * rowIndex refers to the index in previewRows (0 = original header, no-op).
   * Rows before the selected header row are dropped (treated as metadata).
   */
  reapplyHeader: (rowIndex: number) => void;
}

export const useFileStore = create<FileState>()((set) => ({
  data: null,
  schemaDiff: null,
  setData: (data) => set({ data }),
  setSchemaDiff: (diff) => set({ schemaDiff: diff }),
  clear: () => set({ data: null, schemaDiff: null }),
  reapplyHeader: (rowIndex: number) =>
    set((state) => {
      if (!state.data || !state.data.previewRows || rowIndex === 0) return state;
      const { previewRows, rows, totalRows } = state.data;
      if (rowIndex >= previewRows.length) return state;
      const newHeaders = previewRows[rowIndex].map((v) => String(v ?? "").trim());
      // data.rows[0] = previewRows[1], so data.rows[rowIndex-1] = previewRows[rowIndex] (the new header)
      // We want data starting at data.rows[rowIndex] = previewRows[rowIndex+1]
      const newRows = rows.slice(rowIndex);
      return {
        data: {
          ...state.data,
          headers: newHeaders,
          rows: newRows,
          totalRows: Math.max(0, totalRows - rowIndex),
        },
      };
    }),
}));
