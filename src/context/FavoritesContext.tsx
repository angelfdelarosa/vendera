"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Property } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from '@/hooks/useTranslation';

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
  const { t } = useTranslation();

  const addFavorite = useCallback((property: Property) => {
    if (favorites.find(p => p.id === property.id)) {
      return;
    }
    setFavorites(prevFavorites => [...prevFavorites, property]);
    toast({
      title: t('favorites.toast.added.title'),
      description: t('favorites.toast.added.description', { title: property.title }),
    });
  }, [favorites, toast, t]);

  const removeFavorite = useCallback((propertyId: string) => {
    const property = favorites.find(p => p.id === propertyId);
    if (!property) {
      return;
    }
    setFavorites(prevFavorites => prevFavorites.filter((p) => p.id !== propertyId));
    toast({
      title: t('favorites.toast.removed.title'),
      description: t('favorites.toast.removed.description', { title: property.title }),
    });
  }, [favorites, toast, t]);

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
