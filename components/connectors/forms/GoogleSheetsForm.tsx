"use client";

import { useState, useCallback, useRef } from "react";
import { CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import {
  generateCodeVerifier,
  buildAuthUrl,
  openOAuthPopup,
} from "@/lib/connectors/pkce";
import type { ConnectorCommand } from "@/types/connectors.types";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const REDIRECT_URI =
  typeof window !== "undefined"
    ? `${window.location.origin}/dashboard/connect/callback`
    : "";

interface GoogleSheetsFormProps {
  onConnect: (command: ConnectorCommand) => void;
}

export function GoogleSheetsForm({ onConnect }: GoogleSheetsFormProps) {
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [sheetName, setSheetName] = useState("Sheet1");
  const [authError, setAuthError] = useState<string | null>(null);

  // Keep code_verifier in a ref — never persisted to storage
  const codeVerifierRef = useRef<string>("");

  const connectGoogle = useCallback(async () => {
    if (!GOOGLE_CLIENT_ID) {
      setAuthError("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.");
      return;
    }

    setAuthError(null);
    setAuthLoading(true);

    try {
      const codeVerifier = generateCodeVerifier();
      codeVerifierRef.current = codeVerifier;

      const state = crypto.randomUUID();
      const authUrl = await buildAuthUrl(
        {
          authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
          tokenUrl: "https://oauth2.googleapis.com/token",
          clientId: GOOGLE_CLIENT_ID,
          redirectUri: typeof window !== "undefined"
            ? `${window.location.origin}/dashboard/connect/callback`
            : REDIRECT_URI,
          scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
          extraParams: { prompt: "consent" },
        },
        codeVerifier,
        state
      );

      const code = await openOAuthPopup(authUrl, state);

      const currentRedirectUri =
        typeof window !== "undefined"
          ? `${window.location.origin}/dashboard/connect/callback`
          : REDIRECT_URI;

      const tokenRes = await fetch("/api/google/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, code_verifier: codeVerifier, redirect_uri: currentRedirectUri }),
      });
      const tokenJson = await tokenRes.json();
      if (!tokenRes.ok || !tokenJson.access_token) {
        throw new Error(tokenJson.error ?? "Token exchange failed");
      }

      setToken(tokenJson.access_token);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  function extractSpreadsheetId(input: string): string {
    const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    const spreadsheetId = extractSpreadsheetId(spreadsheetUrl);
    if (!spreadsheetId) return;

    const command: ConnectorCommand = {
      type: "CONNECT_GOOGLE_SHEETS",
      payload: {
        auth: { access_token: token },
        config: { spreadsheet_id: spreadsheetId, sheet_name: sheetName.trim() || "Sheet1" },
      },
    };
    onConnect(command);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step 1 — OAuth */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Step 1 — Authenticate</label>
        {!token ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={connectGoogle}
              disabled={authLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              {authLoading ? "Waiting for Google…" : "Connect Google Account"}
            </button>
            {authError && <p className="text-xs text-red-500">{authError}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            Connected — token valid for this session only
          </div>
        )}
      </div>

      {/* Step 2 — Sheet config */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">Step 2 — Configure</label>

        <div className="space-y-1">
          <label className="text-xs text-slate-500">Spreadsheet URL or ID</label>
          <input
            type="text"
            value={spreadsheetUrl}
            onChange={(e) => setSpreadsheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/… or just the ID"
            required
            disabled={!token}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7] disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500">Sheet name (tab name)</label>
          <input
            type="text"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
            placeholder="Sheet1"
            disabled={!token}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00C9A7] disabled:bg-slate-50 disabled:text-slate-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!token || !spreadsheetUrl.trim()}
        className="w-full py-2.5 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40"
        style={{ background: "#00C9A7", color: "#0d1e33" }}
      >
        Fetch & Profile Sheet
      </button>
    </form>
  );
}
