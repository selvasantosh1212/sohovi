import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ADMIN_IDS = (process.env.ADMIN_CLERK_USER_IDS ?? "").split(",").filter(Boolean);

/** Use in Server Components / Server Actions for admin-only pages */
export async function requireAdmin(): Promise<string> {
  const { userId } = await auth();
  if (!userId || !ADMIN_IDS.includes(userId)) {
    redirect("/dashboard");
  }
  return userId;
}

export function isAdmin(userId: string | null | undefined): boolean {
  if (!userId) return false;
  return ADMIN_IDS.includes(userId);
}

/**
 * Returns the active scope key for data isolation.
 * When the user is in an org context (team workspace), returns orgId.
 * Otherwise returns userId (personal workspace).
 * Use this in all data server actions so team members share the same data.
 */
export async function getScopeId(): Promise<string> {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");
  return orgId ?? userId;
}
