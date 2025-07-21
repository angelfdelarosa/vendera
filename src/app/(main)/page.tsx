"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertySearchFilters } from "@/components/properties/PropertySearchFilters";
import { properties as allProperties } from "@/lib/mock-data";
import type { Property } from "@/types";
import { useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

function AuthenticatedHome() {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      const results = allProperties.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProperties(results);
    } else {
        setFilteredProperties(allProperties);
    }
  }, [searchParams]);

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

function GuestHome() {
    const [properties, setProperties] = useState(allProperties.slice(0, 4));
    const searchParams = useSearchParams();

    useEffect(() => {
        const searchQuery = searchParams.get('q');
        if (searchQuery) {
            const results = allProperties.filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setProperties(results);
        } else {
            setProperties(allProperties.slice(0, 8));
        }
    }, [searchParams]);

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-primary/70 z-10" />
        <Image
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8cmVhbCUyMHN0YXRlfGVufDB8fHx8MTc1MzExOTEwNHww&ixlib=rb-4.1.0&q=80&w=1080"
            layout="fill"
            objectFit="cover"
            alt="Hero background"
            className="absolute inset-0 z-0"
            data-ai-hint="house interior"
            priority
        />
        <div className="relative z-20 p-4">
            <h1 className="font-headline text-5xl md:text-7xl font-bold mb-4">
                Encuentra la casa de tus sueños
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
                Explora miles de propiedades exclusivas, conecta con los mejores agentes y da el siguiente paso hacia tu nuevo hogar.
            </p>
            <div className="flex justify-center gap-4">
                <Button size="lg" asChild>
                    <Link href="/signup">
                        Crear Cuenta <ArrowRight className="ml-2" />
                    </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                    <Link href="/login">Iniciar Sesión</Link>
                </Button>
            </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="font-headline text-4xl font-bold text-primary mb-10 text-center">
            {searchParams.get('q') ? 'Resultados de la Búsqueda' : 'Listados Destacados'}
        </h2>
        {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-card rounded-lg">
                <p className="text-muted-foreground text-lg">No se encontraron propiedades.</p>
            </div>
        )}
      </section>
    </div>
  );
}


export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return user ? <AuthenticatedHome /> : <GuestHome />;
}
