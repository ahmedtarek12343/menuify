import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xiirg2ns4k.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
