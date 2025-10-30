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
        hostname: "server.K.WOOD MARTcom",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
