
'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import type { Property } from '@/types';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useChatStore } from './use-chat-store';
import { useToast } from '@/hooks/use-toast';

interface ContactRealtorButtonProps {
  property: Property;
}

export function ContactRealtorButton({ property }: ContactRealtorButtonProps) {
  const { user: authUser, supabase } = useAuth();
  const { handleStartConversation } = useChatStore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onContact = async () => {
    if (!authUser || !supabase) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to contact a realtor.',
        variant: 'destructive',
      });
      return router.push('/login');
    }
    
    setIsLoading(true);
    const conversationId = await handleStartConversation(property, authUser, supabase);
    setIsLoading(false);
    
    if (conversationId) {
      router.push('/messages');
    } else {
      toast({
        title: 'Error',
        description: 'Could not start a conversation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={onContact} className="w-full mt-4" disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <MessageSquare className="mr-2 h-4 w-4" />
      )}
      Contactar al Vendedor
    </Button>
  );
}
