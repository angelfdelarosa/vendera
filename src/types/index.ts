export type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  address: string;
  type: 'house' | 'apartment' | 'condo' | 'villa';
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
}
