/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Image optimization with AVIF/WebP formats and long-term cache
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.parqet.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // Tree-shaking & module optimization
  experimental: {
    optimizePackageImports: ["lucide-react", "sonner", "@reduxjs/toolkit"],
  },

  // HTTP Cache-Control headers for public static assets (images, icons)
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      { source: "/dashboard", destination: "/user/dashboard" },
      { source: "/alerts", destination: "/user/alerts" },
      { source: "/watchlist", destination: "/user/watchlist" },
      { source: "/settings", destination: "/user/settings" },
      { source: "/subscription", destination: "/user/subscription" },
      { source: "/stocks/:symbol*", destination: "/user/stocks/:symbol*" },
    ];
  },
};

export default nextConfig;
