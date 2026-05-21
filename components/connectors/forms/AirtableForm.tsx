"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { ConnectorCommand } from "@/types/connectors.types";

interface AirtableFormProps {
  onConnect: (command: ConnectorCommand) => void;
}

export function AirtableForm({ onConnect }: AirtableFormProps) {
  const [token, setToken] = useState("");
  const [baseId, setBaseId] = useState("");
  const [tableName, setTableName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const command: ConnectorCommand = {
      type: "CONNECT_AIRTABLE",
      payload: {
        auth: { personal_access_token: token.trim() },
        config: { base_id: baseId.trim(), table_id_or_name: tableName.trim() },
      },
    };
    onConnect(command);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Personal Access Token</label>
          <a
            href="https://airtable.com/create/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#00C9A7] hover:underline"
          >
            Get token <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="patXXXXXXXXXXXXXX.XXXXXXXX"
          required
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
        />
        <p className="text-xs text-slate-400">
          Token stays in browser memory — never sent to our servers.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Base ID</label>
        <input
          type="text"
          value={baseId}
          onChange={(e) => setBaseId(e.target.value)}
          placeholder="appXXXXXXXXXXXXXX"
          required
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
        />
        <p className="text-xs text-slate-400">
          Found in your Airtable URL: airtable.com/<strong>appXXXXX</strong>/...
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Table name or ID</label>
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="Leads  or  tblXXXXXXXXXXXXXX"
          required
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
        />
      </div>

      <button
        type="submit"
        disabled={!token.trim() || !baseId.trim() || !tableName.trim()}
        className="w-full py-2.5 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40"
        style={{ background: "#00C9A7", color: "#0d1e33" }}
      >
        Fetch & Profile Table
      </button>
    </form>
  );
}
