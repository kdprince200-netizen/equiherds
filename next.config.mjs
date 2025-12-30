/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lms-api.wiserbee.ca',
        port: '',
        pathname: '/Upload/Documents/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Suppress Ant Design React 19 compatibility warning
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Suppress specific warnings during build
    config.infrastructureLogging = {
      level: 'error',
    };
    
    return config;
  },
  // Turbopack configuration (required in Next.js 16 when using webpack config)
  turbopack: {},
  // Suppress console warnings in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  // React Compiler configuration (moved from experimental in Next.js 16)
  reactCompiler: false,
  // Permanently disable Next.js dev overlay and indicators
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  // Disable React Fast Refresh overlay
  reactStrictMode: false,
  // Suppress specific warnings
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;