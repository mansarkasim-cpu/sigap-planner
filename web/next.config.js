/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Default to a relative API path so production builds use same-origin `/api`.
    // Allow overriding at build time via environment variable.
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
  async rewrites() {
    // In development, proxy /api requests to backend to avoid CORS issues.
    if (process.env.NODE_ENV !== 'production') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:4000/api/:path*',
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;