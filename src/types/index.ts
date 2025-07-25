
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
  property: Property;
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

export type ConversationFromDB = {
  id: string;
  created_at: string;
  property_id: string | null;
  sender_id: string;
  receiver_id: string;
  last_message: string | null;
  property: {
    id: string;
    title: string;
    images: string[];
  } | null;
  sender: UserProfile;
  receiver: UserProfile;
};
