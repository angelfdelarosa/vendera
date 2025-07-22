'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { mockUsers } from '@/lib/mock-data';
import { UserCard } from '@/components/users/UserCard';
import { Loader2, SearchX } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const { t } = useTranslation();
  
  if (!query) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground">{t('search.enterQuery')}</p>
      </div>
    );
  }

  const lowerCaseQuery = query.toLowerCase();
  const results = Object.values(mockUsers).filter(user =>
    user.name.toLowerCase().includes(lowerCaseQuery)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-3xl font-bold text-primary mb-2">
        {t('search.resultsTitle')}
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        {t('search.resultsFor')} <span className="font-semibold text-primary">{query}</span>
      </p>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-card rounded-xl border border-dashed flex flex-col items-center">
          <SearchX className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-primary">
            {t('search.noUsersFound')}
          </h2>
          <p className="text-muted-foreground">
            {t('search.noUsersMatch')}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        }>
            <SearchResults />
        </Suspense>
    )
}
