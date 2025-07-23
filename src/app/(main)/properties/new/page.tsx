
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { usePropertyStore } from "@/hooks/usePropertyStore";
import type { Property } from "@/types";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/context/AuthContext";


export default function NewPropertyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const addProperty = usePropertyStore((state) => state.addProperty);
  const { t } = useTranslation();
  const { user, loading: authLoading, supabase } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const getInitialFormData = () => ({
    title: "",
    price: 3500000,
    location: "Beverly Hills",
    address: "123 Rodeo Drive, Beverly Hills, CA",
    propertyType: "villa" as Property["type"],
    numBedrooms: 4,
    numBathrooms: 3,
    area: 600,
    amenities: "Swimming Pool, Garage",
    uniqueFeatures: "Ocean view, modern architecture",
    description: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: parseInt(value) || 0 }));
  };

  const handleSelectChange = (value: Property["type"]) => {
    setFormData((prev) => ({ ...prev, propertyType: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);

      // Free up memory from old previews
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to list a property.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    let imageUrls: string[] = [];
    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `public/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property_images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('property_images')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      try {
        imageUrls = await Promise.all(uploadPromises);
      } catch (error: any) {
        console.error('Error uploading images:', error);
        toast({
          title: "Image Upload Failed",
          description: error.message || "An unknown error occurred during image upload.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

    } else {
        imageUrls = [
            "https://placehold.co/600x400.png",
            "https://placehold.co/600x400.png",
        ]
    }


    const features = [
      ...formData.amenities.split(",").map((f) => f.trim()),
      ...formData.uniqueFeatures.split(",").map((f) => f.trim()),
    ].filter(Boolean);

    const newPropertyData = {
      realtor_id: user.id,
      title: formData.title,
      price: formData.price,
      location: formData.location,
      address: formData.address,
      type: formData.propertyType,
      bedrooms: formData.numBedrooms,
      bathrooms: formData.numBathrooms,
      area: formData.area,
      description: formData.description,
      features: features,
      images: imageUrls,
    };
    
    console.log('Inserting data:', newPropertyData);

    const { data, error } = await supabase
        .from('properties')
        .insert(newPropertyData)
        .select()
        .single();


    if (error) {
        console.error('Error inserting property:', error);
        toast({
            title: "Error Listing Property",
            description: error.message || 'An unknown error occurred.',
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }

    const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single();

    const newProperty: Property = {
        ...data,
        realtor: {
             id: user.id,
             name: profile?.full_name || 'Anonymous',
             avatar: profile?.avatar_url || 'https://placehold.co/100x100.png',
        }
    }

    addProperty(newProperty);

    toast({
      title: t('newProperty.toast.listed.title'),
      description: t('newProperty.toast.listed.description'),
    });

    setFormData(getInitialFormData());
    setImageFiles([]);
    setImagePreviews([]);
    setIsSubmitting(false);
    router.push(`/properties/${newProperty.id}`);
  };


  if (authLoading || !user) {
     return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {t('newProperty.title')}
            </CardTitle>
            <CardDescription>
              {t('newProperty.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t('newProperty.form.title')}</Label>
              <Input
                id="title"
                placeholder={t('newProperty.form.title_placeholder')}
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
                placeholder="e.g., 3500000"
                value={formData.price}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t('newProperty.form.location')}</Label>
              <Input
                id="location"
                placeholder="e.g., Beverly Hills"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">{t('newProperty.form.address')}</Label>
              <Input
                id="address"
                placeholder="e.g., 123 Rodeo Drive"
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
                  placeholder="e.g., 5"
                  value={formData.numBedrooms}
                  onChange={handleNumberInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numBathrooms">{t('newProperty.form.bathrooms')}</Label>
                <Input
                  id="numBathrooms"
                  type="number"
                  placeholder="e.g., 6"
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
                placeholder="e.g., 600"
                value={formData.area}
                onChange={handleNumberInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amenities">{t('newProperty.form.amenities')}</Label>
              <Input
                id="amenities"
                placeholder={t('newProperty.form.amenities_placeholder')}
                value={formData.amenities}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                {t('newProperty.form.amenities_note')}
              </p>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="uniqueFeatures">{t('newProperty.form.features')}</Label>
              <Input
                id="uniqueFeatures"
                placeholder={t('newProperty.form.features_placeholder')}
                value={formData.uniqueFeatures}
                onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">{t('property.description')}</Label>
              <Textarea
                id="description"
                placeholder={t('newProperty.form.description_placeholder')}
                className="min-h-[120px]"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="images">{t('newProperty.form.photos')}</Label>
              <Input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} />
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={src}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('newProperty.form.submit')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
