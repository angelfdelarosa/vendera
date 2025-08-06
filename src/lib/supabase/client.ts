
'use client';

import { createBrowserClient } from '@supabase/ssr';

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
    
    console.log('✅ Supabase client created successfully');
    return supabaseInstance;
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error);
    throw error;
  }
}
