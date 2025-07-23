
import ProfilePageClient from '@/components/users/ProfilePageClient';

// This is a server component that passes the ID to the client component.
export default function ProfilePage({ params }: { params: { id: string } }) {
  return <ProfilePageClient profileId={params.id} />;
}
