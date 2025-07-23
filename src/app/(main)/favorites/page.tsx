
'use client';

import { useFavorites } from '@/context/FavoritesContext';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { favorites } = useFavorites();
  const { t } = useTranslation();

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary mb-2">
          {t('favorites.title')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('favorites.subtitle')}
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favorites.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-xl border border-dashed flex flex-col items-center">
          <Heart className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-primary">
            {t('favorites.empty.title')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t('favorites.empty.description')}
          </p>
          <Button asChild>
            <Link href="/">{t('favorites.empty.button')}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
