import type { NextConfig } from "next";

/**
 * Static export so the OS demo deploys to GitHub Pages (seed data, no server).
 * `NEXT_PUBLIC_BASE_PATH` is set at build time for project Pages (e.g. "/daric-os");
 * empty for local dev / custom domains / a real (server) deployment.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
