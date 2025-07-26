
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
    is_seller?: boolean;
  };
};

export type UserProfile = {
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  email?: string | null;
  subscription_status?: 'active' | 'inactive';
  is_seller: boolean;
  // Seller Onboarding Info
  national_id?: string | null;
  birth_date?: string | null; // Storing as ISO string (YYYY-MM-DD)
  nationality?: string | null;
  phone_number?: string | null;
  full_address?: string | null;
  id_front_url?: string | null;
  id_back_url?: string | null;
  is_profile_complete?: boolean;
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
  buyer_id: string;
  seller_id: string;
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
};
