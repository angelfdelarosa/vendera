"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Property } from '@/types';
import { useToast } from "@/hooks/use-toast";

interface FavoritesContextType {
  favorites: Property[];
  addFavorite: (property: Property) => void;
  removeFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const { toast } = useToast();

  const addFavorite = useCallback((property: Property) => {
    if (favorites.find(p => p.id === property.id)) {
      return;
    }
    setFavorites(prevFavorites => [...prevFavorites, property]);
    toast({
      title: "Added to Favorites",
      description: `"${property.title}" has been saved.`,
    });
  }, [favorites, toast]);

  const removeFavorite = useCallback((propertyId: string) => {
    const property = favorites.find(p => p.id === propertyId);
    if (!property) {
      return;
    }
    setFavorites(prevFavorites => prevFavorites.filter((p) => p.id !== propertyId));
    toast({
      title: "Removed from Favorites",
      description: `"${property.title}" has been removed.`,
    });
  }, [favorites, toast]);

  const isFavorite = (propertyId: string) => {
    return favorites.some((p) => p.id === propertyId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
