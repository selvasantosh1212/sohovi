"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
  unreadCount: number;
}

export function AlertBell({ unreadCount }: Props) {
  return (
    <Link
      href="/dashboard/alerts"
      className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <Badge
          className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[10px] font-bold text-white border-0"
          style={{ background: "#EF4444" }}
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </Badge>
      )}
    </Link>
  );
}
