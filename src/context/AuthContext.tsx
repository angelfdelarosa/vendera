
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, AuthError, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<{ error: AuthError | null }>;
  updateUser: (updates: { displayName?: string, photoURL?: string }) => Promise<void>;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const signup = async (name: string, email: string, pass: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    return { error };
  };
  
  const updateUser = async (updates: { displayName?: string, photoURL?: string }) => {
     if (!user) throw new Error("No user is logged in");
     
     const { data, error } = await supabase.auth.updateUser({
        data: {
            full_name: updates.displayName,
            avatar_url: updates.photoURL,
        }
     });

     if (error) throw error;
     // Manually update user state if needed, or rely on onAuthStateChange
     if (data.user) {
        setUser(data.user);
     }
  };

  const value = { 
    user, 
    loading, 
    login, 
    logout, 
    signup,
    updateUser,
    supabase
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
