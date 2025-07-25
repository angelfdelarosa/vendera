
import { create } from 'zustand';
import type { Conversation, Message, Property, UserProfile } from '@/types';
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
    property: Property,
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
  handleStartConversation: async (property, authUser, supabase) => {
    if (!authUser || authUser.id === property.realtor.user_id) {
      console.log("Cannot start conversation with yourself.");
      return null;
    }

    // Check if a conversation already exists for this trio
    const { data: existing, error: existingError } = await supabase
      .from('conversations')
      .select('id')
      .eq('buyer_id', authUser.id)
      .eq('seller_id', property.realtor_id)
      .eq('property_id', property.id)
      .maybeSingle();

    if (existingError) {
        console.error("Error checking for existing conversation", existingError);
        return null;
    }

    if (existing) {
      get().selectConversation(existing.id);
      return existing.id;
    }

    // If no existing conversation, create a new one
    const { data: newConversationData, error } = await supabase
      .from('conversations')
      .insert({
        buyer_id: authUser.id,
        seller_id: property.realtor_id,
        property_id: property.id,
      })
      .select(`
        *,
        property:properties!inner(id, title, images),
        buyer:buyer_id!inner(*),
        seller:seller_id!inner(*)
      `)
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
    
    // Manually construct the full conversation object for the state
    const newConvo: Conversation = {
      ...newConversationData,
      otherUser: newConversationData.seller, // Since the authUser is the buyer
      lastMessage: "No messages yet.",
    };

    set(state => ({
        conversations: [newConvo, ...state.conversations],
        selectedConversation: newConvo
    }));

    return newConvo.id;
  },
}));
