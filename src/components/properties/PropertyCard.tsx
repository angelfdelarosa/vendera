
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

    const handleStartConversation = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user || !supabase || user.id === property.realtor_id) return;

        try {
            const { data: existingConvo, error: fetchError } = await supabase
                .from('conversations')
                .select('id')
                .eq('buyer_id', user.id)
                .eq('seller_id', property.realtor_id)
                .eq('property_id', property.id)
                .maybeSingle();

            if (fetchError) throw fetchError;

            let conversationId = existingConvo?.id;

            if (!conversationId) {
                const { data: newConvo, error: insertError } = await supabase
                    .from('conversations')
                    .insert({
                        buyer_id: user.id,
                        seller_id: property.realtor_id,
                        property_id: property.id,
                    })
                    .select('id')
                    .single();
                
                if (insertError) throw insertError;
                conversationId = newConvo.id;
            }
            
            selectConversation(conversationId);
            router.push('/messages');

        } catch (error: any) {
            console.error("Error starting conversation:", error);
            toast({
                title: "Could not start chat",
                description: error.message,
                variant: "destructive"
            });
        }
  };

    return (
        <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 shadow-lg group">
            <CardHeader className="p-0 relative">
                 <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                    {user && user.id !== property.realtor_id && (
                        <Button size="lg" onClick={handleStartConversation}>
                            <MessageSquare className="mr-2" /> Contactar
                        </Button>
                    )}
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
