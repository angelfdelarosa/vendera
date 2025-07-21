
import { create } from 'zustand';
import { mockConversations } from '@/lib/mock-data';
import type { Conversation, Message, Property, UserProfile } from '@/types';

interface ChatState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  selectConversation: (conversationId: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  getConversationByPropertyId: (propertyId: string) => Conversation | undefined;
  getConversationByUserId: (userId: string) => Conversation | undefined;
  createConversation: (data: { user: UserProfile, property: Property }) => Conversation;
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
    set({ selectedConversation: conversation || null });
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
  getConversationByPropertyId: (propertyId) => {
    return get().conversations.find(c => c.property.id === propertyId);
  },
  getConversationByUserId: (userId: string) => {
    return get().conversations.find(c => c.user.id === userId);
  },
  createConversation: ({ user, property }) => {
    // Check if a conversation with this user and property already exists
    let existingConvo = get().conversations.find(c => c.user.id === user.id && c.property.id === property.id);
    if (existingConvo) {
      set({ selectedConversation: existingConvo });
      return existingConvo;
    }

    // Check if a conversation with this user already exists
    existingConvo = get().getConversationByUserId(user.id);
    if (existingConvo) {
        set({ selectedConversation: existingConvo });
        return existingConvo;
    }

    const newConversation: Conversation = {
      id: `convo-${crypto.randomUUID()}`,
      user,
      property,
      messages: [
        {
          id: crypto.randomUUID(),
          text: `Hi! I'm ${user.name}. I saw you're interested in the property "${property.title}". How can I help?`,
          sender: 'seller',
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      unread: false,
    };
    
    set(state => ({
      conversations: [newConversation, ...state.conversations],
      selectedConversation: newConversation,
    }));
    
    return newConversation;
  },
}));
