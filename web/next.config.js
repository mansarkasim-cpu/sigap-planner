/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Default to a relative API path so production builds use same-origin `/api`.
    // Allow overriding at build time via environment variable.
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    // Expose package version to the client as NEXT_PUBLIC_VERSION. Can be
    // overridden by setting the env var at build time.
    NEXT_PUBLIC_VERSION:
      process.env.NEXT_PUBLIC_VERSION || require('./package.json').version,
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