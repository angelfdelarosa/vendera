
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { usePropertyStore } from '@/hooks/usePropertyStore';
import type { Property } from '@/types';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { notFound } from 'next/navigation';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const {
    properties,
    updateProperty,
    isLoading: isStoreLoading,
  } = usePropertyStore();
  const { t } = useTranslation();
  const { user, loading: authLoading, supabase } = useAuth();

  const propertyId = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    location: '',
    address: '',
    propertyType: 'house' as Property['type'],
    numBedrooms: 0,
    numBathrooms: 0,
    area: 0,
    features: '',
    description: '',
  });

  useEffect(() => {
    if (!isStoreLoading) {
      const prop = properties.find(p => p.id === propertyId);
      if (prop) {
        setProperty(prop);
        setFormData({
          title: prop.title,
          price: prop.price,
          location: prop.location,
          address: prop.address,
          propertyType: prop.type,
          numBedrooms: prop.bedrooms,
          numBathrooms: prop.bathrooms,
          area: prop.area,
          description: prop.description,
          features: prop.features.join(', '),
        });
      }
    }
  }, [propertyId, properties, isStoreLoading]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (!authLoading && user && property && user.id !== property.realtor_id) {
        toast({ title: 'No autorizado', description: 'No tienes permiso para editar esta propiedad.', variant: 'destructive' });
        router.push(`/properties/${property.id}`);
    }
  }, [user, authLoading, router, property, toast]);

  if (isStoreLoading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
      return notFound();
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: parseInt(value) || 0 }));
  };

  const handleSelectChange = (value: Property['type']) => {
    setFormData(prev => ({ ...prev, propertyType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !property) return;
    setIsSubmitting(true);

    const updatedPropertyData = {
      title: formData.title,
      price: formData.price,
      location: formData.location,
      address: formData.address,
      type: formData.propertyType,
      bedrooms: formData.numBedrooms,
      bathrooms: formData.numBathrooms,
      area: formData.area,
      description: formData.description,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
    };

    const { data, error } = await supabase
      .from('properties')
      .update(updatedPropertyData)
      .eq('id', property.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating property:', error);
      toast({
        title: 'Error al actualizar',
        description: error.message,
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }
    
    // This is tricky because the updated 'data' doesn't have the realtor info.
    // We need to merge it with the existing property data.
    const fullyUpdatedProperty = { ...property, ...data };
    updateProperty(data.id, fullyUpdatedProperty);

    toast({
      title: 'Propiedad actualizada',
      description: 'Los cambios han sido guardados.',
    });

    setIsSubmitting(false);
    router.push(`/properties/${property.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Editar Propiedad
            </CardTitle>
            <CardDescription>
              Actualiza los detalles de tu propiedad a continuación.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t('newProperty.form.title')}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">{t('newProperty.form.price')}</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t('newProperty.form.location')}</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">{t('newProperty.form.address')}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property-type">{t('search.propertyType')}</Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.propertyType}
              >
                <SelectTrigger id="property-type">
                  <SelectValue placeholder={t('newProperty.form.type_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">{t('property.types.house')}</SelectItem>
                  <SelectItem value="apartment">{t('property.types.apartment')}</SelectItem>
                  <SelectItem value="condo">{t('property.types.condo')}</SelectItem>
                  <SelectItem value="villa">{t('property.types.villa')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numBedrooms">{t('newProperty.form.bedrooms')}</Label>
                <Input
                  id="numBedrooms"
                  type="number"
                  value={formData.numBedrooms}
                  onChange={handleNumberInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numBathrooms">{t('newProperty.form.bathrooms')}</Label>
                <Input
                  id="numBathrooms"
                  type="number"
                  value={formData.numBathrooms}
                  onChange={handleNumberInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">{t('newProperty.form.area')}</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={handleNumberInputChange}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="features">{t('newProperty.form.features')}</Label>
              <Input
                id="features"
                placeholder={t('newProperty.form.features_placeholder')}
                value={formData.features}
                onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">{t('property.description')}</Label>
              <Textarea
                id="description"
                className="min-h-[120px]"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
                <Label>Fotos</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                  {property.images.map((src, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={src}
                        alt={`Property image ${index + 1}`}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">La edición de fotos no está disponible actualmente.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
