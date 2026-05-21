"use client";

import { useProfilingStore } from "@/store/profilingStore";
import { ShieldAlert, X } from "lucide-react";
import { useState } from "react";

/**
 * Shown after profiling completes when one or more columns contain PII.
 * Appears inside UploadFlow — purely client-side, no server round-trip needed.
 */
export function PIIDetectionBanner() {
  const profiles = useProfilingStore((s) => s.profiles);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !profiles) return null;

  const piiColumns = profiles.filter((c) => c.pii_detected);
  if (piiColumns.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-3 rounded-xl border px-4 py-3"
      style={{ background: "#fffbeb", borderColor: "#f59e0b" }}
    >
      <ShieldAlert
        className="w-5 h-5 flex-shrink-0 mt-0.5"
        style={{ color: "#b45309" }}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: "#92400e" }}>
          PII detected in {piiColumns.length} column{piiColumns.length !== 1 ? "s" : ""}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#b45309" }}>
          Columns:{" "}
          <span className="font-medium">
            {piiColumns
              .map((c) => `${c.column_name}${c.pii_type ? ` (${c.pii_type})` : ""}`)
              .join(", ")}
          </span>
          . Raw values were masked during profiling — only aggregated stats are stored.
          Review before sharing these results.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 p-1 rounded-lg transition-colors hover:bg-amber-100"
        aria-label="Dismiss PII warning"
      >
        <X className="w-4 h-4" style={{ color: "#b45309" }} aria-hidden="true" />
      </button>
    </div>
  );
}
