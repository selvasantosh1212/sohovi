"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function CallbackHandler() {
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (window.opener && typeof window.opener.postMessage === "function") {
      window.opener.postMessage(
        {
          type: "OAUTH_CALLBACK",
          code,
          state,
          error: error ?? errorDescription ?? null,
        },
        window.location.origin
      );
      window.close();
    } else {
      window.location.href = "/dashboard";
    }
  }, [params]);

  return null;
}

export default function ConnectCallbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-slate-500">
      <Loader2 className="w-6 h-6 animate-spin" />
      <p className="text-sm">Completing authentication…</p>
      <Suspense>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
