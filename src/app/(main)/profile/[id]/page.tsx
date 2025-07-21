
'use client';

import { useParams, useRouter, notFound, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, Settings, Loader2, Building, Heart } from 'lucide-react';
import { properties } from '@/lib/mock-data';
import { PropertyCard } from '@/components/properties/PropertyCard';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUsers } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useChatStore } from '@/components/chat/use-chat-store';
import type { Conversation } from '@/types';

export default function ProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user: currentUser, loading } = useAuth();
  const router = useRouter();
  const profileId = params.id as string;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { getConversationByUserId, createConversation } = useChatStore();

  const isOwnProfile = currentUser?.uid === profileId;
  
  useEffect(() => {
    if (searchParams.get('chat') === 'true') {
      const convo = getConversationByUserId(profileId);
      if (convo) {
        setIsChatOpen(true);
      }
    }
  }, [searchParams, profileId, getConversationByUserId]);

  const displayUser = useMemo(() => {
    if (isOwnProfile && currentUser) {
      return {
        id: currentUser.uid,
        name: currentUser.displayName || 'Anonymous User',
        avatar: currentUser.photoURL || 'https://placehold.co/100x100.png',
        bio: 'Real estate enthusiast and savvy investor. Helping you find the home of your dreams.',
        isVerifiedSeller: true,
        rating: 4,
        properties: properties.slice(0, 4), // Mock properties for demo
      };
    }
    
    const mockUser = mockUsers[profileId];
    if (mockUser) {
      return {
        id: profileId,
        name: mockUser.name,
        avatar: mockUser.avatar,
        bio: mockUser.bio,
        isVerifiedSeller: mockUser.isVerifiedSeller,
        rating: mockUser.rating,
        properties: mockUser.properties,
      };
    }
    
    return null;
  }, [profileId, currentUser, isOwnProfile]);
  
  const conversation = getConversationByUserId(profileId) ||
   (displayUser && displayUser.properties.length > 0
    ? ({
        id: 'temp',
        user: displayUser,
        property: displayUser.properties[0],
        messages: [],
        unread: false,
        timestamp: ''
      } as Conversation)
    : null);

  const handleContactSeller = () => {
    if (!displayUser || !displayUser.properties.length) return;
    let convo = getConversationByUserId(displayUser.id);
    if (!convo) {
       convo = createConversation({
        user: displayUser,
        property: displayUser.properties[0], // Default to first property
      });
    }
    setIsChatOpen(true);
  };


  useEffect(() => {
    if (!loading && !displayUser) {
        // If loading is finished and we still can't find a user to display,
        // it means the profile doesn't exist.
        notFound();
    }
  }, [loading, displayUser]);
  
  const { favorites } = useFavorites();

  if (loading || !displayUser) {
    // Show loader while we're still loading or waiting for displayUser to be calculated
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const userInitial = displayUser.name.charAt(0).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="p-0">
            <div className="bg-primary/10 h-24" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-start -mt-16">
              <div className="flex-grow pt-8">
                {displayUser.isVerifiedSeller && (
                  <Badge variant="secondary" className="mb-2">
                    Seller
                  </Badge>
                )}
                <h1 className="text-3xl font-headline font-bold text-primary">
                  {displayUser.name}
                </h1>
                <p className="text-muted-foreground mt-2 max-w-md">
                  {displayUser.bio}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < displayUser.rating ? 'fill-current' : 'text-muted-foreground fill-muted'}`} />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    ({Math.floor(Math.random() * 200)} ratings)
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Avatar className="h-24 w-24 border-4 border-background bg-background">
                  <AvatarImage
                    src={displayUser.avatar}
                    alt="User avatar"
                    data-ai-hint="person face"
                  />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                {isOwnProfile ? (
                  <div className="space-x-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href="/messages"><MessageSquare className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleContactSeller}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Seller
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] h-3/4 flex flex-col">
                      <DialogHeader>
                        <DialogTitle>Chat with {displayUser.name}</DialogTitle>
                      </DialogHeader>
                      {currentUser && conversation && (
                        <ChatWindow
                          buyer={currentUser}
                          conversation={conversation}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="listed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listed">
              <Building className="mr-2" /> Listed Properties
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger value="saved">
                <Heart className="mr-2" /> Saved Properties
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="listed">
            <Card className="mt-4">
              <CardContent className="p-6">
                {displayUser.properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayUser.properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">
                      {isOwnProfile ? "You haven't listed any properties yet." : `${displayUser.name} hasn't listed any properties yet.`}
                    </p>
                    {isOwnProfile && (
                      <Button asChild>
                        <Link href="/properties/new">List a Property</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {isOwnProfile && (
            <TabsContent value="saved">
              <Card className="mt-4">
                <CardContent className="p-6">
                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {favorites.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground mb-4">
                        You haven't saved any properties yet.
                      </p>
                      <Button asChild>
                        <Link href="/">Browse Properties</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
