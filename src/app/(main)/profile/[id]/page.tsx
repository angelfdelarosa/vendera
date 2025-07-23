

'use client';

import { useParams } from 'next/navigation';
import { mockUsers } from '@/lib/mock-data';
import { ProfilePageClient } from '@/components/users/ProfilePageClient';
import type { UserProfile } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user: authUser, loading: authLoading } = useAuth();
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const profileId = params.id as string;
  const chatOpen = searchParams.get('chat') === 'true';

  useEffect(() => {
    if (authLoading) return;

    let foundUser = mockUsers[profileId] as UserProfile | undefined;

    if (!foundUser) {
      if (authUser && authUser.id === profileId) {
        foundUser = {
          id: authUser.id,
          name: authUser.user_metadata?.full_name || 'New User',
          email: authUser.email || '',
          avatar: authUser.user_metadata?.avatar_url || `https://placehold.co/128x128.png`,
          bio: 'A new member of the VENDRA community.',
          isVerifiedSeller: false,
          rating: 0,
          properties: [],
        };
      } else {
         // If user is not found and it's not the auth user, create a temporary profile
         foundUser = {
            id: profileId,
            name: 'New User',
            email: '',
            avatar: 'https://placehold.co/128x128.png',
            bio: 'A new member of the VENDRA community.',
            isVerifiedSeller: false,
            rating: 0,
            properties: []
        }
      }
    }
    
    // Merge properties from realtor field in properties list
    const userProperties = Object.values(mockUsers).flatMap(u => u.properties).filter(p => p.realtor.id === foundUser?.id);
    if(foundUser && userProperties.length > 0) {
        foundUser.properties = userProperties;
    }


    setUser(foundUser);
    setLoading(false);
    
  }, [profileId, authUser, authLoading]);

  if (loading || !user) {
    // Optionally return a loading skeleton here
    return <div>Loading...</div>;
  }

  return <ProfilePageClient user={user} chatOpen={chatOpen} />;
}
