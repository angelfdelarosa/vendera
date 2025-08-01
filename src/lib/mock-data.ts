
import type { Property, UserProfile, Conversation, Message } from "@/types";

export const mockUsers: Record<string, UserProfile> = {
  'jane-doe-realtor': {
    user_id: "jane-doe-realtor",
    full_name: "Jane Doe",
    username: "jane.doe@test.com",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop",
  },
  'john-smith': {
    user_id: "john-smith",
    full_name: "John Smith",
    username: "john.smith@test.com",
    avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop",
  },
  'emily-white': {
    user_id: "emily-white",
    full_name: "Emily White",
    username: "emily.white@test.com",
    avatar_url: "https://images.unsplash.com/photo-1690749170664-fe894475db98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhJTIwR2lybHxlbnwwfHx8fDE3NTMxMjI1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
   'michael-brown': {
    user_id: "michael-brown",
    full_name: "Michael Brown",
    username: "michael.brown@test.com",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
  }
};

export const properties: Property[] = [
  {
    id: "1",
    title: "mock.property1_title",
    price: 3500000,
    location: "Beverly Hills",
    address: "123 Rodeo Drive, Beverly Hills, CA",
    type: "villa",
    bedrooms: 5,
    bathrooms: 6,
    area: 600,
    description: "mock.property1_description",
    features: ["Piscina", "Garaje", "Cine en casa", "Vista a la ciudad"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx2aWxsYXxlbnwwfHx8fDE3NTMxMTkzODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png",
      "https://placehold.co/600x400.png"
    ],
    realtor_id: 'jane-doe-realtor',
    realtor: {
      user_id: "jane-doe-realtor",
      full_name: "Jane Doe",
      username: "jane.doe@test.com",
      avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop"
    }
  },
  {
    id: "2",
    title: "mock.property2_title",
    price: 1200000,
    location: "Downtown LA",
    address: "456 Grand Ave, Los Angeles, CA",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    description: "mock.property2_description",
    features: ["Salón en azotea", "Gimnasio", "Conserje", "Vista al horizonte"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxhcGFydG1lbnR8ZW58MHx8fHwxNzUzMTE5NDMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png"
    ],
    realtor_id: 'john-smith',
    realtor: {
      user_id: "john-smith",
      full_name: "John Smith",
      username: "john.smith@test.com",
      avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
    }
  },
  {
    id: "3",
    title: "mock.property3_title",
    price: 2750000,
    location: "Santa Monica",
    address: "789 Ocean Ave, Santa Monica, CA",
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
    area: 260,
    description: "mock.property3_description",
    features: ["Jardín", "Chimenea", "Cerca de la playa", "Cocina renovada"],
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob3VzZXxlbnwwfHx8fDE3NTMwODk5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png",
      "https://placehold.co/600x400.png"
    ],
    realtor_id: 'emily-white',
    realtor: {
      user_id: "emily-white",
      full_name: "Emily White",
      username: "emily.white@test.com",
      avatar_url: "https://images.unsplash.com/photo-1690749170664-fe894475db98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhJTIwR2lybHxlbnwwfHx8fDE3NTMxMjI1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: "4",
    title: "mock.property4_title",
    price: 950000,
    location: "West Hollywood",
    address: "101 Sunset Blvd, West Hollywood, CA",
    type: "condo",
    bedrooms: 1,
    bathrooms: 1,
    area: 85,
    description: "mock.property4_description",
    features: ["Piscina", "Gimnasio", "Balcón", "Estacionamiento seguro"],
    images: [
      "https://images.unsplash.com/photo-1580041065738-e72023775cdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjb25kb3xlbnwwfHx8fDE3NTMxMTk2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png"
    ],
    realtor_id: 'michael-brown',
    realtor: {
      user_id: "michael-brown",
      full_name: "Michael Brown",
      username: "michael.brown@test.com",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
    }
  },
  {
    id: "5",
    title: "mock.property5_title",
    price: 15000000,
    location: "Malibu",
    address: "202 Pacific Coast Hwy, Malibu, CA",
    type: "villa",
    bedrooms: 6,
    bathrooms: 8,
    area: 930,
    description: "mock.property5_description",
    features: ["Frente al mar", "Playa privada", "Cancha de tenis", "Cine en casa"],
    images: [
      "https://images.unsplash.com/photo-1716807335226-dfe1e2062db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx2aWxsYXxlbnwwfHx8fDE3NTMxMTkzODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png",
      "https://placehold.co/600x400.png"
    ],
    realtor_id: 'jane-doe-realtor',
    realtor: {
      user_id: "jane-doe-realtor",
      full_name: "Jane Doe",
      username: "jane.doe@test.com",
      avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop"
    }
  },
  {
    id: "6",
    title: "mock.property6_title",
    price: 1800000,
    location: "Pasadena",
    address: "303 Rose Bowl Dr, Pasadena, CA",
    type: "house",
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    description: "mock.property6_description",
    features: ["Estilo artesano", "Porche delantero", "Barrio tranquilo", "Carpintería original"],
    images: [
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxob3VzZXxlbnwwfHx8fDE3NTMwODk5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png"
    ],
    realtor_id: 'michael-brown',
    realtor: {
      user_id: "michael-brown",
      full_name: "Michael Brown",
      username: "michael.brown@test.com",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
    }
  },
  {
    id: "7",
    title: "mock.property7_title",
    price: 4500000,
    location: "Downtown LA",
    address: "707 Wilshire Blvd, Los Angeles, CA",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 4,
    area: 325,
    description: "mock.property7_description",
    features: ["Vista panorámica", "Ascensor privado", "Terraza en azotea", "Servicios premium"],
    images: [
      "https://images.unsplash.com/photo-1580216643062-cf460548a66a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8YXBhcnRtZW50fGVufDB8fHx8MTc1MzExOTQzMnww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png",
      "https://placehold.co/600x400.png"
    ],
    realtor_id: 'john-smith',
    realtor: {
      user_id: "john-smith",
      full_name: "John Smith",
      username: "john.smith@test.com",
      avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
    }
  },
  {
    id: "8",
    title: "mock.property8_title",
    price: 3200000,
    location: "Santa Monica",
    address: "800 Palisades Beach Rd, Santa Monica, CA",
    type: "condo",
    bedrooms: 2,
    bathrooms: 2,
    area: 140,
    description: "mock.property8_description",
    features: ["Frente al mar", "Acceso directo a la playa", "Vista al atardecer", "Interior moderno"],
    images: [
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Y29uZG98ZW58MHx8fHwxNzUzMTE5NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png"
    ],
    realtor_id: 'emily-white',
    realtor: {
      user_id: "emily-white",
      full_name: "Emily White",
      username: "emily.white@test.com",
      avatar_url: "https://images.unsplash.com/photo-1690749170664-fe894475db98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhJTIwR2lybHxlbnwwfHx8fDE3NTMxMjI1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  }
];

// Populate user properties
Object.values(mockUsers).forEach(user => {
  // user.properties = properties.filter(p => p.realtor_id === user.user_id);
});


export const mockConversations: Conversation[] = [
  {
    id: 'convo-1',
    user: mockUsers['jane-doe-realtor'],
    property: properties[0],
    messages: [],
    timestamp: "2",
    unread: true,
  },
  {
    id: 'convo-2',
    user: mockUsers['john-smith'],
    property: properties[1],
    messages: [
        { id: 'msg-2-1', text: '¡Hola! Tenía una pregunta sobre el estacionamiento.', sender: 'buyer', timestamp: '11:00 AM' },
        { id: 'msg-2-2', text: 'Sí, el edificio admite mascotas.', sender: 'seller', timestamp: '11:05 AM' },
    ],
    timestamp: "1",
    unread: false,
  },
  {
    id: 'convo-3',
    user: mockUsers['emily-white'],
    property: properties[2],
    messages: [],
    timestamp: "5",
    unread: true,
  },
];
