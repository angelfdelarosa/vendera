
'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

// Singleton pattern para el cliente Supabase
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Si ya tenemos una instancia, la devolvemos (singleton)
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables');
    throw new Error('Missing Supabase configuration. Please check your environment variables.');
  }

  try {
    console.log('🔄 Creating new Supabase client instance');
    
    // Crear una nueva instancia del cliente
    supabaseInstance = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'vendra-auth-token',
          flowType: 'pkce',
          debug: process.env.NODE_ENV === 'development'
        },
        global: {
          headers: {
            'X-Client-Info': 'vendra-web-app'
          }
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      }
    );
    
    // Add auth state change listener after creating the client
    supabaseInstance.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log('🔄 Auth state change:', event, session?.user?.id || 'no user');
      
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        console.log(`🔄 Auth event: ${event}`);
      }
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in:', session.user.id);
      }
    });
    
    console.log('✅ Supabase client created successfully');
    return supabaseInstance;
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
    throw error;
  }
}
