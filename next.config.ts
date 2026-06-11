import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow larger request bodies for Server Actions (profiling result payloads)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sohovi.com" }],
        destination: "https://sohovi.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
