'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if still loading
    if (loading) return;

    // Don't redirect if user is authenticated
    if (user) return;

    // Don't redirect if already on landing page
    if (pathname === '/landing') return;

    // Redirect unauthenticated users to landing page
    router.push('/landing');
  }, [user, loading, router, pathname]);

  // Show loading while checking authentication or redirecting
  if (loading || (!user && pathname !== '/landing')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show children if user is authenticated or on landing page
  return <>{children}</>;
}