"use client";

import * as React from "react";

interface TooltipProps {
  content: string;
  children: React.ReactElement;
}

/**
 * Simple hover tooltip.
 * Usage: <Tooltip content="Explanation"><SomeElement /></Tooltip>
 */
export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 rounded-md px-2.5 py-1.5 text-xs leading-relaxed text-slate-100 pointer-events-none z-50 shadow-lg whitespace-normal"
          style={{ background: "#1e293b" }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
