/**
 * pkce.ts — OAuth 2.0 PKCE utilities (browser-only, no backend needed).
 *
 * Flow:
 * 1. generateCodeVerifier() → store in memory (Zustand)
 * 2. generateCodeChallenge(verifier) → include in OAuth URL as code_challenge
 * 3. Open OAuth URL in popup window
 * 4. Popup redirects to /dashboard/connect/callback → postMessage back authorization code
 * 5. exchangeCodeForToken(code, verifier, ...) → get access_token (no client_secret)
 */

export function generateCodeVerifier(): string {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(new Uint8Array(digest));
}

function base64URLEncode(buffer: Uint8Array): string {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export interface PKCEOAuthConfig {
  authUrl: string;
  tokenUrl: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  extraParams?: Record<string, string>;
}

/**
 * Build the OAuth authorization URL with PKCE parameters.
 */
export async function buildAuthUrl(
  config: PKCEOAuthConfig,
  codeVerifier: string,
  state: string
): Promise<string> {
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    access_type: "online",
    ...config.extraParams,
  });

  return `${config.authUrl}?${params.toString()}`;
}

/**
 * Exchange an authorization code for an access token.
 * No client_secret required — PKCE flow for SPA clients.
 */
export async function exchangeCodeForToken(opts: {
  tokenUrl: string;
  clientId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<string> {
  const res = await fetch(opts.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: opts.code,
      client_id: opts.clientId,
      code_verifier: opts.codeVerifier,
      redirect_uri: opts.redirectUri,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token exchange failed: ${res.status} — ${body}`);
  }

  const json = await res.json();
  if (!json.access_token) throw new Error("No access_token in response");
  return json.access_token as string;
}

/**
 * Open a popup window for OAuth and return the authorization code
 * via window.postMessage from the callback page.
 */
export function openOAuthPopup(
  url: string,
  expectedState: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const popup = window.open(url, "oauth_popup", "width=520,height=620,menubar=no,toolbar=no");

    if (!popup) {
      reject(new Error("Popup blocked. Allow popups for this site and try again."));
      return;
    }

    const openedPopup = popup;

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "OAUTH_CALLBACK") return;

      cleanup();

      if (event.data.error) {
        reject(new Error(`OAuth error: ${event.data.error}`));
        return;
      }
      if (event.data.state !== expectedState) {
        reject(new Error("OAuth state mismatch — possible CSRF"));
        return;
      }
      if (!event.data.code) {
        reject(new Error("No authorization code received"));
        return;
      }
      resolve(event.data.code as string);
    }

    function onPopupClose() {
      if (!openedPopup.closed) return;
      cleanup();
      reject(new Error("OAuth window was closed before completing"));
    }

    const pollInterval = setInterval(onPopupClose, 500);

    function cleanup() {
      window.removeEventListener("message", onMessage);
      clearInterval(pollInterval);
    }

    window.addEventListener("message", onMessage);
  });
}
