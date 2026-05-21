/**
 * connectorStore.ts
 *
 * In-memory store for connector OAuth tokens and state.
 * PRIVACY: tokens are kept in JS heap only — never persisted to
 * localStorage, sessionStorage, or any server. Lost on page reload.
 */

import { create } from "zustand";

interface ConnectorAuthState {
  // OAuth access tokens — keyed by connector type, memory-only
  googleToken: string | null;
  // Pending PKCE state (code_verifier kept in memory between OAuth redirect and callback)
  pendingPKCE: {
    provider: string;
    codeVerifier: string;
    redirectUri: string;
  } | null;
  setGoogleToken: (token: string | null) => void;
  setPendingPKCE: (state: ConnectorAuthState["pendingPKCE"]) => void;
  clearPendingPKCE: () => void;
  clearAll: () => void;
}

export const useConnectorStore = create<ConnectorAuthState>()((set) => ({
  googleToken: null,
  pendingPKCE: null,
  setGoogleToken: (token) => set({ googleToken: token }),
  setPendingPKCE: (state) => set({ pendingPKCE: state }),
  clearPendingPKCE: () => set({ pendingPKCE: null }),
  clearAll: () => set({ googleToken: null, pendingPKCE: null }),
}));
