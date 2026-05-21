import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "./SearchResults";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.025em]" style={{ color: "#0A0A0F" }}>Search</h1>
        <p className="text-[14px] text-slate-500 mt-1.5">
          Find assets, catalogs, business units, and blog posts.
        </p>
      </div>

      <form method="GET" role="search" aria-label="Global search">
        <label htmlFor="search-input" className="sr-only">Search</label>
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            id="search-input"
            name="q"
            type="search"
            defaultValue={q ?? ""}
            autoFocus
            placeholder="Search assets, catalogs, blog posts…"
            className="w-full pl-10 pr-4 py-3 border border-[#EEF0F3] rounded-[14px] text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#E07150] focus:border-transparent"
          />
        </div>
      </form>

      <Suspense key={q} fallback={<SearchSkeleton />}>
        <SearchResults query={q ?? ""} />
      </Suspense>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading results">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
}
