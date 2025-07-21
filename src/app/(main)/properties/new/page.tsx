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

// This is a mock of the AI function call.
import { generatePropertyDescription as mockGenerateDescription } from "@/ai/flows/property-description-generator";

export default function NewPropertyPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        propertyType: 'House',
        location: 'Beverly Hills',
        numBedrooms: 4,
        numBathrooms: 3,
        amenities: 'Swimming Pool, Garage',
        uniqueFeatures: 'Ocean view, modern architecture',
        description: ''
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    const handleGenerateDescription = async () => {
        setIsGenerating(true);
        try {
            // In a real app, you would get form values dynamically
            const result = await mockGenerateDescription({
                propertyType: formData.propertyType,
                location: formData.location,
                numBedrooms: formData.numBedrooms,
                numBathrooms: formData.numBathrooms,
                amenities: formData.amenities,
                uniqueFeatures: formData.uniqueFeatures,
            });
            setFormData(prev => ({...prev, description: result.description}));
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


  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">List a New Property</CardTitle>
          <CardDescription>
            Fill out the details below to put your property on the market.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title</Label>
            <Input id="title" placeholder="e.g., Luxurious Villa in Beverly Hills" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input id="price" type="number" placeholder="e.g., 3500000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g., Beverly Hills" onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <Input id="address" placeholder="e.g., 123 Rodeo Drive" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="property-type">Property Type</Label>
            <Select onValueChange={value => setFormData({...formData, propertyType: value})}>
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
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" type="number" placeholder="e.g., 5" onChange={e => setFormData({...formData, numBedrooms: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input id="bathrooms" type="number" placeholder="e.g., 6" onChange={e => setFormData({...formData, numBathrooms: parseInt(e.target.value)})} />
              </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="area">Area (sqft)</Label>
            <Input id="area" type="number" placeholder="e.g., 6500" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="amenities">Amenities</Label>
            <Input id="amenities" placeholder="e.g., Swimming Pool, Garage" onChange={e => setFormData({...formData, amenities: e.target.value})} />
            <p className="text-xs text-muted-foreground">Comma-separated list.</p>
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="unique-features">Unique Features</Label>
            <Input id="unique-features" placeholder="e.g., Ocean view, modern architecture" onChange={e => setFormData({...formData, uniqueFeatures: e.target.value})} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                <Button variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate with AI"}
                </Button>
            </div>
            <Textarea 
                id="description" 
                placeholder="Describe the property..." 
                className="min-h-[120px]" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
           <div className="md:col-span-2 space-y-2">
            <Label htmlFor="images">Property Photos</Label>
            <Input id="images" type="file" multiple />
            <p className="text-xs text-muted-foreground">Upload high-quality images of the property.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg">List Property</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
