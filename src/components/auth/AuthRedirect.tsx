'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, loading, clearSession } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showSessionError, setShowSessionError] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    // Don't redirect if still loading
    if (loading) return;

    // Don't redirect if user is authenticated
    if (user) return;

    // Don't redirect if already on landing page or login/signup pages
    if (pathname === '/landing' || pathname === '/login' || pathname === '/signup') return;

    // Check if we're dealing with a session error (user was trying to access protected content)
    // Profile pages should be viewable by everyone, so they're not fully protected
    const isFullyProtectedRoute = pathname.startsWith('/developer/') || 
                                 pathname.startsWith('/agent/') ||
                                 pathname.startsWith('/messages') ||
                                 pathname.startsWith('/favorites');

    if (isFullyProtectedRoute) {
      // Show session error instead of immediate redirect for protected routes
      setShowSessionError(true);
      return;
    }

    // For profile routes, allow viewing but show limited functionality
    if (pathname.startsWith('/profile/')) {
      // Don't redirect, let the profile component handle the authentication state
      return;
    }

    // Redirect unauthenticated users to landing page for other routes
    router.push('/landing');
  }, [user, loading, router, pathname]);

  const handleClearSession = async () => {
    setIsClearing(true);
    try {
      await clearSession();
      // Redirect to login after clearing session
      router.push('/login');
    } catch (error) {
      console.error('Error clearing session:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  // Show session error for protected routes
  if (showSessionError && !loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
            <CardTitle>Sesión Expirada</CardTitle>
            <CardDescription>
              Tu sesión ha expirado o hay un problema con la autenticación. 
              Por favor, inicia sesión nuevamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleGoToLogin} 
              className="w-full"
              variant="default"
            >
              Iniciar Sesión
            </Button>
            <Button 
              onClick={handleClearSession} 
              className="w-full"
              variant="outline"
              disabled={isClearing}
            >
              {isClearing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Limpiando...
                </>
              ) : (
                'Limpiar Sesión y Reintentar'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while checking authentication or redirecting
  // Don't show loading for profile pages, landing, login, signup, or home page
  const isPublicPage = pathname === '/landing' || 
                      pathname === '/login' || 
                      pathname === '/signup' || 
                      pathname === '/' ||
                      pathname.startsWith('/profile/');
  
  if (loading || (!user && !isPublicPage)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Show children if user is authenticated or on public pages
  return <>{children}</>;
}