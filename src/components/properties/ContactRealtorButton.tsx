
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface ContactRealtorButtonProps {
  realtorId: string;
  propertyId: string;
}

export function ContactRealtorButton({ realtorId, propertyId }: ContactRealtorButtonProps) {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartConversation = async () => {
    if (!user || !supabase) {
        toast({ title: "Not authenticated", description: "You need to be logged in to contact a realtor.", variant: "destructive" });
        return;
    }

    if (user.id === realtorId) {
        toast({ title: "Cannot contact yourself", description: "You cannot start a conversation with yourself.", variant: "destructive" });
        return;
    }

    setIsLoading(true);

    try {
      // Check if a conversation already exists for this property between these users
      let { data: existingConvo, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('property_id', propertyId)
        .eq('buyer_id', user.id)
        .eq('seller_id', realtorId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // If a conversation exists, just go to messages
      if (existingConvo) {
        router.push('/messages');
        return;
      }

      // If not, create a new one
      const { error: insertError } = await supabase
        .from('conversations')
        .insert({
          buyer_id: user.id,
          seller_id: realtorId,
          property_id: propertyId,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      // Redirect to messages page where the new conversation will appear
      router.push('/messages');
    } catch (error: any) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Could not start chat",
        description: error.message,
        variant: "destructive"
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleStartConversation} disabled={isLoading}>
      <MessageSquare className="mr-2 h-4 w-4" />
      Contactar
    </Button>
  );
}
