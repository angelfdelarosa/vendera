
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, AuthError, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useChatStore } from '@/components/chat/use-chat-store';
import type { Conversation as AppConversation, ConversationFromDB, UserProfile, Property } from '@/types';


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

    const { data: conversationsData, error: conversationsError } = await supabase
      .from('conversations')
      .select(`
        id, 
        created_at, 
        last_message,
        last_message_at,
        property_id,
        user1:user1_id(id, email),
        user2:user2_id(id, email)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    if (conversationsError) {
      console.error("Error fetching conversations:", conversationsError);
      setConversations([]);
      setChatLoading(false);
      return;
    }

    if (!conversationsData || conversationsData.length === 0) {
      setConversations([]);
      setChatLoading(false);
      return;
    }
    
    const typedConversations = conversationsData as unknown as ConversationFromDB[];

    const userIds = new Set<string>();
    const propertyIds = new Set<string>();
    typedConversations.forEach(convo => {
      if (convo.user1?.id) userIds.add(convo.user1.id);
      if (convo.user2?.id) userIds.add(convo.user2.id);
      if (convo.property_id) propertyIds.add(convo.property_id);
    });

    const [profilesResponse, propertiesResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url, username, created_at, email')
          .in('user_id', Array.from(userIds)),
        supabase
          .from('properties')
          .select('id, title, images')
          .in('id', Array.from(propertyIds))
    ]);

    if (profilesResponse.error) console.error("Error fetching profiles:", profilesResponse.error);
    if (propertiesResponse.error) console.error("Error fetching properties:", propertiesResponse.error);
    
    const profilesMap = new Map<string, UserProfile>(
        profilesResponse.data?.map(p => [p.user_id, p as UserProfile]) || []
    );
    const propertiesMap = new Map<string, Pick<Property, 'id' | 'title' | 'images'>>(
        propertiesResponse.data?.map(p => [p.id, p as Pick<Property, 'id' | 'title' | 'images'>]) || []
    );

    const transformedConversations = typedConversations.map(convo => {
        const otherUserAuth = convo.user1?.id === userId ? convo.user2 : convo.user1;
        const otherUserProfile = profilesMap.get(otherUserAuth?.id || '') || { user_id: otherUserAuth?.id || 'unknown', full_name: otherUserAuth?.email || 'Unknown User', avatar_url: null, username: 'unknown' };
        
        const property = convo.property_id ? propertiesMap.get(convo.property_id) : null;

        return {
            id: convo.id,
            user: otherUserProfile,
            property: property || { id: 'deleted-property', title: 'Deleted Property', images: [] },
            messages: [],
            timestamp: convo.last_message_at || convo.created_at,
            lastMessage: convo.last_message || "No messages yet.",
            unread: false,
        } as AppConversation;
    }).filter(c => c.user && c.property);

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
                    { event: '*', schema: 'public', table: 'conversations', filter: `or(user1_id.eq.${sessionUser.id},user2_id.eq.${sessionUser.id})` },
                    () => {
                        fetchAndSetConversations(sessionUser.id);
                    }
                )
                .subscribe();
        } else {
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
