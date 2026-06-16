"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Database,
  Workflow,
  BarChart3,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Users2,
  GraduationCap,
  CreditCard,
} from "lucide-react";
import { SidebarContextHelp } from "@/components/layout/SidebarContextHelp";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Search", href: "/dashboard/search", icon: Search },
      { label: "Team", href: "/dashboard/team", icon: Users2 },
      { label: "Learn", href: "/dashboard/learn", icon: GraduationCap },
      { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    ],
  },
  {
    group: "Data Catalog",
    items: [
      { label: "Business Units", href: "/dashboard/business-units", icon: Building2 },
      { label: "Catalogs", href: "/dashboard/catalogs", icon: BookOpen },
      { label: "Data Assets", href: "/dashboard/assets", icon: Database },
    ],
  },
  {
    group: "Quality",
    items: [
      { label: "Workflows", href: "/dashboard/workflows", icon: Workflow },
      { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
      { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full transition-all duration-300 border-r",
        collapsed ? "w-16" : "w-60"
      )}
      style={{
        background: "var(--sidebar)",
        borderColor: "var(--sidebar-border)",
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          {collapsed ? (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm shrink-0"
              style={{ background: "#00C9A7" }}
            >
              S
            </div>
          ) : (
            <Image
              src="/sohovi.svg"
              alt="Sohovi"
              width={96}
              height={24}
              className="h-6 w-auto brightness-0 invert"
            />
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-4 px-2 space-y-6" aria-label="Main navigation">
        {navItems.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--sidebar-foreground)", opacity: 0.5 }}>
                {group.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-label={collapsed ? item.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                        collapsed && "justify-center px-2",
                        active
                          ? "text-white"
                          : "hover:text-white",
                      )}
                      style={
                        active
                          ? { background: "var(--sidebar-accent)", color: "#00C9A7" }
                          : { color: "var(--sidebar-foreground)", opacity: 0.75 }
                      }
                    >
                      <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: "1.125rem", height: "1.125rem" }} aria-hidden="true" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Contextual help */}
      <SidebarContextHelp collapsed={collapsed} />

      {/* Collapse toggle */}
      <div className="px-2 pb-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg transition-colors hover:opacity-80"
          style={{ color: "var(--sidebar-foreground)", opacity: 0.5 }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
