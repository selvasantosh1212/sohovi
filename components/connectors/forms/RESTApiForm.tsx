"use client";

import { useState } from "react";
import type { ConnectorCommand } from "@/types/connectors.types";

interface RESTApiFormProps {
  onConnect: (command: ConnectorCommand) => void;
}

export function RESTApiForm({ onConnect }: RESTApiFormProps) {
  const [url, setUrl] = useState("");
  const [jsonPath, setJsonPath] = useState("");
  const [authEnabled, setAuthEnabled] = useState(false);
  const [headerName, setHeaderName] = useState("Authorization");
  const [headerValue, setHeaderValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const command: ConnectorCommand = {
      type: "CONNECT_REST_API",
      payload: {
        config: {
          url: url.trim(),
          json_path: jsonPath.trim() || ".",
          auth:
            authEnabled && headerValue.trim()
              ? { header_name: headerName.trim(), header_value: headerValue.trim() }
              : undefined,
        },
      },
    };
    onConnect(command);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Endpoint URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/v1/records"
          required
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
        />
        <p className="text-xs text-slate-400">Must be CORS-enabled and return JSON.</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">JSON path to records array</label>
        <input
          type="text"
          value={jsonPath}
          onChange={(e) => setJsonPath(e.target.value)}
          placeholder='e.g. "data" or "results.items" — leave blank if root is an array'
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
        />
        <p className="text-xs text-slate-400">
          Use dot notation: <code>data.items</code> → response.data.items[]
        </p>
      </div>

      {/* Auth toggle */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={authEnabled}
            onChange={(e) => setAuthEnabled(e.target.checked)}
            className="w-4 h-4 rounded accent-[#00C9A7]"
          />
          <span className="text-sm font-medium text-slate-700">Add auth header</span>
        </label>

        {authEnabled && (
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-2 space-y-1">
              <label className="text-xs text-slate-500">Header name</label>
              <input
                type="text"
                value={headerName}
                onChange={(e) => setHeaderName(e.target.value)}
                placeholder="Authorization"
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
              />
            </div>
            <div className="col-span-3 space-y-1">
              <label className="text-xs text-slate-500">Value</label>
              <input
                type="password"
                value={headerValue}
                onChange={(e) => setHeaderValue(e.target.value)}
                placeholder="Bearer sk-…"
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!url.trim()}
        className="w-full py-2.5 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40"
        style={{ background: "#00C9A7", color: "#0d1e33" }}
      >
        Fetch & Profile Data
      </button>
    </form>
  );
}
