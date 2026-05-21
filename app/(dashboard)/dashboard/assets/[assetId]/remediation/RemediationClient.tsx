"use client";

import { useState, useCallback } from "react";
import { useDQStore } from "@/store/dqStore";
import { useFileStore } from "@/store/fileStore";
import { RemediationPanel } from "@/components/remediation/RemediationPanel";
import { ExportCleanedFile } from "@/components/remediation/ExportCleanedFile";
import Link from "next/link";
import { Play, Upload, ChevronRight } from "lucide-react";

interface Props {
  assetId: string;
  assetName: string;
  fileName?: string;
}

export function RemediationClient({ assetId, assetName, fileName }: Props) {
  const dqResult = useDQStore((s) => s.result);
  const fileData = useFileStore((s) => s.data);
  const [excludedIndices, setExcludedIndices] = useState<Set<number>>(new Set());
  // fixedRows is a mutable in-memory copy that data fix actions can modify
  const [fixedRows, setFixedRows] = useState<(string | null)[][] | null>(null);

  const rows = fixedRows ?? fileData?.rows ?? [];

  const handleApplyFix = useCallback(
    (columnName: string, transform: (value: string | null) => string | null) => {
      const base = fixedRows ?? fileData?.rows ?? [];
      const headers = fileData?.headers ?? [];
      const colIdx = headers.indexOf(columnName);
      if (colIdx < 0) return;
      const updated = base.map((row) => {
        const copy = [...row];
        copy[colIdx] = transform(copy[colIdx]);
        return copy;
      });
      setFixedRows(updated);
    },
    [fixedRows, fileData]
  );

  if (!fileData) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-3">
        <Upload className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-slate-600 font-medium">No file data in memory</p>
        <p className="text-sm text-slate-400">
          Upload a file first — remediation works with your in-memory data.
        </p>
        <Link
          href={`/dashboard/assets/${assetId}/upload`}
          className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-[#1E3A5F] hover:underline"
        >
          Upload file →
        </Link>
      </div>
    );
  }

  if (!dqResult || dqResult.asset_id !== assetId) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-3">
        <Play className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-slate-600 font-medium">No DQ results in memory</p>
        <p className="text-sm text-slate-400">
          Run a DQ check on this asset first, then come back here to remediate.
        </p>
        <Link
          href={`/dashboard/assets/${assetId}/rules`}
          className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-[#1E3A5F] hover:underline"
        >
          Go to Rules →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* How it works — 3-step explainer */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">How Remediation Works</p>
        <div className="flex items-start gap-2 flex-wrap sm:flex-nowrap">
          {[
            { step: "1", label: "Review suggestions", desc: "Each failed rule shows what went wrong and how to fix it." },
            { step: "2", label: "Apply fixes or exclude rows", desc: "Fix values in-memory (fill nulls, change case) or remove bad rows." },
            { step: "3", label: "Export clean file", desc: "Download your corrected dataset as CSV or Excel — nothing is sent to any server." },
          ].map(({ step, label, desc }, i, arr) => (
            <div key={step} className="flex items-start gap-3 flex-1 min-w-0">
              <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#1E3A5F" }}>
                {step}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
              {i < arr.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1.5 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      <RemediationPanel
        result={dqResult}
        headers={fileData.headers}
        rows={rows}
        onExcludeRows={setExcludedIndices}
        onApplyFix={handleApplyFix}
      />

      <ExportCleanedFile
        headers={fileData.headers}
        rows={rows}
        excludedIndices={excludedIndices}
        fileName={fileName ?? fileData.fileName}
      />
    </div>
  );
}
