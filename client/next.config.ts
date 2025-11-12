import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8001",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "k-wood-mart-server.vercel.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;


