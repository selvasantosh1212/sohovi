"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { getContextualGuides } from "@/lib/learn/guides";
import { cn } from "@/lib/utils";

interface SidebarContextHelpProps {
  collapsed: boolean;
}

export function SidebarContextHelp({ collapsed }: SidebarContextHelpProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const guides = getContextualGuides(pathname);

  if (collapsed) {
    return (
      <div className="px-2 pb-2">
        <Link
          href="/dashboard/learn"
          className="w-full flex items-center justify-center p-2 rounded-lg transition-colors hover:opacity-80"
          style={{ color: "var(--sidebar-foreground)", opacity: 0.5 }}
          aria-label="Learn Center"
          title="Learn Center"
        >
          <HelpCircle className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="px-2 pb-2">
      <div className="rounded-lg overflow-hidden border" style={{ borderColor: "var(--sidebar-border)", opacity: 0.8 }}>
        {/* Header */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 text-left transition-colors hover:opacity-90"
          style={{ background: "var(--sidebar-accent)" }}
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" style={{ color: "#00C9A7" }} />
            <span className="text-xs font-semibold" style={{ color: "#00C9A7" }}>
              Page Help
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="w-3 h-3" style={{ color: "#00C9A7" }} />
          ) : (
            <ChevronDown className="w-3 h-3" style={{ color: "#00C9A7" }} />
          )}
        </button>

        {/* Links */}
        {expanded && (
          <div className="px-3 py-2 space-y-1" style={{ background: "var(--sidebar-accent)" }}>
            {guides.map((g) => (
              <Link
                key={g.id}
                href={`/dashboard/learn?guide=${g.id}`}
                className={cn(
                  "flex items-center gap-1.5 text-xs py-0.5 transition-colors hover:opacity-100"
                )}
                style={{ color: "var(--sidebar-foreground)", opacity: 0.7 }}
              >
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">{g.title}</span>
              </Link>
            ))}
            <Link
              href="/dashboard/learn"
              className="flex items-center gap-1.5 text-xs py-0.5 font-medium mt-1 transition-colors"
              style={{ color: "#00C9A7" }}
            >
              All guides →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
