"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/context/FavoritesContext";
import type { Property } from "@/types";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  property: Property;
  className?: string;
}

export function FavoriteButton({ property, className }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isFavorited = isFavorite(property.id);

  const toggleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-full hover:bg-red-100/50 dark:hover:bg-red-900/20", className)}
      onClick={toggleFavorite}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn(
        "w-5 h-5 transition-colors",
        isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
      )} />
    </Button>
  );
}
