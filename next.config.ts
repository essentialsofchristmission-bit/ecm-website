import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/ministries/go-ye", destination: "/ministries/evangelism", permanent: true },
      { source: "/sermons/preachers/joe-kissinger-anokye", destination: "/sermons/preachers/kissinger-joe-anokye", permanent: true },
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
};

export default nextConfig;
