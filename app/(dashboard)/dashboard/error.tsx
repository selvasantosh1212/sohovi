"use client";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-lg font-semibold text-slate-800">Something went wrong</h2>
      <p className="text-sm text-slate-500">This page failed to load. Try refreshing.</p>
      <button
        onClick={reset}
        className="px-4 py-2 text-sm font-medium rounded-full border border-slate-200 hover:bg-slate-50"
      >
        Try again
      </button>
    </div>
  );
}
