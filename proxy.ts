import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Clerk middleware temporarily bypassed while production instance activates.
// Restore clerkMiddleware once sohovi.com Clerk instance is confirmed Active.
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
