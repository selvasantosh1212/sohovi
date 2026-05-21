import Link from "next/link";
import { smartSearch } from "@/app/actions/search";
import { Database, FolderOpen, Building2 } from "lucide-react";
import { ScoreBadge } from "@/components/shared/ScoreBadge";

const TYPE_META = {
  asset:         { label: "Asset",         icon: Database,   color: "#1E3A5F" },
  catalog:       { label: "Catalog",       icon: FolderOpen, color: "#0e6b5a" },
  business_unit: { label: "Business Unit", icon: Building2,  color: "#5f4b1e" },
} as const;

interface Props {
  query: string;
}

export async function SearchResults({ query }: Props) {
  if (!query.trim() || query.length < 2) {
    return (
      <p className="text-sm text-gray-400 text-center py-12">
        Type at least 2 characters to search.
      </p>
    );
  }

  const results = await smartSearch(query);

  if (results.length === 0) {
    return (
      <div className="text-center py-16 space-y-2">
        <p className="text-gray-500 font-medium">No results for &ldquo;{query}&rdquo;</p>
        <p className="text-sm text-gray-400">Try a different search term.</p>
      </div>
    );
  }

  return (
    <section aria-label={`Search results for ${query}`}>
      <p className="text-xs text-gray-400 mb-4">
        {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
      </p>
      <ul className="space-y-2" role="list">
        {results.map((r) => {
          const meta = TYPE_META[r.type];
          const Icon = meta.icon;
          return (
            <li key={`${r.type}-${r.id}`}>
              <Link
                href={r.href}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-[#00C9A7] hover:shadow-sm transition-all"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${meta.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: meta.color }} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm text-gray-900 truncate">{r.title}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: `${meta.color}15`, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    {r.type === "asset" && r.score != null && (
                      <ScoreBadge score={r.score} size="sm" />
                    )}
                  </div>
                  {r.subtitle && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">{r.subtitle}</p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
