
"use client";

import { create } from "zustand";
import type { Property } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface PropertyState {
  allProperties: Property[];
  setAllProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
  fetchAllProperties: () => Promise<void>;
}

const supabase = createClient();

export const usePropertyStore = create<PropertyState>((set, get) => ({
  allProperties: [],
  setAllProperties: (properties) => set({ allProperties: properties }),
  addProperty: (property) => {
    set((state) => ({
      allProperties: [property, ...state.allProperties],
    }));
  },
  fetchAllProperties: async () => {
    const { data: propertiesData, error: propertiesError } = await supabase
      .from('properties')
      .select('*');

    if (propertiesError) {
      console.error("Error fetching properties:", propertiesError);
      return;
    }
    if (!propertiesData) {
      set({ allProperties: [] });
      return;
    }
    
    const realtorIds = [...new Set(propertiesData.map(p => p.realtor_id))];
    const { data: realtorsData, error: realtorsError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', realtorIds);
    
    if (realtorsError) {
        console.error("Error fetching realtors:", realtorsError);
        return;
    }

    const realtorsMap = new Map(realtorsData.map(r => [r.id, r]));

    const formattedProperties: Property[] = propertiesData.map(p => {
        const realtor = realtorsMap.get(p.realtor_id);
        return {
            ...p,
            realtor: {
                id: p.realtor_id,
                name: realtor?.full_name || 'Anonymous',
                avatar: realtor?.avatar_url || 'https://placehold.co/100x100.png',
                email: '', // Not fetched
            }
        }
    });

    set({ allProperties: formattedProperties });
  }
}));

// Fetch properties on initial load
if (typeof window !== 'undefined') {
    usePropertyStore.getState().fetchAllProperties();
}
