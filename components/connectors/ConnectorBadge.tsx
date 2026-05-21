import { Plug } from "lucide-react";
import type { ConnectorType } from "@/types/connectors.types";

const LABELS: Record<ConnectorType, string> = {
  google_sheets: "Google Sheets",
  airtable: "Airtable",
  cloud_storage_url: "Cloud Storage",
  rest_api: "REST API",
};

interface ConnectorBadgeProps {
  connectorType: ConnectorType;
  displayName: string;
  lastConnectedAt: string;
}

export function ConnectorBadge({ connectorType, displayName, lastConnectedAt }: ConnectorBadgeProps) {
  const date = new Date(lastConnectedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-200 bg-teal-50 text-xs text-teal-700">
      <Plug className="w-3.5 h-3.5 shrink-0" />
      <span>
        <span className="font-medium">{LABELS[connectorType]}</span>
        {" · "}
        {displayName}
        {" · "}
        <span className="text-teal-600">Last connected {date}</span>
      </span>
    </div>
  );
}
