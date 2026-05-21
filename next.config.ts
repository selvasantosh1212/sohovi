import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is the default in Next.js 16 — empty config silences the warning
  turbopack: {},
  // Allow larger request bodies for Server Actions (profiling result payloads)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
