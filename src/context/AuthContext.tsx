
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, AuthError, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useChatStore } from '@/components/chat/use-chat-store';
import type { Conversation as AppConversation, ConversationFromDB, UserProfile } from '@/types';
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
  const router = useRouter();
  const { setConversations, setLoading: setChatLoading } = useChatStore();
  const [user, setUser] = useState<(User & { profile?: UserProfile }) | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAndSetConversations = useCallback(async (userId: string) => {
    setChatLoading(true);
    
    const { data: convos, error: convosError } = await supabase
      .from('conversations')
      .select('*, buyer:profiles!buyer_id(*), seller:profiles!seller_id(*)')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

    if (convosError) {
      console.error("Error fetching conversations:", convosError);
      setConversations([]);
      setChatLoading(false);
      return;
    }
    
    if (convos) {
       const transformedConversations = (convos as unknown as ConversationFromDB[]).map(c => {
        const otherUser = c.buyer_id === userId ? c.seller! : c.buyer!;
        return {
            ...c,
            lastMessage: "No messages yet.", 
            otherUser,
        } as AppConversation;
      });
      setConversations(transformedConversations);
    } else {
        setConversations([]);
    }
    setChatLoading(false);
  }, [supabase, setConversations, setChatLoading]);
  
  const refreshUser = async () => {
    const { data: { user } } = await supabase.auth.refreshSession();
    if (user) {
        const profile = await userService.getProfile(user.id);
        setUser({ ...user, profile: profile || undefined });
    } else {
        setUser(null);
    }
  };
  
  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const setupUserSession = async (sessionUser: User | null) => {
        setLoading(true);
        if (sessionUser) {
            const profile = await userService.getProfile(sessionUser.id);
            setUser({ ...sessionUser, profile: profile || undefined });
            await fetchAndSetConversations(sessionUser.id);
             channel = supabase
                .channel('db-changes')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'messages' },
                    () => fetchAndSetConversations(sessionUser.id)
                )
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'conversations' },
                    () => fetchAndSetConversations(sessionUser.id)
                )
                .subscribe();
        } else {
            setUser(null);
            setConversations([]);
            if (channel) {
                supabase.removeChannel(channel);
                channel = null;
            }
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
      if (channel) {
          supabase.removeChannel(channel);
      }
    };
  }, [supabase, router, fetchAndSetConversations, setConversations]);


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
