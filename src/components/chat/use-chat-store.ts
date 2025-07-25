
import { create } from 'zustand';
import type { Conversation, Message } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface ChatState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  selectConversation: (conversationId: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setConversations: (conversations: Conversation[]) => void;
  updateConversation: (conversationId: string, updatedData: Partial<Conversation>) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  selectedConversation: null,
  loading: true,
  setLoading: (loading) => set({ loading }),
  setConversations: (conversations) => set({ conversations, selectedConversation: null, loading: false }),
  selectConversation: (conversationId) => {
    if (!conversationId) {
      set({ selectedConversation: null });
      return;
    }
    const conversation = get().conversations.find((c) => c.id === conversationId);
    
    set((state) => ({
      selectedConversation: conversation || null,
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unread: false } : c
      ),
    }));
  },
  addMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, message],
              timestamp: new Date().toISOString(),
              lastMessage: message.text,
            }
          : c
      ),
    }));
  },
  updateConversation: (conversationId, updatedData) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, ...updatedData } : c
      ),
    }));
  },
}));
