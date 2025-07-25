
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, AuthError, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useChatStore } from '@/components/chat/use-chat-store';
import { properties as mockProperties } from '@/lib/mock-data';
import type { Conversation as AppConversation } from '@/types';


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
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setConversations, setLoading: setChatLoading } = useChatStore();

  const fetchAndSetConversations = useCallback(async (userId: string) => {
    setChatLoading(true);
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        created_at,
        property_id,
        buyer_id,
        seller_id,
        last_message_sender_id,
        last_message_read,
        property:properties(id, title, images),
        buyer:profiles!buyer_id(user_id, full_name, avatar_url),
        seller:profiles!seller_id(user_id, full_name, avatar_url),
        messages(content, created_at, sender_id)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { referencedTable: 'messages', ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
    } else {
       const transformedConversations = data.map(convo => {
          if (!convo.buyer || !convo.seller) return null;

          const otherUser = convo.buyer_id === userId ? convo.seller : convo.buyer;
          const lastMessage = convo.messages[0];
          return {
              id: convo.id.toString(),
              user: {
                  user_id: otherUser.user_id,
                  full_name: otherUser.full_name,
                  avatar_url: otherUser.avatar_url,
                  username: null
              },
              property: {
                  ...(convo.property || mockProperties[0]),
                  id: convo.property?.id || "unknown",
                  title: convo.property?.title || "Conversation",
                  images: convo.property?.images || []
              },
              messages: [], // Not needed for the global list
              timestamp: lastMessage ? lastMessage.created_at : convo.created_at,
              lastMessage: lastMessage?.content || "No messages yet.",
              unread: !convo.last_message_read && convo.last_message_sender_id !== userId
          } as AppConversation;
      }).filter(Boolean) as AppConversation[];
      setConversations(transformedConversations);
    }
     setChatLoading(false);
  }, [supabase, setConversations, setChatLoading]);
  
  useEffect(() => {
    let conversationsChannel: RealtimeChannel | null = null;

    const setupUserSession = async (sessionUser: User | null) => {
        setUser(sessionUser);

        if (sessionUser) {
            await fetchAndSetConversations(sessionUser.id);
            conversationsChannel = supabase
                .channel('public:conversations')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'conversations', filter: `or(buyer_id.eq.${sessionUser.id},seller_id.eq.${sessionUser.id})` },
                    () => {
                        fetchAndSetConversations(sessionUser.id);
                    }
                )
                .subscribe();
        } else {
            // Clear conversations and unsubscribe on logout
            setConversations([]);
            if (conversationsChannel) {
                supabase.removeChannel(conversationsChannel);
                conversationsChannel = null;
            }
        }
        setLoading(false);
    };


    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setupUserSession(currentUser);
        if (event === 'SIGNED_IN' && router) {
          router.refresh();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      if (conversationsChannel) {
          supabase.removeChannel(conversationsChannel);
      }
    };
  }, [supabase, router, fetchAndSetConversations, setConversations, pathname]);


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
