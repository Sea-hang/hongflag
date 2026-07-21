import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare 部署时跳过 Next.js 图片优化（用 Cloudflare 的）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
