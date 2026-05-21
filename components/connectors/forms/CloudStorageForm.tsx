"use client";

import { useState } from "react";
import type { ConnectorCommand } from "@/types/connectors.types";

interface CloudStorageFormProps {
  onConnect: (command: ConnectorCommand) => void;
}

export function CloudStorageForm({ onConnect }: CloudStorageFormProps) {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const command: ConnectorCommand = {
      type: "CONNECT_CLOUD_URL",
      payload: {
        config: { url: url.trim(), file_hint: label.trim() || undefined },
      },
    };
    onConnect(command);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700 space-y-1">
        <p className="font-medium">How to get a pre-signed / signed URL</p>
        <ul className="list-disc list-inside space-y-0.5 text-blue-600">
          <li>
            <strong>AWS S3:</strong> S3 console → object → &ldquo;Share with presigned URL&rdquo;
          </li>
          <li>
            <strong>Azure Blob:</strong> Storage Explorer → &ldquo;Generate SAS&rdquo;
          </li>
          <li>
            <strong>GCS:</strong> Cloud Console → object → &ldquo;Create signed URL&rdquo;
          </li>
        </ul>
        <p>Supported file types: CSV, Excel (.xlsx / .xls), JSON.</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Pre-signed / SAS / Signed URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-bucket.s3.amazonaws.com/file.csv?X-Amz-Signature=…"
          required
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
        />
        <p className="text-xs text-slate-400">
          Your browser downloads the file directly — no data touches our servers.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Display label (optional)</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Q1 customers export"
          className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
        />
      </div>

      <button
        type="submit"
        disabled={!url.trim()}
        className="w-full py-2.5 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40"
        style={{ background: "#00C9A7", color: "#0d1e33" }}
      >
        Download & Profile File
      </button>
    </form>
  );
}
