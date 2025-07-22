
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
import { PropertyCard } from '@/components/properties/PropertyCard';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUsers } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useChatStore } from '@/components/chat/use-chat-store';
import type { Conversation, UserProfile } from '@/types';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { useTranslation } from '@/hooks/useTranslation';


export default function ProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user: currentUser, loading, updateUser } = useAuth();
  const router = useRouter();
  const profileId = params.id as string;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { getConversationByUserId, createConversation } = useChatStore();
  const { toast } = useToast();
  const allProperties = usePropertyStore((state) => state.properties);
  const { t } = useTranslation();

  const isOwnProfile = currentUser?.uid === profileId;
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('chat') === 'true') {
      const convo = getConversationByUserId(profileId);
      if (convo) {
        setIsChatOpen(true);
      }
    }
  }, [searchParams, profileId, getConversationByUserId]);

  const displayUser: UserProfile | undefined = useMemo(() => {
    return mockUsers[profileId];
  }, [profileId]);

  useEffect(() => {
    if (displayUser && isSheetOpen) {
      setName(displayUser.name);
      setBio(displayUser.bio);
    }
    if (!isSheetOpen) {
        setNewAvatarUrl(null);
    }
  }, [displayUser, isSheetOpen]);
  
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
        property: displayUser.properties[0],
      });
    }
    setIsChatOpen(true);
  };


  useEffect(() => {
    if (!loading && !displayUser) {
        notFound();
    }
  }, [loading, displayUser]);
  
  const { favorites } = useFavorites();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      updateUser({
        displayName: name,
        ...(newAvatarUrl && { photoURL: newAvatarUrl }),
      });

      toast({
        title: t('profile.edit.toast.success.title'),
        description: t('profile.edit.toast.success.description'),
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: t('profile.edit.toast.error.title'),
        description: t('profile.edit.toast.error.description'),
        variant: "destructive"
      });
    } finally {
      setIsSheetOpen(false);
    }
  };


  if (loading || !displayUser) {
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
                  {displayUser.bio}
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
                  <div className="space-x-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href="/messages"><MessageSquare className="h-4 w-4" /></Link>
                    </Button>
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                      <SheetTrigger asChild>
                         <Button variant="outline" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                       <form onSubmit={handleSaveChanges}>
                        <SheetHeader>
                          <SheetTitle>{t('profile.edit.title')}</SheetTitle>
                          <SheetDescription>
                            {t('profile.edit.description')}
                          </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                           <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">
                              Avatar
                            </Label>
                            <div className="col-span-3 flex items-center gap-4">
                               <Avatar>
                                <AvatarImage src={newAvatarUrl || displayUser.avatar} />
                                <AvatarFallback>{userInitial}</AvatarFallback>
                              </Avatar>
                              <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="text-sm" />
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              {t('profile.edit.name')}
                            </Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">
                              Bio
                            </Label>
                            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="col-span-3" />
                          </div>
                        </div>
                        <SheetFooter>
                          <Button type="submit">{t('profile.edit.save')}</Button>
                        </SheetFooter>
                       </form>
                      </SheetContent>
                    </Sheet>
                  </div>
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
              <Building className="mr-2" /> {t('profile.tabs.listed')}
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger value="saved">
                <Heart className="mr-2" /> {t('profile.tabs.saved')}
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
                      {isOwnProfile ? t('profile.empty.listed.own') : t('profile.empty.listed.other', { name: displayUser.name })}
                    </p>
                    {isOwnProfile && (
                      <Button asChild>
                        <Link href="/properties/new">{t('header.addProperty')}</Link>
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
          )}
        </Tabs>
      </div>
    </div>
  );
}
