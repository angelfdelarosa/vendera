
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Settings } from "lucide-react";
import { properties } from "@/lib/mock-data";
import { PropertyCard } from "@/components/properties/PropertyCard";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";

export default function ProfilePage() {
  // Mock data for demonstration
  const featuredProperty = properties[0]; 
  const moreProperties = properties.slice(1, 4);
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* User Info Card */}
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="p-0">
             <div className="bg-primary/10 h-24" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-start -mt-16">
                 <div className="flex-grow pt-8">
                    <Badge variant="secondary" className="mb-2">Seller</Badge>
                    <h1 className="text-3xl font-headline font-bold text-primary">
                        John Doe
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-md">
                        Real estate enthusiast and savvy investor. Helping you find the home of your dreams.
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <div className="flex items-center text-amber-500">
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 fill-current" />
                           <Star className="w-5 h-5 text-muted-foreground fill-muted" />
                        </div>
                        <span className="text-muted-foreground text-sm">(123 ratings)</span>
                    </div>
                </div>
                 <div className="flex flex-col items-end space-y-2">
                     <Avatar className="h-24 w-24 border-4 border-background bg-background">
                      <AvatarImage src="https://placehold.co/100x100.png" alt="User avatar" data-ai-hint="person face" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                     <div className="space-x-2">
                        <Button variant="outline" size="icon">
                            <MessageSquare className="h-4 w-4" />
                        </Button>
                         <Button variant="outline" size="icon">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Property Section */}
        <section>
          <h2 className="text-2xl font-headline font-semibold text-primary mb-4">
            Featured Property
          </h2>
          {featuredProperty ? (
            <div className="flex justify-center">
              <div className="w-full md:w-5/6 lg:w-3/4">
                <PropertyCard property={featuredProperty} />
              </div>
            </div>
          ) : (
             <div className="text-center py-16 bg-card rounded-lg border-dashed border">
              <p className="text-muted-foreground mb-4">You haven't listed any properties yet.</p>
              <Button asChild>
                  <Link href="/properties/new">List a Property</Link>
              </Button>
            </div>
          )}
        </section>

        {/* More Properties Section */}
        {moreProperties.length > 0 && (
          <section>
            <h2 className="text-2xl font-headline font-semibold text-primary mb-4">
              More Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {moreProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
            </div>
          </section>
        )}

        {/* Saved Properties Section */}
        <section>
          <h2 className="text-2xl font-headline font-semibold text-primary mb-4">
            Saved Properties
          </h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favorites.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-lg border-dashed border">
              <p className="text-muted-foreground mb-4">You haven't saved any properties yet.</p>
               <Button asChild>
                  <Link href="/">Browse Properties</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
