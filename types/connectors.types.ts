// ============================================================
// Connector types — browser-native data source connections.
// Raw data NEVER leaves the browser; connectors fetch and
// return ParsedData for the existing profiler/DQ pipeline.
// ============================================================

export type ConnectorType =
  | "google_sheets"
  | "airtable"
  | "cloud_storage_url"
  | "rest_api";

// ---- Google Sheets -----------------------------------------------

export interface GoogleSheetsAuth {
  access_token: string; // memory-only, lost on reload
}

export interface GoogleSheetsConfig {
  spreadsheet_id: string;
  sheet_name: string;
}

// ---- Airtable ----------------------------------------------------

export interface AirtableAuth {
  personal_access_token: string; // memory-only, lost on reload
}

export interface AirtableConfig {
  base_id: string;
  table_id_or_name: string;
}

// ---- Cloud Storage URL (S3 pre-signed, Azure SAS, GCS signed) ----
// User generates the URL themselves — Sohovi never handles credentials.

export interface CloudStorageConfig {
  url: string;
  file_hint?: string; // optional display label
}

// ---- Generic REST API --------------------------------------------

export interface RESTApiAuth {
  header_name: string;  // e.g. "Authorization"
  header_value: string; // e.g. "Bearer sk-..." — memory-only
}

export interface RESTApiConfig {
  url: string;
  json_path: string; // dot-notation to the records array, e.g. "data" or "results.items"
  auth?: RESTApiAuth;
}

// ---- Worker command union ----------------------------------------

export type ConnectorCommand =
  | {
      type: "CONNECT_GOOGLE_SHEETS";
      payload: { auth: GoogleSheetsAuth; config: GoogleSheetsConfig };
    }
  | {
      type: "CONNECT_AIRTABLE";
      payload: { auth: AirtableAuth; config: AirtableConfig };
    }
  | {
      type: "CONNECT_CLOUD_URL";
      payload: { config: CloudStorageConfig };
    }
  | {
      type: "CONNECT_REST_API";
      payload: { config: RESTApiConfig };
    };

// ---- Worker response ---------------------------------------------

import type { ParsedData } from "./profiling.types";

export type ConnectorResponse =
  | { type: "CONNECT_PROGRESS"; payload: { pct: number; message: string } }
  | { type: "CONNECT_COMPLETE"; payload: ParsedData }
  | { type: "CONNECT_ERROR"; payload: { message: string } };

// ---- Non-sensitive metadata saved to Supabase -------------------

export interface ConnectorConfigRecord {
  id: string;
  asset_id: string;
  clerk_user_id: string;
  connector_type: ConnectorType;
  display_name: string;
  config_meta: Record<string, string>; // sheet name, base ID, table — NO credentials
  last_connected_at: string;
}

// ---- UI descriptor for the selector grid -------------------------

export interface ConnectorOption {
  type: ConnectorType;
  name: string;
  tagline: string;
  authLabel: string; // e.g. "OAuth" | "API Token" | "Pre-signed URL"
  comingSoon: boolean;
}

export const CONNECTOR_OPTIONS: ConnectorOption[] = [
  {
    type: "google_sheets",
    name: "Google Sheets",
    tagline: "Connect any Google spreadsheet via OAuth",
    authLabel: "OAuth",
    comingSoon: false,
  },
  {
    type: "airtable",
    name: "Airtable",
    tagline: "Pull records from any Airtable base & table",
    authLabel: "API Token",
    comingSoon: false,
  },
  {
    type: "cloud_storage_url",
    name: "Cloud Storage",
    tagline: "S3, Azure Blob, GCS — paste a pre-signed URL",
    authLabel: "Pre-signed URL",
    comingSoon: false,
  },
  {
    type: "rest_api",
    name: "REST API",
    tagline: "Fetch from any CORS-enabled JSON endpoint",
    authLabel: "Bearer Token",
    comingSoon: false,
  },
];
