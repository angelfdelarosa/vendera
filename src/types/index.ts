
export type Property = {
  id: string;
  title: string;
  price: number;
  currency: 'USD' | 'DOP';
  location: string;
  address: string;
  type: 'house' | 'apartment' | 'condo' | 'villa' | 'lot';
  bedrooms: number;
  bathrooms: number;
  area: number; 
  description: string;
  features: string[];
  images: string[];
  realtor_id: string;
  is_active?: boolean;
  realtor: {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
  };
};

export type UserProfile = {
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  email?: string;
};

export interface Message {
  id: number;
  created_at: string;
  conversation_id: string;
  sender_id: string;
  content: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  buyer: UserProfile;
  seller: UserProfile;
  last_message_sender_id: string | null;
  last_message_read: boolean;
  lastMessage?: string;
  // This is a client-side field to easily identify the other participant
  otherUser: UserProfile; 
}


export interface Rating {
  id?: number;
  created_at: string;
  rated_user_id: string;
  rater_user_id: string;
  rating: number;
  comment?: string | null;
}

export type ConversationFromDB = {
  id: string;
  created_at: string;
  buyer_id: string;
  seller_id: string;
  last_message_sender_id: string | null;
  last_message_read: boolean;
  buyer: UserProfile;
  seller: UserProfile;
  messages: { content: string }[];
};

