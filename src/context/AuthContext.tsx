
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
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setConversations, setLoading: setChatLoading } = useChatStore();

  const fetchAndSetConversations = useCallback(async (userId: string) => {
    setChatLoading(true);
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        property:properties(id, title, images),
        sender:profiles!sender_id(user_id, full_name, avatar_url),
        receiver:profiles!receiver_id(user_id, full_name, avatar_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
    } else {
       const transformedConversations = data.map(convo => {
          const typedConvo = convo as unknown as ConversationFromDB;
          if (!typedConvo.sender || !typedConvo.receiver) return null;

          const otherUser = typedConvo.sender.user_id === userId ? typedConvo.receiver : typedConvo.sender;
          
          return {
              id: typedConvo.id.toString(),
              user: otherUser,
              property: {
                  id: typedConvo.property?.id || "unknown-property",
                  title: typedConvo.property?.title || "Conversation",
                  images: typedConvo.property?.images || [],
              } as any,
              messages: [],
              timestamp: typedConvo.created_at,
              lastMessage: typedConvo.last_message || "No messages yet.",
              unread: false, // This logic needs to be revisited based on a better schema
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
                    { event: '*', schema: 'public', table: 'conversations', filter: `or(sender_id.eq.${sessionUser.id},receiver_id.eq.${sessionUser.id})` },
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
