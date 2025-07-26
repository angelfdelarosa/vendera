
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, AuthError, SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/types';
import { userService } from '@/lib/user.service';


interface AuthContextType {
  user: (User & { profile?: UserProfile }) | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<{ error: AuthError | null }>;
  supabase: SupabaseClient;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<(User & { profile?: UserProfile }) | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const { data: { user: authData } } = await supabase.auth.getUser();
    if (authData) {
        const profile = await userService.getProfile(authData.id);
        setUser({ ...authData, profile: profile || undefined });
    } else {
        setUser(null);
    }
  };
  
  useEffect(() => {
    const setupUserSession = async (sessionUser: User | null) => {
        setLoading(true);
        if (sessionUser) {
            const profile = await userService.getProfile(sessionUser.id);
            setUser({ ...sessionUser, profile: profile || undefined });
        } else {
            setUser(null);
        }
        setLoading(false);
    };
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setupUserSession(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setupUserSession(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);


  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const signup = async (name: string, email: string, pass: string) => {
    try {
      await userService.signUp(email, pass, { full_name: name });
      return { error: null };
    } catch (error: any) {
      return { error: error as AuthError };
    }
  };
  
  const value = { 
    user, 
    loading, 
    login, 
    logout, 
    signup,
    supabase,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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
