
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, AuthError, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useChatStore } from '@/components/chat/use-chat-store';
import type { Conversation as AppConversation, ConversationFromDB, Property } from '@/types';
import { userService } from '@/lib/user.service';


interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAndSetConversations = useCallback(async (userId: string) => {
    setChatLoading(true);

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        buyer:profiles!buyer_id(*),
        seller:profiles!seller_id(*)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);


    if (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
    } else if (data) {
      const transformedConversations = (data as unknown as ConversationFromDB[]).map(convo => {
          const otherUser = convo.buyer_id === userId ? convo.seller! : convo.buyer!;
          return {
              ...convo,
              // This should be derived from the latest message if fetched
              // For now, we set a placeholder. The trigger will update the real last message info.
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
    setUser(user);
  };
  
  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const setupUserSession = async (sessionUser: User | null) => {
        setLoading(true);
        setUser(sessionUser);

        if (sessionUser) {
            await fetchAndSetConversations(sessionUser.id);
            // Listen to changes on both conversations and messages tables.
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
            setConversations([]);
            if (channel) {
                supabase.removeChannel(channel);
                channel = null;
            }
        }
        setLoading(false);
    };
    
    // Set initial user synchronously and then setup session
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
    // The onAuthStateChange listener will handle setting user to null.
  };

  const signup = async (name: string, email: string, pass: string) => {
    try {
      // Delegate signup logic to the user service
      await userService.signUp(email, pass, { full_name: name });
      // The onAuthStateChange listener will handle setting the user state.
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
