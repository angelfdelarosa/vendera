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
