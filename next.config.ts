import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Year the build ran; components/Year.tsx swaps in the live year after load.
  env: { BUILD_YEAR: String(new Date().getFullYear()) },
};

export default nextConfig;
