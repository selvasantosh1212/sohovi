import { auth, currentUser } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { getDodo } from "@/lib/dodo/client";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const customerId = user?.publicMetadata?.dodo_customer_id as string | undefined;
  if (!customerId) {
    return Response.json({ error: "No billing account found for this user" }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

  const session = await getDodo().customers.customerPortal.create(customerId, {
    return_url: `${baseUrl}/dashboard/billing`,
  });

  return Response.json({ url: session.link });
}
