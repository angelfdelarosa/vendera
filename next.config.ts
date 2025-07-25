
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  staticPageGenerationTimeout: 1000,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'noyztbqdgfniixzmpuac.supabase.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://noyztbqdgfniixzmpuac.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5veXp0YnFkZ2ZuaWl4em1wdWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyOTcwNzEsImV4cCI6MjA2ODg3MzA3MX0.WcQOBRjEYQun3eFIzSrupRFmjJArY2jXToMURoylciY',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.minimizer = config.optimization.minimizer.map((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions.keep_classnames = false;
          minimizer.options.terserOptions.keep_fnames = false;
        }
        return minimizer;
      });
    }
    return config;
  },
};

export default nextConfig;
