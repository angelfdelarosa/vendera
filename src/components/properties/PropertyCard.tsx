import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/types";
import { MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";
import { useAuth } from "@/context/AuthContext";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth();

  return (
    <Link href={`/properties/${property.id}`} className="group block">
        <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <CardHeader className="p-0 relative">
            {user && (
                <div className="absolute top-2 right-2 z-10">
                    <FavoriteButton property={property} />
                </div>
            )}
             <div className="absolute top-2 left-2 z-10 bg-primary/90 text-primary-foreground py-1.5 px-3 rounded-lg">
                <p className="font-bold text-lg">${property.price.toLocaleString()}</p>
            </div>
            <Image
              src={property.images[0]}
              alt={property.title}
              width={400}
              height={250}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="house exterior"
            />
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <Badge variant="secondary" className="mb-2">{property.type}</Badge>
            <CardTitle className="text-lg font-headline font-semibold mb-2 leading-tight group-hover:text-accent transition-colors">
              {property.title}
            </CardTitle>
            <div className="flex items-center text-muted-foreground text-sm mb-4">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{property.location}</span>
            </div>
          </CardContent>
          {user && (
            <CardFooter className="p-4 pt-0 flex items-start">
              <div className="flex justify-between w-full text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BedDouble className="w-4 h-4" />
                  <span>{property.bedrooms} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{property.bathrooms} baths</span>
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  <span>{property.area.toLocaleString()} sqft</span>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
    </Link>
  );
}
