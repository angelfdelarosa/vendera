
"use client";

import { create } from "zustand";
import { properties as initialProperties, mockUsers } from "@/lib/mock-data";
import type { Property } from "@/types";

interface PropertyState {
  properties: Property[];
  addProperty: (property: Property) => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: initialProperties,
  addProperty: (property) => {
    set((state) => ({
      properties: [property, ...state.properties],
    }));

    if (mockUsers[property.realtor.id]) {
      mockUsers[property.realtor.id].properties.unshift(property);
    }
  },
}));
