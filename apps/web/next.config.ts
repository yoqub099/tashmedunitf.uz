import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
];

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  poweredByHeader: false,
  // Shared workspace packages are shipped as TS source; let Next transpile them.
  transpilePackages: ['@tmtu/utils', '@tmtu/types'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // HTML sahifalar: dev'da — har doim yangi, prod'da — CDN bilan SWR
        source: '/:path((?!_next|api|storage).*)',
        headers: isDev
          ? [
              { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
              { key: 'Pragma', value: 'no-cache' },
            ]
          : [
              {
                key: 'Cache-Control',
                value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=30',
              },
              { key: 'CDN-Cache-Control', value: 'max-age=60, stale-while-revalidate=30' },
              { key: 'Vary', value: 'Accept-Language, Cookie' },
            ],
      },
      {
        // Static chunks: dev'da — keshsiz (HMR uchun), prod'da — 1 yil immutable
        source: '/_next/static/(.*)',
        headers: isDev
          ? [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }]
          : [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // Optimized images: dev'da — keshsiz, prod'da — 30 kun
        source: '/_next/image(.*)',
        headers: isDev
          ? [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }]
          : [
              {
                key: 'Cache-Control',
                value: 'public, max-age=2592000, stale-while-revalidate=86400',
              },
            ],
      },
      {
        // API routes — kesh yo'q
        source: '/api/(.*)',
        headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 2592000, // 30 kun
    unoptimized: process.env.NODE_ENV === 'development',
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    remotePatterns: [
      { protocol: 'http', hostname: '40.47.1.223', pathname: '/storage/**' },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        // Docker internal: frontend container → app container (SSR/image optimization)
        protocol: 'http',
        hostname: 'tmtu_app',
        port: '80',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '*.tdtutf.uz',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'tdtutf.uz',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'tashmedunitf.uz',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '*.tashmedunitf.uz',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
