import { auth } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { code?: unknown; code_verifier?: unknown; redirect_uri?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { code, code_verifier, redirect_uri } = body;

  if (
    typeof code !== "string" ||
    typeof code_verifier !== "string" ||
    typeof redirect_uri !== "string"
  ) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
  if (new URL(redirect_uri, baseUrl).origin !== new URL(baseUrl).origin) {
    return Response.json({ error: "Invalid redirect_uri" }, { status: 400 });
  }

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return Response.json(
      { error: "Google OAuth is not configured on the server." },
      { status: 500 }
    );
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      code_verifier,
      redirect_uri,
    }),
  });

  const json = await tokenRes.json();

  if (!tokenRes.ok) {
    return Response.json(
      { error: json.error_description ?? json.error ?? "Token exchange failed" },
      { status: 502 }
    );
  }

  if (!json.access_token) {
    return Response.json({ error: "No access_token in Google response" }, { status: 502 });
  }

  return Response.json({ access_token: json.access_token });
}
