"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary mb-2">
          Your Favorite Properties
        </h1>
        <p className="text-lg text-muted-foreground">
          Here are the listings you've saved for later.
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favorites.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-xl border border-dashed flex flex-col items-center">
            <Heart className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-primary">No Favorites Yet</h2>
          <p className="text-muted-foreground mb-6">
            Click the heart icon on any property to save it here.
          </p>
          <Button asChild>
            <Link href="/">Browse Properties</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
