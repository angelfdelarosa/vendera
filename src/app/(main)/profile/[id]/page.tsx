
import ProfilePageClient from '@/components/users/ProfilePageClient';
import { mockUsers } from '@/lib/mock-data';

// Statically generate routes from mock users
export async function generateStaticParams() {
  return Object.keys(mockUsers).map((id) => ({
    id,
  }));
}

// This is a server component that passes the ID to the client component.
export default function ProfilePage({ params }: { params: { id: string } }) {
  return <ProfilePageClient profileId={params.id} />;
}
