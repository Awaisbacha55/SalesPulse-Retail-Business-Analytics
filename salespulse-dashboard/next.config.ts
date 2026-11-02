import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Server action & external package config if needed
  serverExternalPackages: ["pg"],
};

export default nextConfig;

