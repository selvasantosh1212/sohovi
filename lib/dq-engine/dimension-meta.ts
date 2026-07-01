import type { DQDimension } from "@/types/app.types";

/** Badge color classes per dimension — single source of truth for rule + glossary UIs. */
export const DIMENSION_COLORS: Record<DQDimension, string> = {
  completeness: "bg-blue-100 text-blue-700",
  validity: "bg-purple-100 text-purple-700",
  accuracy: "bg-green-100 text-green-700",
  uniqueness: "bg-yellow-100 text-yellow-700",
  consistency: "bg-orange-100 text-orange-700",
  integrity: "bg-red-100 text-red-700",
  timeliness: "bg-teal-100 text-teal-700",
  currency: "bg-cyan-100 text-cyan-700",
  conformity: "bg-indigo-100 text-indigo-700",
  precision: "bg-pink-100 text-pink-700",
};

/** Generic, business-friendly definition of each dimension — grounded in the fact that source data is rarely clean. */
export const DIMENSION_DEFINITIONS: Record<DQDimension, string> = {
  completeness:
    "Whether values that should be present actually are. Real-world extracts often have gaps from optional fields, failed integrations, or skipped entry — this flags how much of that gap exists here.",
  validity:
    "Whether values conform to an expected format, type, or allowed set. Source systems rarely enforce this consistently, so even \"required\" fields can contain malformed entries.",
  accuracy:
    "Whether values are correct and plausible — free of impossible numbers or figures that contradict what's realistic for this kind of data.",
  consistency:
    "Whether values are represented the same way across all records, rather than drifting because different systems or people entered the data differently.",
  uniqueness:
    "Whether values meant to identify a single record actually do, with no unintended duplicates from re-entry, merges, or retries.",
  integrity:
    "Whether relationships this column depends on are intact, with no orphaned or dangling references.",
  timeliness:
    "Whether date/time values make logical sense relative to when they were recorded — e.g. not in the future or implausibly old.",
  currency:
    "Whether the data reflects a recent enough state of the world to still be trustworthy, rather than a stale snapshot.",
  conformity:
    "Whether values follow an expected structural standard — a regional format, a code list, an ISO format — beyond just \"looking like\" the right type.",
  precision:
    "Whether numeric values are recorded at the level of detail expected — e.g. consistent decimal places — rather than mixed granularity.",
};
