
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Mock data for demonstration
  const listedProperties = properties.slice(0, 4);
  const { favorites } = useFavorites();

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* User Info Card */}
        <Card className="overflow-hidden shadow-lg">
          <CardHeader className="p-0">
            <div className="bg-primary/10 h-24" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-start -mt-16">
              <div className="flex-grow pt-8">
                <Badge variant="secondary" className="mb-2">
                  Seller
                </Badge>
                <h1 className="text-3xl font-headline font-bold text-primary">
                  {user.displayName || 'Anonymous User'}
                </h1>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Real estate enthusiast and savvy investor. Helping you find
                  the home of your dreams.
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 text-muted-foreground fill-muted" />
                  </div>
                  <span className="text-muted-foreground text-sm">
                    (123 ratings)
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Avatar className="h-24 w-24 border-4 border-background bg-background">
                  <AvatarImage
                    src={user.photoURL || 'https://placehold.co/100x100.png'}
                    alt="User avatar"
                    data-ai-hint="person face"
                  />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <div className="space-x-2">
                  <Button variant="outline" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Tabs */}
        <Tabs defaultValue="listed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listed">
              <Building className="mr-2" /> Listed Properties
            </TabsTrigger>
            <TabsTrigger value="saved">
              <Heart className="mr-2" /> Saved Properties
            </TabsTrigger>
          </TabsList>
          <TabsContent value="listed">
            <Card className="mt-4">
              <CardContent className="p-6">
                {listedProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {listedProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">
                      You haven't listed any properties yet.
                    </p>
                    <Button asChild>
                      <Link href="/properties/new">List a Property</Link>
                    </Button>
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
        </Tabs>

      </div>
    </div>
  );
}
