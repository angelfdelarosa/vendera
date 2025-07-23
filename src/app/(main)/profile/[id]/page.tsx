
import { notFound } from 'next/navigation';
import { mockUsers } from '@/lib/mock-data';
import { ProfilePageClient } from '@/components/users/ProfilePageClient';
import type { UserProfile } from '@/types';

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
    notFound();
  }

  return <ProfilePageClient user={user} chatOpen={chatOpen} />;
}
