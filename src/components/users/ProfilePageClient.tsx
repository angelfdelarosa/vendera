
'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
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
import { Star, MessageSquare, Loader2, Building, Heart, Edit } from 'lucide-react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useChatStore } from '@/components/chat/use-chat-store';
import type { Conversation, UserProfile } from '@/types';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/lib/mock-data';

interface ProfilePageClientProps {
  user: UserProfile;
  chatOpen?: boolean;
}

export function ProfilePageClient({ user: displayUser, chatOpen }: ProfilePageClientProps) {
  const { user: authUser } = useAuth();
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { getConversationByUserId, createConversation } = useChatStore();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (chatOpen) {
      const convo = getConversationByUserId(displayUser.id);
      if (convo) {
        setIsChatOpen(true);
      }
    }
  }, [chatOpen, displayUser.id, getConversationByUserId]);

  const conversation = getConversationByUserId(displayUser.id) ||
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
        property: displayUser.properties[0],
      });
    }
    setIsChatOpen(true);
  };

  const { favorites } = useFavorites();

  const userInitial = displayUser.name.charAt(0).toUpperCase();
  const isOwnProfile = authUser && authUser.id === displayUser.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="p-0">
            <div className="bg-primary/10 h-24" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-start -mt-20">
              <div className="flex-grow pt-8">
                {displayUser.isVerifiedSeller && (
                  <Badge variant="secondary" className="mb-2">
                    {t('profile.sellerBadge')}
                  </Badge>
                )}
                <h1 className="text-3xl font-headline font-bold text-primary">
                  {displayUser.name}
                </h1>
                <p className="text-muted-foreground mt-2 max-w-md">
                  {t(displayUser.bio)}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < displayUser.rating ? 'fill-current' : 'text-muted-foreground fill-muted'}`} />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    ({Math.floor(Math.random() * 200)} {t('profile.ratings')})
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                 <Dialog>
                  <DialogTrigger asChild>
                    <Avatar className="h-32 w-32 border-4 border-background bg-background cursor-pointer hover:ring-4 hover:ring-primary transition-all duration-300">
                      <AvatarImage
                        src={displayUser.avatar}
                        alt="User avatar"
                        data-ai-hint="person face"
                      />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </DialogTrigger>
                  <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-2xl">
                     <DialogHeader>
                      <DialogTitle className="sr-only">{t('profile.avatarAlt', { name: displayUser.name })}</DialogTitle>
                    </DialogHeader>
                     <Image 
                        src={displayUser.avatar} 
                        alt="User avatar enlarged"
                        width={800}
                        height={800}
                        className="rounded-lg object-contain"
                        data-ai-hint="person face"
                     />
                  </DialogContent>
                </Dialog>
                  {isOwnProfile ? (
                     <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                  ) : (
                    <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                        <DialogTrigger asChild>
                        <Button onClick={handleContactSeller}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {t('profile.contactSeller')}
                        </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] h-3/4 flex flex-col">
                        <DialogHeader>
                            <DialogTitle>{t('chat.title')} {displayUser.name}</DialogTitle>
                        </DialogHeader>
                        {conversation && (
                            <ChatWindow
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
              <Building className="mr-2" /> {t('profile.tabs.listed')}
            </TabsTrigger>
              <TabsTrigger value="saved">
                <Heart className="mr-2" /> {t('profile.tabs.saved')}
              </TabsTrigger>
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
                      {isOwnProfile ? t('profile.empty.listed.own') : t('profile.empty.listed.other', { name: displayUser.name })}
                    </p>
                    {isOwnProfile && 
                        <Button asChild>
                            <Link href="/properties/new">List a property</Link>
                        </Button>
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
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
                        {t('profile.empty.saved.description')}
                      </p>
                      <Button asChild>
                        <Link href="/">{t('profile.empty.saved.button')}</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
