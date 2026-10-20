import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // 88 for the brochure pages, 35 for the blurred backdrop behind them
    qualities: [35, 75, 88],
  },
};

export default nextConfig;
