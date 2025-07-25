
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
  id: string;
  text: string;
  sender: 'buyer' | 'seller';
  timestamp: string;
}

export interface Conversation {
  id: string;
  user: UserProfile;
  property: Pick<Property, 'id' | 'title' | 'images'>;
  messages: Message[];
  timestamp: string;
  unread: boolean;
  lastMessage?: string;
}

export interface Rating {
  id?: number;
  created_at: string;
  rated_user_id: string;
  rater_user_id: string;
  rating: number;
  comment?: string | null;
}

type UserFromAuth = {
  id: string;
  email: string;
}

export type ConversationFromDB = {
  id: string;
  created_at: string;
  property_id: string | null;
  last_message: string | null;
  last_message_at: string | null;
  user1: UserFromAuth | null;
  user2: UserFromAuth | null;
};
