
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
    set((state) => ({
      properties: [...state.properties, property],
    }));
    // This part would ideally be handled by a proper backend.
    // We are mutating a mock object here for demonstration purposes.
    if (mockUsers[userId]) {
      mockUsers[userId].properties.push(property);
    }
  },
}));
