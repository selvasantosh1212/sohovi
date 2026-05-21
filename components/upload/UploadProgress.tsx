"use client";

import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Stage = "parsing" | "profiling" | "done" | "error";

interface UploadProgressProps {
  stage: Stage;
  parseProgress?: number;
  profileProgress?: number;
  currentColumn?: string | null;
  columnsProcessed?: number;
  totalColumns?: number;
  fileName?: string;
  totalRows?: number;
  sampleMode?: boolean;
  error?: string | null;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${value}%`, background: "#00C9A7" }}
      />
    </div>
  );
}

export function UploadProgress({
  stage,
  parseProgress = 0,
  profileProgress = 0,
  currentColumn,
  columnsProcessed = 0,
  totalColumns = 0,
  fileName,
  totalRows,
  sampleMode,
  error,
}: UploadProgressProps) {
  if (stage === "error") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
        <div>
          <p className="font-medium text-red-700">Processing failed</p>
          <p className="text-sm text-red-600 mt-0.5">{error ?? "An unknown error occurred."}</p>
        </div>
      </div>
    );
  }

  if (stage === "done") {
    return (
      <div
        className="rounded-xl p-6 flex items-start gap-3"
        style={{
          background: "rgba(0,201,167,0.06)",
          border: "1px solid rgba(0,201,167,0.25)",
        }}
      >
        <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#00C9A7" }} />
        <div>
          <p className="font-semibold text-slate-800">Profiling complete</p>
          {totalRows !== undefined && (
            <p className="text-sm text-slate-500 mt-0.5">
              {totalRows.toLocaleString()} rows · {totalColumns} columns
              {sampleMode && " · sampled (first 50 k rows)"}
            </p>
          )}
        </div>
      </div>
    );
  }

  const isParsing = stage === "parsing";
  const progress = isParsing ? parseProgress : profileProgress;
  const label = isParsing ? "Parsing file…" : "Profiling columns…";
  const detail = isParsing
    ? fileName
    : currentColumn
    ? `Column ${columnsProcessed}/${totalColumns}: ${currentColumn}`
    : `${columnsProcessed}/${totalColumns} columns`;

  return (
    <div className="rounded-xl border border-slate-100 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400 shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-slate-700">{label}</p>
          {detail && <p className="text-xs text-slate-400 truncate mt-0.5">{detail}</p>}
        </div>
        <span className="ml-auto text-sm font-semibold text-slate-500 shrink-0">
          {Math.round(progress)}%
        </span>
      </div>
      <ProgressBar value={progress} />
      {sampleMode && (
        <p className="text-xs text-amber-600 flex items-center gap-1.5">
          <span>⚠</span> Large file detected — analysing a random 50 000-row sample
        </p>
      )}
    </div>
  );
}
