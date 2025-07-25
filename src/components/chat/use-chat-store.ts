
import { create } from 'zustand';
import type { Conversation, Message } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface ChatState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  selectConversation: (conversationId: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setConversations: (conversations: Conversation[]) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  selectedConversation: null,
  setConversations: (conversations) => set({ conversations }),
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

    // Also mark as read in the database
    if (conversation?.unread) {
      const supabase = createClient();
      const markAsRead = async () => {
        await supabase
          .from('conversations')
          .update({ last_message_read: true })
          .eq('id', conversationId);
      };
      markAsRead();
    }
  },
  addMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, message],
              timestamp: new Date().toISOString(),
            }
          : c
      ),
    }));
  },
}));

    