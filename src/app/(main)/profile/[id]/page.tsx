
import { notFound } from 'next/navigation';
import { mockUsers } from '@/lib/mock-data';
import { ProfilePageClient } from '@/components/users/ProfilePageClient';
import type { UserProfile } from '@/types';

export const dynamicParams = false;

export async function generateStaticParams() {
  const users = Object.values(mockUsers);
  return users.map((user) => ({
    id: user.id,
  }));
}

interface ProfilePageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const profileId = params.id as string;
  const user = mockUsers[profileId] as UserProfile | undefined;
  const chatOpen = searchParams?.chat === 'true';

  if (!user) {
    // This part might need adjustment if we are fetching users dynamically.
    // For now, we assume if it's not in mockUsers, it's a new dynamic user
    // and we'll let ProfilePageClient handle fetching or displaying a loading state.
    // But since ProfilePageClient doesn't fetch, we create a temporary user object
    // for new users that are not in the mock data.
    const tempUser: UserProfile = {
      id: profileId,
      name: 'New User',
      email: '',
      avatar: 'https://placehold.co/128x128.png',
      bio: 'A new member of the VENDRA community.',
      isVerifiedSeller: false,
      rating: 0,
      properties: []
    }
    return <ProfilePageClient user={tempUser} chatOpen={chatOpen} />;
  }

  return <ProfilePageClient user={user} chatOpen={chatOpen} />;
}
