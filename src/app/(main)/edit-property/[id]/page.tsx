
import { EditPropertyForm } from '@/components/properties/EditPropertyForm';
import { createClient } from '@/lib/supabase/server';
import type { Property } from '@/types';
import { notFound } from 'next/navigation';

async function getPropertyForEdit(id: string): Promise<Property | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('properties')
        .select(`*, realtor:realtor_id(user_id, full_name, avatar_url, username)`)
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching property for edit page:', error);
        return null;
    }

    return data as unknown as Property;
}


export default async function EditPropertyPage({ params }: { params: { id: string } }) {
    const property = await getPropertyForEdit(params.id);

    if (!property) {
        notFound();
    }

    return <EditPropertyForm property={property} />;
}
