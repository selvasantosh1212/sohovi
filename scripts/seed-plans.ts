import * as fs from "fs";
import * as path from "path";

// Load .env.local manually so this script works standalone via npx tsx
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
if (!CLERK_SECRET_KEY) {
  console.error("Missing CLERK_SECRET_KEY in .env.local");
  process.exit(1);
}

const SEED_PLANS: { email: string; plan: string }[] = [
  { email: "santoshselva1212@gmail.com", plan: "pro" },
  { email: "selvaganapathypari@gmail.com", plan: "business" },
];

async function clerkFetch(path: string, options?: RequestInit) {
  const res = await fetch(`https://api.clerk.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Clerk API ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

async function seedPlans() {
  console.log("Seeding test user plans via Clerk API...\n");

  for (const { email, plan } of SEED_PLANS) {
    const params = new URLSearchParams();
    params.append("email_address[]", email);
    const result = await clerkFetch(`/users?${params.toString()}`);

    const users: { id: string; public_metadata: Record<string, unknown> }[] =
      result.data ?? result;

    if (!users.length) {
      console.warn(`⚠  User not found: ${email} — sign up first, then re-run`);
      continue;
    }

    const user = users[0];
    await clerkFetch(`/users/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        public_metadata: { ...user.public_metadata, plan },
      }),
    });

    console.log(`✓  ${email} → ${plan}`);
  }

  console.log("\nDone.");
}

seedPlans().catch((err) => {
  console.error(err);
  process.exit(1);
});
