
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertySearchFilters } from "@/components/properties/PropertySearchFilters";
import type { Property } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader2 } from "lucide-react";
import { usePropertyContext } from "@/context/PropertyContext";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { properties, isLoading: isLoadingProperties } = usePropertyContext();
  const { user, loading: isLoadingAuth } = useAuth();
  const router = useRouter();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoadingAuth && !user) {
        router.replace('/landing');
    }
  }, [user, isLoadingAuth, router]);

  useEffect(() => {
    if (!isLoadingProperties) {
      setFilteredProperties(properties);
    }
  }, [properties, isLoadingProperties]);


  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      const results = properties.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProperties(results);
    } else {
        setFilteredProperties(properties);
    }
  }, [searchParams, properties]);

  const locations = useMemo(() => {
    const locationSet = new Set(properties.map(p => p.location));
    return Array.from(locationSet);
  }, [properties]);

  const propertyTypes = useMemo(() => {
    const typeSet = new Set(properties.map(p => p.type));
    return Array.from(typeSet);
  }, [properties]);

  const handleSearch = (filters: {
    location: string;
    type: string;
    priceRange: [number, number];
  }) => {
    const { location, type, priceRange } = filters;
    const [minPrice, maxPrice] = priceRange;

    const results = properties.filter(property => {
      const matchesLocation = !location || property.location === location;
      const matchesType = !type || property.type === type;
      const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
      return matchesLocation && matchesType && matchesPrice;
    });
    setFilteredProperties(results);
  };
  
  const isLoading = isLoadingAuth || isLoadingProperties;

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center bg-card shadow-md rounded-xl p-8 md:p-12 mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4">
          {t('home.title')}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
        <PropertySearchFilters
          locations={locations}
          propertyTypes={propertyTypes}
          onSearch={handleSearch}
        />
      </section>

      <section>
        <h2 className="font-headline text-3xl font-semibold mb-8 text-primary">
          {t('home.featuredListings')}
        </h2>
        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        ) : filteredProperties.length > 0 ? (
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
