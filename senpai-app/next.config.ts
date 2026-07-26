import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phone/tablet preview over the local network (dev only)
  allowedDevOrigins: ["192.168.1.254", "localhost"],
};

export default nextConfig;
