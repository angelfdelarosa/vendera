
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Property, UserProfile } from '@/types';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { createClient } from '@/lib/supabase/client';

interface PropertyContextType {
  properties: Property[];
  isLoading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const { properties, setProperties, isLoading, setIsLoading } = usePropertyStore();
  const supabase = createClient();

  useEffect(() => {
    const fetchAllProperties = async () => {
      setIsLoading(true);
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*');

      if (propertiesError) {
        console.error("Error fetching properties:", propertiesError);
        setIsLoading(false);
        return;
      }
      if (!propertiesData) {
        setProperties([]);
        return;
      }
      
      const realtorIds = [...new Set(propertiesData.map(p => p.realtor_id))];
      if (realtorIds.length === 0) {
        setProperties([]);
        return;
      }
      
      const { data: realtorsData, error: realtorsError } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url, username')
        .in('user_id', realtorIds);
      
      if (realtorsError) {
          console.error("Error fetching realtors:", realtorsError);
          setIsLoading(false);
          return;
      }

      const realtorsMap = new Map(realtorsData.map(r => [r.user_id, r]));

      const formattedProperties: Property[] = propertiesData.map(p => {
          const realtor = realtorsMap.get(p.realtor_id);
          return {
              ...p,
              realtor: {
                  user_id: p.realtor_id,
                  full_name: realtor?.full_name || 'Anonymous',
                  avatar_url: realtor?.avatar_url || 'https://placehold.co/100x100.png',
                  username: realtor?.username || '',
              }
          }
      });

      setProperties(formattedProperties);
    };

    if (properties.length === 0) {
        fetchAllProperties();
    }
  }, [setProperties, supabase, setIsLoading, properties.length]);

  return (
    <PropertyContext.Provider value={{ properties, isLoading }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
};
