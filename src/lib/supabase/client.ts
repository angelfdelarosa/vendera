
'use client';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient;

function getSupabase() {
  if (!supabase) {
    supabase = createPagesBrowserClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    });
  }
  return supabase;
}

export const supabaseClient = getSupabase();
