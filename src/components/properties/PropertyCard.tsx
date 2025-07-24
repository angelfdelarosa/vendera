
'use client';

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/types";
import { MapPin, BedDouble, Bath, Ruler, Lock } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";

interface PropertyCardProps {
  property: Property;
  isClickable?: boolean;
}

const PropertyCardContent = ({ property }: { property: Property }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    return (
        <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="p-0 relative">
                <div className="absolute top-2 right-2 z-10">
                    <FavoriteButton property={property} />
                </div>
                <div className="absolute top-2 left-2 z-10 bg-primary/90 text-primary-foreground py-1.5 px-3 rounded-lg">
                    <p className="font-bold text-lg">${property.price.toLocaleString()}</p>
                </div>
                <Image
                src={property.images[0]}
                alt={t(property.title)}
                width={400}
                height={250}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="house exterior"
                />
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <Badge variant="secondary">{t(`property.types.${property.type}`)}</Badge>
                <CardTitle className="text-lg font-headline font-semibold mb-2 leading-tight group-hover:text-accent transition-colors">
                {t(property.title)}
                </CardTitle>
                <div className="flex items-center text-muted-foreground text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.location}</span>
                </div>
            </CardContent>
            {user ? (
                <CardFooter className="p-4 pt-0 flex items-start">
                <div className="flex justify-between w-full text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4" />
                    <span>{property.bedrooms} {t('property.beds')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    <span>{property.bathrooms} {t('property.baths')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    <span>{property.area.toLocaleString()} {t('property.sqft')}</span>
                    </div>
                </div>
                </CardFooter>
            ) : (
                <CardFooter className="p-4 pt-0 flex items-start bg-secondary/30">
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <Lock className="h-3 w-3" />
                        <span>Inicia sesión para ver más detalles</span>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};

export function PropertyCard({ property, isClickable = true }: PropertyCardProps) {
  if (isClickable) {
    return (
      <Link href={`/properties/${property.id}`} className="group block h-full">
        <PropertyCardContent property={property} />
      </Link>
    );
  }

  return (
    <div className="group block h-full">
      <PropertyCardContent property={property} />
    </div>
  );
}
