
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
import { useState } from "react";
import { SubscriptionModal } from "../layout/SubscriptionModal";

interface PropertyCardProps {
  property: Property;
  isClickable?: boolean;
}

const PropertyCardContent = ({ property }: { property: Property }) => {
    const { t } = useTranslation();

    const priceDisplay = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: property.currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(property.price).replace('US$', 'USD $').replace('DOP', 'DOP $');

    return (
        <Link href={`/properties/${property.id}`} className="block h-full">
            <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 shadow-lg group">
                <CardHeader className="p-0 relative">
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
                    <CardTitle className="text-lg font-headline font-semibold mb-2 leading-tight group-hover:text-accent transition-colors mt-2">
                        {t(property.title)}
                    </CardTitle>
                    <div className="flex items-center text-muted-foreground text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{property.location}</span>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 mt-auto">
                    <div className="flex justify-between w-full text-sm text-muted-foreground border-t pt-4">
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
            </Card>
        </Link>
    );
};

export function PropertyCard({ property, isClickable = true }: PropertyCardProps) {
  if (!property?.id) return null;

  return <PropertyCardContent property={property} />;
}
