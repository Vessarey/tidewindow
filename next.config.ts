import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/tidewindow",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
