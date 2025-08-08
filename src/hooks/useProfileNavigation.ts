'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { refreshServiceWorker } from '@/lib/sw-utils';

export function useProfileNavigation() {
  const router = useRouter();

  const navigateToProfile = useCallback(async (userId: string) => {
    const profileUrl = `/profile/${userId}`;
    
    console.log('🔍 useProfileNavigation: Starting navigation to:', profileUrl);
    console.log('🔍 Current environment:', process.env.NODE_ENV);
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 User agent:', navigator.userAgent);
    
    // Check if we're in production
    const isProduction = process.env.NODE_ENV === 'production' || window.location.hostname.includes('vercel.app');
    
    if (isProduction) {
      console.log('🌍 Production detected - using direct navigation to avoid PWA/SW issues');
      
      // In production, use direct navigation to bypass any PWA/Service Worker issues
      try {
        // Clear any existing service worker cache for this route
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          for (const cacheName of cacheNames) {
            if (cacheName.includes('profile') || cacheName.includes('pages')) {
              console.log('🧹 Clearing cache:', cacheName);
              await caches.delete(cacheName);
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not clear cache:', error);
      }
      
      // Force direct navigation
      console.log('🚀 Using window.location.href for direct navigation');
      window.location.href = profileUrl;
      
    } else {
      // Development: Use normal router
      console.log('🛠️ Development environment, using Next.js router');
      try {
        await router.push(profileUrl);
        console.log('✅ Router navigation completed');
      } catch (error) {
        console.error('❌ Router navigation failed:', error);
        window.location.href = profileUrl;
      }
    }
  }, [router]);

  return { navigateToProfile };
}