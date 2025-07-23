
"use client";

import { create } from "zustand";
import type { Property } from "@/types";

interface PropertyState {
  properties: Property[];
  setProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: [], // Start with empty, will be loaded from DB
  setProperties: (properties) => set({ properties }),
  addProperty: (property) => {
    set((state) => ({
      properties: [property, ...state.properties],
    }));
  },
}));
