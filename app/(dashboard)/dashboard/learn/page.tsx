import { Suspense } from "react";
import { LearnPageClient } from "@/components/learn/LearnPageClient";

export const metadata = { title: "Learn — Sohovi" };

export default function LearnPage() {
  return (
    <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 py-8">
      <Suspense>
        <LearnPageClient />
      </Suspense>
    </div>
  );
}
