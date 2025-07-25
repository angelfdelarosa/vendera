
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, AuthError, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useChatStore } from '@/components/chat/use-chat-store';
import type { Conversation as AppConversation, ConversationFromDB, UserProfile } from '@/types';


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

    // Step 1: Fetch conversations and basic user info (from auth.users)
    const { data: conversationsData, error: conversationsError } = await supabase
      .from('conversations')
      .select(`
        *,
        property:properties(id, title, images),
        sender:sender_id(id, email),
        receiver:receiver_id(id, email)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (conversationsError) {
      console.error("Error fetching conversations:", conversationsError);
      setConversations([]);
      setChatLoading(false);
      return;
    }
    
    const typedConversations = conversationsData as unknown as ConversationFromDB[];

    // Step 2: Extract all unique user IDs to fetch their profiles
    const userIds = new Set<string>();
    typedConversations.forEach(convo => {
      userIds.add(convo.sender_id);
      userIds.add(convo.receiver_id);
    });

    // Step 3: Fetch profiles for all involved users
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url, username, created_at')
      .in('user_id', Array.from(userIds));

    if (profilesError) {
      console.error("Error fetching profiles for conversations:", profilesError);
      // We can still proceed with partial data if needed
    }

    const profilesMap = new Map<string, UserProfile>(
      profilesData?.map(p => [p.user_id, p as UserProfile]) || []
    );

    // Step 4: Transform and combine data
    const transformedConversations = typedConversations.map(convo => {
      const otherUserAuth = convo.sender_id === userId ? convo.receiver : convo.sender;
      const otherUserProfile = profilesMap.get(otherUserAuth.id) || { user_id: otherUserAuth.id, full_name: otherUserAuth.email || 'Unknown User' };
      
      const finalOtherUser: UserProfile = {
          user_id: otherUserAuth.id,
          full_name: otherUserProfile.full_name || otherUserAuth.email,
          avatar_url: otherUserProfile.avatar_url,
          username: otherUserProfile.username,
          created_at: otherUserProfile.created_at,
          email: otherUserAuth.email || undefined,
      };

      return {
        id: convo.id,
        user: finalOtherUser,
        property: convo.property || { id: 'deleted-property', title: 'Deleted Property', images: [] },
        messages: [], // Messages are fetched separately
        timestamp: convo.created_at,
        lastMessage: convo.last_message || "No messages yet.",
        unread: false, // This logic can be improved later
      } as AppConversation;
    });

    setConversations(transformedConversations);
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
