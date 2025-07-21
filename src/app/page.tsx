"use client";

import { useState } from "react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertySearchFilters } from "@/components/properties/PropertySearchFilters";
import { properties as allProperties } from "@/lib/mock-data";
import type { Property } from "@/types";
import { useMemo } from "react";

export default function Home() {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);

  const locations = useMemo(() => {
    const locationSet = new Set(allProperties.map(p => p.location));
    return Array.from(locationSet);
  }, []);

  const propertyTypes = useMemo(() => {
    const typeSet = new Set(allProperties.map(p => p.type));
    return Array.from(typeSet);
  }, []);

  const handleSearch = (filters: {
    location: string;
    type: string;
    priceRange: [number, number];
  }) => {
    const { location, type, priceRange } = filters;
    const [minPrice, maxPrice] = priceRange;

    const results = allProperties.filter(property => {
      const matchesLocation = !location || property.location === location;
      const matchesType = !type || property.type === type;
      const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
      return matchesLocation && matchesType && matchesPrice;
    });
    setFilteredProperties(results);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center bg-card shadow-md rounded-xl p-8 md:p-12 mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4">
          Find Your Dream Home
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover a curated selection of the finest properties. Your new beginning awaits.
        </p>
        <PropertySearchFilters
          locations={locations}
          propertyTypes={propertyTypes}
          onSearch={handleSearch}
        />
      </section>

      <section>
        <h2 className="font-headline text-3xl font-semibold mb-8 text-primary">
          Featured Listings
        </h2>
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg">
             <p className="text-muted-foreground text-lg">No properties match your current filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
