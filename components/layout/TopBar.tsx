"use client";

import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { Search, Database, FolderOpen, Building2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, useCallback } from "react";
import { GuidedTour } from "@/components/shared/GuidedTour";
import { ScoreBadge } from "@/components/shared/ScoreBadge";
import { smartSearch, type SearchResult } from "@/app/actions/search";

const TYPE_META = {
  asset:         { label: "Asset",         icon: Database,   color: "#1E3A5F" },
  catalog:       { label: "Catalog",       icon: FolderOpen, color: "#0e6b5a" },
  business_unit: { label: "Business Unit", icon: Building2,  color: "#5f4b1e" },
} as const;

interface TopBarProps {
  onMenuClick?: () => void;
  alertBell?: React.ReactNode;
}

export function TopBar({ onMenuClick, alertBell }: TopBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // "/" key focuses the search input from anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const runSearch = useCallback((q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    startTransition(async () => {
      const data = await smartSearch(q);
      setResults(data);
      setOpen(true);
      setActiveIdx(-1);
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(q), 300);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && results[activeIdx]) {
        navigate(results[activeIdx].href);
      } else if (query.trim().length >= 2) {
        router.push(`/dashboard/search?q=${encodeURIComponent(query.trim())}`);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
      inputRef.current?.blur();
    }
  }

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(href);
  }

  // Group results by type for display
  const grouped: Record<string, SearchResult[]> = {};
  for (const r of results) {
    (grouped[r.type] ??= []).push(r);
  }
  const typeOrder: Array<SearchResult["type"]> = ["business_unit", "catalog", "asset"];
  const groupLabels: Record<string, string> = {
    business_unit: "Business Units",
    catalog: "Catalogs",
    asset: "Data Assets",
  };

  // Flat index for keyboard navigation
  let flatIdx = -1;

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-6 border-b bg-white"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        aria-expanded={false}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Left spacer on desktop */}
      <div className="hidden md:block" />

      {/* Right actions */}
      <div className="flex items-center gap-3">

        {/* Inline search */}
        <div ref={containerRef} className="relative hidden md:block">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-[#00C9A7] focus-within:bg-white transition-colors">
            {isPending
              ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin shrink-0" />
              : <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            }
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => { if (results.length > 0) setOpen(true); }}
              placeholder="Search…"
              aria-label="Search data assets, catalogs and business units"
              className="w-44 lg:w-56 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
            />
            <kbd className="hidden lg:inline text-xs bg-white text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">/</kbd>
          </div>

          {/* Dropdown results */}
          {open && results.length > 0 && (
            <div
              className="absolute right-0 top-full mt-1.5 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
              role="listbox"
              aria-label="Search results"
            >
              {typeOrder.filter((t) => grouped[t]?.length).map((type) => (
                <div key={type}>
                  <p className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {groupLabels[type]}
                  </p>
                  {grouped[type].map((r) => {
                    flatIdx++;
                    const idx = flatIdx;
                    const isHighlighted = activeIdx === idx;
                    const meta = TYPE_META[r.type];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        role="option"
                        aria-selected={isHighlighted}
                        onClick={() => navigate(r.href)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                          isHighlighted ? "bg-slate-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${meta.color}15` }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm font-medium text-slate-800 truncate">{r.title}</span>
                            {r.type === "asset" && r.score != null && (
                              <ScoreBadge score={r.score} size="sm" />
                            )}
                          </div>
                          {r.subtitle && (
                            <p className="text-xs text-slate-400 truncate">{r.subtitle}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
              <div className="border-t border-slate-100 px-3 py-2">
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/dashboard/search?q=${encodeURIComponent(query.trim())}`);
                    setOpen(false);
                  }}
                  className="text-xs text-[#00C9A7] hover:underline w-full text-left"
                >
                  View all results for &ldquo;{query}&rdquo; →
                </button>
              </div>
            </div>
          )}

          {/* No results state */}
          {open && query.trim().length >= 2 && results.length === 0 && !isPending && (
            <div className="absolute right-0 top-full mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-50 px-4 py-3">
              <p className="text-sm text-slate-500">No results for &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Org switcher */}
        <OrganizationSwitcher
          hidePersonal={false}
          afterCreateOrganizationUrl="/dashboard"
          afterSelectOrganizationUrl="/dashboard"
          afterLeaveOrganizationUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "flex items-center",
              organizationSwitcherTrigger:
                "flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors max-w-[160px]",
            },
          }}
        />

        {alertBell}

        {/* Guided tour */}
        <GuidedTour />

        {/* User button */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    </header>
  );
}
