export type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  address: string;
  type: 'House' | 'Apartment' | 'Condo' | 'Villa';
  bedrooms: number;
  bathrooms: number;
  area: number; 
  description: string;
  features: string[];
  images: string[];
  realtor: {
    name: string;
    avatar: string;
  };
};

export type UserProfile = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  isVerifiedSeller: boolean;
  rating: number;
  properties: Property[];
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
