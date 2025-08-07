
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  
  console.log('=== MIDDLEWARE ===');
  console.log('Pathname:', pathname);
  console.log('Session exists:', !!session);
  console.log('User ID:', session?.user?.id);

  // Skip middleware for profile pages - they should be publicly accessible
  if (pathname.startsWith('/profile/')) {
    console.log('✅ MIDDLEWARE: Skipping middleware for profile page');
    return response;
  }

  // If user is not logged in and trying to access the root, redirect to /landing
  if (!session && pathname === '/') {
    console.log('🔄 MIDDLEWARE: Redirecting to landing page');
    return NextResponse.redirect(new URL('/landing', request.url));
  }

  // If user is logged in, check role-based redirections
  if (session?.user) {
    try {
      // Get user profile to check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const userRole = profile?.role || 'buyer';

      // Role-based route protection
      if (pathname.startsWith('/developer/') && userRole !== 'developer') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      if (pathname.startsWith('/agent/') && userRole !== 'agent') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Redirect developers to register if they don't have a developer profile
      if (userRole === 'developer' && pathname === '/') {
        const { data: developerProfile } = await supabase
          .from('developer_profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (!developerProfile) {
          return NextResponse.redirect(new URL('/developer/register', request.url));
        } else {
          return NextResponse.redirect(new URL('/developer/dashboard', request.url));
        }
      }

      // Redirect agents to their dashboard
      if (userRole === 'agent' && pathname === '/') {
        return NextResponse.redirect(new URL('/agent/dashboard', request.url));
      }
    } catch (error) {
      console.error('Middleware error:', error);
      // Continue with normal flow if there's an error
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
