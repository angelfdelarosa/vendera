import { createClient } from '@supabase/supabase-js';

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
  return createClient(supabaseUrl, supabaseServiceRoleKey);
};