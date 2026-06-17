"use client";

import Link from "next/link";
import {
  ArrowRightLeft,
  GitMerge,
  Trash2,
  Database,
  Table2,
  Wand2,
  Columns,
  Calculator,
  FileJson,
  ShieldAlert,
  GitCompare,
  ShieldOff,
} from "lucide-react";

const tools = [
  {
    icon: ShieldAlert,
    name: "Pre-Send PII Audit",
    slug: "pii-audit",
    tagline: "Check any file for emails, SSNs, API keys, and personal data before you send it.",
    color: "#E07150",
    colorBg: "rgba(224,113,80,0.08)",
  },
  {
    icon: GitCompare,
    name: "Two-File Reconciler",
    slug: "compare",
    tagline: "Drop two spreadsheets, see exactly what changed — added, removed, and modified rows.",
    color: "#00C9A7",
    colorBg: "rgba(0,201,167,0.08)",
  },
  {
    icon: ShieldOff,
    name: "Research Data De-Identifier",
    slug: "de-identify",
    tagline: "Mask, generalize, and pseudonymize a dataset. Check k-anonymity. Export a methods log.",
    color: "#8B5CF6",
    colorBg: "rgba(139,92,246,0.08)",
  },
  {
    icon: Trash2,
    name: "Duplicate Row Remover",
    slug: "remove-duplicates",
    tagline: "Find and remove duplicate rows from any CSV — instantly.",
    color: "#E07150",
    colorBg: "rgba(224,113,80,0.08)",
  },
  {
    icon: ArrowRightLeft,
    name: "CSV to JSON Converter",
    slug: "csv-to-json",
    tagline: "Convert CSV files to JSON arrays — no coding needed.",
    color: "#00C9A7",
    colorBg: "rgba(0,201,167,0.08)",
  },
  {
    icon: FileJson,
    name: "JSON to CSV Converter",
    slug: "json-to-csv",
    tagline: "Flatten JSON into a clean CSV spreadsheet in one click.",
    color: "#00C9A7",
    colorBg: "rgba(0,201,167,0.08)",
  },
  {
    icon: Columns,
    name: "CSV Column Picker",
    slug: "csv-columns",
    tagline: "Select, drop, reorder, and rename CSV columns — then download.",
    color: "#C7BDE6",
    colorBg: "rgba(199,189,230,0.12)",
  },
  {
    icon: Table2,
    name: "CSV to Markdown Table",
    slug: "csv-to-markdown",
    tagline: "Turn any CSV into a GitHub-ready Markdown table.",
    color: "#F7D67A",
    colorBg: "rgba(247,214,122,0.1)",
  },
  {
    icon: Database,
    name: "CSV to SQL Generator",
    slug: "csv-to-sql",
    tagline: "Generate SQL INSERT statements from a CSV — MySQL, PostgreSQL, SQLite.",
    color: "#B5D4E6",
    colorBg: "rgba(181,212,230,0.12)",
  },
  {
    icon: GitMerge,
    name: "CSV Merger",
    slug: "csv-merger",
    tagline: "Stack or join multiple CSV files into one download.",
    color: "#A8C8A6",
    colorBg: "rgba(168,200,166,0.12)",
  },
  {
    icon: Wand2,
    name: "Test Data Generator",
    slug: "test-data-generator",
    tagline: "Generate realistic fake CSV data for testing — up to 100k rows.",
    color: "#E07150",
    colorBg: "rgba(224,113,80,0.08)",
  },
  {
    icon: Calculator,
    name: "Excel Formula Explainer",
    slug: "formula-explainer",
    tagline: "Paste any Excel formula — get a plain-English explanation.",
    color: "#00C9A7",
    colorBg: "rgba(0,201,167,0.08)",
  },
];

export function ToolsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group flex flex-col rounded-2xl border p-6 transition-all duration-200"
            style={{ borderColor: "var(--hair-strong)", background: "var(--paper)" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = tool.color;
              el.style.boxShadow = `0 4px 20px -4px ${tool.color}22`;
              el.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = "var(--hair-strong)";
              el.style.boxShadow = "none";
              el.style.transform = "translateY(0)";
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: tool.colorBg }}
            >
              <Icon className="w-5 h-5" style={{ color: tool.color }} />
            </div>
            <h2 className="text-[16px] font-bold mb-1.5" style={{ color: "var(--ink)" }}>
              {tool.name}
            </h2>
            <p className="text-[13px] leading-relaxed flex-1" style={{ color: "var(--ink-soft)" }}>
              {tool.tagline}
            </p>
            <div className="mt-4 flex items-center gap-1 text-[13px] font-semibold" style={{ color: tool.color }}>
              Use free
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
