
import type { Property, UserProfile, Conversation, Message } from "@/types";

export const properties: Property[] = [
  {
    id: "1",
    title: "Luxurious Villa in Beverly Hills",
    price: 3500000,
    location: "Beverly Hills",
    address: "123 Rodeo Drive, Beverly Hills, CA",
    type: "Villa",
    bedrooms: 5,
    bathrooms: 6,
    area: 6500,
    description: "A stunning villa offering unparalleled luxury and privacy. Features a grand staircase, gourmet kitchen, and a breathtaking infinity pool with city views. Perfect for those who demand the very best in life.",
    features: ["Swimming Pool", "Garage", "Home Theater", "City View"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx2aWxsYXxlbnwwfHx8fDE3NTMxMTkzODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      name: "Jane Doe",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop"
    }
  },
  {
    id: "2",
    title: "Modern Apartment in Downtown LA",
    price: 1200000,
    location: "Downtown LA",
    address: "456 Grand Ave, Los Angeles, CA",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    description: "Sleek and stylish modern apartment in the heart of Downtown LA. Floor-to-ceiling windows provide amazing skyline views. Amenities include a rooftop lounge, fitness center, and 24/7 concierge.",
    features: ["Rooftop Lounge", "Fitness Center", "Concierge", "Skyline View"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxhcGFydG1lbnR8ZW58MHx8fHwxNzUzMTE5NDMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
    }
  },
  {
    id: "3",
    title: "Cozy Family House in Santa Monica",
    price: 2750000,
    location: "Santa Monica",
    address: "789 Ocean Ave, Santa Monica, CA",
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    description: "Charming family house just blocks from the beach. This home features a beautiful backyard with a garden, a spacious living room with a fireplace, and a newly renovated kitchen. Ideal for family living.",
    features: ["Garden", "Fireplace", "Near Beach", "Renovated Kitchen"],
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob3VzZXxlbnwwfHx8fDE3NTMwODk5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      name: "Emily White",
      avatar: "https://images.unsplash.com/photo-1690749170664-fe894475db98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhJTIwR2lybHxlbnwwfHx8fDE3NTMxMjI1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: "4",
    title: "Chic Condo in West Hollywood",
    price: 950000,
    location: "West Hollywood",
    address: "101 Sunset Blvd, West Hollywood, CA",
    type: "Condo",
    bedrooms: 1,
    bathrooms: 1,
    area: 900,
    description: "A trendy condo in a vibrant neighborhood, perfect for a young professional. Open-concept layout with modern finishes and a private balcony. The building offers a pool, gym, and secure parking.",
    features: ["Swimming Pool", "Gym", "Balcony", "Secure Parking"],
    images: [
      "https://images.unsplash.com/photo-1580041065738-e72023775cdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjb25kb3xlbnwwfHx8fDE3NTMxMTk2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
    }
  },
  {
    id: "5",
    title: "Sprawling Estate in Malibu",
    price: 15000000,
    location: "Malibu",
    address: "202 Pacific Coast Hwy, Malibu, CA",
    type: "Villa",
    bedrooms: 6,
    bathrooms: 8,
    area: 10000,
    description: "An exquisite oceanfront estate with private beach access. This masterpiece of design features panoramic ocean views from every room, a state-of-the-art home cinema, and a tennis court.",
    features: ["Oceanfront", "Private Beach", "Tennis Court", "Home Cinema"],
    images: [
      "https://images.unsplash.com/photo-1716807335226-dfe1e2062db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx2aWxsYXxlbnwwfHx8fDE3NTMxMTkzODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      name: "Jane Doe",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop"
    }
  },
  {
    id: "6",
    title: "Quaint House in Pasadena",
    price: 1800000,
    location: "Pasadena",
    address: "303 Rose Bowl Dr, Pasadena, CA",
    type: "House",
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    description: "A beautiful craftsman house in a quiet, tree-lined street in Pasadena. Features original woodwork, a large front porch, and a serene backyard perfect for relaxing.",
    features: ["Craftsman Style", "Front Porch", "Quiet Neighborhood", "Original Woodwork"],
    images: [
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxob3VzZXxlbnwwfHx8fDE3NTMwODk5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
    }
  },
  {
    id: "7",
    title: "Penthouse with Panoramic Views",
    price: 4500000,
    location: "Downtown LA",
    address: "707 Wilshire Blvd, Los Angeles, CA",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 4,
    area: 3500,
    description: "Live at the top of the world in this exclusive penthouse. Offering 360-degree views of the city, this residence is the epitome of urban luxury. Includes a private elevator, rooftop terrace, and premium services.",
    features: ["Panoramic View", "Private Elevator", "Rooftop Terrace", "Premium Services"],
    images: [
      "https://images.unsplash.com/photo-1580216643062-cf460548a66a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8YXBhcnRtZW50fGVufDB8fHx8MTc1MzExOTQzMnww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
    }
  },
  {
    id: "8",
    title: "Beachfront Condo in Santa Monica",
    price: 3200000,
    location: "Santa Monica",
    address: "800 Palisades Beach Rd, Santa Monica, CA",
    type: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    description: "Wake up to the sound of waves in this luxurious beachfront condo. Direct access to the sand, a modern open-plan living area, and a large balcony to enjoy the sunset. A rare opportunity in a prime location.",
    features: ["Beachfront", "Direct Beach Access", "Sunset View", "Modern Interior"],
    images: [
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Y29uZG98ZW58MHx8fHwxNzUzMTE5NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      name: "Emily White",
      avatar: "https://images.unsplash.com/photo-1690749170664-fe894475db98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhJTIwR2lybHxlbnwwfHx8fDE3NTMxMjI1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  }
];

// This user ID can be used for logging in with email: 'michael.brown@test.com', pass: 'password'
const michaelBrownId = "k1OaP2yL9aWcE5xQyRzFp8sT7uJ3";

export const mockUsers: Record<string, UserProfile> = {
  'jane-doe-realtor': {
    id: "jane-doe-realtor",
    name: "Jane Doe",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop",
    bio: "Top-rated realtor with over 15 years of experience in the luxury market. Let me help you find your dream home.",
    isVerifiedSeller: true,
    rating: 5,
    properties: [properties.find(p => p.id === '1')!, properties.find(p => p.id === '5')!]
  },
  'john-smith': {
    id: "john-smith",
    name: "John Smith",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop",
    bio: "Specializing in downtown residential and commercial properties. Let's find your next investment.",
    isVerifiedSeller: true,
    rating: 4,
    properties: [properties.find(p => p.id === '2')!, properties.find(p => p.id === '7')!]
  },
  'emily-white': {
    id: "emily-white",
    name: "Emily White",
    avatar: "https://images.unsplash.com/photo-1690749170664-fe894475db98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhJTIwR2lybHxlbnwwfHx8fDE3NTMxMjI1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Your Santa Monica real estate expert. I live and breathe coastal properties.",
    isVerifiedSeller: true,
    rating: 5,
    properties: [properties.find(p => p.id === '3')!, properties.find(p => p.id === '8')!]
  },
   [michaelBrownId]: {
    id: michaelBrownId,
    name: "Michael Brown",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
    bio: "Connecting clients with the vibrant lifestyle of West Hollywood. Your dream condo awaits.",
    isVerifiedSeller: false,
    rating: 4,
    properties: [properties.find(p => p.id === '4')!, properties.find(p => p.id === '6')!]
  }
};


export const mockConversations: Conversation[] = [
  {
    id: 'convo-1',
    user: mockUsers['jane-doe-realtor'],
    property: properties[0],
    messages: [],
    timestamp: '2m ago',
    unread: true,
  },
  {
    id: 'convo-2',
    user: mockUsers['john-smith'],
    property: properties[1],
    messages: [
        { id: 'msg-2-1', text: 'Hello! I had a question about the parking situation.', sender: 'buyer', timestamp: '11:00 AM' },
        { id: 'msg-2-2', text: 'Yes, the building is pet friendly.', sender: 'seller', timestamp: '11:05 AM' },
    ],
    timestamp: '1h ago',
    unread: false,
  },
  {
    id: 'convo-3',
    user: mockUsers['emily-white'],
    property: properties[2],
    messages: [],
    timestamp: '5h ago',
    unread: true,
  },
];
