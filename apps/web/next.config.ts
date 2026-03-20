import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"], // ensures UI package is compiled
  images: {
    remotePatterns: [new URL("https://uploads.codingthecode.site/**")],
  },
};

export default nextConfig;
