/** @type {import('next').NextConfig} */
const nextConfig = {
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
