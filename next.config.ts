import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  
  // Add headers for proper audio file serving
  async headers() {
    return [
      {
        source: '/(.*).mp3',
        headers: [
          {
            key: 'Content-Type',
            value: 'audio/mpeg',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;