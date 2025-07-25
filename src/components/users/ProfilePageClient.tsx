
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Star, Loader2, Building, Heart, Edit, Mail, Lock, Upload, Trash2, MessageSquare, Calendar, Home } from 'lucide-react';
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
  DialogClose,
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
import type { UserProfile, Property, Rating } from '@/types';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import ReactCrop, { type Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { canvasPreview, cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { Textarea } from '../ui/textarea';

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

// Debounce function to limit how often a function can run.
function debounce(fn: Function, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}


export default function ProfilePageClient() {
  const { user: authUser, loading: authLoading, supabase } = useAuth();
  const { deleteProperty } = usePropertyStore();
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const profileId = params.id as string;
  const { favorites } = useFavorites();
  
  const [displayUser, setDisplayUser] = useState<UserProfile | null>(null);
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingData, setRatingData] = useState<{ average: number, count: number }>({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [aspect, setAspect] = useState<number | undefined>(1)

  const [isUploading, setIsUploading] = useState(false);
  
  // Rating state
  const [isRating, setIsRating] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);


  const fetchRatingData = async (userId: string) => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('ratings')
        .select('rating, comment, created_at')
        .eq('rated_user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ratings:', error);
        setRatingData({ average: 0, count: 0 });
        setRatings([]);
        return;
      }
      
      setRatings(data as Rating[]);
      const count = data.length;
      const average = count > 0 ? data.reduce((acc, item) => acc + item.rating, 0) / count : 0;
      setRatingData({ average, count });
  };
  
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
    const fetchProfileAndProperties = async () => {
      if (!profileId || !supabase) {
        setLoading(false);
        return;
      }
      setLoading(true);

      // Fetch profile data from the new view
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', profileId)
        .single();
      
      if (profileError || !profileData) {
        console.error('Error fetching profile:', profileError);
        setDisplayUser(null);
        setLoading(false);
        return;
      }
      
      setDisplayUser(profileData as UserProfile);
      fetchRatingData(profileData.user_id);

      // Fetch properties for this user
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`*, realtor:realtor_id(user_id, full_name, avatar_url, username)`)
        .eq('realtor_id', profileData.user_id);
      
      if (propertiesError) {
        console.error('Error fetching properties for profile:', propertiesError);
      } else {
        setUserProperties(propertiesData as unknown as Property[]);
      }

      setLoading(false);
    };

    if (!authLoading) {
      fetchProfileAndProperties();
    }
  }, [profileId, supabase, authLoading]);

  
  const handleDeleteProperty = async (propertyId?: string) => {
    if (!supabase || !propertyId) return;
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
      // Also update local state to reflect deletion immediately
      setUserProperties(prev => prev.filter(p => p.id !== propertyId));
      toast({
        title: 'Propiedad eliminada',
        description: 'Tu propiedad ha sido eliminada exitosamente.',
      });
    }
  };

  const isLoadingInitial = loading || authLoading;
  const isOwnProfile = authUser && authUser.id === displayUser?.user_id;

  if (isLoadingInitial) {
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
    if (!previewCanvasRef.current || !authUser || !completedCrop || !supabase) {
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

  const handleRatingSubmit = async () => {
    if (!authUser || isOwnProfile || !supabase) {
        toast({ title: "Acción no permitida", description: "No puedes calificarte a ti mismo.", variant: 'destructive' });
        return;
    }
    if (currentRating === 0) {
        toast({ title: "Calificación requerida", description: "Por favor, selecciona una calificación de 1 a 5 estrellas.", variant: 'destructive' });
        return;
    }
    
    setIsRating(true);
    
    const { error } = await supabase
        .from('ratings')
        .upsert({
            rated_user_id: displayUser.user_id,
            rater_user_id: authUser.id,
            rating: currentRating,
            comment: ratingComment,
        }, { onConflict: 'rated_user_id, rater_user_id' });

    if (error) {
        console.error("Error submitting rating:", error);
        toast({ title: "Error", description: "No se pudo guardar tu calificación. " + error.message, variant: 'destructive' });
    } else {
        toast({ title: "¡Gracias!", description: "Tu calificación ha sido guardada." });
        await fetchRatingData(displayUser.user_id); // Refresh ratings
        setIsRatingDialogOpen(false); // Close dialog on success
        setCurrentRating(0);
        setHoverRating(0);
        setRatingComment("");
    }
    
    setIsRating(false);
  };
  
  const userInitial = displayUser.full_name?.charAt(0).toUpperCase() || '?';
  const memberSince = displayUser.created_at ? new Date(displayUser.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : 'N/A';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="overflow-hidden shadow-lg rounded-2xl">
           <CardHeader className="p-0">
             <div className="bg-primary/10 h-24" />
           </CardHeader>
           <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center sm:items-start -mt-20">
                <div className='flex flex-col sm:flex-row items-center gap-4'>
                    <Avatar className="h-32 w-32 border-4 border-background bg-background">
                      <AvatarImage
                        src={displayUser.avatar_url || undefined}
                        alt="User avatar"
                        data-ai-hint="person face"
                        className="object-cover"
                      />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                     <div className="pt-4 text-center sm:text-left">
                        <h1 className="text-3xl font-headline font-bold text-primary">
                          {displayUser.full_name}
                        </h1>
                         <div className="flex items-center justify-center sm:justify-start text-amber-500 mt-2">
                             {[...Array(5)].map((_, i) => (
                             <Star key={i} className={cn('w-5 h-5', i < Math.round(ratingData.average) ? 'fill-current' : 'text-muted-foreground fill-muted')} />
                             ))}
                              <span className="text-muted-foreground text-sm ml-2">
                                 {ratingData.average.toFixed(1)} ({ratingData.count} {t('profile.ratings')})
                             </span>
                         </div>
                    </div>
                </div>

              <div className="flex-shrink-0 mt-4 sm:mt-0 flex gap-2">
                  {isOwnProfile ? (
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
                                            <div className='relative w-full h-full'>
                                                <Image
                                                    ref={imgRef}
                                                    alt="Crop me"
                                                    src={imgSrc}
                                                    fill
                                                    style={{ objectFit: 'contain' }}
                                                    onLoad={onImageLoad}
                                                />
                                            </div>
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
                  ) : authUser && (
                     <Button asChild>
                        <Link href="/messages">
                            <MessageSquare className="mr-2" /> Contactar al Vendedor
                        </Link>
                     </Button>
                  )}
              </div>
            </div>
            
            <div className='mt-6 border-t pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                 <div className="flex flex-col items-center gap-1">
                     <span className='text-sm text-muted-foreground'>Email</span>
                     <span className='font-semibold'>{displayUser.username || 'N/A'}</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                     <span className='text-sm text-muted-foreground'>Miembro desde</span>
                     <span className='font-semibold'>{memberSince}</span>
                 </div>
                  <div className="flex flex-col items-center gap-1">
                     <span className='text-sm text-muted-foreground'>Propiedades</span>
                     <span className='font-semibold'>{userProperties.length}</span>
                 </div>
                 {!isOwnProfile && authUser && (
                     <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className='w-full'>Calificar Usuario</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Califica a {displayUser.full_name}</DialogTitle>
                                <DialogDescription>
                                    Tu opinión ayuda a otros a encontrar agentes de confianza.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="flex justify-center items-center gap-2">
                                    {[...Array(5)].map((_, i) => {
                                        const ratingValue = i + 1;
                                        return (
                                            <Star 
                                                key={i} 
                                                className={cn("h-8 w-8 cursor-pointer transition-colors", 
                                                    ratingValue <= (hoverRating || currentRating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
                                                )}
                                                onClick={() => setCurrentRating(ratingValue)}
                                                onMouseEnter={() => setHoverRating(ratingValue)}
                                                onMouseLeave={() => setHoverRating(0)}
                                            />
                                        )
                                    })}
                                </div>
                                <Textarea 
                                    placeholder="Deja un comentario anónimo (opcional)..."
                                    value={ratingComment}
                                    onChange={(e) => setRatingComment(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsRatingDialogOpen(false)}>Cancelar</Button>
                                <Button onClick={handleRatingSubmit} disabled={isRating}>
                                    {isRating ? <Loader2 className="animate-spin" /> : "Enviar Calificación"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                 )}
            </div>
          </CardContent>
        </Card>

        { authUser ? (
            <Tabs defaultValue="listed" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="listed">
                  <Building className="mr-2" /> {t('profile.tabs.listed')}
                </TabsTrigger>
                <TabsTrigger value="ratings">
                  <Star className="mr-2" /> Valoraciones
                </TabsTrigger>
                <TabsTrigger value="saved">
                    <Heart className="mr-2" /> {t('profile.tabs.saved')}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="listed">
                 <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Propiedades Listadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userProperties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {userProperties.map((property) => (
                            <div key={property.id} className="relative group">
                               {isOwnProfile && (
                                <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="outline" className="bg-background" asChild>
                                        <Link href={`/edit-property/${property.id}`}>
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
            <TabsContent value="ratings">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Valoraciones Recibidas</CardTitle>
                </CardHeader>
                <CardContent>
                  {ratings.length > 0 ? (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-6">
                        {ratings.map((rating, index) => (
                          <div key={index} className="flex flex-col gap-2 border-b pb-4 last:border-b-0">
                             <div className="flex items-center gap-2">
                                <div className="flex items-center text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn('w-4 h-4', i < rating.rating ? 'fill-current' : 'text-muted-foreground/50 fill-muted')} />
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">{new Date(rating.created_at).toLocaleDateString()}</p>
                             </div>
                             {rating.comment && (
                                <p className="text-muted-foreground italic">"{rating.comment}"</p>
                             )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-16">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Este usuario aún no ha recibido ninguna valoración.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="saved">
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Tus Propiedades Guardadas</CardTitle>
                    </CardHeader>
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
                            {isOwnProfile ? t('profile.empty.saved.description') : `Aún no has guardado ninguna de las propiedades de ${displayUser.full_name}.`}
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
