"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { AlertBell } from "@/components/alerts/AlertBell";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  unreadAlertCount: number;
}

export function DashboardShell({ children, unreadAlertCount }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-white text-[#1E3A5F] font-semibold px-4 py-2 rounded-lg shadow"
      >
        Skip to main content
      </a>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          role="presentation"
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 md:relative md:z-auto",
          "transition-transform duration-300",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <TopBar
          onMenuClick={() => setMobileSidebarOpen((v) => !v)}
          mobileSidebarOpen={mobileSidebarOpen}
          alertBell={<AlertBell unreadCount={unreadAlertCount} />}
        />
        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
