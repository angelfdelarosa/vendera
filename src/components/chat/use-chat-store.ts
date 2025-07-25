
import { create } from 'zustand';
import type { Conversation, UserProfile } from '@/types';
import { type SupabaseClient, type User } from '@supabase/supabase-js';

interface ChatState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  selectConversation: (conversationId: string | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  updateConversation: (conversationId: string, updatedData: Partial<Conversation>) => void;
  handleStartConversation: (
    otherUser: UserProfile,
    authUser: User,
    supabase: SupabaseClient
  ) => Promise<string | null>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  selectedConversation: null,
  loading: true,
  setLoading: (loading) => set({ loading }),
  setConversations: (conversations) => set({ 
      conversations, 
      selectedConversation: get().selectedConversation 
        ? conversations.find(c => c.id === get().selectedConversation?.id) || null 
        : null, 
      loading: false 
  }),
  selectConversation: (conversationId) => {
    if (!conversationId) {
      set({ selectedConversation: null });
      return;
    }
    const conversation = get().conversations.find((c) => c.id === conversationId);
    
    set({ selectedConversation: conversation || null });
    // Note: Read status should be updated in the backend when messages are fetched/viewed.
  },
  updateConversation: (conversationId, updatedData) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, ...updatedData } : c
      ),
    }));
  },
  handleStartConversation: async (otherUser, authUser, supabase) => {
    if (!authUser || authUser.id === otherUser.user_id) {
      console.log("Cannot start conversation with yourself.");
      return null;
    }

    // Check if a conversation already exists between the two users
    const { data: existing, error: existingError } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(buyer_id.eq.${authUser.id},seller_id.eq.${otherUser.user_id}),and(buyer_id.eq.${otherUser.user_id},seller_id.eq.${authUser.id})`)
      .maybeSingle();

    if (existingError) {
        console.error("Error checking for existing conversation", existingError);
        return null;
    }

    if (existing) {
      get().selectConversation(existing.id);
      return existing.id;
    }

    // If no existing conversation, create a new one. Auth user is the buyer by default.
    const { data: newConversationData, error } = await supabase
      .from('conversations')
      .insert({
        buyer_id: authUser.id,
        seller_id: otherUser.user_id,
      })
      .select(`
        *,
        buyer:profiles!buyer_id(*),
        seller:profiles!seller_id(*)
      `)
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
    
    const newConvo: Conversation = {
      ...newConversationData,
      otherUser: newConversationData.seller, 
      lastMessage: "No messages yet.",
    };

    set(state => ({
        conversations: [newConvo, ...state.conversations],
        selectedConversation: newConvo
    }));

    return newConvo.id;
  },
}));
