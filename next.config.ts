import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization with modern formats
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      },
    ],
  },

  // Enable fast refresh and SWC minification
  reactStrictMode: true,

  // Optimize on-demand entries
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },

  // Server-side rendering optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      'framer-motion',
      'react-hot-toast',
    ],
  },

  // External packages that should not be bundled
  serverExternalPackages: ['@prisma/client'],

  // Optimize webpack bundle
  webpack: (config, { dev, isServer }) => {
    // Optimize production builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // React bundle
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
              name: 'react-vendor',
              priority: 50,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Animation libraries
            animations: {
              test: /[\\/]node_modules[\\/](framer-motion|@react-spring)[\\/]/,
              name: 'animations',
              priority: 40,
              reuseExistingChunk: true,
              enforce: true,
            },
            // UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
              name: 'ui-libs',
              priority: 35,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Utilities
            utils: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 10,
              reuseExistingChunk: true,
            },
            // Common code shared across chunks
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
        runtimeChunk: {
          name: 'runtime',
        },
      };

      // Minify CSS
      if (config.plugins) {
        config.plugins = config.plugins.map((plugin: any) => {
          if (plugin.constructor.name === 'TerserPlugin') {
            return new (require('terser-webpack-plugin'))({
              terserOptions: {
                compress: {
                  drop_console: true,
                  reduce_vars: true,
                },
                output: {
                  comments: false,
                },
              },
            });
          }
          return plugin;
        });
      }
    }

    return config;
  },

  // Compress assets
  compress: true,

  // Production source maps for error tracking
  productionBrowserSourceMaps: false,

  // Faster builds with SWC
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Environment variable inlining
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000',
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Cache images
      {
        source: '/logos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache fonts
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for optimization
  async redirects() {
    return [];
  },

  // Rewrites for API optimization
  async rewrites() {
    return [];
  },
};

export default nextConfig;
