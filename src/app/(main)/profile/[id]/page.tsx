import { mockUsers } from '@/lib/mock-data';
import type { UserProfile } from '@/types';
import ProfilePageClient from '@/components/users/ProfilePageClient';

export async function generateStaticParams() {
  const users = Object.keys(mockUsers);
  return users.map((id) => ({
    id,
  }));
}

function getUser(id: string): UserProfile | null {
    if (mockUsers[id]) {
        return mockUsers[id];
    }
    const userProperties = Object.values(mockUsers).flatMap(u => u.properties).filter(p => p.realtor.id === id);
    const firstProperty = userProperties[0];

    if (firstProperty) {
         return {
            id: id,
            name: firstProperty.realtor.name,
            email: '',
            avatar: firstProperty.realtor.avatar,
            bio: 'A new member of the VENDRA community.',
            isVerifiedSeller: false,
            rating: 0,
            properties: userProperties
        }
    }
    return null;
}


export default function ProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = getUser(id);

  return <ProfilePageClient user={user} profileId={id} />;
}
