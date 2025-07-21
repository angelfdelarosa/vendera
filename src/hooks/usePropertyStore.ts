
"use client";

import { create } from "zustand";
import { properties as initialProperties, mockUsers } from "@/lib/mock-data";
import type { Property } from "@/types";

interface PropertyState {
  properties: Property[];
  addProperty: (property: Property, userId: string) => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: initialProperties,
  addProperty: (property, userId) => {
    // Add property to the global list of properties
    set((state) => ({
      properties: [property, ...state.properties],
    }));

    // This part would ideally be handled by a proper backend.
    // We are mutating a mock object here for demonstration purposes to ensure consistency.
    if (mockUsers[userId]) {
      // Add property to the user's specific list of properties
      mockUsers[userId].properties.unshift(property);
    }
  },
}));
