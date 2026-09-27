import type { NextConfig } from "next";

// Images are served as optimised, responsive WebP. AVIF is left off: it saves
// a little more but encodes slowly on first request. Widths stop at 2048px
// because source photos are prepared at 2000px (see public/images/).
const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1280, 1600, 2048],
  },
};

export default nextConfig;
