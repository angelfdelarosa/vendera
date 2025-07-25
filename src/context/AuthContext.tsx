
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, AuthError, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useChatStore } from '@/components/chat/use-chat-store';
import type { Conversation as AppConversation, ConversationFromDB } from '@/types';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<{ error: AuthError | null }>;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const router = useRouter();
  const { setConversations, setLoading: setChatLoading } = useChatStore();

  const fetchAndSetConversations = useCallback(async (userId: string) => {
    setChatLoading(true);

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        buyer:profiles!buyer_id(*),
        seller:profiles!seller_id(*),
        messages ( content, created_at )
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { referencedTable: 'messages', ascending: false })
      .limit(1, { referencedTable: 'messages' });


    if (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
      setChatLoading(false);
      return;
    }
    
    if (!data) {
        setConversations([]);
        setChatLoading(false);
        return;
    }

    const transformedConversations = (data as unknown as ConversationFromDB[]).map(convo => {
        const otherUser = convo.buyer_id === userId ? convo.seller! : convo.buyer!;
        return {
            ...convo,
            lastMessage: convo.messages?.[0]?.content || "No messages yet.",
            otherUser,
        } as AppConversation;
    });

    setConversations(transformedConversations);
    setChatLoading(false);
  }, [supabase, setConversations, setChatLoading]);
  
  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const setupUserSession = async (sessionUser: User | null) => {
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
    
    // Set initial user synchronously
    const initialSession = supabase.auth.getSession();
    initialSession.then(({ data: { session } }) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false); // Initial load complete
        setupUserSession(currentUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser); // Update user state on change
        setupUserSession(currentUser);
        if (event === 'SIGNED_IN') {
          router.refresh();
        }
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
    setUser(null);
  };

  const signup = async (name: string, email: string, pass: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
          avatar_url: `https://placehold.co/128x128.png?text=${name.charAt(0)}`
        },
      },
    });
    return { error };
  };
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const value = { 
    user, 
    loading, 
    login, 
    logout, 
    signup,
    supabase
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
