
import { create } from 'zustand';
import type { Conversation, Message, Property } from '@/types';
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
    const { conversations } = get();
    const sellerId = property.realtor_id;

    if (!authUser || authUser.id === sellerId) {
      console.log("Cannot start conversation with yourself.");
      return null;
    }

    const existingConversation = conversations.find(
      c => c.property_id === property.id && c.buyer_id === authUser.id && c.seller_id === sellerId
    );

    if (existingConversation) {
      get().selectConversation(existingConversation.id);
      return existingConversation.id;
    }

    // If no existing conversation, create a new one
    const { data: newConversationData, error } = await supabase
      .from('conversations')
      .insert({
        buyer_id: authUser.id,
        seller_id: sellerId,
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
    
    // Manually add the lastMessage field
    const newConvo = {
      ...newConversationData,
      otherUser: newConversationData.seller, // Since the authUser is the buyer
      lastMessage: "No messages yet."
    };

    set(state => ({
        conversations: [newConvo, ...state.conversations],
        selectedConversation: newConvo
    }));

    return newConvo.id;
  },
}));
