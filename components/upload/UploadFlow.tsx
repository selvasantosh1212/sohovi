"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, CheckCircle2 } from "lucide-react";
import { FileDropZone } from "./FileDropZone";
import { UploadProgress } from "./UploadProgress";
import { ColumnComparisonTable } from "./ColumnComparisonTable";
import { PIIDetectionBanner } from "./PIIDetectionBanner";
import { PlanGate } from "@/components/shared/PlanGate";
import { HeaderRowSelector } from "./HeaderRowSelector";
import { useFileWorker } from "@/hooks/useFileWorker";
import { useProfileWorker } from "@/hooks/useProfileWorker";
import { useFileStore } from "@/store/fileStore";

interface UploadFlowProps {
  assetId: string;
  assetName: string;
  previousSchema: string[] | null;
}

export function UploadFlow({ assetId, assetName, previousSchema }: UploadFlowProps) {
  const router = useRouter();
  const fileData = useFileStore((s) => s.data);
  const reapplyHeader = useFileStore((s) => s.reapplyHeader);

  // Header row selector state
  const [showHeaderSelector, setShowHeaderSelector] = useState(false);
  const [headerConfirmed, setHeaderConfirmed] = useState(false);

  const {
    status: parseStatus,
    progress: parseProgress,
    error: parseError,
    startParsing,
    reset: resetParse,
  } = useFileWorker();

  const {
    status: profileStatus,
    progress: profileProgress,
    currentColumn,
    columnsProcessed,
    totalColumns,
    error: profileError,
    startProfiling,
  } = useProfileWorker();

  // Start profiling once user has confirmed the header row (explicit button click)
  useEffect(() => {
    if (parseStatus === "done" && profileStatus === "idle" && headerConfirmed) {
      startProfiling(assetId);
    }
  }, [parseStatus, profileStatus, headerConfirmed, assetId, startProfiling]);

  function handleHeaderConfirm(rowIndex: number) {
    reapplyHeader(rowIndex);
    setShowHeaderSelector(false);
    setHeaderConfirmed(true);
  }

  // Derived state
  const isIdle = parseStatus === "idle";
  const isParsing = parseStatus === "parsing";
  const isProfiling = profileStatus === "profiling";
  const isDone = profileStatus === "done";
  const hasError = parseStatus === "error" || profileStatus === "error";
  const error = parseError ?? profileError;

  function handleRetry() {
    resetParse();
    setShowHeaderSelector(false);
    setHeaderConfirmed(false);
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href={`/dashboard/assets/${assetId}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-3.5 h-3.5" />Back to {assetName}
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload File</h1>
        <p className="text-slate-500 mt-1">
          Parse and profile your data entirely in this browser tab. Nothing is sent to any server.
        </p>
      </div>

      {/* State machine rendering */}
      {isIdle && (
        <FileDropZone onFile={(file) => startParsing(file)} />
      )}

      {isParsing && (
        <UploadProgress
          stage="parsing"
          parseProgress={parseProgress}
          fileName={fileData?.fileName}
          sampleMode={fileData?.sampleMode}
        />
      )}

      {/* Header row selection step — shown after parsing, before profiling starts */}
      {parseStatus === "done" && !headerConfirmed && fileData && (
        <div className="space-y-4">
          {/* Parse success banner */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-800">File parsed successfully</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {fileData.totalRows.toLocaleString()} rows · {fileData.headers.length} columns
                {fileData.sampleMode && " · large file — will sample 50 k rows for profiling"}
              </p>
            </div>
          </div>

          {/* Optional header row checkbox */}
          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={showHeaderSelector}
              onChange={(e) => {
                setShowHeaderSelector(e.target.checked);
              }}
              className="w-4 h-4 rounded border-slate-300 accent-[#1A1A2E]"
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
              My file doesn&apos;t have headers in the first row
            </span>
          </label>

          {/* HeaderRowSelector — visible only when checkbox is checked */}
          {showHeaderSelector && fileData.previewRows && fileData.previewRows.length > 0 && (
            <HeaderRowSelector
              previewRows={fileData.previewRows}
              onConfirm={handleHeaderConfirm}
            />
          )}

          {/* Start profiling button — visible when checkbox is unchecked */}
          {!showHeaderSelector && (
            <button
              type="button"
              onClick={() => setHeaderConfirmed(true)}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90"
              style={{ background: "#1A1A2E" }}
            >
              Start Profiling →
            </button>
          )}
        </div>
      )}

      {(parseStatus === "done" && isProfiling) && (
        <UploadProgress
          stage="profiling"
          profileProgress={profileProgress}
          currentColumn={currentColumn}
          columnsProcessed={columnsProcessed}
          totalColumns={totalColumns}
          sampleMode={fileData?.sampleMode}
        />
      )}

      {isDone && fileData && (
        <div className="space-y-6">
          <UploadProgress
            stage="done"
            totalRows={fileData.totalRows}
            totalColumns={fileData.headers.length}
            sampleMode={fileData.sampleMode}
          />

          <PlanGate minPlan="pro" feature="PII detection" fallback={null}>
            <PIIDetectionBanner />
          </PlanGate>

          <ColumnComparisonTable
            currentHeaders={fileData.headers}
            previousHeaders={previousSchema}
          />

          <div className="flex gap-3">
            <Link
              href={`/dashboard/assets/${assetId}/profile`}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90"
              style={{ background: "#1A1A2E" }}
            >
              <Eye className="w-4 h-4" />View Profiling Results
            </Link>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Upload Different File
            </button>
          </div>
        </div>
      )}

      {hasError && (
        <div className="space-y-4">
          <UploadProgress stage="error" error={error} />
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
