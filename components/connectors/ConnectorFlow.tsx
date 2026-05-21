"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, CheckCircle2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useConnectorWorker } from "@/hooks/useConnectorWorker";
import { useProfileWorker } from "@/hooks/useProfileWorker";
import { useFileStore } from "@/store/fileStore";
import { ConnectorSelector } from "./ConnectorSelector";
import { GoogleSheetsForm } from "./forms/GoogleSheetsForm";
import { AirtableForm } from "./forms/AirtableForm";
import { CloudStorageForm } from "./forms/CloudStorageForm";
import { RESTApiForm } from "./forms/RESTApiForm";
import { saveConnectorConfig } from "@/app/actions/connectors";
import type { ConnectorCommand, ConnectorType } from "@/types/connectors.types";

interface ConnectorFlowProps {
  assetId: string;
  assetName: string;
}

const CONNECTOR_NAMES: Record<ConnectorType, string> = {
  google_sheets: "Google Sheets",
  airtable: "Airtable",
  cloud_storage_url: "Cloud Storage",
  rest_api: "REST API",
};

type Step = "select" | "configure" | "connecting" | "profiling" | "done" | "error";

export function ConnectorFlow({ assetId, assetName }: ConnectorFlowProps) {
  const router = useRouter();
  const fileData = useFileStore((s) => s.data);

  const {
    status: connectStatus,
    progress: connectProgress,
    progressMessage,
    error: connectError,
    startConnect,
    reset: resetConnect,
  } = useConnectorWorker();

  const {
    status: profileStatus,
    progress: profileProgress,
    currentColumn,
    columnsProcessed,
    totalColumns,
    error: profileError,
    startProfiling,
  } = useProfileWorker();

  const [selectedType, setSelectedType] = useState<ConnectorType | null>(null);
  const [step, setStep] = useState<Step>("select");
  const [pendingCommand, setPendingCommand] = useState<ConnectorCommand | null>(null);

  // Auto-start profiling when connector fetch is done
  useEffect(() => {
    if (connectStatus === "done" && profileStatus === "idle") {
      setStep("profiling");
      startProfiling(assetId);
    }
    if (connectStatus === "connecting") setStep("connecting");
    if (connectStatus === "error") setStep("error");
  }, [connectStatus, profileStatus, assetId, startProfiling]);

  useEffect(() => {
    if (profileStatus === "done") setStep("done");
    if (profileStatus === "error") setStep("error");
  }, [profileStatus]);

  async function handleConnect(command: ConnectorCommand) {
    setPendingCommand(command);
    setStep("connecting");

    // Save non-sensitive config to Supabase (best-effort, don't block)
    const metaLabel = buildConfigLabel(command);
    saveConnectorConfig({
      asset_id: assetId,
      connector_type: selectedType!,
      display_name: metaLabel,
      config_meta: buildConfigMeta(command),
    }).catch(() => {/* silent */});

    await startConnect(command);
  }

  function handleRetry() {
    resetConnect();
    setStep(selectedType ? "configure" : "select");
  }

  function handleBack() {
    resetConnect();
    setStep("select");
    setSelectedType(null);
  }

  const error = connectError ?? profileError;

  return (
    <div className="space-y-6">
      {/* Back to asset link */}
      <Link
        href={`/dashboard/assets/${assetId}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="w-3.5 h-3.5" />Back to {assetName}
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Connect Data Source</h1>
        <p className="text-slate-500 mt-1">
          Data is fetched and processed entirely in this browser tab — nothing is stored on our
          servers.
        </p>
      </div>

      {/* Select connector */}
      {step === "select" && (
        <ConnectorSelector
          onSelect={(type) => {
            setSelectedType(type);
            setStep("configure");
          }}
        />
      )}

      {/* Configure form */}
      {step === "configure" && selectedType && (
        <div className="space-y-5">
          <button
            onClick={handleBack}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Choose different connector
          </button>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              {CONNECTOR_NAMES[selectedType]}
            </h2>
          </div>
          {selectedType === "google_sheets" && <GoogleSheetsForm onConnect={handleConnect} />}
          {selectedType === "airtable" && <AirtableForm onConnect={handleConnect} />}
          {selectedType === "cloud_storage_url" && <CloudStorageForm onConnect={handleConnect} />}
          {selectedType === "rest_api" && <RESTApiForm onConnect={handleConnect} />}
        </div>
      )}

      {/* Connecting progress */}
      {step === "connecting" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#00C9A7]" />
            <span className="text-sm font-medium text-slate-700">{progressMessage}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${connectProgress}%`, background: "#00C9A7" }}
            />
          </div>
          <p className="text-xs text-slate-400">
            Fetching from {selectedType ? CONNECTOR_NAMES[selectedType] : "source"}…
          </p>
        </div>
      )}

      {/* Profiling progress */}
      {step === "profiling" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#00C9A7]" />
            <span className="text-sm font-medium text-slate-700">
              Profiling column {columnsProcessed}/{totalColumns}
              {currentColumn ? ` — ${currentColumn}` : ""}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${profileProgress}%`, background: "#00C9A7" }}
            />
          </div>
          <p className="text-xs text-slate-400">Profiling runs entirely in this browser tab.</p>
        </div>
      )}

      {/* Done */}
      {step === "done" && fileData && (
        <div className="space-y-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-emerald-800">
                {fileData.fileName} — {fileData.headers.length} columns,{" "}
                {fileData.totalRows.toLocaleString()} rows
              </p>
              {fileData.sampleMode && (
                <p className="text-xs text-emerald-700">
                  Large dataset — profiled a random sample of 50 000 rows.
                </p>
              )}
            </div>
          </div>
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
              Connect Different Source
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {step === "error" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-700">Connection failed</p>
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}

// ---- Helpers ---------------------------------------------------------

function buildConfigLabel(command: ConnectorCommand): string {
  switch (command.type) {
    case "CONNECT_GOOGLE_SHEETS":
      return `${command.payload.config.sheet_name} (Google Sheets)`;
    case "CONNECT_AIRTABLE":
      return `${command.payload.config.table_id_or_name} (Airtable)`;
    case "CONNECT_CLOUD_URL":
      return command.payload.config.file_hint ?? "Cloud Storage file";
    case "CONNECT_REST_API":
      return `REST API — ${command.payload.config.url}`;
  }
}

function buildConfigMeta(command: ConnectorCommand): Record<string, string> {
  switch (command.type) {
    case "CONNECT_GOOGLE_SHEETS":
      return {
        spreadsheet_id: command.payload.config.spreadsheet_id,
        sheet_name: command.payload.config.sheet_name,
      };
    case "CONNECT_AIRTABLE":
      return {
        base_id: command.payload.config.base_id,
        table: command.payload.config.table_id_or_name,
      };
    case "CONNECT_CLOUD_URL":
      return { url_domain: new URL(command.payload.config.url).hostname };
    case "CONNECT_REST_API":
      return {
        url: command.payload.config.url,
        json_path: command.payload.config.json_path,
      };
  }
}
