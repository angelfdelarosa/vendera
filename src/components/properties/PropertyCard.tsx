
'use client';

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/types";
import { MapPin, BedDouble, Bath, Ruler, Lock, MessageSquare } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button";
import { useChatStore } from "../chat/use-chat-store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  property: Property;
  isClickable?: boolean;
}

const PropertyCardContent = ({ property, isClickable = true }: { property: Property, isClickable?: boolean }) => {
    const { t } = useTranslation();
    const { user, supabase } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const { selectConversation } = useChatStore();

    const priceDisplay = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: property.currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(property.price).replace('US$', 'USD $').replace('DOP', 'DOP $');

    return (
        <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 shadow-lg group">
            <CardHeader className="p-0 relative">
                 <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    {/* Contact button removed as per user request */}
                </div>
                <div className="absolute top-2 right-2 z-10">
                    <FavoriteButton property={property} />
                </div>
                <div className="absolute top-2 left-2 z-10 bg-primary/90 text-primary-foreground py-1.5 px-3 rounded-lg">
                    <p className="font-bold text-lg">{priceDisplay}</p>
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
            {isClickable && (
                user ? (
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
                )
            )}
        </Card>
    );
};

export function PropertyCard({ property, isClickable = true }: PropertyCardProps) {
  if (!property?.id) return null; // Defensive check for missing property or id

  if (isClickable) {
    return (
      <Link href={`/properties/${property.id}`} className="block h-full">
        <PropertyCardContent property={property} isClickable={isClickable} />
      </Link>
    );
  }

  return (
    <div className="block h-full">
      <PropertyCardContent property={property} isClickable={isClickable} />
    </div>
  );
}
