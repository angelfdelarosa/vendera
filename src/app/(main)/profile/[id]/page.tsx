
'use client';

import { useParams } from 'next/navigation';
import ProfilePageClient from '@/components/users/ProfilePageClient';

// This is a server-component-first approach, but we need the client to handle dynamic user data.
// The page will pass the ID to a client component which will handle all fetching and state.
// We keep generateStaticParams to satisfy the `output: 'export'` requirement for existing users.

export default function ProfilePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return <ProfilePageClient profileId={id} />;
}
