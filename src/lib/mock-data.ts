
import type { Property, UserProfile, Conversation, Message } from "@/types";

export const properties: Property[] = [
  {
    id: "1",
    title: "Lujosa Villa en Beverly Hills",
    price: 3500000,
    location: "Beverly Hills",
    address: "123 Rodeo Drive, Beverly Hills, CA",
    type: "Villa",
    bedrooms: 5,
    bathrooms: 6,
    area: 600,
    description: "Una impresionante villa que ofrece lujo y privacidad incomparables. Cuenta con una gran escalera, cocina gourmet y una piscina infinita impresionante con vistas a la ciudad. Perfecta para quienes exigen lo mejor de la vida.",
    features: ["Piscina", "Garaje", "Cine en casa", "Vista a la ciudad"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx2aWxsYXxlbnwwfHx8fDE3NTMxMTkzODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      id: "jane-doe-realtor",
      name: "Jane Doe",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop"
    }
  },
  {
    id: "2",
    title: "Moderno Apartamento en el Centro de LA",
    price: 1200000,
    location: "Downtown LA",
    address: "456 Grand Ave, Los Angeles, CA",
    type: "Apartamento",
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    description: "Apartamento moderno, elegante y con estilo en el corazón del centro de LA. Ventanas de piso a techo que ofrecen increíbles vistas del horizonte. Las comodidades incluyen un salón en la azotea, gimnasio y conserje 24/7.",
    features: ["Salón en azotea", "Gimnasio", "Conserje", "Vista al horizonte"],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxhcGFydG1lbnR8ZW58MHx8fHwxNzUzMTE5NDMyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      id: "john-smith",
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
    }
  },
  {
    id: "3",
    title: "Acogedora Casa Familiar en Santa Monica",
    price: 2750000,
    location: "Santa Monica",
    address: "789 Ocean Ave, Santa Monica, CA",
    type: "Casa",
    bedrooms: 4,
    bathrooms: 3,
    area: 260,
    description: "Encantadora casa familiar a solo unas cuadras de la playa. Esta casa cuenta con un hermoso patio trasero con jardín, una espaciosa sala de estar con chimenea y una cocina recientemente renovada. Ideal para la vida familiar.",
    features: ["Jardín", "Chimenea", "Cerca de la playa", "Cocina renovada"],
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob3VzZXxlbnwwfHx8fDE3NTMwODk5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      id: "emily-white",
      name: "Emily White",
      avatar: "https://images.unsplash.com/photo-1690749170664-fe894475db98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhJTIwR2lybHxlbnwwfHx8fDE3NTMxMjI1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  },
  {
    id: "4",
    title: "Condominio Chic en West Hollywood",
    price: 950000,
    location: "West Hollywood",
    address: "101 Sunset Blvd, West Hollywood, CA",
    type: "Condo",
    bedrooms: 1,
    bathrooms: 1,
    area: 85,
    description: "Un condominio de moda en un barrio vibrante, perfecto para un joven profesional. Diseño de concepto abierto con acabados modernos y un balcón privado. El edificio ofrece piscina, gimnasio y estacionamiento seguro.",
    features: ["Piscina", "Gimnasio", "Balcón", "Estacionamiento seguro"],
    images: [
      "https://images.unsplash.com/photo-1580041065738-e72023775cdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjb25kb3xlbnwwfHx8fDE3NTMxMTk2MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      id: "k1OaP2yL9aWcE5xQyRzFp8sT7uJ3",
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
    }
  },
  {
    id: "5",
    title: "Extensa Finca en Malibú",
    price: 15000000,
    location: "Malibu",
    address: "202 Pacific Coast Hwy, Malibu, CA",
    type: "Villa",
    bedrooms: 6,
    bathrooms: 8,
    area: 930,
    description: "Una exquisita finca frente al mar con acceso privado a la playa. Esta obra maestra del diseño cuenta con vistas panorámicas al océano desde todas las habitaciones, un cine en casa de última generación y una cancha de tenis.",
    features: ["Frente al mar", "Playa privada", "Cancha de tenis", "Cine en casa"],
    images: [
      "https://images.unsplash.com/photo-1716807335226-dfe1e2062db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx2aWxsYXxlbnwwfHx8fDE3NTMxMTkzODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      id: "jane-doe-realtor",
      name: "Jane Doe",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop"
    }
  },
  {
    id: "6",
    title: "Pintoresca Casa en Pasadena",
    price: 1800000,
    location: "Pasadena",
    address: "303 Rose Bowl Dr, Pasadena, CA",
    type: "Casa",
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    description: "Una hermosa casa de estilo artesano en una calle tranquila y arbolada en Pasadena. Cuenta con carpintería original, un gran porche delantero y un patio trasero sereno perfecto para relajarse.",
    features: ["Estilo artesano", "Porche delantero", "Barrio tranquilo", "Carpintería original"],
    images: [
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxob3VzZXxlbnwwfHx8fDE3NTMwODk5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      id: "k1OaP2yL9aWcE5xQyRzFp8sT7uJ3",
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
    }
  },
  {
    id: "7",
    title: "Penthouse con Vistas Panorámicas",
    price: 4500000,
    location: "Downtown LA",
    address: "707 Wilshire Blvd, Los Angeles, CA",
    type: "Apartamento",
    bedrooms: 3,
    bathrooms: 4,
    area: 325,
    description: "Vive en la cima del mundo en este exclusivo penthouse. Ofreciendo vistas de 360 grados de la ciudad, esta residencia es el epítome del lujo urbano. Incluye un ascensor privado, terraza en la azotea y servicios premium.",
    features: ["Vista panorámica", "Ascensor privado", "Terraza en azotea", "Servicios premium"],
    images: [
      "https://images.unsplash.com/photo-1580216643062-cf460548a66a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8YXBhcnRtZW50fGVufDB8fHx8MTc1MzExOTQzMnww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      id: "john-smith",
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop"
    }
  },
  {
    id: "8",
    title: "Condominio Frente a la Playa en Santa Mónica",
    price: 3200000,
    location: "Santa Monica",
    address: "800 Palisades Beach Rd, Santa Monica, CA",
    type: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    area: 140,
    description: "Despierta con el sonido de las olas en este lujoso condominio frente a la playa. Acceso directo a la arena, una moderna sala de estar de planta abierta y un gran balcón para disfrutar del atardecer. Una oportunidad única en una ubicación privilegiada.",
    features: ["Frente al mar", "Acceso directo a la playa", "Vista al atardecer", "Interior moderno"],
    images: [
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Y29uZG98ZW58MHx8fHwxNzUzMTE5NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://placehold.co/600x400.png"
    ],
    realtor: {
      id: "emily-white",
      name: "Emily White",
      avatar: "https://images.unsplash.com/photo-1690749170664-fe894475db98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhJTIwR2lybHxlbnwwfHx8fDE3NTMxMjI1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    }
  }
];

const michaelBrownId = "k1OaP2yL9aWcE5xQyRzFp8sT7uJ3";

export const mockUsers: Record<string, UserProfile> = {
  'jane-doe-realtor': {
    id: "jane-doe-realtor",
    name: "Jane Doe",
    email: "jane.doe@test.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop",
    bio: "Agente inmobiliaria de primer nivel con más de 15 años de experiencia en el mercado de lujo. Permíteme ayudarte a encontrar la casa de tus sueños.",
    isVerifiedSeller: true,
    rating: 5,
    properties: properties.filter(p => p.realtor.id === "jane-doe-realtor")
  },
  'john-smith': {
    id: "john-smith",
    name: "John Smith",
    email: "john.smith@test.com",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop",
    bio: "Especializado en propiedades residenciales y comerciales del centro. Encontremos tu próxima inversión.",
    isVerifiedSeller: true,
    rating: 4,
    properties: properties.filter(p => p.realtor.id === "john-smith")
  },
  'emily-white': {
    id: "emily-white",
    name: "Emily White",
    email: "emily.white@test.com",
    avatar: "https://images.unsplash.com/photo-1690749170664-fe894475db98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhJTIwR2lybHxlbnwwfHx8fDE3NTMxMjI1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    bio: "Tu experta en bienes raíces de Santa Mónica. Vivo y respiro propiedades costeras.",
    isVerifiedSeller: true,
    rating: 5,
    properties: properties.filter(p => p.realtor.id === "emily-white")
  },
   [michaelBrownId]: {
    id: michaelBrownId,
    name: "Michael Brown",
    email: "michael.brown@test.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop",
    bio: "Conectando clientes con el vibrante estilo de vida de West Hollywood. El condominio de tus sueños te espera.",
    isVerifiedSeller: false,
    rating: 4,
    properties: properties.filter(p => p.realtor.id === michaelBrownId)
  }
};


export const mockConversations: Conversation[] = [
  {
    id: 'convo-1',
    user: mockUsers['jane-doe-realtor'],
    property: properties[0],
    messages: [],
    timestamp: 'hace 2m',
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
    timestamp: 'hace 1h',
    unread: false,
  },
  {
    id: 'convo-3',
    user: mockUsers['emily-white'],
    property: properties[2],
    messages: [],
    timestamp: 'hace 5h',
    unread: true,
  },
];
