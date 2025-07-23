
'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Loader2, Building, Heart, Edit, Mail, Lock, Upload } from 'lucide-react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import type { UserProfile, Property } from '@/types';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import ReactCrop, { type Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { canvasPreview } from '@/lib/utils';

interface ProfilePageClientProps {
    profileId: string;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ProfilePageClient({ profileId }: ProfilePageClientProps) {
  const { user: authUser, loading: authLoading, supabase } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { favorites } = useFavorites();

  const [displayUser, setDisplayUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [aspect, setAspect] = useState<number | undefined>(1)

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
        
      if (profile) {
        const { data: userProperties, error: propertiesError } = await supabase
          .from('properties')
          .select('*')
          .eq('realtor_id', profileId);

        if (propertiesError) {
          console.error("Error fetching user properties", propertiesError);
        }
        
        const realtorForProperties = {
            id: profile.id,
            name: profile.full_name || 'Anonymous',
            avatar: profile.avatar_url || 'https://placehold.co/100x100.png',
            email: profile.email,
        };

        setDisplayUser({
            id: profile.id,
            name: profile.full_name || 'New User',
            email: profile.email || '', 
            avatar: profile.avatar_url || `https://placehold.co/128x128.png`,
            bio: profile.bio || 'A new member of the VENDRA community.',
            isVerifiedSeller: profile.is_verified_seller || false,
            rating: profile.rating || 0,
            properties: (userProperties || []).map(p => ({ ...p, realtor: realtorForProperties })) as unknown as Property[]
        });
      } else if (authUser?.id === profileId) {
         setDisplayUser({
            id: authUser.id,
            name: authUser.user_metadata?.full_name || 'New User',
            email: authUser.email || '',
            avatar: authUser.user_metadata?.avatar_url || `https://placehold.co/128x128.png`,
            bio: 'A new member of the VENDRA community.',
            isVerifiedSeller: false,
            rating: 0,
            properties: [],
        });
      }

      setLoading(false);
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [profileId, authUser, authLoading, supabase]);
  

  if (loading || authLoading) {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  if (!displayUser) {
     return (
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
           <div className="text-center">
             <h2 className="text-2xl font-bold text-primary mb-2">User not found</h2>
             <p className="text-muted-foreground">The profile you are looking for does not exist.</p>
             <Button asChild className="mt-4">
                <Link href="/">Go to Homepage</Link>
             </Button>
           </div>
        </div>
    );
  }

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }
  
  const handleAvatarUpload = async () => {
    if (!previewCanvasRef.current || !authUser || !completedCrop) {
         toast({ title: "Crop Error", description: "Please select an image and crop it first.", variant: "destructive" });
        return;
    }

    const canvas = previewCanvasRef.current;
    canvas.toBlob(async (blob) => {
        if (!blob) {
            toast({ title: "Canvas Error", description: "Could not get image from canvas.", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        const fileName = `${authUser.id}-${Date.now()}.png`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('property_images') 
            .upload(filePath, blob, { contentType: 'image/png' });

        if (uploadError) {
            toast({ title: "Upload Failed", description: uploadError.message, variant: "destructive" });
            setIsUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('property_images')
            .getPublicUrl(filePath);

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', authUser.id);
        
        if (updateError) {
            toast({ title: "Update Failed", description: updateError.message, variant: "destructive" });
        } else {
            setDisplayUser(prev => prev ? { ...prev, avatar: publicUrl } : null);
            toast({ title: "Profile Picture Updated!", description: "Your new avatar is now live." });
            setIsEditModalOpen(false);
            setImgSrc('');
        }
        
        setIsUploading(false);
    }, 'image/png');
  };

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
                 { authUser ? (
                     <>
                        <p className="text-muted-foreground mt-2 max-w-md">
                        {t(displayUser.bio || '')}
                        </p>
                        <div className="flex items-center gap-2 mt-4">
                          <div className="flex items-center text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-5 h-5 ${i < (displayUser.rating || 0) ? 'fill-current' : 'text-muted-foreground fill-muted'}`} />
                            ))}
                          </div>
                          <span className="text-muted-foreground text-sm">
                            ({Math.floor(Math.random() * 200)} {t('profile.ratings')})
                          </span>
                        </div>
                     </>
                 ) : (
                    <p className="text-muted-foreground mt-2">Inicia sesión para ver más detalles.</p>
                 )}
              </div>
              <div className="flex flex-col items-center space-y-2">
                 <Dialog>
                  <DialogTrigger asChild>
                    <Avatar className="h-32 w-32 border-4 border-background bg-background cursor-pointer hover:ring-4 hover:ring-primary transition-all duration-300">
                      <AvatarImage
                        src={displayUser.avatar}
                        alt="User avatar"
                        data-ai-hint="person face"
                        className="object-cover"
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
                     <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                                <DialogTitle>{t('profile.edit.title')}</DialogTitle>
                                <DialogDescription>{t('profile.edit.description')}</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="picture">Change Picture</Label>
                                    <Input id="picture" type="file" accept="image/*" onChange={onSelectFile} />
                                </div>

                                {imgSrc && (
                                  <div className="mt-4 flex flex-col items-center">
                                      <ReactCrop
                                        crop={crop}
                                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        aspect={aspect}
                                        circularCrop
                                      >
                                        <Image
                                          ref={imgRef}
                                          alt="Crop me"
                                          src={imgSrc}
                                          width={500}
                                          height={500}
                                          onLoad={onImageLoad}
                                          className="max-h-[60vh] object-contain"
                                        />
                                      </ReactCrop>
                                  </div>
                                )}
                                {!!completedCrop && (
                                  <div className="mt-4 flex flex-col items-center">
                                    <h3 className="text-sm font-medium mb-2">Preview</h3>
                                      <div>
                                          <canvas
                                          ref={previewCanvasRef}
                                          style={{
                                              border: '1px solid black',
                                              objectFit: 'contain',
                                              width: completedCrop.width,
                                              height: completedCrop.height,
                                              borderRadius: '50%'
                                          }}
                                          />
                                      </div>
                                  </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAvatarUpload} disabled={isUploading || !completedCrop}>
                                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                    Upload & Save
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                     </Dialog>
                  ) : authUser ? (
                    <Button asChild>
                       <a href={`mailto:${displayUser.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        {t('profile.contactSeller')}
                       </a>
                    </Button>
                  ) : null }
              </div>
            </div>
          </CardContent>
        </Card>

        { authUser ? (
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
        ) : (
            <Card>
                <CardContent className="p-10 text-center">
                    <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-primary">Contenido exclusivo para miembros</h3>
                    <p className="text-muted-foreground mb-4">Inicia sesión para ver las propiedades listadas y guardadas de este usuario.</p>
                     <Button asChild size="lg">
                        <Link href="/login">Iniciar Sesión</Link>
                    </Button>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
