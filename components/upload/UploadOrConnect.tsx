"use client";

import { useEffect, useState } from "react";
import { Upload, Plug, Layers } from "lucide-react";
import { UploadFlow } from "./UploadFlow";
import { LargeFileFlow } from "./LargeFileFlow";
import { ConnectorGate } from "@/components/connectors/ConnectorGate";
import { ConnectorFlow } from "@/components/connectors/ConnectorFlow";
import { useFileStore } from "@/store/fileStore";

interface UploadOrConnectProps {
  assetId: string;
  assetName: string;
  previousSchema: string[] | null;
  workflowId?: string | null;
}

type Tab = "upload" | "connect" | "bulk";

export function UploadOrConnect({ assetId, assetName, previousSchema, workflowId = null }: UploadOrConnectProps) {
  const [tab, setTab] = useState<Tab>("upload");
  const setWorkflowId = useFileStore((s) => s.setWorkflowId);

  useEffect(() => {
    setWorkflowId(workflowId);
  }, [workflowId, setWorkflowId]);

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 w-fit">
        <TabButton active={tab === "upload"} onClick={() => setTab("upload")}>
          <Upload className="w-3.5 h-3.5" />
          Upload File
        </TabButton>
        <TabButton active={tab === "connect"} onClick={() => setTab("connect")}>
          <Plug className="w-3.5 h-3.5" />
          Connect Data Source
        </TabButton>
        <TabButton active={tab === "bulk"} onClick={() => setTab("bulk")}>
          <Layers className="w-3.5 h-3.5" />
          Bulk File
        </TabButton>
      </div>

      {tab === "upload" && (
        <UploadFlow assetId={assetId} assetName={assetName} previousSchema={previousSchema} />
      )}

      {tab === "connect" && (
        <ConnectorGate>
          <ConnectorFlow assetId={assetId} assetName={assetName} />
        </ConnectorGate>
      )}

      {tab === "bulk" && (
        <ConnectorGate>
          <LargeFileFlow assetId={assetId} assetName={assetName} />
        </ConnectorGate>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
        active
          ? "bg-white text-slate-800 shadow-sm"
          : "text-slate-500 hover:text-slate-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
