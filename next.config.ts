
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 1000,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase body size limit for file uploads
    },
  },
  images: {
    // Habilitamos la optimización de imágenes para un mejor rendimiento.
    unoptimized: false,
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
        hostname: 'qlbuwoyugbwpzzwdflsq.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'qmbzgazhkhiymbwngzox.supabase.co',
        port: '',
        pathname: '/**',
      },

    ],
  },
};

export default nextConfig;
