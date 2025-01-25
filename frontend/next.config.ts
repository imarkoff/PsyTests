import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: '8000',
                pathname: "/api/tests/**/image?**",
            }
        ]
    }
};

export default nextConfig;
