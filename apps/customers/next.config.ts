import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
});

const nextConfig: NextConfig = withPWA({
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ["@shared/lib"],
});

export default nextConfig;
