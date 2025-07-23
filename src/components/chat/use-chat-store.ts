
import { create } from 'zustand';
import { mockConversations } from '@/lib/mock-data';
import type { Conversation, Message, Property, UserProfile } from '@/types';

interface ChatState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  selectConversation: (conversationId: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: mockConversations,
  selectedConversation: null,
  selectConversation: (conversationId) => {
    if (!conversationId) {
      set({ selectedConversation: null });
      return;
    }
    const conversation = get().conversations.find((c) => c.id === conversationId);
    
    set((state) => ({
      selectedConversation: conversation || null,
      // Mark the selected conversation as read
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
              timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            }
          : c
      ),
    }));
  },
}));
