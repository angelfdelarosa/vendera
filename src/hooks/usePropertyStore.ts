
"use client";

import { create } from "zustand";
import type { Property } from "@/types";
import { properties as mockProperties } from "@/lib/mock-data";

interface PropertyState {
  properties: Property[];
  setProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: mockProperties, // Start with mock data
  setProperties: (properties) => set({ properties }),
  addProperty: (property) => {
    set((state) => ({
      properties: [property, ...state.properties],
    }));
  },
}));
