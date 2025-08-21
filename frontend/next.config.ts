import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "plus.unsplash.com",
      "images.pexels.com",
      "img.freepik.com",
      "lh3.googleusercontent.com",
      "cdn.prod.website-files.com"
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  experimental: {
    optimizeCss: true,
  },
  // Enable static optimization for pages that don't need SSR
  reactStrictMode: true,
};

export default nextConfig;
