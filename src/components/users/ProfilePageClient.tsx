
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Loader2, Building, Heart, Edit, Mail, Lock, Upload, Trash2 } from 'lucide-react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import Link from 'next/link';
import { useFavorites } from '@/context/FavoritesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { ScrollArea } from '../ui/scroll-area';
import { usePropertyContext } from '@/context/PropertyContext';
import { usePropertyStore } from '@/hooks/usePropertyStore';

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

// Debounce function to limit how often a function can run.
function debounce(fn: Function, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}


export default function ProfilePageClient({ profileId }: ProfilePageClientProps) {
  const { user: authUser, loading: authLoading, supabase } = useAuth();
  const { properties: allProperties, isLoading: propertiesLoading } = usePropertyContext();
  const { deleteProperty } = usePropertyStore();
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const { favorites } = useFavorites();
  
  const [displayUser, setDisplayUser] = useState<UserProfile | null>(null);
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [aspect, setAspect] = useState<number | undefined>(1)

  const [isUploading, setIsUploading] = useState(false);
  
  const debouncedCanvasPreview = debounce(async () => {
    if (
        completedCrop?.width &&
        completedCrop.height &&
        imgRef.current &&
        previewCanvasRef.current
        ) {
        await canvasPreview(
            imgRef.current,
            previewCanvasRef.current,
            completedCrop,
        );
    }
  }, 100);

  useEffect(() => {
    debouncedCanvasPreview();
  }, [completedCrop, debouncedCanvasPreview]);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
          setLoading(false);
          return;
      }
      setLoading(true);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', profileId)
        .single();
      
      if (error || !profileData) {
        console.error('Error fetching profile:', error);
        setDisplayUser(null);
      } else {
        setDisplayUser(profileData);
        const propertiesForUser = allProperties.filter(p => p.realtor_id === profileId);
        setUserProperties(propertiesForUser);
      }

      setLoading(false);
    };

    if (!authLoading && !propertiesLoading) {
      fetchProfile();
    }
  }, [profileId, authLoading, propertiesLoading, supabase, allProperties]);
  
  const handleDeleteProperty = async (propertyId: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      toast({
        title: 'Error al eliminar',
        description: 'No se pudo eliminar la propiedad.',
        variant: 'destructive',
      });
    } else {
      deleteProperty(propertyId);
      toast({
        title: 'Propiedad eliminada',
        description: 'Tu propiedad ha sido eliminada exitosamente.',
      });
    }
  };


  const isLoading = loading || authLoading || propertiesLoading;

  if (isLoading) {
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
             <h2 className="text-2xl font-bold text-primary mb-2">Usuario no encontrado</h2>
             <p className="text-muted-foreground">El perfil que buscas no existe.</p>
             <Button asChild className="mt-4">
                <Link href="/">Ir al Inicio</Link>
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

  const getCroppedBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> => {
    return new Promise((resolve) => {
        canvas.toBlob(blob => resolve(blob), 'image/png', 1);
    });
  };
  
  const handleAvatarUpload = async () => {
    if (!previewCanvasRef.current || !authUser || !completedCrop) {
         toast({ title: "Crop Error", description: "Please select an image and crop it first.", variant: "destructive" });
        return;
    }

    setIsUploading(true);

    const canvas = previewCanvasRef.current;
    const blob = await getCroppedBlob(canvas);

    if (!blob) {
        toast({ title: "Error", description: "Could not process image.", variant: "destructive" });
        setIsUploading(false);
        return;
    }

    const filePath = `${authUser.id}/${Date.now()}.png`;

    try {
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, blob, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
        
        const { error: updateUserError } = await supabase.auth.updateUser({
            data: { avatar_url: publicUrl }
        });
        if (updateUserError) throw updateUserError;

         const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
          .eq('user_id', authUser.id);
        if (updateProfileError) throw updateProfileError;
        
        setDisplayUser(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
        toast({ title: "Profile Picture Updated!", description: "Your new avatar is now live." });

    } catch (error: any) {
        console.error("Error updating profile picture:", error);
        toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
        setIsUploading(false);
        setIsEditModalOpen(false);
        setImgSrc('');
    }
  };

  const userInitial = displayUser.full_name?.charAt(0).toUpperCase() || '?';
  const isOwnProfile = authUser && authUser.id === displayUser.user_id;

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
                <h1 className="text-3xl font-headline font-bold text-primary">
                  {displayUser.full_name}
                </h1>
                 { authUser ? (
                     <>
                        <p className="text-muted-foreground mt-2 max-w-md">
                        {/* Bio field does not exist in the new schema */}
                        </p>
                        <div className="flex items-center gap-2 mt-4">
                          <div className="flex items-center text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-5 h-5 ${i < (0) ? 'fill-current' : 'text-muted-foreground fill-muted'}`} />
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
                        src={displayUser.avatar_url || undefined}
                        alt="User avatar"
                        data-ai-hint="person face"
                        className="object-cover"
                      />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </DialogTrigger>
                  <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-2xl">
                     <DialogHeader>
                      <DialogTitle className="sr-only">{t('profile.avatarAlt', { name: displayUser.full_name })}</DialogTitle>
                    </DialogHeader>
                     <Image 
                        src={displayUser.avatar_url || 'https://placehold.co/800x800.png'} 
                        alt="User avatar enlarged"
                        width={800}
                        height={800}
                        className="rounded-lg object-contain"
                        data-ai-hint="person face"
                     />
                  </DialogContent>
                </Dialog>
                  {isOwnProfile && (
                     <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{t('profile.edit.title')}</DialogTitle>
                                <DialogDescription>{t('profile.edit.description')}</DialogDescription>
                            </DialogHeader>
                              <ScrollArea className="max-h-[70vh] p-4">
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
                                              width={800}
                                              height={600}
                                              onLoad={onImageLoad}
                                              className="object-contain"
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
                              </ScrollArea>
                            <DialogFooter>
                                <Button onClick={handleAvatarUpload} disabled={isUploading || !completedCrop}>
                                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                    Upload & Save
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                     </Dialog>
                  )}
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
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Tus Propiedades Listadas</CardTitle>
                        {isOwnProfile && (
                          <Button variant="outline" size="sm" onClick={() => setIsEditMode(!isEditMode)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {isEditMode ? 'Salir del Modo Edición' : 'Editar Propiedades'}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {userProperties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {userProperties.map(property => (
                            <div key={property.id} className="relative group">
                              {isEditMode && (
                                <div className="absolute top-2 right-14 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button size="icon" variant="outline" className="bg-background" asChild>
                                    <Link href={`/properties/edit/${property.id}`}>
                                      <Edit className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="icon" variant="destructive">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Esta acción no se puede deshacer. Esto eliminará permanentemente la propiedad de los servidores.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteProperty(property.id)}>
                                          Sí, eliminar propiedad
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              )}
                              <PropertyCard property={property} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <p className="text-muted-foreground mb-4">
                            {isOwnProfile ? t('profile.empty.listed.own') : t('profile.empty.listed.other', { name: displayUser.full_name })}
                          </p>
                          {isOwnProfile && (
                            <Button asChild>
                              <Link href="/properties/new">Listar una propiedad</Link>
                            </Button>
                          )}
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
