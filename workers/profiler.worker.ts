/// <reference lib="webworker" />
/**
 * profiler.worker.ts
 *
 * Profiles each column of a parsed dataset entirely in-browser.
 * Runs profileColumn() on each column sequentially, posting progress.
 */

import { profileColumn } from "@/lib/profiling/profiler";
import type { ProfileCommand, ProfileResponse } from "@/types/profiling.types";

function post(msg: ProfileResponse) {
  self.postMessage(msg);
}

self.onmessage = (e: MessageEvent<ProfileCommand>) => {
  if (e.data.type !== "PROFILE") return;

  const { headers, rows } = e.data.payload;

  try {
    const profiles = headers.map((colName, colIndex) => {
      // Extract all values for this column
      const values = rows.map((row) => row[colIndex] ?? null);

      post({
        type: "PROFILE_PROGRESS",
        payload: { columnIndex: colIndex, totalColumns: headers.length, columnName: colName },
      });

      return profileColumn(colName, values);
    });

    post({ type: "PROFILE_COMPLETE", payload: { profiles } });
  } catch (err) {
    post({
      type: "PROFILE_ERROR",
      payload: { message: err instanceof Error ? err.message : "Unknown profiling error" },
    });
  }
};
