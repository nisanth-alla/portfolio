import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phone/other devices on your LAN to load HMR + dev bundles (Next.js 16+)
  allowedDevOrigins: ["192.168.0.110"],
};

export default nextConfig;
