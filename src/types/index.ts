// Base type for a user profile, matching the database table
export interface UserProfile {
  id: string; // This is the primary key that references auth.users(id)
  full_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  updated_at: string | null;
  created_at: string | null;
  subscription_status: 'active' | 'inactive' | null;
  is_profile_complete: boolean | null;
  // Seller onboarding fields
  national_id: string | null;
  birth_date: string | null;
  nationality: string | null;
  phone_number: string | null;
  full_address: string | null;
  id_front_url: string | null;
  id_back_url: string | null;
  is_seller: boolean | null;
}

// Base type for a property, matching the database table
export interface Property {
  id: string; // UUID
  realtor_id: string; // UUID
  title: string;
  description: string | null;
  price: number;
  currency?: 'USD' | 'DOP';
  location: string | null;
  address: string | null;
  type: 'house' | 'apartment' | 'condo' | 'villa' | 'lot' | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  features: string[] | null;
  images: string[] | null;
  is_active?: boolean;
  created_at: string | null;
  // Optional realtor information (populated when joined)
  realtor?: Pick<UserProfile, 'id' | 'full_name' | 'avatar_url' | 'username'> | null;
}

// Combined type for a property including the realtor's profile info
export interface PropertyWithRealtor extends Property {
  profiles: Pick<UserProfile, 'full_name' | 'avatar_url'> | null;
}

// Rating type matching the database table
export interface Rating {
  id: number;
  created_at: string;
  rated_user_id: string;
  rater_user_id: string;
  rating: number;
  comment: string | null;
}

// Message type matching the database table
export interface Message {
  id: number; // BIGINT
  created_at: string;
  conversation_id: string; // UUID
  sender_id: string; // UUID
  content: string;
}

// Base conversation type from database
export interface ConversationFromDB {
  id: string; // UUID
  created_at: string;
  buyer_id: string; // UUID
  seller_id: string; // UUID
  last_message_sender_id: string | null; // UUID
  last_message_read: boolean;
  buyer?: UserProfile;
  seller?: UserProfile;
}

// Extended conversation type for UI
export interface Conversation extends ConversationFromDB {
  otherUser: UserProfile;
  lastMessage: string;
  lastMessageAt: string; // Timestamp of the last message, used for sorting
}