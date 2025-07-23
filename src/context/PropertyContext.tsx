
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Property } from '@/types';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { createClient } from '@/lib/supabase/client';

interface PropertyContextType {
  properties: Property[];
  isLoading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider = ({ children }: { children: ReactNode }) => {
  const { properties, setProperties } = usePropertyStore();
  const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(false);
        return;
      }
      
      const realtorIds = [...new Set(propertiesData.map(p => p.realtor_id))];
      const { data: realtorsData, error: realtorsError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', realtorIds);
      
      if (realtorsError) {
          console.error("Error fetching realtors:", realtorsError);
          setIsLoading(false);
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

      setProperties(formattedProperties);
      setIsLoading(false);
    };

    fetchAllProperties();
  }, [setProperties, supabase]);

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
