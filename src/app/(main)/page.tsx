
"use client";

import { useState, useEffect, useMemo } from "react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertySearchFilters } from "@/components/properties/PropertySearchFilters";
import type { Property } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader2 } from "lucide-react";
import { usePropertyStore } from "@/hooks/usePropertyStore";
import { createClient } from "@/lib/supabase/client";

function HomePage() {
  const { t } = useTranslation();
  const { properties, setProperties, isLoading, setIsLoading } = usePropertyStore();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchAllProperties = async () => {
      setIsLoading(true);
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*, realtor:realtor_id(*)')
        .eq('is_active', true);

      if (propertiesError) {
        console.error("Error fetching properties:", propertiesError);
        setIsLoading(false);
        return;
      }
      if (!propertiesData) {
        setProperties([]);
        return;
      }
      setProperties(propertiesData as unknown as Property[]);
    };
    
    // Fetch only if properties aren't in the store yet.
    if (properties.length === 0) {
      fetchAllProperties();
    } else {
        setFilteredProperties(properties);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  const locations = useMemo(() => {
    const locationSet = new Set(properties.map(p => p.location));
    return Array.from(locationSet);
  }, [properties]);

  const propertyTypes = useMemo(() => {
    const typeSet = new Set(properties.map(p => p.type));
    return Array.from(typeSet);
  }, [properties]);

  if (isLoading) {
    return (
       <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center bg-card shadow-lg rounded-xl p-8 md:p-12 mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4">
          {t('home.title')}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
        <PropertySearchFilters
          allProperties={properties}
          onSearch={(results) => setFilteredProperties(results)}
        />
      </section>

      <section>
        <h2 className="font-headline text-3xl font-semibold mb-8 text-primary">
          {t('home.featuredListings')}
        </h2>
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg">
             <p className="text-muted-foreground text-lg">{t('home.noProperties')}</p>
          </div>
        )}
      </section>
    </div>
  );
}


export default HomePage;
