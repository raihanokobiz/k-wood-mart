/** @type {import('next').NextConfig} */
const nextConfig = {
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
