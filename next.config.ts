import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow larger request bodies for Server Actions (profiling result payloads)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
