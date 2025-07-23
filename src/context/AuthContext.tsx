
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User, AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<{ error: AuthError | null }>;
  updateUser: (updates: { displayName?: string, photoURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock functions since auth is disabled
  const login = async (email: string, pass: string): Promise<{ error: AuthError | null }> => {
    console.log("Login attempt (auth disabled)");
    return { error: null };
  };

  const logout = async () => {
    console.log("Logout attempt (auth disabled)");
    router.push('/');
  };

  const signup = async (name: string, email: string, pass: string): Promise<{ error: AuthError | null }> => {
     console.log("Signup attempt (auth disabled)");
    return { error: null };
  };
  
  const updateUser = async (updates: { displayName?: string, photoURL?: string }) => {
     console.log("Update user attempt (auth disabled)");
  };

  const value = { 
    user, 
    loading, 
    login, 
    logout, 
    signup,
    updateUser
  };

  // We don't need a real provider if auth is disabled, but we keep it for components that might still use the hook.
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
