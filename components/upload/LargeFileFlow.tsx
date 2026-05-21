"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { useLargeFileProcessor } from "@/hooks/useLargeFileProcessor";

const ACCEPTED_EXT = [".csv", ".xlsx", ".xls", ".ods", ".xlsm"];
const MAX_BULK_BYTES = 1024 * 1024 * 1024; // 1 GB

interface LargeFileFlowProps {
  assetId: string;
  assetName: string;
}

// ── Drop zone ─────────────────────────────────────────────────────────────────

function BulkDropZone({ onFile }: { onFile: (f: File) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const validate = (file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_EXT.includes(ext))
      return `Unsupported file type. Upload: ${ACCEPTED_EXT.join(", ")}`;
    if (file.size > MAX_BULK_BYTES)
      return `File is too large (${(file.size / 1024 / 1024 / 1024).toFixed(1)} GB). Max 1 GB.`;
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) { setFileError(err); return; }
      setFileError(null);
      onFile(file);
    },
    [onFile]
  );

  return (
    <div className="space-y-3">
      <label
        className={[
          "relative flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed p-[72px_24px] cursor-pointer transition-all duration-200 overflow-hidden",
          dragActive ? "border-[#1E3A5F]" : "border-slate-200 hover:border-slate-300",
        ].join(" ")}
        style={{
          background: dragActive
            ? "radial-gradient(ellipse 80% 100% at 50% 50%, #DDEEFF, #fff)"
            : undefined,
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
      >
        {!dragActive && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(30,58,95,0.06), transparent 70%)",
            }}
          />
        )}

        <input
          type="file"
          accept={ACCEPTED_EXT.join(",")}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />

        <div className="relative text-center">
          <div
            className="w-[72px] h-[72px] rounded-[20px] inline-flex items-center justify-center mb-[22px]"
            style={{ background: "#1E3A5F" }}
          >
            <Layers className="w-[26px] h-[26px] text-white" />
          </div>
          <h3
            className="text-[22px] font-bold m-0 mb-2"
            style={{ letterSpacing: "-0.02em", color: "#0A0A0F" }}
          >
            {dragActive ? "Drop your large file here" : "Drop your large file here"}
          </h3>
          <p className="text-[14px] text-slate-500 mb-[22px]">
            or{" "}
            <span
              className="font-semibold underline underline-offset-[3px]"
              style={{ color: "#1E3A5F" }}
            >
              browse your computer
            </span>
          </p>
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[12px] font-medium text-slate-500"
            style={{ background: "#F1F5F9" }}
          >
            .csv · .xlsx · .xls · up to 1 GB · Business plan
          </div>
        </div>
      </label>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Auto-chunked", sub: "500k rows per chunk", bg: "#EFF6FF", color: "#1E3A5F" },
          { label: "Profiles merged", sub: "Exact combined stats", bg: "#F0FDF4", color: "#166534" },
          { label: "DQ on sample", sub: "50k rows for rules", bg: "#FFF7ED", color: "#9A3412" },
        ].map((c) => (
          <div
            key={c.label}
            className="p-4 rounded-xl border"
            style={{ background: c.bg, borderColor: "rgba(10,10,15,0.04)" }}
          >
            <UploadCloud className="w-4 h-4 mb-2" style={{ color: c.color }} />
            <p className="text-[13px] font-bold text-slate-800 leading-tight">{c.label}</p>
            <p className="text-[11px] mt-0.5 font-medium" style={{ color: c.color }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {fileError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {fileError}
        </div>
      )}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function BulkProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${value}%`, background: "#1E3A5F" }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function LargeFileFlow({ assetId, assetName }: LargeFileFlowProps) {
  const { state, start, reset } = useLargeFileProcessor();

  const handleFile = useCallback(
    (file: File) => {
      start(file, assetId);
    },
    [assetId, start]
  );

  const isIdle = state.phase === "idle";
  const isProcessing =
    state.phase === "splitting" ||
    state.phase === "profiling" ||
    state.phase === "merging";
  const isDone = state.phase === "done";
  const hasError = state.phase === "error";

  // ── Chunk label ──────────────────────────────────────────────────────────
  const chunkLabel = () => {
    if (state.totalChunks > 0) return `Chunk ${state.currentChunk} of ${state.totalChunks}`;
    return `Chunk ${state.currentChunk}`;
  };

  // ── Phase label ──────────────────────────────────────────────────────────
  const phaseLabel = () => {
    if (state.phase === "splitting") return `Splitting file — ${chunkLabel()}…`;
    if (state.phase === "profiling") {
      const colPart = state.currentColumn ? ` · ${state.currentColumn}` : "";
      return `Profiling ${chunkLabel()}${colPart}…`;
    }
    if (state.phase === "merging") return "Merging chunk profiles…";
    return "";
  };

  return (
    <div className="space-y-6">
      <Link
        href={`/dashboard/assets/${assetId}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-3.5 h-3.5" />Back to {assetName}
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bulk File</h1>
        <p className="text-slate-500 mt-1">
          Upload files up to 1 GB. The file is split into chunks, each profiled in-browser and
          merged into a single result. Nothing is sent to any server.
        </p>
      </div>

      {isIdle && <BulkDropZone onFile={handleFile} />}

      {isProcessing && (
        <div className="rounded-xl border border-slate-100 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-700 truncate">{phaseLabel()}</p>
              {state.phase === "profiling" && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Column {state.columnProgress}% · overall {state.overallProgress}%
                </p>
              )}
            </div>
            <span className="ml-auto text-sm font-semibold text-slate-500 shrink-0">
              {state.overallProgress}%
            </span>
          </div>
          <BulkProgressBar value={state.overallProgress} />
          <p className="text-xs text-amber-600 flex items-center gap-1.5">
            <span>⚠</span> Large file — processing in chunks. This may take a few minutes.
          </p>
        </div>
      )}

      {isDone && (
        <div className="space-y-6">
          <div
            className="rounded-xl p-6 flex items-start gap-3"
            style={{
              background: "rgba(30,58,95,0.05)",
              border: "1px solid rgba(30,58,95,0.15)",
            }}
          >
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#1E3A5F" }} />
            <div>
              <p className="font-semibold text-slate-800">Bulk profiling complete</p>
              <p className="text-sm text-slate-500 mt-0.5">
                {state.totalRows.toLocaleString()} total rows ·{" "}
                {state.totalChunks} chunk{state.totalChunks !== 1 ? "s" : ""} processed ·
                profiles merged · 50k-row sample ready for DQ
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/dashboard/assets/${assetId}/profile`}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90"
              style={{ background: "#1E3A5F" }}
            >
              <Eye className="w-4 h-4" />
              View Profiling Results
            </Link>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Upload Different File
            </button>
          </div>
        </div>
      )}

      {hasError && (
        <div className="space-y-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-red-700">Bulk processing failed</p>
              <p className="text-sm text-red-600 mt-0.5">{state.error ?? "An unknown error occurred."}</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
