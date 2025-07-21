
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { generatePropertyDescription } from "@/ai/flows/property-description-generator";
import { usePropertyStore } from "@/hooks/usePropertyStore";
import type { Property } from "@/types";

const initialFormData = {
  title: "Luxurious Villa in Beverly Hills",
  price: 3500000,
  location: "Beverly Hills",
  address: "123 Rodeo Drive, Beverly Hills, CA",
  propertyType: "Villa" as Property["type"],
  numBedrooms: 4,
  numBathrooms: 3,
  area: 6500,
  amenities: "Swimming Pool, Garage",
  uniqueFeatures: "Ocean view, modern architecture",
  description: "",
};

export default function NewPropertyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const addProperty = usePropertyStore((state) => state.addProperty);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    try {
      const result = await generatePropertyDescription({
        propertyType: formData.propertyType,
        location: formData.location,
        numBedrooms: formData.numBedrooms,
        numBathrooms: formData.numBathrooms,
        amenities: formData.amenities,
        uniqueFeatures: formData.uniqueFeatures,
      });
      setFormData((prev) => ({ ...prev, description: result.description }));
      toast({
        title: "Description Generated!",
        description: "The AI-powered description has been added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate description.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const newProperty: Property = {
      id: crypto.randomUUID(),
      title: formData.title,
      price: formData.price,
      location: formData.location,
      address: formData.address,
      type: formData.propertyType,
      bedrooms: formData.numBedrooms,
      bathrooms: formData.numBathrooms,
      area: formData.area,
      description: formData.description,
      features: formData.amenities.split(",").map((f) => f.trim()),
      images: [
        "https://placehold.co/600x400.png",
        "https://placehold.co/600x400.png",
      ],
      realtor: {
        name: user.displayName || "Anonymous Seller",
        avatar:
          user.photoURL || "https://placehold.co/100x100.png",
      },
    };

    addProperty(newProperty, user.uid);

    toast({
      title: "Property Listed!",
      description: "Your property is now on the market.",
    });

    // Reset form and navigate
    setFormData(initialFormData);
    setIsSubmitting(false);
    router.push(`/properties/${newProperty.id}`);
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              List a New Property
            </CardTitle>
            <CardDescription>
              Fill out the details below to put your property on the market.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                placeholder="e.g., Luxurious Villa in Beverly Hills"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
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
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Beverly Hills"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                placeholder="e.g., 123 Rodeo Drive"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="property-type">Property Type</Label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.propertyType}
              >
                <SelectTrigger id="property-type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numBedrooms">Bedrooms</Label>
                <Input
                  id="numBedrooms"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.numBedrooms}
                  onChange={handleNumberInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numBathrooms">Bathrooms</Label>
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
              <Label htmlFor="area">Area (sqft)</Label>
              <Input
                id="area"
                type="number"
                placeholder="e.g., 6500"
                value={formData.area}
                onChange={handleNumberInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities</Label>
              <Input
                id="amenities"
                placeholder="e.g., Swimming Pool, Garage"
                value={formData.amenities}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated list.
              </p>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="uniqueFeatures">Unique Features</Label>
              <Input
                id="uniqueFeatures"
                placeholder="e.g., Ocean view, modern architecture"
                value={formData.uniqueFeatures}
                onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate with AI"}
                </Button>
              </div>
              <Textarea
                id="description"
                placeholder="Describe the property..."
                className="min-h-[120px]"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="images">Property Photos</Label>
              <Input id="images" type="file" multiple disabled/>
              <p className="text-xs text-muted-foreground">
                Image uploads are not yet implemented. Placeholder images will be used.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              List Property
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
