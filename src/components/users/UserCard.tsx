
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/types';
import { Button } from '../ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';


interface UserCardProps {
  user: UserProfile;
}

export function UserCard({ user }: UserCardProps) {
  const userInitial = user.full_name?.charAt(0).toUpperCase() || '?';
  const { t } = useTranslation();
  const { user: authUser } = useAuth();


  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="items-center text-center p-6">
        <Avatar className="h-24 w-24 mb-4 border-4 border-background">
          <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || ''} data-ai-hint="person face" className="object-cover" />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
        <h3 className="font-headline text-xl font-bold text-primary">{user.full_name}</h3>
        {/* {user.isVerifiedSeller && (
          <Badge variant="secondary" className="mt-1">{t('profile.sellerBadge')}</Badge>
        )} */}
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-grow flex flex-col">
        {authUser ? (
            <>
                <p className="text-muted-foreground text-sm text-center flex-grow">
                  {/* Bio does not exist on new schema */}
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-amber-500">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < 0 ? 'fill-current' : 'text-muted-foreground fill-muted'}`} />
                ))}
                </div>
            </>
        ) : (
             <div className="text-muted-foreground text-sm text-center flex-grow">
                Inicia sesión para ver más detalles.
            </div>
        )}
        <Button asChild className="w-full mt-6">
          <Link href={`/profile/${user.user_id}`}>
            {t('userCard.viewProfile')} <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
