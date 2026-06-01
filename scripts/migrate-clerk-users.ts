/**
 * One-time script to migrate users from Clerk dev instance → production instance.
 * Passwords cannot be migrated (hashed). Email+password users must use "Forgot password".
 * OAuth users (Google, Microsoft) migrate fully and can sign in immediately.
 *
 * Usage:
 *   1. Fill in PROD_SECRET_KEY below (sk_live_... from Clerk Dashboard → API Keys)
 *   2. npx ts-node --esm scripts/migrate-clerk-users.ts
 */

const DEV_SECRET_KEY = "sk_test_flf6pPaMVlTPHGVYrYoPIoxcuWrpnJz3QBqjzYRjWS";
const PROD_SECRET_KEY = "PASTE_YOUR_sk_live_KEY_HERE";

const CLERK_API = "https://api.clerk.com/v1";

interface ClerkEmail {
  id: string;
  email_address: string;
}

interface ClerkUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_addresses: ClerkEmail[];
  primary_email_address_id: string | null;
}

async function clerkGet(secretKey: string, path: string): Promise<ClerkUser[]> {
  const res = await fetch(`${CLERK_API}${path}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<ClerkUser[]>;
}

async function clerkPost(secretKey: string, path: string, body: object): Promise<Response> {
  return fetch(`${CLERK_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

async function migrate() {
  if (PROD_SECRET_KEY === "PASTE_YOUR_sk_live_KEY_HERE") {
    console.error("ERROR: Set PROD_SECRET_KEY in the script before running.");
    process.exit(1);
  }

  let offset = 0;
  const limit = 100;
  let migrated = 0;
  let skipped = 0;

  while (true) {
    const users = await clerkGet(DEV_SECRET_KEY, `/users?limit=${limit}&offset=${offset}`);
    if (!users.length) break;

    for (const user of users) {
      const primaryEmail = user.email_addresses.find(
        (e) => e.id === user.primary_email_address_id
      )?.email_address;

      if (!primaryEmail) {
        console.warn(`Skipping user ${user.id} — no primary email`);
        skipped++;
        continue;
      }

      const body: Record<string, unknown> = {
        email_address: [primaryEmail],
        skip_password_requirement: true,
      };
      if (user.first_name) body.first_name = user.first_name;
      if (user.last_name) body.last_name = user.last_name;

      const res = await clerkPost(PROD_SECRET_KEY, "/users", body);
      if (res.ok) {
        console.log(`Migrated: ${primaryEmail}`);
        migrated++;
      } else {
        const err = await res.json() as { errors?: { message: string }[] };
        const msg = err.errors?.[0]?.message ?? res.status;
        console.warn(`Skipped ${primaryEmail}: ${msg}`);
        skipped++;
      }
    }

    if (users.length < limit) break;
    offset += limit;
  }

  console.log(`\nDone. Migrated: ${migrated}, Skipped: ${skipped}`);
  console.log("Email+password users must use 'Forgot password' to set a new password in production.");
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
