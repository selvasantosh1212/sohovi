"use client";

import { FileSpreadsheet, Table2, Cloud, Globe } from "lucide-react";
import type { ConnectorType, ConnectorOption } from "@/types/connectors.types";
import { CONNECTOR_OPTIONS } from "@/types/connectors.types";

const ICONS: Record<ConnectorType, React.ReactNode> = {
  google_sheets: <FileSpreadsheet className="w-6 h-6" />,
  airtable: <Table2 className="w-6 h-6" />,
  cloud_storage_url: <Cloud className="w-6 h-6" />,
  rest_api: <Globe className="w-6 h-6" />,
};

interface ConnectorSelectorProps {
  onSelect: (type: ConnectorType) => void;
}

export function ConnectorSelector({ onSelect }: ConnectorSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-800">Choose a data source</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Data is fetched and processed entirely in this browser tab — nothing is sent to our
          servers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONNECTOR_OPTIONS.map((opt: ConnectorOption) => (
          <button
            key={opt.type}
            onClick={() => !opt.comingSoon && onSelect(opt.type)}
            disabled={opt.comingSoon}
            className={[
              "text-left p-4 rounded-xl border transition-all",
              opt.comingSoon
                ? "border-slate-100 bg-slate-50 cursor-not-allowed opacity-60"
                : "border-slate-200 bg-white hover:border-[#00C9A7] hover:shadow-sm cursor-pointer",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <div
                className={[
                  "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                  opt.comingSoon ? "bg-slate-100 text-slate-400" : "bg-[#e6faf7] text-[#00C9A7]",
                ].join(" ")}
              >
                {ICONS[opt.type]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">{opt.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                    {opt.authLabel}
                  </span>
                  {opt.comingSoon && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-medium">
                      Soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{opt.tagline}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400 pt-1">
        Need Salesforce, SAP, or HubSpot? Export as CSV and use the{" "}
        <span className="font-medium">Upload File</span> tab — all data stays in your browser
        either way.
      </p>
    </div>
  );
}
