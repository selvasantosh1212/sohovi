import { ClerkProvider } from "@clerk/nextjs";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getUnreadAlertCount } from "@/app/actions/alerts";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch unread count server-side so TopBar gets real data
  let unreadAlertCount = 0;
  try {
    unreadAlertCount = await getUnreadAlertCount();
  } catch {
    // Not authenticated yet or DB not set up — fall through with 0
  }

  return (
    <ClerkProvider>
      <DashboardShell unreadAlertCount={unreadAlertCount}>
        {children}
      </DashboardShell>
    </ClerkProvider>
  );
}
