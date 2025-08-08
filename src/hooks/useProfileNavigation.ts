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
    
    try {
      // In production, we might need to handle navigation differently
      const isProduction = process.env.NODE_ENV === 'production';
      
      if (isProduction) {
        console.log('🌍 Production environment detected, using enhanced navigation');
        
        // First attempt: Use Next.js router
        await router.push(profileUrl);
        
        // Wait a bit and check if navigation was successful
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const currentPath = window.location.pathname;
        const expectedPath = `/profile/${userId}`;
        
        if (!currentPath.includes(expectedPath)) {
          console.log('⚠️ Router navigation failed, trying service worker refresh');
          
          // Try refreshing service worker first
          await refreshServiceWorker();
          
          // Wait a bit more
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Check again
          const newPath = window.location.pathname;
          if (!newPath.includes(expectedPath)) {
            console.log('⚠️ Service worker refresh failed, showing debug helper');
            // Show debug helper by adding query parameter
            const debugUrl = `/?debug_profile=${userId}`;
            window.location.href = debugUrl;
          } else {
            console.log('✅ Service worker refresh successful');
          }
        } else {
          console.log('✅ Router navigation successful');
        }
      } else {
        // Development: Use normal router
        console.log('🛠️ Development environment, using normal router');
        await router.push(profileUrl);
      }
    } catch (error) {
      console.error('❌ Navigation error, using fallback:', error);
      // Ultimate fallback
      window.location.href = profileUrl;
    }
  }, [router]);

  return { navigateToProfile };
}