
'use client';

import { useState, useEffect } from 'react';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Loader2, MessageCircle, MessagesSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Conversation, ConversationFromDB } from '@/types';
import { useChatStore } from '@/components/chat/use-chat-store';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export default function MessagesPage() {
  const { user, loading: authLoading, supabase } = useAuth();
  const { conversations, selectedConversation, selectConversation, setConversations, updateConversation } = useChatStore();
  const { t, locale } = useTranslation();
  const [loading, setLoading] = useState(true);

  const fetchAndSetConversations = async () => {
      if (!user || !supabase) return;

      setLoading(true);

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          created_at,
          property_id,
          buyer_id,
          seller_id,
          last_message_sender_id,
          last_message_read,
          property:properties(id, title, images),
          buyer:profiles!conversations_buyer_id_fkey(user_id, full_name, avatar_url),
          seller:profiles!conversations_seller_id_fkey(user_id, full_name, avatar_url),
          messages(content, created_at, sender_id)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { referencedTable: 'messages', ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
      } else {
        const transformedConversations = data.map(convo => {
            const otherUser = convo.buyer_id === user.id ? convo.seller : convo.buyer;
            const lastMessage = convo.messages[0];
            return {
                id: convo.id.toString(),
                user: {
                    user_id: otherUser.user_id,
                    full_name: otherUser.full_name,
                    avatar_url: otherUser.avatar_url,
                    username: null
                },
                property: {
                    ...mockProperty,
                    id: convo.property?.id || "unknown",
                    title: convo.property?.title || "Conversation",
                    images: convo.property?.images || []
                },
                messages: [],
                timestamp: lastMessage ? lastMessage.created_at : convo.created_at,
                lastMessage: lastMessage?.content || "No messages yet.",
                unread: !convo.last_message_read && convo.last_message_sender_id !== user.id
            }
        });
        setConversations(transformedConversations);
      }
      setLoading(false);
    };

  useEffect(() => {
    if (!authLoading) {
        fetchAndSetConversations();
    }
  }, [user, authLoading, supabase, setConversations]);
  
  useEffect(() => {
    if (!supabase || !user) return;

    const conversationsChannel = supabase.channel('public:conversations')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'conversations' },
            (payload) => {
                // When a conversation is updated (e.g., last_message_read changes), refetch all.
                // This is a simple way to ensure the UI is consistent.
                fetchAndSetConversations();
            }
        )
        .subscribe();
    
    return () => {
        supabase.removeChannel(conversationsChannel);
    };
  }, [supabase, user]);

  const getTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: locale === 'es' ? es : enUS });
  }

  if (loading || authLoading) {
     return (
        <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-24 bg-card rounded-xl border border-dashed flex flex-col items-center container mx-auto mt-8">
        <MessagesSquare className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-primary">
          {t('messages.empty.title')}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t('messages.empty.description')}
        </p>
         <Link href="/">
            <div className='text-primary hover:underline'>{t('messages.empty.button')}</div>
          </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
       <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold text-primary mb-2">
          {t('messages.title')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('messages.subtitle')}
        </p>
      </div>
      <Card className="h-[calc(100vh-18rem)] flex overflow-hidden">
        <div className="w-1/3 border-r overflow-y-auto">
          <div className="p-4 font-semibold border-b">
            {t('messages.allMessages')} ({conversations.length})
          </div>
          <nav className="p-2 space-y-1">
            {conversations.map((convo) => (
              <button
                key={convo.id}
                onClick={() => selectConversation(convo.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg flex items-start gap-3 transition-colors",
                  selectedConversation?.id === convo.id ? "bg-muted" : "hover:bg-muted/50"
                )}
              >
                <Link href={`/profile/${convo.user.user_id}`} onClick={(e) => e.stopPropagation()}>
                    <Avatar className="h-10 w-10 hover:ring-2 hover:ring-primary transition-all">
                      <AvatarImage src={convo.user.avatar_url || undefined} />
                      <AvatarFallback>{convo.user.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex-grow overflow-hidden">
                   <div className="flex justify-between items-center">
                    <Link href={`/profile/${convo.user.user_id}`} onClick={(e) => e.stopPropagation()}>
                        <p className="font-semibold text-sm truncate hover:underline">{convo.user.full_name}</p>
                    </Link>
                     <p className="text-xs text-muted-foreground flex-shrink-0">{getTimestamp(convo.timestamp)}</p>
                   </div>
                    <p className="text-xs text-muted-foreground truncate">
                        {t('messages.re')} {t(convo.property.title)}
                    </p>
                   <p className="text-sm text-muted-foreground truncate">{ (convo as any).lastMessage }</p>
                </div>
                 {convo.unread && <div className="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0"></div>}
              </button>
            ))}
          </nav>
        </div>
        <div className="w-2/3 flex flex-col">
          {selectedConversation ? (
            <ChatWindow
              key={selectedConversation.id}
              conversationId={selectedConversation.id}
              recipient={selectedConversation.user}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <MessageCircle className="h-16 w-16 mb-4" />
                <h2 className="text-xl font-semibold">{t('messages.select.title')}</h2>
                <p>{t('messages.select.description')}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Mock property to satisfy the type, as not all fields are needed for the convo list
const mockProperty: Property = {
    id: 'mock',
    title: 'mock',
    price: 0,
    location: 'mock',
    address: 'mock',
    type: 'house',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    description: 'mock',
    features: [],
    images: [],
    realtor_id: 'mock',
    realtor: { user_id: 'mock', full_name: 'mock', avatar_url: 'mock', username: 'mock' }
}

    
