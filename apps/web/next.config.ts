import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"], // ensures UI package is compiled
  images: {
    remotePatterns: [
      new URL("https://meet-uploads.codingthecode.site/**"),
      {
        hostname: "lh3.googleusercontent.com",
      },
      { hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
