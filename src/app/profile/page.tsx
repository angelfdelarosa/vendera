
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
import { MessageSquare, Settings, UserPlus } from "lucide-react";
import { properties } from "@/lib/mock-data";
import { PropertyCard } from "@/components/properties/PropertyCard";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";

export default function ProfilePage() {
  // Mock data for demonstration
  const userProperties = properties.slice(0, 2);
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* User Info Card */}
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="p-0">
             <div className="bg-primary/10 h-24" />
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex items-start -mt-12">
                <Avatar className="h-24 w-24 border-4 border-background bg-background">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                 <div className="ml-4 mt-12 flex-grow">
                    <h1 className="text-2xl font-headline font-bold text-primary">
                        John Doe
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Real estate enthusiast and savvy investor. Helping you find the home of your dreams.
                    </p>
                </div>
                <div className="mt-12 space-x-2">
                    <Button variant="outline" size="icon">
                        <MessageSquare className="h-4 w-4" />
                    </Button>
                     <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* My Properties Section */}
        <section>
          <h2 className="text-2xl font-headline font-semibold text-primary mb-4">
            My Properties
          </h2>
          {userProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
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
