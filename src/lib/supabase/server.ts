import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createServerClient as createSSRClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client for server-side operations, using the service_role key.
 * This client can bypass Row Level Security and should be used with caution in
 * server-only environments (Server Components, Route Handlers, Server Actions).
 *
 * @returns A Supabase client instance with admin privileges.
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase URL or Service Role Key is missing from .env.local');
  }

  // This client is for server-side use only, with admin privileges.
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey);
};

/**
 * Creates a Supabase client for server-side operations with user context.
 * This client respects Row Level Security and uses the user's session.
 *
 * @returns A Supabase client instance with user context.
 */
export const createClient = async () => {
  const cookieStore = await cookies();

  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

/**
 * Alias for createClient to match your proposed naming convention
 * Creates a Supabase client for server-side operations with user context.
 */
export const createServerClient = createClient;