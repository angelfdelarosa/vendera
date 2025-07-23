
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
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
      }
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://tgmwexyipcwoppgikzrr.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbXdleHlpcGN3b3BwZ2lrenJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzE2MzEsImV4cCI6MjA2ODgwNzYzMX0.DRQyAsyi1BtSLVJDHnr29Xo1bKVufPAjEbO-vAKq4F4',
  }
};

export default nextConfig;
