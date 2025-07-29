
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
  updateUserProfile: (profileUpdates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<(User & { profile?: UserProfile }) | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      console.log('🔄 RefreshUser: Starting user refresh...');
      const { data: { user: authData }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('❌ RefreshUser: Auth error:', authError);
        throw authError;
      }
      
      if (authData) {
        console.log('👤 RefreshUser: Auth user found, fetching profile...');
        
        try {
          // Use enhanced retry logic with timeout
          const profilePromise = userService.getProfile(authData.id, 2); // 2 retries for refresh
          const timeoutPromise = new Promise<null>((_, reject) => 
            setTimeout(() => reject(new Error('RefreshUser profile fetch timeout')), 8000)
          );
          
          const profile = await Promise.race([profilePromise, timeoutPromise]);
          console.log('📋 RefreshUser: Profile fetched:', profile);
          setUser({ ...authData, profile: profile || undefined });
          console.log('✅ RefreshUser: User updated in context');
        } catch (profileError) {
          console.error('❌ RefreshUser: Profile fetch failed:', profileError);
          // Set user without profile to allow app to continue
          setUser({ ...authData, profile: undefined });
        }
      } else {
        console.log('❌ RefreshUser: No auth user found');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ RefreshUser: Error during refresh:', error);
      throw error;
    }
  };

  const updateUserProfile = (profileUpdates: Partial<UserProfile>) => {
    console.log('🔄 UpdateUserProfile: Updating user profile in context...');
    if (user && user.profile) {
      const updatedProfile = { ...user.profile, ...profileUpdates };
      setUser({ ...user, profile: updatedProfile });
      console.log('✅ UpdateUserProfile: Profile updated in context');
    }
  };
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          try {
            console.log('🔄 AuthContext: Auth state changed, fetching profile...');
            
            // Add timeout to prevent hanging - increased to 10 seconds to account for retry logic
            const profilePromise = userService.getProfile(session.user.id);
            const timeoutPromise = new Promise<null>((_, reject) => 
              setTimeout(() => reject(new Error('Auth profile fetch timeout - this may indicate a database connection issue')), 10000)
            );
            
            const profile = await Promise.race([profilePromise, timeoutPromise]);
            setUser({ ...session.user, profile: profile || undefined });
            console.log('✅ AuthContext: Profile fetched and user updated');
          } catch (error) {
            console.error('❌ AuthContext: Error fetching profile on auth change:', error);
            
            // Test database connection to provide better error context
            const connectionOk = await userService.testConnection();
            if (!connectionOk) {
              console.error('❌ AuthContext: Database connection test failed - this may be a network or database issue');
            }
            
            // Set user without profile if fetch fails - this allows the app to continue working
            setUser({ ...session.user, profile: undefined });
            
            // Try to fetch profile in background after a delay
            setTimeout(async () => {
              try {
                console.log('🔄 AuthContext: Attempting background profile fetch...');
                const profile = await userService.getProfile(session.user.id, 2); // Fewer retries for background fetch
                if (profile) {
                  setUser(prevUser => prevUser ? { ...prevUser, profile } : null);
                  console.log('✅ AuthContext: Background profile fetch successful');
                }
              } catch (bgError) {
                console.error('❌ AuthContext: Background profile fetch failed:', bgError);
              }
            }, 3000); // Increased delay for background fetch
          }
        } else {
          setUser(null);
        }
        setLoading(false);
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
    refreshUser,
    updateUserProfile
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
