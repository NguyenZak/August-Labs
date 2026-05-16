import type { NextConfig } from "next";
import { securityHeaders, getCspHeader } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  async redirects() {
    return [
      {
        source: '/post/:slug',
        destination: '/magazine/:slug',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...securityHeaders,
          {
            key: 'Content-Security-Policy',
            value: getCspHeader(process.env.NEXT_PUBLIC_SUPABASE_URL || ''),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
