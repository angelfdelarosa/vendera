
'use client';

import { notFound, useRouter, usePathname, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { mockUsers } from '@/lib/mock-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { BedDouble, Bath, Ruler, MapPin, Building, MessageSquare, Lock, Loader2, ArrowRight } from 'lucide-react';
import { SimilarProperties } from '@/components/properties/SimilarProperties';
import { FavoriteButton } from '@/components/properties/FavoriteButton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useChatStore } from '@/components/chat/use-chat-store';
import type { Conversation } from '@/types';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { useTranslation } from '@/hooks/useTranslation';

export default function PropertyDetailPage() {
  const params = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const properties = usePropertyStore((state) => state.properties);
  const property = properties.find((p) => p.id === params.id);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { getConversationByPropertyId, createConversation } = useChatStore();
  const { t } = useTranslation();

  if (!property) {
    notFound();
  }

  const realtorProfile = Object.values(mockUsers).find(
    (user) => user.id === property.realtor.id
  );
  
  const sellerForChat = realtorProfile || { 
      id: property.realtor.id,
      name: property.realtor.name,
      avatar: property.realtor.avatar,
      bio: "Un apasionado profesional inmobiliario.",
      isVerifiedSeller: true,
      rating: 5,
      properties: [property]
  };

  const handleContactSeller = () => {
    let convo = getConversationByPropertyId(property.id);
    if (!convo) {
      convo = createConversation({
        user: sellerForChat,
        property: property,
      });
    }
    setIsChatOpen(true);
  };

  const conversation = getConversationByPropertyId(property.id) || 
    ({ id: 'temp', user: sellerForChat, property, messages: [], unread: false, timestamp: '' } as Conversation);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Carousel className="w-full">
                <CarouselContent>
                  {property.images.map((src, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={src}
                        alt={`${property.title} image ${index + 1}`}
                        width={800}
                        height={500}
                        className="w-full h-[500px] object-cover"
                        data-ai-hint="house interior"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-16" />
                <CarouselNext className="mr-16" />
              </Carousel>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">
                {property.type}
              </Badge>
              <CardTitle className="font-headline text-3xl font-bold text-primary">
                {property.title}
              </CardTitle>
              <p className="flex items-center text-muted-foreground pt-2">
                <MapPin className="w-4 h-4 mr-2" />
                {property.address}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-4xl font-bold text-accent">
                  ${property.price.toLocaleString()}
                </p>
                <FavoriteButton property={property} className="h-10 w-10" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                {t('property.realtorInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={property.realtor.avatar}
                    alt={property.realtor.name}
                    data-ai-hint="person face"
                  />
                  <AvatarFallback>
                    {property.realtor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  {realtorProfile ? (
                    <Link
                      href={`/profile/${realtorProfile.id}`}
                      className="font-semibold text-lg hover:underline"
                    >
                      {property.realtor.name}
                    </Link>
                  ) : (
                    <p className="font-semibold text-lg">
                      {property.realtor.name}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {t('property.certifiedRealtor')}
                  </p>
                </div>
              </div>
               <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full" onClick={handleContactSeller}>
                        <MessageSquare className="mr-2" />
                        {t('profile.contactSeller')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] h-3/4 flex flex-col">
                  <DialogHeader>
                    <DialogTitle>{t('chat.titleProperty', { title: property.title })}</DialogTitle>
                  </DialogHeader>
                   <ChatWindow
                      conversation={conversation}
                    />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            {t('property.details')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-6">
            <div className="bg-secondary/50 p-4 rounded-lg">
              <BedDouble className="mx-auto mb-2 h-8 w-8 text-primary" />
              <p className="font-semibold">{property.bedrooms} {t('property.bedrooms')}</p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg">
              <Bath className="mx-auto mb-2 h-8 w-8 text-primary" />
              <p className="font-semibold">{property.bathrooms} {t('property.bathrooms')}</p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg">
              <Ruler className="mx-auto mb-2 h-8 w-8 text-primary" />
              <p className="font-semibold">
                {property.area.toLocaleString()} m²
              </p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg">
              <Building className="mx-auto mb-2 h-8 w-8 text-primary" />
              <p className="font-semibold">{property.type}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-headline text-xl font-semibold mb-4">
              {t('property.description')}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {property.description}
            </p>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-headline text-xl font-semibold mb-4">
              {t('property.features')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, index) => (
                <Badge key={index} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <SimilarProperties currentPropertyId={property.id} />
    </div>
  );
}
